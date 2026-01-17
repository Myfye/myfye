require("dotenv").config();
const express = require("express");
const cors = require("cors");
const geoip = require('geoip-lite');
const rateLimit = require('express-rate-limit');
const web3 = require('@solana/web3.js');
const app = express();
const { create_new_on_ramp_path, get_all_receivers, delete_blockchain_wallet, delete_receiver, delete_blockchain_wallet_and_receiver } = require('./routes/blindPay/receiver.js');
const { create_new_payin, get_payin_quote } = require('./routes/blindPay/payIn.js');
const { create_new_bank_account, get_bank_accounts, delete_bank_account, get_all_bank_accounts } = require('./routes/blindPay/bankAccount.js');
const { bridge_swap } = require('./routes/bridge_swap/bridgeSwap');
const { ensureTokenAccount } = require('./routes/sol_transaction/tokenAccount');
const { signTransaction, signVersionedTransaction } = require('./routes/sol_transaction/solanaTransaction');
const { 
    createUser, 
    getUserByEmail, 
    updateEvmPubKey, 
    updateSolanaPubKey, 
    getUserByPrivyId,
    getAllUsers,
    deleteUserWithBlindPay } = require('./routes/userDb');
const { createErrorLog, getErrorLogs, deleteErrorLog } = require('./routes/errorLog');
const { 
    createContact, 
    getContacts, 
    searchUser, 
    getTopContacts,
    deleteContact 
} = require('./routes/interUser');
const { 
    createSwapTransaction, 
    getSwapTransactionsByUserId,
    getAllSwapTransactions 
} = require('./routes/transactions/swapTransactions');
const { 
    createPayTransaction,
    getAllPayTransactions 
} = require('./routes/transactions/payTransactions');
const { transactionHistory } = require('./routes/transactions/transactionHistory');
const { 
    saveRecentlyUsedAddresses, 
    getRecentlyUsedAddresses 
} = require('./routes/sol_transaction/recentlyUsedAddresses');
const { emailService } = require('./routes/emailService');
const { create_new_dinari_user } = require('./routes/dinari_shares/entity');
const { create_new_wallet } = require('./routes/dinari_shares/wallet');
const { generate_nonce } = require('./routes/dinari_shares/generate_nonce');
const { add_kyc_to_entity } = require('./routes/dinari_shares/kyc');
const { add_kyc_doc_to_entity } = require('./routes/dinari_shares/kyc_doc');
const { create_new_dinari_account } = require('./routes/dinari_shares/account');
const { sign_nonce } = require('./routes/dinari_shares/sign_nonce');
const { sign_order } = require('./routes/dinari_shares/sign_order.js');
const { getWalletByAddress } = require('./routes/privy/getWallets');
const { pregenerateUser } = require('./routes/privy/pregenerateUser');
const { create_new_payout, get_payout_quote } = require('./routes/blindPay/payOut.js');
const { generateExternalLink } = require('./routes/sumsub/generateExternalLink');
const { serveTempImage } = require('./routes/sumsub/serveTempImage');
const { handleSumsubWebhook } = require('./routes/sumsub/webhook');
const { handleBlindPayWebhook } = require('./routes/blindPay/webhook');
const { 
    updateUserKycStatus, 
    updateUserKycStatusByBlindPayId,
    getUserKycStatus,
    getUserKycStatusByBlindPayId 
} = require('./routes/kyc/kycStatus');
const { 
    getAllStockPrices,
    getStockPriceBySymbol,
    triggerStockPriceUpdate,
    initializeStockPriceSystem,
    clearAllStockPrices
} = require('./routes/stockPrice');
const { createEtherfuseOnboardingUrl } = require('./routes/etherfuse/onboarding');
const { createBankAccount, getBankAccount } = require('./routes/etherfuse/bankAccount');
const { createEtherfuseOrder, getEtherfuseOrderDetails } = require('./routes/etherfuse/order');
const { getUserEtherfuseData } = require('./routes/etherfuse/customer_data.js');
const { handleCustomerUpdatedWebhook } = require('./routes/etherfuse/customer_updated');
const { handleOrderUpdatedWebhook } = require('./routes/etherfuse/order_updated');
const { handleBankAccountUpdatedWebhook } = require('./routes/etherfuse/bank_account_updated');
const { validatePrivyUserId, checkAccountCreationRateLimit, logSponsoredRequest, getAllSponsoredRequests } = require('./routes/sol_transaction/sponsoredSecurity');

app.set('trust proxy', true);

const allowedOrigins = [
    "http://localhost:3000", // Development (local)
    "http://localhost:3002", // Development (local)
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

// Store raw body for webhook signature verification
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.path.startsWith('/webhooks/')) {
      req.rawBody = buf;
    }
  }
}));

// Add middleware logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    // console.log('Headers:', JSON.stringify(req.headers, null, 2));
    // console.log('Body:', JSON.stringify(req.body, null, 2));
    next();
  });

// Create different rate limiters for different endpoints
const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 500, // Limit each IP requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP requests per windowMs
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Very strict limiter for sensitive operations
const sensitiveLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 12, // Limit each IP per windowMs
  message: { error: 'Too many sensitive operations attempted, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Very strict limiter for sensitive operations
const sponsoredLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 4, // Limit each IP per windowMs
  message: { error: 'Too many sponsored operations attempted, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// IP blocking middleware with rate limiting
const blockUnauthorizedIPs = (req, res, next) => {
  // Allow preflight OPTIONS requests without API key
  if (req.method === 'OPTIONS') {
    return next();
  }
  
  // Allow webhook routes without API key (they use signature authentication)
  if (req.path.startsWith('/webhooks/') || req.path.startsWith('/etherfuse/webhook/')) {
    console.log(`Webhook request from IP: ${req.ip} - bypassing API key check`);
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

// Serve temporary images (no API key required)
app.get("/api/sumsub/temp-image/:filename", serveTempImage);

// Apply general rate limiting to all routes (excluding webhooks)
app.use((req, res, next) => {
  // Skip rate limiting for webhook routes
  if (req.path.startsWith('/webhooks/') || req.path.startsWith('/etherfuse/webhook/')) {
    return next();
  }
  generalLimiter(req, res, next);
});
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


app.post("/get_user_by_email", authLimiter, async (req, res) => {
  console.log("\n=== User Lookup Request Received ===");

  try {
    const { email } = req.body;
    const result = await getUserByEmail(email);
    // console.log("User lookup result:", JSON.stringify(result, null, 2));
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
    // console.log("User lookup result:", JSON.stringify(result, null, 2));
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

/* KYC status endpoints */
app.post('/get_user_kyc_status', generalLimiter, async (req, res) => {
    console.log("\n=== Get User KYC Status Request Received ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        
        const result = await getUserKycStatus(user_id);
        console.log("KYC status result:", JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        console.error("Error in /get_user_kyc_status endpoint:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ 
            error: error.message || "Failed to get user KYC status",
            details: error.toString(),
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

app.post('/get_user_kyc_status_by_blindpay_id', generalLimiter, async (req, res) => {
    console.log("\n=== Get User KYC Status by BlindPay ID Request Received ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    try {
        const { blind_pay_receiver_id } = req.body;
        if (!blind_pay_receiver_id) {
            return res.status(400).json({ error: 'BlindPay receiver ID is required' });
        }
        
        const result = await getUserKycStatusByBlindPayId(blind_pay_receiver_id);
        console.log("KYC status result:", JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        console.error("Error in /get_user_kyc_status_by_blindpay_id endpoint:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ 
            error: error.message || "Failed to get user KYC status by BlindPay ID",
            details: error.toString(),
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

app.post('/update_user_kyc_status', sensitiveLimiter, async (req, res) => {
    console.log("\n=== Update User KYC Status Request Received ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    try {
        const { user_id, new_status } = req.body;
        if (!user_id || !new_status) {
            return res.status(400).json({ error: 'User ID and new status are required' });
        }
        
        const result = await updateUserKycStatus(user_id, new_status);
        console.log("KYC status update result:", JSON.stringify(result, null, 2));
        res.json({ success: result });
    } catch (error) {
        console.error("Error in /update_user_kyc_status endpoint:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ 
            error: error.message || "Failed to update user KYC status",
            details: error.toString(),
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

app.post('/update_user_kyc_status_by_blindpay_id', sensitiveLimiter, async (req, res) => {
    console.log("\n=== Update User KYC Status by BlindPay ID Request Received ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    try {
        const { blind_pay_receiver_id, new_status } = req.body;
        if (!blind_pay_receiver_id || !new_status) {
            return res.status(400).json({ error: 'BlindPay receiver ID and new status are required' });
        }
        
        const result = await updateUserKycStatusByBlindPayId(blind_pay_receiver_id, new_status);
        console.log("KYC status update result:", JSON.stringify(result, null, 2));
        res.json({ success: result });
    } catch (error) {
        console.error("Error in /update_user_kyc_status_by_blindpay_id endpoint:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ 
            error: error.message || "Failed to update user KYC status by BlindPay ID",
            details: error.toString(),
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
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

/* Transaction History endpoint */
app.post("/get_transaction_history", generalLimiter, async (req, res) => {
    console.log("\n=== Get Transaction History Request Received ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    try {
        const data = req.body;
        const result = await transactionHistory(data);
        console.log(`Retrieved transaction history for user: ${data.user_id}`);
        res.json(result);
    } catch (error) {
        console.error("Error in /get_transaction_history endpoint:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ 
            error: error.message || "Failed to fetch transaction history",
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
    console.error("Error in /new_payin endpoint:", error);
    
    // Check if the error has a response with data containing a message
    if (error.response && error.response.data && error.response.data.message) {
      res.status(400).json({ error: error.response.data.message });
    } else {
      res.status(500).json({ error: error.message || "Failed to create payin" });
    }
  }
});

  app.post("/create_payout", async (req, res) => {
    console.log("\n=== New Pay-Out Request Received ===");

    try {
      const data = req.body;
      // Call the pay-out quote service
      const result = await create_new_payout(data);
      console.log("Pay-out result:", JSON.stringify(result, null, 2));
      res.json(result);
    } catch (error) {
      console.error("Error in /create_payout endpoint:", error);

      // Check if the error has a response with data containing a message
      if (error.response && error.response.data && error.response.data.message) {
        res.status(400).json({ error: error.response.data.message });
      } else {
        res.status(500).json({ error: error.message || "Failed to create payout" });
      }
    }
});

app.post("/add_bank_account", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Add Bank Account Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const data = req.body;
    const result = await create_new_bank_account(data);
    console.log("Bank account creation result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /add_bank_account endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to create bank account",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/get_bank_accounts", generalLimiter, async (req, res) => {
  console.log("\n=== Get Bank Accounts Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const data = req.body;
    const result = await get_bank_accounts(data);
    console.log("Bank accounts retrieval result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /get_bank_accounts endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to get bank accounts",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/delete_bank_account", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Delete Bank Account Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const data = req.body;
    const result = await delete_bank_account(data);
    console.log("Bank account deletion result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /delete_bank_account endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to delete bank account",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/get_all_bank_accounts", generalLimiter, async (req, res) => {
  console.log("\n=== Get All Bank Accounts Request Received ===");

  try {
    const result = await get_all_bank_accounts();
    // console.log("All bank accounts retrieval result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /get_all_bank_accounts endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to get all bank accounts",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/create_solana_token_account", sponsoredLimiter, async (req, res) => {
  console.log("\n=== Create Solana Token Account Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  console.log("Request IP:", req.ip);
  
  try {
    const { receiverPubKey, mintAddress, programId, privyUserId } = req.body;
    
    // Validate required fields
    if (!privyUserId) {
      return res.status(400).json({ 
        error: "Missing required field: privyUserId is required" 
      });
    }
    
    // Validate required fields
    if (!receiverPubKey || !mintAddress || !programId) {
      return res.status(400).json({ 
        error: "Missing required fields: receiverPubKey, mintAddress, and programId are required" 
      });
    }

    // SECURITY: Validate privy user ID exists in database
    const user = await validatePrivyUserId(privyUserId);
    if (!user) {
      console.warn(`[SECURITY] Invalid privy user ID: ${privyUserId} from IP: ${req.ip}`);
      return res.status(403).json({ 
        error: "Invalid user: privyUserId not found in database" 
      });
    }

    // SECURITY: Rate limiting - max 4 token account creations per user per day
    const rateLimitCheck = await checkAccountCreationRateLimit(privyUserId, 4);
    if (!rateLimitCheck.allowed) {
      console.warn(`[SECURITY] Rate limit exceeded for ${privyUserId} from IP: ${req.ip}. Current count: ${rateLimitCheck.count}/4`);
      return res.status(429).json({ 
        error: `Rate limit exceeded: Maximum 4 token account creations per day. You have created ${rateLimitCheck.count} account(s) in the last 24 hours.`,
        count: rateLimitCheck.count,
        maxPerDay: 4
      });
    }

    console.log(`[SECURITY] Account creation allowed for user ${privyUserId} (${rateLimitCheck.count}/4 today)`);
    
    // Log environment variable status (without exposing the actual key)
    console.log(`SOL_PRIV_KEY is ${process.env.SOL_PRIV_KEY ? 'set' : 'not set'}`);
    console.log(`SOL_PRIV_KEY length: ${process.env.SOL_PRIV_KEY ? process.env.SOL_PRIV_KEY.length : 0}`);
    
    const result = await ensureTokenAccount({
      receiverPubKey,
      mintAddress,
      programId,
    });
    
    // Log the sponsored request (transaction signature will be null for account creation)
    await logSponsoredRequest({
      ip_address: req.ip,
      request_type: 'create_token_account',
      privy_user_id: privyUserId,
      transaction_signature: null, // Account creation doesn't have a signature yet
      transaction_data: {
        receiverPubKey,
        mintAddress,
        programId,
        result: result.pubkey
      }
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
    // console.log("Get contacts result:", JSON.stringify(result, null, 2));
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
    // console.log("User search result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    // console.error("Error in /search_users endpoint:", error);
    // console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to search users",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/get_top_contacts", async (req, res) => {
  console.log("\n=== Get Top Contacts Request Received ===");
  // console.log("Request body:", JSON.stringify(req.body, null, 2));

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

app.post("/delete_contact", async (req, res) => {
  console.log("\n=== Delete Contact Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const data = req.body;
    const result = await deleteContact(data);
    console.log("Delete contact result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /delete_contact endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to delete contact",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/* Transaction signing endpoints */
app.post("/sign_transaction", sponsoredLimiter, async (req, res) => {
  console.log("\n=== Sign Transaction Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  console.log("Request IP:", req.ip);
  
  try {
    const { serializedTransaction, privyUserId } = req.body;
    
    // Validate required fields
    if (!privyUserId) {
      return res.status(400).json({ 
        error: "Missing required field: privyUserId is required" 
      });
    }
    
    if (!serializedTransaction) {
      return res.status(400).json({ 
        error: "Missing required field: serializedTransaction is required" 
      });
    }
    
    // Validate privy user ID exists in database
    const user = await validatePrivyUserId(privyUserId);
    if (!user) {
      console.warn(`[SECURITY] Invalid privy user ID: ${privyUserId} from IP: ${req.ip}`);
      return res.status(403).json({ 
        error: "Invalid user: privyUserId not found in database" 
      });
    }
    
    const data = { serializedTransaction };
    const result = await signTransaction(data);
    
    // Extract transaction signature from result (if available)
    const transactionSignature = result.transactionSignature || null;
    
    // Log the sponsored request
    await logSponsoredRequest({
      ip_address: req.ip,
      request_type: 'sign_transaction',
      privy_user_id: privyUserId,
      transaction_signature: transactionSignature,
      transaction_data: {
        serializedTransaction: serializedTransaction.substring(0, 200), // Store first 200 chars for reference
        signedTransactionLength: result.signedTransaction ? result.signedTransaction.length : 0,
        hasError: !!result.error
      }
    });
    
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

app.post("/sign_versioned_transaction", sponsoredLimiter, async (req, res) => {
  console.log("\n=== Sign Versioned Transaction Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  console.log("Request IP:", req.ip);

  try {
    const { serializedTransaction, privyUserId } = req.body;
    
    // Validate required fields
    if (!privyUserId) {
      return res.status(400).json({ 
        error: "Missing required field: privyUserId is required" 
      });
    }
    
    if (!serializedTransaction) {
      return res.status(400).json({ 
        error: "Missing required field: serializedTransaction is required" 
      });
    }
    
    // Validate privy user ID exists in database
    const user = await validatePrivyUserId(privyUserId);
    if (!user) {
      console.warn(`[SECURITY] Invalid privy user ID: ${privyUserId} from IP: ${req.ip}`);
      return res.status(403).json({ 
        error: "Invalid user: privyUserId not found in database" 
      });
    }
    
    const data = { serializedTransaction };
    const result = await signVersionedTransaction(data);
    
    // Extract transaction signature from result (if available)
    const transactionSignature = result.transactionSignature || null;
    
    // Log the sponsored request
    await logSponsoredRequest({
      ip_address: req.ip,
      request_type: 'sign_versioned_transaction',
      privy_user_id: privyUserId,
      transaction_signature: transactionSignature,
      transaction_data: {
        serializedTransaction: serializedTransaction.substring(0, 200), // Store first 200 chars for reference
        signedTransactionLength: result.signedTransaction ? result.signedTransaction.length : 0,
        hasError: !!result.error
      }
    });
    
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
    // console.log(`Retrieved ${result.length} error logs`);
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

app.post("/get_all_sponsored_requests", generalLimiter, async (req, res) => {
  console.log("\n=== Get All Sponsored Requests Request Received ===");

  try {
    const result = await getAllSponsoredRequests();
    console.log(`Retrieved ${result.length} sponsored requests`);
    res.json(result);
  } catch (error) {
    console.error("Error in /get_all_sponsored_requests endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to fetch sponsored requests",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/get_all_users", generalLimiter, async (req, res) => {
  console.log("\n=== Get All Users Request Received ===");

  try {
    const result = await getAllUsers();
    // console.log(`Retrieved ${result.length} users`);
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

app.post("/delete_user", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Delete User Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const result = await deleteUserWithBlindPay(user_id);
    console.log("User deletion result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /delete_user endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to delete user",
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
    // console.log("Request body:", JSON.stringify(req.body, null, 2));

    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).json({ 
                error: 'Invalid request. user_id is required.' 
            });
        }
        const result = await getRecentlyUsedAddresses(user_id);
        // console.log("Get addresses result:", JSON.stringify(result, null, 2));
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

app.post("/get_wallet_by_address", generalLimiter, async (req, res) => {
    console.log("\n=== Get Wallet ID by Address Request Received ===");
    // console.log("Request body:", JSON.stringify(req.body, null, 2));

    try {
        const { address } = req.body;
        if (!address) {
            return res.status(400).json({ 
                error: 'Invalid request. address is required.' 
            });
        }

        const result = await getWalletByAddress(address);
        console.log("Get wallet ID result:", JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        console.error("Error in /get_wallet_id_by_address endpoint:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ 
            error: error.message || "Failed to get wallet ID",
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

app.get("/get_all_receivers", generalLimiter, async (req, res) => {
  console.log("\n=== Get All Receivers Request Received ===");

  try {
    const result = await get_all_receivers();
    // console.log(`Retrieved ${result.length} receivers with their blockchain wallets`);
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
  // console.log("Request body:", JSON.stringify(req.body, null, 2));

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

app.post("/payout_quote", async (req, res) => {
  console.log("\n=== New Payout Quote Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  try {
    const data = req.body;
    const result = await get_payout_quote(data);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result);
  } catch (error) {
    console.error("Error in /payout_quote endpoint:", error);
    res.status(500).json({ error: error.message || "Failed to get payout quote" });
  }
});

app.post("/get_wallet_id_by_address", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Get Wallet ID by Address Request Received ===");
  // console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ 
        error: 'Address parameter is required' 
      });
    }

    const result = await getWalletByAddress(address);
    console.log("Wallet ID lookup result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /get_wallet_id_by_address endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to get wallet ID by address",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/pregenerate_privy_user", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Pregenerate Privy User Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        error: 'Email parameter is required' 
      });
    }

    // Pregenerate the Privy user and get Solana wallet address
    const privyUser = await pregenerateUser(email);
    console.log("Privy user pregeneration result:", JSON.stringify(privyUser, null, 2));

    // Check if user already exists in database
    let dbUser = await getUserByPrivyId(privyUser.id);
    
    if (!dbUser) {
      // Create user in database with Solana address
      dbUser = await createUser({
        email: email,
        phoneNumber: null,
        firstName: null,
        lastName: null,
        country: null,
        evmPubKey: null,
        solanaPubKey: privyUser.solana_pub_key,
        privyUserId: privyUser.id,
        personaAccountId: null,
        blindPayReceiverId: null,
        blindPayEvmWalletId: null,
      });
      console.log("Created new user in database:", dbUser.uid);
    } else if (!dbUser.solana_pub_key && privyUser.solana_pub_key) {
      // Update existing user with Solana address if missing
      await updateSolanaPubKey(privyUser.id, privyUser.solana_pub_key);
      dbUser = await getUserByPrivyId(privyUser.id);
      console.log("Updated user with Solana address:", dbUser.uid);
    }

    // Return both Privy user data and database user data
    res.json({
      ...privyUser,
      dbUser: {
        uid: dbUser.uid,
        email: dbUser.email,
        solana_pub_key: dbUser.solana_pub_key,
      }
    });
  } catch (error) {
    console.error("Error in /pregenerate_privy_user endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to pregenerate Privy user",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/generate_sumsub_external_link", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Generate Sumsub External Link Request Received ===");
  // console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const data = req.body;
    
    const result = await generateExternalLink(data);
    console.log("Sumsub external link result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /generate_sumsub_external_link endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to generate Sumsub external link",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Sumsub webhook endpoint (no rate limiting for webhooks)
app.post("/webhooks/sumsub", async (req, res) => {
  console.log("\n=== Sumsub Webhook Received ===");
  // console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Body:", JSON.stringify(req.body, null, 2));

  try {
    await handleSumsubWebhook(req, res);
  } catch (error) {
    console.error("Error handling Sumsub webhook:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to process webhook",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// BlindPay webhook endpoint (no rate limiting for webhooks)
app.post("/webhooks/blindpay", async (req, res) => {
  console.log("\n=== BlindPay Webhook Received ===");
  // console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Body:", JSON.stringify(req.body, null, 2));

  try {
    await handleBlindPayWebhook(req, res);
  } catch (error) {
    console.error("Error handling BlindPay webhook:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to process webhook",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Stock Price Routes
app.get("/stock-prices", generalLimiter, async (req, res) => {
  console.log("\n=== Get All Stock Prices Request Received ===");

  try {
    const result = await getAllStockPrices();
    // console.log("Stock prices result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /api/stock-prices endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to get stock prices",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.get("/stock-prices/:symbol", generalLimiter, async (req, res) => {
  console.log("\n=== Get Stock Price by Symbol Request Received ===");
  console.log("Symbol:", req.params.symbol);

  try {
    const result = await getStockPriceBySymbol(req.params.symbol);
    console.log("Stock price result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /api/stock-prices/:symbol endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to get stock price",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/stock-prices/update", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Trigger Stock Price Update Request Received ===");

  try {
    const result = await triggerStockPriceUpdate();
    console.log("Stock price update result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /api/stock-prices/update endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to update stock prices",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.delete("/stock-prices/clear", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Clear All Stock Prices Request Received ===");

  try {
    const result = await clearAllStockPrices();
    console.log("Stock prices clear result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /api/stock-prices/clear endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to clear stock prices",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/* Etherfuse onboarding endpoint */
app.post("/etherfuse/onboarding", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Etherfuse Onboarding Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const data = req.body;
    
    // Validate required fields
    if (!data.publicKey || !data.userId) {
      return res.status(400).json({ 
        error: 'Invalid request. publicKey, and userId are required.' 
      });
    }

    const result = await createEtherfuseOnboardingUrl(data);
    
    if (result.success) {
      console.log("Etherfuse onboarding result:", JSON.stringify(result.data, null, 2));
      res.json(result.data);
    } else {
      console.error("Etherfuse onboarding failed:", result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error("Error in /etherfuse/onboarding endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to create Etherfuse onboarding URL",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/* Etherfuse bank account endpoint */
app.post("/etherfuse/bank-account", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Etherfuse Bank Account Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const data = req.body;
    
    // Validate required fields
    if (!data.presignedUrl || !data.account) {
      return res.status(400).json({ 
        error: 'Invalid request. presignedUrl and account are required.' 
      });
    }

    const result = await createBankAccount(data);
    
    if (result.success) {
      console.log("Etherfuse bank account result:", JSON.stringify(result.data, null, 2));
      res.json(result.data);
    } else {
      console.error("Etherfuse bank account failed:", result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error("Error in /etherfuse/bank-account endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to create bank account",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/* Etherfuse get bank accounts endpoint */
app.post("/etherfuse/get-bank-accounts", generalLimiter, async (req, res) => {
  console.log("\n=== Etherfuse Get Bank Accounts Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const data = req.body;
    
    // Validate required fields
    if (!data.userId) {
      return res.status(400).json({ 
        error: 'Invalid request. userId is required.' 
      });
    }

    const result = await getBankAccount(data);
    
    if (result.success) {
      console.log("Etherfuse get bank accounts result:", JSON.stringify(result.data, null, 2));
      res.json(result.data);
    } else {
      console.error("Etherfuse get bank accounts failed:", result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error("Error in /etherfuse/get-bank-accounts endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to get bank accounts",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/* Etherfuse order endpoint */
app.post("/etherfuse/order", sensitiveLimiter, async (req, res) => {
  console.log("\n=== Etherfuse Order Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const data = req.body;
    const result = await createEtherfuseOrder(data);
    
    if (result.success) {
      console.log("Etherfuse order result:", JSON.stringify(result.data, null, 2));
      res.json(result.data);
    } else {
      console.error("Etherfuse order failed:", result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error("Error in /etherfuse/order endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to create Etherfuse order",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/* Etherfuse get order details endpoint */
app.post("/etherfuse/order-details", generalLimiter, async (req, res) => {
  console.log("\n=== Etherfuse Get Order Details Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const { orderId } = req.body;
    
    // Validate required fields
    if (!orderId) {
      return res.status(400).json({ 
        error: 'Invalid request. orderId is required.' 
      });
    }

    const result = await getEtherfuseOrderDetails(orderId);
    
    if (result.success) {
      console.log("Etherfuse order details retrieved successfully");
      res.json(result.data);
    } else {
      console.error("Failed to get Etherfuse order details:", result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error("Error in /etherfuse/order-details endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to get Etherfuse order details",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/* Etherfuse get user data endpoint */
app.post("/etherfuse/get-user-data", generalLimiter, async (req, res) => {
  console.log("\n=== Etherfuse Get User Data Request Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const data = req.body;
    
    // Validate required fields
    if (!data.userId) {
      return res.status(400).json({ 
        error: 'Invalid request. userId is required.' 
      });
    }

    const result = await getUserEtherfuseData(data);
    
    if (result.success) {
      console.log("Etherfuse user data retrieved successfully");
      res.json(result.data);
    } else {
      console.error("Failed to get Etherfuse user data:", result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error("Error in /etherfuse/get-user-data endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Failed to get Etherfuse user data",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/* Etherfuse webhook endpoints */
app.post("/etherfuse/webhook/customer-updated", async (req, res) => {
  console.log("\n=== Etherfuse Customer Updated Webhook Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const result = await handleCustomerUpdatedWebhook(req.body);
    
    if (result.success) {
      console.log("Customer updated webhook processed successfully");
      res.status(200).json(result);
    } else {
      console.error("Customer updated webhook failed:", result.error);
      res.status(500).json(result);
    }
  } catch (error) {
    console.error("Error in /etherfuse/webhook/customer-updated endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to process customer updated webhook",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/etherfuse/webhook/order-updated", async (req, res) => {
  console.log("\n=== Etherfuse Order Updated Webhook Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const result = await handleOrderUpdatedWebhook(req.body);
    
    if (result.success) {
      console.log("Order updated webhook processed successfully");
      res.status(200).json(result);
    } else {
      console.error("Order updated webhook failed:", result.error);
      res.status(500).json(result);
    }
  } catch (error) {
    console.error("Error in /etherfuse/webhook/order-updated endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to process order updated webhook",
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/etherfuse/webhook/bank-account-updated", async (req, res) => {
  console.log("\n=== Etherfuse Bank Account Updated Webhook Received ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    const result = await handleBankAccountUpdatedWebhook(req.body);
    
    if (result.success) {
      console.log("Bank account updated webhook processed successfully");
      res.status(200).json(result);
    } else {
      console.error("Bank account updated webhook failed:", result.error);
      res.status(500).json(result);
    }
  } catch (error) {
    console.error("Error in /etherfuse/webhook/bank-account-updated endpoint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to process bank account updated webhook",
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

// Initialize stock price system
initializeStockPriceSystem().then(() => {
  console.log('Stock price system initialized');
}).catch(error => {
  console.error('Failed to initialize stock price system:', error);
});

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
