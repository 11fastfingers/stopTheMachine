require('dotenv').config();  // loads env variables

const express = require('express');
const cors = require('cors'); 
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Database = require('better-sqlite3'); 
const path = require('path');


const app = express(); 
const port = process.env.PORT || 3000;

const ipBlockTracker = {}; // Key: IP block, Value: Array of timestamps 

function getIpBlock(ip) {
    return ip.split('.').slice(0, 3).join('.');
}


// Set up database 
const persistentPath = '/data/database.sqlite';
const fallbackPath = path.join(__dirname, 'database.sqlite');
let dbPath;

if (process.env.NODE_ENV === 'production') {
    dbPath = persistentPath;
  } else {
    dbPath = fallbackPath;
}

let db; 
try {
    db = new Database(dbPath);
    console.log('Success connecting to database');
  } catch (err) {
    console.error('Error opening database: ' + err.message);
}


const allowedOrigins = [
	'https://stopthemachine.org',
	'http://localhost:5173',
]; 

app.use(cors({
  origin: function(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    
    console.log('webhook hit'); 


    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        return res.sendStatus(400);
    }

    if (event.type === 'payment_intent.succeeded') {
        let paymentIntent = event.data.object;


        const chargeId = paymentIntent.latest_charge;
        const charge = await stripe.charges.retrieve(chargeId, {
            expand: ['balance_transaction']
        });
        const balanceTransaction = charge.balance_transaction;

        try {
            // Get full details including amount and currency
            const amount = paymentIntent.amount_received;
            const currency = paymentIntent.currency.toUpperCase();

            let amountInUSD; 
            if (currency !== 'USD') {
                // Fetch Stripe's conversion rate to USD
                const exchangeRates = await stripe.exchangeRates.retrieve(currency.toLowerCase());
                const rateToUSD = exchangeRates.rates['usd'];
                if (!rateToUSD) {
                    throw new Error(`No exchange rate from ${currency} to USD`);
                }
                amountInUSD = amount * rateToUSD;
            } else {
                amountInUSD = amount;
            }
            
            

            // get name
            const name = paymentIntent.metadata?.name || 'Anonymous';

            // donor name inserted if necessary 
            if (name !== 'Anonymous') {
                const stmt = db.prepare('INSERT OR IGNORE INTO donor (name) VALUES (?)');
                const result = stmt.run(name);
                if (result.changes > 0) {
                    console.log(`Inserted donor: ${name}`);
                } else {
                    console.log(`Donor already exists: ${name}`);
                }
            }

            // update donation table 
            if (name !== 'Anonymous') {
                const donation = db.prepare(`
                    INSERT INTO donation (donor_name, amount) 
                    VALUES (?, ?)
                `);
                donation.run(name, amountInUSD);
            } else {
                const donation = db.prepare(`
                    INSERT INTO donation (amount) 
                    VALUES (?)
                `);
                donation.run(amountInUSD);
            } 


            // update total donations 
            const update = db.prepare(`
                UPDATE total_donations 
                SET total = total + ? 
                WHERE id = 1
            `);
            update.run(amountInUSD);


            const stripeFee = await getStripeFeeWithRetry(chargeId, currency);
            // update spending, need to insert into
            const spending = db.prepare(`
                INSERT INTO spending (account, amount)
                VALUES ('stripe', ?)`
            );
            spending.run(stripeFee);

        } catch (error) {
            console.error('Error processing donation:', error.message);
            return res.sendStatus(500);
        }
    }

    res.sendStatus(200);
});


app.use(express.json()); // Must be after the stripe webhook 


app.get('/', (req, res) => {
    res.send('backend is running');
});


app.post('/referral', (req, res) => {
    const ref = req.body.ref;
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

    const bannedwords = ['fuck', 'bitch', 'pussy', 'cunt', 'cock', 'slut', 'whore', 'nigger', 'nigga', 'dildo', 'faggot']
    const ipBlock = getIpBlock(ip);
    const now = Date.now();


     // Check length
     if (typeof ref !== 'string' || ref.length === 0 || ref.length > 50) return false;

     // Only letters, digits, and hyphens
     if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(ref)) return false;
 
     // Check for banned words (case insensitive just in case)
     const lowerRef = ref.toLowerCase();
     if (bannedwords.some(word => lowerRef.includes(word))) return false;

    if (!ip) return false; 



    // Initialize IP Block timestamp array if needed 
    if (!ipBlockTracker[ipBlock]) {
        ipBlockTracker[ipBlock] = [];
    }

    // Remove timestamps older than 1 hour if needed
    ipBlockTracker[ipBlock] = ipBlockTracker[ipBlock].filter(ts => now - ts < 60 * 60 * 1000);

   
    if (ipBlockTracker[ipBlock].length >= 3) {
        return false; 
    }

    ipBlockTracker[ipBlock].push(now);

    // Checks if the user is already in the database
    const exists = db.prepare('SELECT 1 FROM person_referred WHERE ip = ?').get(ip);
    if (exists) {
        return false;
    }



    const addUser = db.prepare('INSERT INTO person_referred (ip) VALUES (?)'); 
    addUser.run(ip);

    const referrerExists = db.prepare('SELECT 1 FROM referrer WHERE name = ?').get(ref);
    if (!referrerExists) {
        const addReferrer = db.prepare('INSERT INTO referrer (name, total) VALUES (?, 0)');
        addReferrer.run(ref);
    }


    const incrementReferrer = db.prepare(`
        UPDATE referrer 
        SET total = COALESCE(total, 0) + 1 
        WHERE name = ?
    `);
    incrementReferrer.run(ref);

    
    return true;





    // Get current total for this referrer
    const currentTotal = db.prepare('SELECT total FROM referrer WHERE name = ?').get(ref);



    {/* complex stuff doesn't work yet


    // Get the actual lowest person on the leaderboard
    const lowestEntry = db.prepare(`
        SELECT name, total 
        FROM top_sharers 
        ORDER BY total ASC, rank DESC 
        LIMIT 1
    `).get();
    if (!lowestEntry || currentTotal.total > lowestEntry.total) {
        const existingRank = db.prepare('SELECT rank FROM top_sharers WHERE name = ?').get(ref);

        if (existingRank) {
            // Already on leaderboard, just update total
            db.prepare('UPDATE top_sharers SET total = ? WHERE name = ?').run(currentTotal.total, ref);
        } else {
            // New entrant, remove lowest and insert
            if (lowestEntry) {
                db.prepare('DELETE FROM top_sharers WHERE name = ?').run(lowestEntry.name);
            }
            db.prepare('INSERT INTO top_sharers (name, total) VALUES (?, ?)').run(ref, currentTotal.total);
        }

        // Recalculate rankings
        const top = db.prepare(`
            SELECT name, total 
            FROM top_sharers 
            ORDER BY total DESC, name ASC 
            LIMIT 50
        `).all();

        const updateRank = db.prepare('UPDATE top_sharers SET rank = ? WHERE name = ?');
        top.forEach((row, index) => {
            updateRank.run(index + 1, row.name);
        });
    }
    */}

    

}); 



app.post('/donate', async (req, res) => {
  const { amount, currency} = req.body;
  let name = req.body.name || 'Anonymous';
  // validate input
  if (
    typeof amount !== 'number' ||
    amount <= 0 ||
    typeof currency !== 'string' ||
    !/^[a-zA-Z]{3}$/.test(currency)
  ) {
    return res.status(400).json({ error: 'Invalid amount or currency' });
  }

  try {
      const session = await stripe.checkout.sessions.create({
          mode: 'payment',
          line_items: [{
              price_data: {
                  currency: currency.toUpperCase(),
                  product_data: {
                      name: `Donation to Stop the Machine`,
                      
                  },
                  unit_amount: Math.round(amount * 100), // amount in cents
              },
              quantity: 1,
          }],
          success_url: 'https://stopthemachine.org',
          cancel_url: 'https://stopthemachine.org',
          payment_intent_data: {
            metadata: {
                name: name
            },
          }
      });

      res.json({ id: session.id });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


async function getStripeFeeWithRetry(chargeId, currency) {
    const maxAttempts = 5;
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const charge = await stripe.charges.retrieve(chargeId, {
            expand: ['balance_transaction']
        });

        const balanceTransaction = charge.balance_transaction;

        if (balanceTransaction && typeof balanceTransaction.fee === 'number') {
            const rateToUSD = currency !== 'USD'
                ? (await stripe.exchangeRates.retrieve(currency.toLowerCase())).rates['usd']
                : 1;

            if (!rateToUSD) throw new Error(`No exchange rate for ${currency}`);

            return balanceTransaction.fee * rateToUSD;
        }

        await delay(1000 * attempt);
    }

    throw new Error('Could not retrieve stripe fee after retries');
}



app.get('/info', (req, res) => {

    // donations stuff
    const row1 = db.prepare('SELECT total FROM total_donations WHERE id = 1').get();
    const row2 = db.prepare('SELECT total FROM pending WHERE id = 1').get();
    const row3 = db.prepare("SELECT total FROM spending_totals WHERE account = 'stripe'").get();
    const rows = db.prepare("SELECT name, total_donated FROM donor ORDER BY total_donated DESC LIMIT 50").all().map(row => ({ ...row })); // This spreads the row into a plain object; 
        
    // sharers stuff
    const sharerRows = db.prepare(`
        SELECT name, total 
        FROM top_sharers 
        ORDER BY total DESC 
        LIMIT 50
    `).all().map(row => ({ ...row }));

    const sharesSoFar = db.prepare(`
        SELECT total FROM shares_so_far WHERE id = 1
    `).get();


    res.json({
        total_donations: row1?.total ?? 0, 
        pending: row2?.total ?? 0,
        stripe: row3?.total ?? 0,
        top_donors: rows, 
        top_sharers: sharerRows, 
        sharesSoFar: sharesSoFar.total

    });
});







// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});