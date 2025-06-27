require("dotenv").config();
const axios = require("axios");
const { createErrorLog } = require('../errorLog');

// Get API key from environment variables
const DINARI_API_KEY = process.env.DINARI_API_KEY;
const DINARI_API_SECRET = process.env.DINARI_API_SECRET;

async function generate_nonce(data) {
  try {
    const response = await axios.get(
      `https://api-enterprise.sbt.dinari.com/api/v2/accounts/${data.account_id}/wallet/external/nonce?wallet_address=${data.wallet_address}`,
      {
        params: {
          wallet_address: data.wallet_address
        },
        headers: {
          'X-API-Key-Id': DINARI_API_KEY,
          'X-API-Secret-Key': DINARI_API_SECRET,
          'accept': 'application/json'
        }
      }
    );
    
    console.log("Nonce generation response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in generate_nonce:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });

    // Create error log
    /*
    await createErrorLog({
      user_id: data.user_id,
      error_message: error.message,
      error_type: 'Dinari Nonce Generation Error',
      error_stack_trace: error.stack
    });
    */

    throw error;
  }
}

module.exports = {
  generate_nonce
};