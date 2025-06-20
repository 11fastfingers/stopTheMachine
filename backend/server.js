require('dotenv').config();  // loads env variables

const express = require('express');
const cors = require('cors'); 
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Database = require('better-sqlite3'); 
const path = require('path');


const app = express(); 
const port = process.env.PORT || 3000;


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
    const row1 = db.prepare('SELECT total FROM total_donations WHERE id = 1').get();

    const row2 = db.prepare('SELECT total FROM pending WHERE id = 1').get();

    const row3 = db.prepare('SELECT total FROM spending_totals WHERE account = `stripe').get();

    res.json({
        total_donations: row1?.total ?? 0, 
        pending: row2?.total ?? 0,
        stripe: row3?.total ?? 0
    });
});







// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});