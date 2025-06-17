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

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('backend is running');
});


// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});