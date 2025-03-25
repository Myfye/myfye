const pool = require('../db');

async function createUser(userData) {
    const query = `
        INSERT INTO users (
            email, phone_number, first_name, last_name, country,
            evm_pub_key, solana_pub_key, privy_user_id, persona_account_id,
            blind_pay_receiver_id, blind_pay_evm_wallet_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
    `;
    
    const values = [
        userData.email,
        userData.phoneNumber,
        userData.firstName,
        userData.lastName,
        userData.country,
        userData.evmPubKey,
        userData.solanaPubKey,
        userData.privyUserId,
        userData.personaAccountId,
        userData.blindPayReceiverId,
        userData.blindPayEvmWalletId
    ];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

async function getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    try {
        const result = await pool.query(query, [email]);
        return result.rows[0];
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
}

// Add a function to update Blind Pay IDs
async function updateBlindPayIds(email, blindPayReceiverId, blindPayEvmWalletId) {
    const query = `
        UPDATE users 
        SET blind_pay_receiver_id = $2, 
            blind_pay_evm_wallet_id = $3
        WHERE email = $1
        RETURNING *
    `;
    try {
        const result = await pool.query(query, [email, blindPayReceiverId, blindPayEvmWalletId]);
        return result.rows[0];
    } catch (error) {
        console.error('Error updating Blind Pay IDs:', error);
        throw error;
    }
}

module.exports = {
    createUser,
    getUserByEmail,
    updateBlindPayIds
}; 