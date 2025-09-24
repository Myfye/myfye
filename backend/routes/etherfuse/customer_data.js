const axios = require('axios');
const pool = require('../../db');

const ETHERFUSE_API_KEY = process.env.ETHERFUSE_API_KEY;

const getUserEtherfuseData = async (data) => {
  const { userId } = data;

  try {
    console.log(`\n=== Getting Etherfuse data for user: ${userId} ===`);

    // Query the etherfuse_users table to get customer_id and bank_account_id
    const userQuery = `
      SELECT customer_id, bank_account_id 
      FROM etherfuse_users 
      WHERE user_id = $1
    `;
    
    const userResult = await pool.query(userQuery, [userId]);
    
    if (userResult.rows.length === 0) {
      console.log(`No Etherfuse user found for userId: ${userId}`);
      return {
        success: false,
        error: 'User not found in Etherfuse system'
      };
    }

    const { customer_id, bank_account_id } = userResult.rows[0];
    console.log(`Found Etherfuse user - Customer ID: ${customer_id}, Bank Account ID: ${bank_account_id}`);

    // Query crypto wallets for the customer
    console.log(`\n--- Querying crypto wallets for customer: ${customer_id} ---`);
    const walletsResponse = await axios.post(
      `https://api.etherfuse.com/ramp/customer/${customer_id}/wallets`,
      {
        pageSize: 10,
        pageNumber: 0
      },
      {
        headers: {
          'Authorization': ETHERFUSE_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Crypto wallets response:', JSON.stringify(walletsResponse.data, null, 2));

    let walletDetails = null;
    
    // If there are wallets, get details for the first one
    if (walletsResponse.data.items && walletsResponse.data.items.length > 0) {
      const walletId = walletsResponse.data.items[0].walletId;
      console.log(`\n--- Querying wallet details for wallet: ${walletId} ---`);
      
      const walletResponse = await axios.get(
        `https://api.etherfuse.com/ramp/wallet/${walletId}`,
        {
          headers: {
            'Authorization': ETHERFUSE_API_KEY
          }
        }
      );

      console.log('Wallet details response:', JSON.stringify(walletResponse.data, null, 2));
      walletDetails = walletResponse.data;
    } else {
      console.log('No crypto wallets found for this customer');
    }

    // Query bank account details
    console.log(`\n--- Querying bank account details for bank account: ${bank_account_id} ---`);
    const bankAccountResponse = await axios.get(
      `https://api.etherfuse.com/ramp/bank-account/${bank_account_id}`,
      {
        headers: {
          'Authorization': ETHERFUSE_API_KEY
        }
      }
    );

    console.log('Bank account details response:', JSON.stringify(bankAccountResponse.data, null, 2));

    return {
      success: true,
      data: {
        customerId: customer_id,
        bankAccountId: bank_account_id,
        cryptoWallets: walletsResponse.data,
        walletDetails: walletDetails,
        bankAccountDetails: bankAccountResponse.data
      }
    };

  } catch (error) {
    console.error('Error getting Etherfuse user data:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get Etherfuse user data'
    };
  }
};

module.exports = {
  getUserEtherfuseData
};