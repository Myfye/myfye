require("dotenv").config();
const axios = require("axios");
const { createErrorLog } = require('../errorLog');
const { create_new_account } = require('./account');

// Get API key from environment variables
//const DINARI_DEV_API_KEY = process.env.DINARI_DEV_API_KEY;
//const DINARI_DEV_API_SECRET = process.env.DINARI_DEV_API_SECRET;

const DINARI_API_KEY = process.env.DINARI_API_KEY;
const DINARI_API_SECRET = process.env.DINARI_API_SECRET;


async function create_new_dinari_user(data) {
    
  console.log(
    "Processing dinari entity request with data:",
    JSON.stringify(data, null, 2)
  );
  
  try {
    const entity = await create_new_entity(data);
    console.log("Entity created:", entity);

    // to do link account to a new wallet 

    return {
      success: true,
      data: {
        entity
      }
    };


  } catch (error) {
    console.error("Detailed error in create_new_dinari_path:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });
    
    // Create error log
    /*
    await createErrorLog({
      user_id: data.user_id,
      error_message: error.message,
      error_type: 'Dinari Entity Creation Error',
      error_stack_trace: error.stack
    });
    */

    return {
      success: false,
      error: error.message,
      details: error.response?.data || error.stack,
    };
  }
}

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function create_new_entity() {
  try {
    const randomName = generateRandomString(20);
    const response = await axios.post(
      'https://api-enterprise.sbt.dinari.com/api/v2/entities/', 
      { name: randomName },
      {
        headers: {
          'X-API-Key-Id': DINARI_API_KEY,
          'X-API-Secret-Key': DINARI_API_SECRET,
          'accept': 'application/json',
          'content-type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in create_new_entity:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    throw error;
  }
}

module.exports = {
  create_new_entity,
  create_new_dinari_user
};
