const pool = require("../../db");

/**
 * Save or update recently used Solana addresses for a user
 * @param {string} userId - The user's ID
 * @param {string[]} addresses - Array of Solana addresses
 * @returns {Promise<Object>} The saved record
 */
async function saveRecentlyUsedAddresses(userId, addresses) {
    const client = await pool.connect();
    try {
        // Check if user already has a record
        const checkQuery = 'SELECT id FROM recently_used_solana_addresses WHERE user_id = $1';
        const existingRecord = await client.query(checkQuery, [userId]);

        if (existingRecord.rows.length > 0) {
            // Update existing record
            const updateQuery = `
                UPDATE recently_used_solana_addresses 
                SET addresses = $1 
                WHERE user_id = $2 
                RETURNING *
            `;
            const result = await client.query(updateQuery, [addresses, userId]);
            return result.rows[0];
        } else {
            // Create new record
            const insertQuery = `
                INSERT INTO recently_used_solana_addresses (user_id, addresses)
                VALUES ($1, $2)
                RETURNING *
            `;
            const result = await client.query(insertQuery, [userId, addresses]);
            return result.rows[0];
        }
    } finally {
        client.release();
    }
}

/**
 * Get recently used Solana addresses for a user
 * @param {string} userId - The user's ID
 * @returns {Promise<Object>} The record containing addresses
 */
async function getRecentlyUsedAddresses(userId) {
    const client = await pool.connect();
    try {
        const query = 'SELECT * FROM recently_used_solana_addresses WHERE user_id = $1';
        const result = await client.query(query, [userId]);
        return result.rows[0] || { addresses: [] };
    } finally {
        client.release();
    }
}

module.exports = {
    saveRecentlyUsedAddresses,
    getRecentlyUsedAddresses
};
