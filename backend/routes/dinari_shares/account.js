require("dotenv").config();
const axios = require("axios");
const { createErrorLog } = require('../errorLog');

// Get API key from environment variables
//const DINARI_DEV_API_KEY = process.env.DINARI_DEV_API_KEY;
//const DINARI_DEV_API_SECRET = process.env.DINARI_DEV_API_SECRET;

const DINARI_API_KEY = process.env.DINARI_API_KEY;
const DINARI_API_SECRET = process.env.DINARI_API_SECRET;

async function create_new_dinari_account(entity_id) {
  try {
    const response = await axios.post(
      `https://api-enterprise.sbt.dinari.com/api/v2/entities/${entity_id}/accounts`,
      {},
      {
        headers: {
          'X-API-Key-Id': DINARI_API_KEY,
          'X-API-Secret-Key': DINARI_API_SECRET,
          'accept': 'application/json',
          'content-type': 'application/json'
        }
      }
    );
    
    console.log("Account creation response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in create_new_account:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });

    /*
    const dinariUserId = "DINARI_ENTITY_" + entity_id
    // Create error log
    await createErrorLog({
      user_id: dinariUserId,
      error_message: error.message,
      error_type: 'Dinari Account Creation Error',
      error_stack_trace: error.stack
    });
    */

    throw error;
  }
}

module.exports = {
  create_new_dinari_account
};