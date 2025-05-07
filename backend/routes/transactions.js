const pool = require("../db");

async function createSwapTransaction(data) {
    console.log("\n=== New Swap Transaction Request Received ===");
    
    const { 
        user_id,
        input_amount,
        output_amount,
        input_chain,
        output_chain,
        public_key,
        input_currency,
        output_currency,
        transaction_type,
        transaction_hash,
        transaction_status
     } = data;

    if (!user_id || !input_amount || !public_key || !transaction_hash) {
        throw new Error('User ID, input amount, public key, and transaction hash are required');
    }
    
    // Create new swap transaction
    const query = `
    INSERT INTO swap_transactions (
        user_id, 
        input_amount, 
        output_amount, 
        input_chain, 
        output_chain, 
        public_key, 
        input_currency, 
        output_currency, 
        transaction_type, 
        transaction_hash, 
        transaction_status,
        creation_date
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP)
    RETURNING *
    `;

    const values = [
        user_id, 
        input_amount, 
        output_amount, 
        input_chain, 
        output_chain, 
        public_key, 
        input_currency, 
        output_currency, 
        transaction_type, 
        transaction_hash, 
        transaction_status
    ];

    try {
        const result = await pool.query(query, values);
        console.log("Swap transaction creation result:", JSON.stringify(result.rows[0], null, 2));
        return result.rows[0];
    } catch (error) {
        console.error('Error creating swap transaction:', error);
        throw error;
    }
}

async function getSwapTransactionsByUserId(userId) {
    console.log(`\n=== Fetching Swap Transactions for User ID: ${userId} ===`);
    
    if (!userId) {
        throw new Error('User ID is required');
    }
    
    const query = `
    SELECT * FROM swap_transactions 
    WHERE user_id = $1 
    ORDER BY creation_date DESC
    `;

    try {
        const result = await pool.query(query, [userId]);
        console.log(`Found ${result.rows.length} swap transactions for user ${userId}`);
        return result.rows;
    } catch (error) {
        console.error('Error fetching swap transactions:', error);
        throw error;
    }
}

module.exports = {
    createSwapTransaction,
    getSwapTransactionsByUserId
};