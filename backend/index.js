require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3001; 
const { create_new_on_ramp_path } = require('./routes/newUser');
const { get_payin_quote } = require('./routes/getPayinQuote');
const { create_new_payin } = require('./routes/createNewPayin');

// Add middleware logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(express.json());


/* Blind pay API */
app.post('/new_on_ramp', async (req, res) => {
    console.log("\n=== New On-Ramp Request Received ===");
    
    try {
        const data = req.body;
        // Call the on-ramp service
        const result = await create_new_on_ramp_path(data);
        console.log("On-ramp result:", JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        console.error("Error in /new_on_ramp endpoint:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/get_payin_quote', async (req, res) => {
    console.log("\n=== New Pay-In Quote Request Received ===");
    
    try {
        const data = req.body;
        // Call the pay-in quote service
        const result = await get_payin_quote(data);
        console.log("Pay-in quote result:", JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        console.error("Error in /get_payin_quote endpoint:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/new_payin', async (req, res) => {
    console.log("\n=== New Pay-In Request Received ===");
    
    try {
        const data = req.body;
        // Call the pay-in quote service
        const result = await create_new_payin(data);
        console.log("Pay-in result:", JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        console.error("Error in /get_payin endpoint:", error);
        res.status(500).json({ error: error.message });
    }
});


app.get('/get_balance', (req, res) => {
    console.log("get_balance");
    const balance = {
        address: "YourWalletAddress",
        balance: "11"
    };
    res.json(balance);
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});

/*
curl -X POST http://localhost:3001/new_on_ramp \
  -H "Content-Type: application/json" \
  -d '{"name": "Gavin", "amount": 1000}'

  curl -X POST http://localhost:3001/new_payin \
  -H "Content-Type: application/json" \
  -d '{"name": "Gavin", "amount": 1000}'

    curl -X POST http://localhost:3001/get_payin_quote \
  -H "Content-Type: application/json" \
  -d '{"name": "Gavin", "amount": 1000}'
*/