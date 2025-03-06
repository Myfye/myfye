require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3001; 

app.use(express.json());

app.get('/get_balance', (req, res) => {
    const balance = {
        address: "YourWalletAddress",
        balance: "11"
    };
    res.json(balance);
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
