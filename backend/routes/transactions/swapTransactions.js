const pool = require("../../db");

async function createSwapTransaction(data) {
    console.log("\n=== New Swap Transaction Request Received ===");
    
    const { 
        user_id,
        input_amount,
        output_amount,
        input_chain,
        output_chain,
        input_public_key,
        output_public_key,
        input_currency,
        output_currency,
        transaction_type,
        transaction_hash,
        transaction_status
     } = data;

    if (!user_id || !input_amount || !input_public_key || !output_public_key || !transaction_hash) {
        console.error('Missing required fields user_id:', user_id, 'input_amount:', 
            input_amount, 'input_public_key:', input_public_key, 'output_public_key:', 
            output_public_key, 'transaction_hash:', transaction_hash);
        throw new Error('User ID, input amount, input public key, output public key, and transaction hash are required');
    }
    
    // Create UTC timestamp
    const now = new Date();
    const utcTimestamp = now.toISOString();
        

    // Create new swap transaction
    const query = `
    INSERT INTO swap_transactions (
        user_id, 
        input_amount, 
        output_amount, 
        input_chain, 
        output_chain, 
        input_public_key,
        output_public_key,
        input_currency, 
        output_currency, 
        transaction_type, 
        transaction_hash, 
        transaction_status,
        creation_date
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *
    `;

    const values = [
        user_id, 
        input_amount, 
        output_amount, 
        input_chain, 
        output_chain, 
        input_public_key,
        output_public_key,
        input_currency, 
        output_currency, 
        transaction_type, 
        transaction_hash, 
        transaction_status,
        now
    ];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating swap transaction:', error);
        throw error;
    }
}

async function getSwapTransactionsByUserId(userId) {
    
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
        return result.rows;
    } catch (error) {
        console.error('Error fetching swap transactions:', error);
        throw error;
    }
}

async function getAllSwapTransactions() {
    const query = `
    SELECT * FROM swap_transactions 
    ORDER BY creation_date DESC
    `;

    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching all swap transactions:', error);
        throw error;
    }
}

module.exports = {
    createSwapTransaction,
    getSwapTransactionsByUserId,
    getAllSwapTransactions
};