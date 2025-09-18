const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const pool = require('../../db');

const ETHERFUSE_API_KEY = process.env.ETHERFUSE_API_KEY;

const createBankAccount = async (data) => {
  try {
    // Unpack the account parameter
    const {
      firstName,
      paternalLastName,
      maternalLastName,
      birthDate,
      birthCountryId,
      curp,
      rfc,
      clabe
    } = data.account;

    // Generate UUID instead of using transactionId
    const transactionId = uuidv4();

    const response = await axios.post('https://api.etherfuse.com/ramp/bank-account', {
      presignedUrl: data.presignedUrl,
      account: {
        transactionId,
        firstName,
        paternalLastName,
        maternalLastName,
        birthDate,
        birthCountryId,
        curp,
        rfc,
        clabe
      }
    }, 
    {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error creating bank account:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to create bank account'
    };
  }
};

/*
example curl request
curl --request POST \
  --url https://api.etherfuse.com/ramp/customer/{customer_id}/bank-accounts \
  --header 'Authorization: <api-key>' \
  --header 'Content-Type: application/json' \
  --data '{
  "pageSize": 20,
  "pageNumber": 0
}'
*/

const getBankAccount = async (data) => {
  try {
    const { userId, pageSize = 10, pageNumber = 0 } = data;

    // Get customer ID from database using userId
    const customerQuery = `
      SELECT customer_id 
      FROM etherfuse_users 
      WHERE user_id = $1
    `;
    
    const customerResult = await pool.query(customerQuery, [userId]);
    
    if (customerResult.rows.length === 0) {
      return {
        success: false,
        error: 'User not found in Etherfuse system'
      };
    }

    const customerId = customerResult.rows[0].customer_id;

    // Call Etherfuse API to get bank accounts
    const response = await axios.post(
      `https://api.etherfuse.com/ramp/customer/${customerId}/bank-accounts`,
      {
        pageSize,
        pageNumber
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
    console.error('Error getting bank accounts:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get bank accounts'
    };
  }
};

module.exports = {
  createBankAccount,
  getBankAccount
};