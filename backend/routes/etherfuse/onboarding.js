const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const pool = require('../../db');

const ETHERFUSE_API_KEY = process.env.ETHERFUSE_API_KEY;

const createEtherfuseOnboardingUrl = async (data) => {
  const userId = data.userId;
  let customerId, bankAccountId;

  try {
    // Check if user already has Etherfuse credentials
    const existingUserQuery = `
      SELECT customer_id, bank_account_id 
      FROM etherfuse_users 
      WHERE user_id = $1
    `;
    
    const existingUserResult = await pool.query(existingUserQuery, [userId]);
    
    if (existingUserResult.rows.length > 0) {
      // User already exists, use existing credentials
      const existingUser = existingUserResult.rows[0];
      customerId = existingUser.customer_id;
      bankAccountId = existingUser.bank_account_id;
      
      console.log("Using existing Etherfuse user - Customer ID:", customerId, "Bank Account ID:", bankAccountId);
    } else {
      // User doesn't exist, create new credentials
      customerId = uuidv4();
      bankAccountId = uuidv4();
      
      console.log("Creating new Etherfuse user - Customer ID:", customerId, "Bank Account ID:", bankAccountId);
      
      // Save new user to database
      const insertUserQuery = `
        INSERT INTO etherfuse_users (user_id, customer_id, bank_account_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id) DO UPDATE SET
          customer_id = EXCLUDED.customer_id,
          bank_account_id = EXCLUDED.bank_account_id
      `;
      
      await pool.query(insertUserQuery, [userId, customerId, bankAccountId]);
      console.log("Saved new Etherfuse user to database");
    }

    // Call Etherfuse API with the credentials
    const response = await axios.post(
      'https://api.etherfuse.com/ramp/onboarding-url',
      {
        customerId: customerId,
        bankAccountId: bankAccountId,
        publicKey: data.publicKey,
        blockchain: 'solana'
      },
      {
        headers: {
          'Authorization': ETHERFUSE_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Etherfuse onboarding error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to create onboarding URL'
    };
  }
};

module.exports = {
  createEtherfuseOnboardingUrl
};