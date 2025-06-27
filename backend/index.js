require("dotenv").config();
const express = require("express");
const cors = require("cors");
const geoip = require('geoip-lite');
const rateLimit = require('express-rate-limit');
const app = express();
const { create_new_on_ramp_path, get_all_receivers, delete_blockchain_wallet, delete_receiver, delete_blockchain_wallet_and_receiver } = require('./routes/onOffRamp/receiver');
const { create_new_payin, get_payin_quote } = require('./routes/onOffRamp/payIn');
const { bridge_swap } = require('./routes/bridge_swap/bridgeSwap');
const { ensureTokenAccount } = require('./routes/sol_transaction/tokenAccount');
const { signTransaction, signVersionedTransaction } = require('./routes/sol_transaction/solanaTransaction');
const { 
    createUser, 
    getUserByEmail, 
    updateEvmPubKey, 
    updateSolanaPubKey, 
    getUserByPrivyId,
    getAllUsers } = require('./routes/userDb');
const { createErrorLog, getErrorLogs, deleteErrorLog } = require('./routes/errorLog');
const { 
    createContact, 
    getContacts, 
    searchUser, 
    getTopContacts 
} = require('./routes/interUser');
const { 
    createSwapTransaction, 
    getSwapTransactionsByUserId,
    getAllSwapTransactions 
} = require('./routes/swapTransactions');
const { 
    createPayTransaction,
    getAllPayTransactions 
} = require('./routes/payTransactions');
const { 
    saveRecentlyUsedAddresses, 
    getRecentlyUsedAddresses 
} = require('./routes/sol_transaction/recentlyUsedAddresses');
const { emailService } = require('./routes/emailService');
const { createUserKYC, getAllKYCUsers } = require('./routes/user_kyc');
const { create_new_dinari_user } = require('./routes/dinari_shares/entity');
const { create_new_wallet } = require('./routes/dinari_shares/wallet');
const { generate_nonce } = require('./routes/dinari_shares/generate_nonce');
const { add_kyc_to_entity } = require('./routes/dinari_shares/kyc');
const { add_kyc_doc_to_entity } = require('./routes/dinari_shares/kyc_doc');
const { create_new_dinari_account } = require('./routes/dinari_shares/account');
const { sign_nonce } = require('./routes/dinari_shares/sign_nonce');
const { sign_order } = require('./routes/dinari_shares/sign_order.js');

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
  windowMs: 60 * 1000, // 1 minutes
  max: 400, // Limit each IP requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP requests per windowMs
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Very strict limiter for sensitive operations
const sensitiveLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
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

// Add email service routes
app.use('/api/email', emailService);

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

app.post('/create_user_kyc', sensitiveLimiter, async (req, res) => {
    console.log("\n=== Create User KYC Request Received ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    try {
        const kycData = req.body;
        const result = await createUserKYC(kycData);
        console.log("KYC creation result:", JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        console.error("Error in /create_user_kyc endpoint:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ 
            error: error.message || "Failed to create user KYC",
            details: error.toString(),
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
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

/* Swap transaction endpoints */
app.post('/create_swap_transaction', generalLimiter, async (req, res) => {
    try {
        const swapData = req.body;
        const result = await createSwapTransaction(swapData);
        res.json(result);
    } catch (error) {
        console.error("Error in /create_swap_transaction endpoint:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/get_swap_transactions', generalLimiter, async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const transactions = await getSwapTransactionsByUserId(user_id);
        res.json(transactions);
    } catch (error) {
        console.error("Error in /get_swap_transactions endpoint:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/get_all_swap_transactions", generalLimiter, async (req, res) => {
    console.log("\n=== Get All Swap Transactions Request Received ===");

    try {
        const result = await getAllSwapTransactions();
        console.log(`Retrieved ${result.length} swap transactions`);
        res.json(result);
    } catch (error) {
        console.error("Error in /get_all_swap_transactions endpoint:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ 
            error: error.message || "Failed to fetch swap transactions",
            details: error.toString(),
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

/* Pay transaction endpoints */
app.post('/create_pay_transaction', generalLimiter, async (req, res) => {
    try {
        const payData = req.body;
        const result = await createPayTransaction(payData);
        res.json(result);
    } catch (error) {
        console.error("Error in /create_pay_transaction endpoint:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/get_all_pay_transactions", generalLimiter, async (req, res) => {
    console.log("\n=== Get All Pay Transactions Request Received ===");

    try {
        const result = await getAllPayTransactions();
        console.log(`Retrieved ${result.length} pay transactions`);
        res.json(result);
    } catch (error) {
        console.error("Error in /get_all_pay_transactions endpoint:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ 
            error: error.message || "Failed to fetch pay transactions",
            details: error.toString(),
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
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
    
    const result = await ensureTokenAccount({
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

app.post("/log_error", async (req, res) => {
  console.log("\n=== Error Log Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const errorData = req.body;
    const result = await createErrorLog(errorData);
    console.log("Error log result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /log_error endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to log error",
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

/* Contact management routes */
app.post("/create_contact", async (req, res) => {
  console.log("\n=== Create Contact Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const contactData = req.body;
    const result = await createContact(contactData);
    console.log("Contact creation result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /create_contact endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to create contact",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/get_contacts", async (req, res) => {
  console.log("\n=== Get Contacts Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const data = req.body;
    const result = await getContacts(data);
    console.log("Get contacts result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /get_contacts endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to get contacts",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/search_users", async (req, res) => {
  console.log("\n=== Search Users Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const searchData = req.body;
    const result = await searchUser(searchData);
    console.log("User search result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /search_users endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to search users",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/get_top_contacts", async (req, res) => {
  console.log("\n=== Get Top Contacts Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const data = req.body;
    const result = await getTopContacts(data);
    console.log("Get top contacts result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /get_top_contacts endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to get top contacts",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/* Transaction signing endpoints */
app.post("/sign_transaction", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Sign Transaction Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const data = req.body;
    const result = await signTransaction(data);
    console.log("Transaction signing result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /sign_transaction endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to sign transaction",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/sign_versioned_transaction", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Sign Versioned Transaction Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const data = req.body;
    const result = await signVersionedTransaction(data);
    console.log("Versioned transaction signing result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /sign_versioned_transaction endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to sign versioned transaction",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/get_error_logs", generalLimiter, async (req, res) => {
  console.log("\n=== Get All Error Logs Request Received ===");

  try {
    const result = await getErrorLogs();
    console.log(`Retrieved ${result.length} error logs`);
    res.json(result);
  } catch (error) {
    console.error("Error in /get_error_logs endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to fetch error logs",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/get_all_users", generalLimiter, async (req, res) => {
  console.log("\n=== Get All Users Request Received ===");

  try {
    const result = await getAllUsers();
    console.log(`Retrieved ${result.length} users`);
    res.json(result);
  } catch (error) {
    console.error("Error in /get_all_users endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to fetch users",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/delete_error_log", generalLimiter, async (req, res) => {
  console.log("\n=== Delete Error Log Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const { error_log_id } = req.body;
    if (!error_log_id) {
      return res.status(400).json({ error: 'Error log ID is required' });
    }
    const result = await deleteErrorLog(error_log_id);
    console.log("Error log deletion result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /delete_error_log endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to delete error log",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/* Recently Used Solana Addresses routes */
app.post("/save_recently_used_addresses", generalLimiter, async (req, res) => {
    console.log("\n=== Save Recently Used Addresses Request Received ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    try {
        const { user_id, addresses } = req.body;
        if (!user_id || !addresses || !Array.isArray(addresses)) {
            return res.status(400).json({ 
                error: 'Invalid request. user_id and addresses array are required.' 
            });
        }
        const result = await saveRecentlyUsedAddresses(user_id, addresses);
        console.log("Save addresses result:", JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        console.error("Error in /save_recently_used_addresses endpoint:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ 
            error: error.message || "Failed to save addresses",
            details: error.toString(),
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

app.post("/get_recently_used_addresses", generalLimiter, async (req, res) => {
    console.log("\n=== Get Recently Used Addresses Request Received ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).json({ 
                error: 'Invalid request. user_id is required.' 
            });
        }
        const result = await getRecentlyUsedAddresses(user_id);
        console.log("Get addresses result:", JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        console.error("Error in /get_recently_used_addresses endpoint:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ 
            error: error.message || "Failed to get addresses",
            details: error.toString(),
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});


app.post("/send_email", async (req, res) => {
  console.log("\n=== Send Email Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const emailData = req.body;
    const result = await emailService(emailData);
    console.log("Email result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /send_email endpoint:", error);
    console.error("Error stack:", error.stack);
        res.status(500).json({ 
            error: error.message || "Failed to get addresses",
            details: error.toString(),
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

app.post("/get_all_kyc_users", generalLimiter, async (req, res) => {
    console.log("\n=== Get All KYC Users Request Received ===");

    try {
        const result = await getAllKYCUsers();
        console.log(`Retrieved ${result.length} KYC users`);
        res.json(result);
    } catch (error) {
        console.error("Error in /get_all_kyc_users endpoint:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ 
            error: error.message || "Failed to fetch KYC users",
            details: error.toString(),
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

app.get("/get_all_receivers", generalLimiter, async (req, res) => {
  console.log("\n=== Get All Receivers Request Received ===");

  try {
    const result = await get_all_receivers();
    console.log(`Retrieved ${result.length} receivers with their blockchain wallets`);
    res.json(result);
  } catch (error) {
    console.error("Error in /get_all_receivers endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to fetch receivers",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});
/*
app.post("/delete_blockchain_wallet", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Delete Blockchain Wallet Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const { receiverId, walletId } = req.body;
    if (!receiverId || !walletId) {
      return res.status(400).json({ 
        error: 'Invalid request. receiverId and walletId are required.' 
      });
    }
    const result = await delete_blockchain_wallet(receiverId, walletId);
    console.log("Blockchain wallet deletion result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /delete_blockchain_wallet endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to delete blockchain wallet",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/delete_receiver", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Delete Receiver Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const { receiverId } = req.body;
    if (!receiverId) {
      return res.status(400).json({ 
        error: 'Invalid request. receiverId is required.' 
      });
    }
    const result = await delete_receiver(receiverId);
    console.log("Receiver deletion result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /delete_receiver endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to delete receiver",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});
*/

app.post("/delete_blockchain_wallet_and_receiver", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Delete Blockchain Wallet and Receiver Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const { receiverId, walletId } = req.body;
    if (!receiverId || !walletId) {
      return res.status(400).json({ 
        error: 'Invalid request. receiverId and walletId are required.' 
      });
    }
    const result = await delete_blockchain_wallet_and_receiver(receiverId, walletId);
    console.log("Deletion result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /delete_blockchain_wallet_and_receiver endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to delete blockchain wallet and receiver",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/create_dinari_user", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Create Dinari User Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const data = req.body;
    const result = await create_new_dinari_user(data);
    console.log("Dinari user creation result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /create_dinari_user endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to create Dinari user",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/link_dinari_wallet", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Link Dinari Wallet Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const { user_id, account_id, signature, nonce, wallet_address } = req.body;
    
    if (!user_id || !account_id || !signature || !nonce || !wallet_address) {
      return res.status(400).json({ 
        error: 'Invalid request. user_id, account_id, signature, nonce, and wallet_address are required.' 
      });
    }

    const result = await create_new_wallet({
      user_id,
      account_id,
      signature,
      nonce,
      wallet_address
    });

    console.log("Wallet linking result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /link_dinari_wallet endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to link wallet",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/generate_dinari_nonce", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Generate Dinari Nonce Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const { user_id, account_id, wallet_address } = req.body;
    
    if (!user_id || !account_id || !wallet_address) {
      return res.status(400).json({ 
        error: 'Invalid request. user_id, account_id, and wallet_address are required.' 
      });
    }

    const result = await generate_nonce({
      user_id,
      account_id,
      wallet_address
    });

    console.log("Nonce generation result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /generate_dinari_nonce endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to generate nonce",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/add_dinari_kyc", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Add Dinari KYC Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const data = req.body;
    const result = await add_kyc_to_entity(data);
    console.log("KYC addition result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /add_dinari_kyc endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to add KYC",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/add_dinari_kyc_doc", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Add Dinari KYC Document Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const data = req.body;
    const result = await add_kyc_doc_to_entity(data);
    console.log("KYC document upload result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /add_dinari_kyc_doc endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to upload KYC document",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/create_dinari_account", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Create Dinari Account Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const { entity_id } = req.body;
    
    if (!entity_id) {
      return res.status(400).json({ 
        error: 'Invalid request. entity_id is required.' 
      });
    }

    const result = await create_new_dinari_account(entity_id);
    console.log("Account creation result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /create_dinari_account endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to create account",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/sign_dinari_nonce", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Sign Dinari Nonce Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const { nonce_message, message, nonce } = req.body;
    
    // Check if we have the Dinari nonce response structure or just a message
    if (!nonce_message && (!message || !nonce)) {
      return res.status(400).json({ 
        error: 'Invalid request. Either nonce_message or both message and nonce are required.' 
      });
    }

    const result = await sign_nonce(req.body);
    console.log("Nonce signing result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /sign_dinari_nonce endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to sign nonce",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/sign_dinari_order", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Sign Dinari Order Request Received ===");

  try {
    const result = await sign_order();
    console.log("Order execution result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /sign_dinari_order endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to execute order",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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
