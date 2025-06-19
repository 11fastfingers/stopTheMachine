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
        const paymentIntent = event.data.object;
        const chargeId = paymentIntent.latest_charge;
        const amount = paymentIntent.amount_received;
        const currency = paymentIntent.currency.toUpperCase();

        // Convert amount to USD if needed
        let amountInUSD = amount;
        if (currency !== 'USD') {
            const exchangeRates = await stripe.exchangeRates.retrieve(currency.toLowerCase());
            const rateToUSD = exchangeRates.rates['usd'];
            if (!rateToUSD) throw new Error(`No exchange rate for ${currency}`);
            amountInUSD = amount * rateToUSD;
        }

        // --- Wait until we get stripeFee reliably ---
        async function getStripeFeeWithRetry() {
            const maxAttempts = 5;
            const delay = (ms) => new Promise(res => setTimeout(res, ms));
            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                const charge = await stripe.charges.retrieve(chargeId, {
                    expand: ['balance_transaction']
                });

                const bt = charge.balance_transaction;
                if (bt && typeof bt.fee === 'number') {
                    const rateToUSD = currency !== 'USD'
                        ? (await stripe.exchangeRates.retrieve(currency.toLowerCase())).rates['usd']
                        : 1;
                    return bt.fee * rateToUSD;
                }

                await delay(1000 * attempt); // exponential backoff
            }
            throw new Error('Could not retrieve Stripe fee after retries');
        }

        const stripeFee = await getStripeFeeWithRetry();

        // Get donor name
        const name = paymentIntent.metadata?.name || 'Anonymous';

        if (name !== 'Anonymous') {
            const stmt = db.prepare('INSERT OR IGNORE INTO donor (name) VALUES (?)');
            stmt.run(name);
        }

        const donationStmt = name !== 'Anonymous'
            ? db.prepare(`INSERT INTO donation (donor_name, amount) VALUES (?, ?)`)
            : db.prepare(`INSERT INTO donation (amount) VALUES (?)`);

        name !== 'Anonymous'
            ? donationStmt.run(name, amountInUSD)
            : donationStmt.run(amountInUSD);

        const update = db.prepare(`
            UPDATE total_donations 
            SET total = total + ? 
            WHERE id = 1
        `);
        update.run(amountInUSD);

        const ensureRow = db.prepare(`
            INSERT OR IGNORE INTO spending (account, total) VALUES ('stripe', 0)
        `);
        ensureRow.run();

        const spending = db.prepare(`
            UPDATE spending
            SET total = total + ?
            WHERE account = 'stripe'
        `);
        spending.run(stripeFee);
    }

    res.sendStatus(200);
});
