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
app.use(express.json());


app.get('/', (req, res) => {
    res.send('backend is running');
});


app.post('/donate', async (req, res) => {
  const { amount, currency, name } = req.body;

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
                      name: 'Donation',
                      donor_name: name || 'Anonymous'
                  },
                  unit_amount: Math.round(amount * 100), // amount in cents
              },
              quantity: 1,
          }],
          success_url: 'https://stopthemachine.org',
          cancel_url: 'https://stopthemachine.org',
      });

      res.json({ id: session.id });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});












// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});