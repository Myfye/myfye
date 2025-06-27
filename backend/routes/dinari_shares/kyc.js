require("dotenv").config();
const axios = require("axios");
const { createErrorLog } = require('../errorLog');

// Get API key from environment variables
const DINARI_API_KEY = process.env.DINARI_API_KEY;
const DINARI_API_SECRET = process.env.DINARI_API_SECRET;

async function add_kyc_to_entity(data) {
    try {
      const response = await axios.post(
        `https://api-enterprise.sbt.dinari.com/api/v2/entities/${data.entity_id}/kyc`,
        {
          data: {
            country_code: data.country_code,
            last_name: data.last_name,
            first_name: data.first_name,
            email: data.email,
            tax_id_number: data.tax_id,
            birth_date: data.date_of_birth,
            address_street_1: data.address_line_1,
            // address_street_2: data.address_line_2, // optional
            address_city: data.city,
            // address_subdivision: data.state_province_region, // optional
            address_postal_code: data.postal_code
          },
          provider_name: "Myfye"
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
      
      console.log("KYC response:", response.data);

      return response.data;

      
    } catch (error) {

        /*
      await createErrorLog({
          user_id: data.user_id,
          error_message: error.message,
          error_type: 'Dinari KYC Creation Error',
          error_stack_trace: error.stack
        });
        */

      console.error(
        "Error in add_kyc_to_entity:",
        JSON.stringify(error.response?.data || error.message, null, 2)
      );
      throw error;
    }
  }


  module.exports = {
    add_kyc_to_entity
  };