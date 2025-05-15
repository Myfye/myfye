const pool = require("../db");

async function createPayTransaction(data) {
    console.log("\n=== New Pay Transaction Request Received ===");
    
    const { 
        user_id,
        amount,
        chain,
        sender_public_key,
        receiver_id,
        receiver_phone_number,
        receiver_email,
        receiver_public_key,
        currency,
        transaction_hash,
        transaction_status
     } = data;

    if (!user_id || !amount || !sender_public_key || !receiver_public_key || !transaction_hash || !chain || !currency) {
        console.error('Missing required fields user_id:', user_id, 'amount:', 
            amount, 'sender_public_key:', sender_public_key, 'receiver_public_key:', 
            receiver_public_key, 'transaction_hash:', transaction_hash, 'chain:', chain, 'currency:', currency);
        throw new Error('User ID, amount, sender public key, receiver public key, transaction hash, chain, and currency are required');
    }
    
    // Create UTC timestamp
    const now = new Date();
    const utcTimestamp = now.toISOString();
        
    console.log("Creating pay transaction with UTC timestamp:", utcTimestamp);

    // Create new pay transaction
    const query = `
    INSERT INTO pay_transactions (
        sender_id,
        sender_public_key,
        receiver_id,
        receiver_phone_number,
        receiver_email,
        receiver_public_key,
        amount,
        currency,
        chain,
        transaction_hash,
        transaction_status,
        creation_date
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *
    `;

    const values = [
        user_id,
        sender_public_key,
        receiver_id || null,
        receiver_phone_number || null,
        receiver_email || null,
        receiver_public_key,
        amount,
        currency,
        chain,
        transaction_hash,
        transaction_status,
        now
    ];

    try {
        const result = await pool.query(query, values);
        console.log("Pay transaction creation result:", JSON.stringify(result.rows[0], null, 2));
        return result.rows[0];
    } catch (error) {
        console.error('Error creating pay transaction:', error);
        throw error;
    }
}

async function getAllPayTransactions() {
    console.log("\n=== Getting All Pay Transactions ===");
    
    const query = `
        SELECT * FROM pay_transactions
        ORDER BY creation_date DESC
    `;

    try {
        const result = await pool.query(query);
        console.log(`Retrieved ${result.rows.length} pay transactions`);
        return result.rows;
    } catch (error) {
        console.error('Error getting all pay transactions:', error);
        throw error;
    }
}

module.exports = {
    createPayTransaction,
    getAllPayTransactions
}; 