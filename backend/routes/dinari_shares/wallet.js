require("dotenv").config();
const axios = require("axios");
const { createErrorLog } = require('../errorLog');

// Get API key from environment variables
const DINARI_API_KEY = process.env.DINARI_API_KEY;
const DINARI_API_SECRET = process.env.DINARI_API_SECRET;

async function create_new_wallet(data) {
  try {
    const response = await axios.post(
      `https://api-enterprise.sbt.dinari.com/api/v2/accounts/${data.account_id}/wallet/external`,
      {
        chain_id: 'eip155:8453', // base: will not change
        signature: data.signature,
        nonce: data.nonce,
        wallet_address: data.wallet_address
      },
      {
        headers: {
          'X-API-Key-Id': DINARI_API_KEY,
          'X-API-Secret-Key': DINARI_API_SECRET,
          'accept': 'application/json',
          'content-type': 'application/json'
        }
      }
    );
    
    console.log("Wallet creation response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in create_new_wallet:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });

    // Create error log
    /*
    await createErrorLog({
      user_id: "test_user",
      error_message: error.message,
      error_type: 'Dinari Wallet Creation Error',
      error_stack_trace: error.stack
    });
    */

    throw error;
  }
}

module.exports = {
  create_new_wallet
};