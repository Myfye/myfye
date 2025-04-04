require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001; 
const { create_new_on_ramp_path } = require('./routes/newUser');
const { get_payin_quote } = require('./routes/getPayinQuote');
const { create_new_payin } = require('./routes/createNewPayin');
const { bridge_swap } = require('./routes/bridge_swap/bridgeSwap');
const { createNewTokenAccount } = require('./routes/newSolanaTokenAccount');
const { 
    createUser, 
    getUserByEmail, 
    updateEvmPubKey, 
    updateSolanaPubKey, 
    getUserByPrivyId } = require('./routes/userDb');


const allowedOrigins = [
    'http://localhost:3000', // Development (local)
    'https://d3ewm5gcazpqyv.cloudfront.net', // Staging (CloudFront)
    'https://d1voqwa9zncr8f.cloudfront.net', // Production (CloudFront)
    'https://myfye.com', // Production (myfye.com)
    'https://www.myfye.com' // Production (www.myfye.com)
];

// Add CORS middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests without origin (e.g., Postman or server-side requests)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Add middleware logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(express.json());

/* User management endpoints */
app.post('/create_user', async (req, res) => {
    console.log("\n=== New User Creation Request Received ===");
    
    try {
        const userData = req.body;
        const result = await createUser(userData);
        console.log("User creation result:", JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        console.error("Error in /create_user endpoint:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/get_user_by_email', async (req, res) => {
    console.log("\n=== User Lookup Request Received ===");
    
    try {
        const { email } = req.body;
        const result = await getUserByEmail(email);
        console.log("User lookup result:", JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        console.error("Error in /get_user_by_email endpoint:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/get_user_by_privy_id', async (req, res) => {
    console.log("\n=== User Lookup Request Received ===");
    
    try {
        const { privyUserId } = req.body;
        const result = await getUserByPrivyId(privyUserId);
        console.log("User lookup result:", JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        console.error("Error in /get_user_by_privy_id endpoint:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/update_evm_pub_key', async (req, res) => {
    console.log("\n=== Update EVM Public Key Request Received ===");
    
    try {
        const { privyUserId, evmPubKey } = req.body;
        const result = await updateEvmPubKey(privyUserId, evmPubKey);
        console.log("EVM public key update result:", JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        console.error("Error in /update_evm_pub_key endpoint:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/update_solana_pub_key', async (req, res) => {
    console.log("\n=== Update Solana Public Key Request Received ===");
    
    try {
        const { privyUserId, solanaPubKey } = req.body;
        const result = await updateSolanaPubKey(privyUserId, solanaPubKey);
        console.log("Solana public key update result:", JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        console.error("Error in /update_solana_pub_key endpoint:", error);
        res.status(500).json({ error: error.message });
    }
});

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

app.post('/create_solana_token_account', async (req, res) => {
    console.log("\n=== Create Solana Token Account Request Received ===");
    
    try {
        const { receiverPubKey, mintAddress, programId } = req.body;
        const result = await createNewTokenAccount({
            receiverPubKey,
            mintAddress,
            programId
        });
        console.log("Token account creation result:", JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        console.error("Error in /create_solana_token_account endpoint:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/bridge_swap', async (req, res) => {
    console.log("\n=== Bridge Swap Request Received ===");
    try {
        const result = await bridge_swap({
            toAddress: "DR5s8mAdygzmHihziLzDBwjuux1R131ydAG2rjYhpAmn",
            inToken: "USDC",
            inChain: "solana",
            outToken: "USDC",
            outChain: "base",
            amount: "1000000" // 1 USDC
        });
        console.log("Bridge swap result:", JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        console.error("Error in /bridge_swap endpoint:", error);
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running at http://0.0.0.0:${PORT}`);
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