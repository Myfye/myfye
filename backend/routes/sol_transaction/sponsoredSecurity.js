const pool = require("../../db");

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

module.exports = {
  validatePrivyUserId,
  logSponsoredRequest
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
