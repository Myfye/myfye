const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const pool = require('../../db');

const ETHERFUSE_API_KEY = process.env.ETHERFUSE_API_KEY;

const createEtherfuseOrder = async (data) => {
  try {
    const {
      userId,
      publicKey,
      blockchain = 'solana',
      fiatAmount,
      direction,
      memo = null,
      optionalPayerAccount = null
    } = data;

    // Generate orderId using UUID
    const orderId = uuidv4();

    // Validate required fields
    if (!userId || !publicKey || !fiatAmount || !direction) {
      return {
        success: false,
        error: 'Missing required fields: userId, publicKey, fiatAmount, and direction are required'
      };
    }

    // Query the etherfuse_users table to get bank_account_id
    const userQuery = `
      SELECT bank_account_id 
      FROM etherfuse_users 
      WHERE user_id = $1
    `;
    
    const userResult = await pool.query(userQuery, [userId]);
    
    if (userResult.rows.length === 0) {
      return {
        success: false,
        error: 'User not found in Etherfuse system. Please complete onboarding first.'
      };
    }

    const bankAccountId = userResult.rows[0].bank_account_id;
    console.log(`Found bank account ID for user ${userId}: ${bankAccountId}`);

    // Validate direction
    if (!['onramp', 'offramp'].includes(direction)) {
      return {
        success: false,
        error: 'Invalid direction. Must be either "onramp" or "offramp"'
      };
    }

    // Validate blockchain
    if (blockchain !== 'solana') {
      return {
        success: false,
        error: 'Invalid blockchain. Currently only "solana" is supported'
      };
    }

    // Prepare the request payload
    const requestPayload = {
      orderId,
      bankAccountId,
      publicKey,
      blockchain,
      fiatAmount,
      direction,
      memo
    };

    // Add optionalPayerAccount if provided
    if (optionalPayerAccount) {
      requestPayload.optionalPayerAccount = optionalPayerAccount;
      console.log(`Adding optionalPayerAccount to Etherfuse request: ${optionalPayerAccount}`);
    }

    console.log('Etherfuse order request payload:', JSON.stringify(requestPayload, null, 2));

    // Call Etherfuse API to create order
    const response = await axios.post(
      'https://api.etherfuse.com/ramp/order',
      requestPayload,
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
    console.error('Etherfuse order creation error:', error.response?.data || error.message);
    
    // Extract the actual error message from the response
    let errorMessage = 'Failed to create Etherfuse order';
    
    if (error.response?.data) {
      // If the response data is a string, use it directly
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      }
      // If the response data is an object with a message property
      else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      // If the response data is an object with an error property
      else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

//Get order details
const getEtherfuseOrderDetails = async (orderId) => {
  try {
    // Validate required fields
    if (!orderId) {
      return {
        success: false,
        error: 'Missing required field: orderId is required'
      };
    }

    // Call Etherfuse API to get order details
    const response = await axios.get(
      `https://api.etherfuse.com/ramp/order/${orderId}`,
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
    console.error('Etherfuse order details retrieval error:', error.response?.data || error.message);
    
    // Extract the actual error message from the response
    let errorMessage = 'Failed to get Etherfuse order details';
    
    if (error.response?.data) {
      // If the response data is a string, use it directly
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      }
      // If the response data is an object with a message property
      else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      // If the response data is an object with an error property
      else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

/*
curl --request GET \
  --url https://api.etherfuse.com/ramp/order/{order_id} \
  --header 'Authorization: <api-key>'
  */

module.exports = {
  createEtherfuseOrder,
  getEtherfuseOrderDetails
};