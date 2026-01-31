const pool = require("../../db");
const geoip = require("geoip-lite");

/**
 * Map country names (as in BANNED_OPERATIONS) to ISO 3166-1 alpha-2 codes.
 * geoip-lite returns 2-letter codes (e.g. "FI" for Finland).
 */
const COUNTRY_NAME_TO_CODE = {
  finland: "FI",
  // Add more as needed, e.g. united states: "US", germany: "DE"
};

/**
 * Parse BANNED_OPERATIONS env (comma-separated country names or codes)
 * into a Set of 2-letter ISO country codes for comparison with geoip.
 */
function getBannedOperationCountryCodes() {
  const raw = process.env.BANNED_OPERATIONS;
  if (!raw || typeof raw !== "string") return new Set();
  const entries = raw.split(",").map((s) => s.trim()).filter(Boolean);
  const codes = new Set();
  for (const entry of entries) {
    if (entry.length === 2) {
      codes.add(entry.toUpperCase());
    } else {
      const code = COUNTRY_NAME_TO_CODE[entry.toLowerCase()];
      if (code) codes.add(code);
    }
  }
  return codes;
}

/**
 * @param {string} ipAddress - Client IP (e.g. req.ip)
 * @returns {{ banned: boolean, country?: string }} 
 */
function isIpBannedForOperations(ipAddress) {
  const bannedCodes = getBannedOperationCountryCodes();
  if (bannedCodes.size === 0) return { banned: false };
  const geo = geoip.lookup(ipAddress);
  const country = geo?.country || null;
  if (!country) return { banned: false, country: "Unknown" };
  const banned = bannedCodes.has(country.toUpperCase());
  if (banned) {
    console.warn(`[SECURITY] Blocked sponsored operation from banned country: ${country} (IP: ${ipAddress})`);
  }
  return { banned, country };
}

/**
 * Error message returned when blocking due to BANNED_OPERATIONS.
 * Read from BANNED_OPERATIONS_ERROR in .env so the real reason is hidden
 * (e.g. "Insufficient funds" so it looks like a normal failure).
 */
function getBannedOperationsErrorMessage() {
  const msg = process.env.BANNED_OPERATIONS_ERROR;
  return (typeof msg === "string" && msg.trim()) ? msg.trim() : "Insufficient funds";
}

/**
 * Validate that a privy user ID exists in the database
 * @param {string} privyUserId - The Privy user ID to validate
 * @returns {Promise<Object|null>} - User object if found, null otherwise
 */
async function validatePrivyUserId(privyUserId) {
  if (!privyUserId) {
    return null;
  }

  try {
    const query = "SELECT * FROM users WHERE privy_user_id = $1";
    const result = await pool.query(query, [privyUserId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error validating privy user ID:", error);
    throw error;
  }
}

/**
 * Log a sponsored request to the database
 * @param {Object} data - Request data to log
 * @param {string} data.ip_address - IP address of the requester
 * @param {string} data.request_type - Type of request (create_token_account, sign_transaction, sign_versioned_transaction)
 * @param {string} data.privy_user_id - Privy user ID
 * @param {string} data.transaction_signature - Blockchain transaction signature (if available)
 * @param {Object} data.transaction_data - The transaction data (serialized transaction or request body)
 * @returns {Promise<Object>} - The logged request record
 */
async function logSponsoredRequest(data) {
  // Ensure table exists before logging
  await createSponsoredRequestsTable();

  const {
    ip_address,
    request_type,
    privy_user_id,
    transaction_signature,
    transaction_data
  } = data;

  try {
    const query = `
      INSERT INTO sponsored_requests (
        ip_address,
        request_type,
        privy_user_id,
        transaction_signature,
        transaction_data,
        creation_date
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      ip_address,
      request_type,
      privy_user_id,
      transaction_signature || null,
      transaction_data ? JSON.stringify(transaction_data) : null,
      new Date()
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error logging sponsored request:", error);
    // Don't throw - logging failure shouldn't break the request
    return null;
  }
}

/**
 * Get all sponsored requests from the database
 * @returns {Promise<Array>} - Array of all sponsored request records
 */
async function getAllSponsoredRequests() {
  // Ensure table exists before querying
  await createSponsoredRequestsTable();

  const query = `
    SELECT * FROM sponsored_requests 
    ORDER BY creation_date DESC
  `;

  try {
    const result = await pool.query(query);
    console.log(`Retrieved ${result.rows.length} sponsored requests`);
    return result.rows;
  } catch (error) {
    console.error('Error fetching all sponsored requests:', error);
    throw error;
  }
}

/**
 * Check if user has exceeded daily rate limit for token account creation
 * @param {string} privyUserId - The Privy user ID to check
 * @param {number} maxPerDay - Maximum number of account creations allowed per day (default: 3)
 * @returns {Promise<{allowed: boolean, count?: number}>} - Whether user is allowed and current count
 */
async function checkAccountCreationRateLimit(privyUserId, maxPerDay = 3) {
  if (!privyUserId) {
    return { allowed: false, count: 0 };
  }

  try {
    // Ensure table exists
    await createSponsoredRequestsTable();

    // Count account creations in the last 24 hours for this user
    const query = `
      SELECT COUNT(*) as count 
      FROM sponsored_requests 
      WHERE privy_user_id = $1 
        AND request_type = 'create_token_account'
        AND creation_date >= NOW() - INTERVAL '24 hours'
    `;

    const result = await pool.query(query, [privyUserId]);
    const count = parseInt(result.rows[0]?.count || 0);
    const allowed = count < maxPerDay;

    if (!allowed) {
      console.warn(`[SECURITY] Rate limit exceeded for ${privyUserId}: ${count} account creations in last 24 hours (max: ${maxPerDay})`);
    }

    return { allowed, count };
  } catch (error) {
    console.error("Error checking account creation rate limit:", error);
    // Fail secure - deny if check fails
    return { allowed: false, count: 0 };
  }
}

module.exports = {
  isIpBannedForOperations,
  getBannedOperationsErrorMessage,
  validatePrivyUserId,
  checkAccountCreationRateLimit,
  logSponsoredRequest,
  getAllSponsoredRequests
};

/**
 * Create the sponsored_requests table if it doesn't exist
 * This is a convenience function to avoid needing to rebuild the DB
 * Called automatically when logSponsoredRequest is first used
 */
let tableInitialized = false;
async function createSponsoredRequestsTable() {
  if (tableInitialized) {
    return; // Already initialized
  }

  try {
    // Create the table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sponsored_requests (
        id TEXT PRIMARY KEY DEFAULT generate_unique_id(),
        ip_address TEXT NOT NULL,
        request_type TEXT NOT NULL,
        privy_user_id TEXT REFERENCES users(privy_user_id),
        transaction_signature TEXT,
        transaction_data JSONB,
        creation_date TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')
      )
    `);

    // Create indexes
    const indexes = [
      { name: 'sponsored_requests_privy_user_id_idx', column: 'privy_user_id' },
      { name: 'sponsored_requests_ip_address_idx', column: 'ip_address' },
      { name: 'sponsored_requests_request_type_idx', column: 'request_type' },
      { name: 'sponsored_requests_creation_date_idx', column: 'creation_date' },
      { name: 'sponsored_requests_transaction_signature_idx', column: 'transaction_signature' }
    ];

    for (const index of indexes) {
      try {
        await pool.query(`
          CREATE INDEX IF NOT EXISTS ${index.name} ON sponsored_requests (${index.column})
        `);
      } catch (indexError) {
        // Index might already exist, which is fine
        console.log(`Index ${index.name} may already exist:`, indexError.message);
      }
    }

    tableInitialized = true;
    console.log("Sponsored requests table and indexes created/verified successfully");
  } catch (error) {
    console.error("Error creating sponsored_requests table:", error);
    // Don't throw - table might already exist, which is fine
  }
}


