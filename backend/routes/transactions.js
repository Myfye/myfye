const pool = require("../db");

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
        
    console.log("Creating user with UTC timestamp:", utcTimestamp);

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

async function getAllSwapTransactions() {
    console.log("\n=== Fetching All Swap Transactions ===");
    
    const query = `
    SELECT * FROM swap_transactions 
    ORDER BY creation_date DESC
    `;

    try {
        const result = await pool.query(query);
        console.log(`Found ${result.rows.length} swap transactions`);
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