require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3001; 
const { processOnRampRequest } = require('./routes/onRamp');

app.use(express.json());

app.post('/on_ramp', async (req, res) => {
    const data = req.body;
    // Call the on-ramp service
    const result = await processOnRampRequest(data);
    res.json(result);
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
