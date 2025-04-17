require("dotenv").config();
const express = require("express");
const cors = require("cors");
const geoip = require('geoip-lite');
const rateLimit = require('express-rate-limit');
const app = express();
const { create_new_on_ramp_path } = require('./routes/newBlindPayReceiver');
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

app.set('trust proxy', true);

const allowedOrigins = [
    "http://localhost:3000", // Development (local)
    "https://d3ewm5gcazpqyv.cloudfront.net", // Staging (CloudFront)
    "https://dev.myfye.com", // Staging (dev.myfye.com)
    "https://d1voqwa9zncr8f.cloudfront.net", // Production (CloudFront)
    "https://myfye.com", // Production (myfye.com)
    "https://www.myfye.com", // Production (www.myfye.com)
    "https://api.myfye.com", // API domain
  ];
  
  // Add CORS middleware with stricter configuration
  app.use(cors({
      origin: function (origin, callback) {
        // Allow requests without origin (e.g., Postman or server-side requests)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          console.log(`Blocked request from origin: ${origin}`);
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'X-API-Key'],
      credentials: true,
      maxAge: 86400, // Cache preflight requests for 24 hours
      exposedHeaders: ['Access-Control-Allow-Origin']
  }));

// Add explicit OPTIONS handling for preflight requests
app.options('*', cors());

app.use(express.json());
// Add middleware logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    next();
  });

// Create different rate limiters for different endpoints
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 400, // Limit each IP requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP requests per windowMs
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Very strict limiter for sensitive operations
const sensitiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 6, // Limit each IP per windowMs
  message: { error: 'Too many sensitive operations attempted, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// IP blocking middleware with rate limiting
const blockUnauthorizedIPs = (req, res, next) => {
  // Allow preflight OPTIONS requests without API key
  if (req.method === 'OPTIONS') {
    return next();
  }
  const apiKey = req.headers['x-api-key'];
  const ip = req.ip;
  const geo = geoip.lookup(ip);
  
  // If no API key is provided, block the request immediately
  if (!apiKey) {
    console.log(`Blocked request from IP: ${ip} (${geo?.country || 'Unknown Country'}, ${geo?.city || 'Unknown City'}) - No API key provided`);
    return res.status(403).json({ 
      error: 'Forbidden',
      message: 'Missing API key'
    });
  }

  // If API key is invalid, block the request
  if (apiKey !== process.env.CLIENT_SIDE_KEY) {
    console.log(`Blocked request from IP: ${ip} (${geo?.country || 'Unknown Country'}, ${geo?.city || 'Unknown City'}) - Invalid API key`);
    return res.status(403).json({ 
      error: 'Forbidden',
      message: 'Invalid API key'
    });
  }

  // Log successful requests with geolocation
  console.log(`Request from IP: ${ip} (${geo?.country || 'Unknown Country'}, ${geo?.city || 'Unknown City'})`);
  next();
};

// Apply general rate limiting to all routes
app.use(generalLimiter);
// Apply IP blocking and API key validation to all routes
app.use(blockUnauthorizedIPs);

/* User management endpoints */
// Apply stricter rate limiting to sensitive endpoints
app.post('/create_user', sensitiveLimiter, async (req, res) => {
    try {
        const userData = req.body;
        const result = await createUser(userData);
        res.json(result);
    } catch (error) {
        console.error("Error in /create_user endpoint:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/get_user_by_email", authLimiter, async (req, res) => {
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

app.post("/get_user_by_privy_id", authLimiter, async (req, res) => {
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

app.post('/update_evm_pub_key', sensitiveLimiter, async (req, res) => {
    try {
        const { privyUserId, evmPubKey } = req.body;
        const result = await updateEvmPubKey(privyUserId, evmPubKey);
        res.json(result);
    } catch (error) {
        console.error("Error in /update_evm_pub_key endpoint:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/update_solana_pub_key', sensitiveLimiter, async (req, res) => {
    try {
        const { privyUserId, solanaPubKey } = req.body;
        const result = await updateSolanaPubKey(privyUserId, solanaPubKey);
        res.json(result);
    } catch (error) {
        console.error("Error in /update_solana_pub_key endpoint:", error);
        res.status(500).json({ error: error.message });
    }
});

/* Blind pay API */
app.post("/new_on_ramp", async (req, res) => {
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

app.post("/get_payin_quote", async (req, res) => {
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

app.post("/new_payin", async (req, res) => {
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

app.post("/create_solana_token_account", async (req, res) => {
  console.log("\n=== Create Solana Token Account Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const { receiverPubKey, mintAddress, programId } = req.body;
    
    // Log environment variable status (without exposing the actual key)
    console.log(`SOL_PRIV_KEY is ${process.env.SOL_PRIV_KEY ? 'set' : 'not set'}`);
    console.log(`SOL_PRIV_KEY length: ${process.env.SOL_PRIV_KEY ? process.env.SOL_PRIV_KEY.length : 0}`);
    
    const result = await createNewTokenAccount({
      receiverPubKey,
      mintAddress,
      programId,
    });
    console.log(
      "Token account creation result:",
      JSON.stringify(result, null, 2)
    );
    res.json(result);
  } catch (error) {
    console.error("Error in /create_solana_token_account endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to create token account",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});


app.get("/bridge_swap", async (req, res) => {
  console.log("\n=== Bridge Swap Request Received ===");
  try {
    const result = await bridge_swap({
      toAddress: "DR5s8mAdygzmHihziLzDBwjuux1R131ydAG2rjYhpAmn",
      inToken: "USDC",
      inChain: "solana",
      outToken: "USDC",
      outChain: "base",
      amount: "1000000", // 1 USDC
    });
    console.log("Bridge swap result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /bridge_swap endpoint:", error);
    res.status(500).json({ error: error.message });
  }
});

/*
app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
*/

// Use process.env.PORT for production (Heroku, AWS, etc.), fall back to 3001 in development
const PORT = process.env.PORT || 3001; 

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend server running at http://0.0.0.0:${PORT}`); 
});

//http://44.242.228.55:3001

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
