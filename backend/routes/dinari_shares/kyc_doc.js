require("dotenv").config();
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const { createErrorLog } = require('../errorLog');

// Get API key from environment variables
const DINARI_API_KEY = process.env.DINARI_API_KEY;
const DINARI_API_SECRET = process.env.DINARI_API_SECRET;

async function add_kyc_doc_to_entity(data) {
    try {
        // Create form data for file upload
        const formData = new FormData();
        
        // Hardcoded file path for now
        const filePath = '/Users/gavinmilligan/Desktop/b2dad49c-267a-4b25-88fe-3142d49480be.jpg';
        const fileBuffer = fs.readFileSync(filePath);
        
        // Add the file to form data with filename and content type
        formData.append('file', fileBuffer, {
            filename: 'document.jpg',
            contentType: 'image/jpeg'
        });

        const response = await axios.post(
            `https://api-enterprise.sbt.dinari.com/api/v2/entities/${data.entity_id}/kyc/${data.kyc_id}/document?document_type=${data.document_type || 'GOVERNMENT_ID'}`,
            formData,
            {
                headers: {
                    'X-API-Key-Id': DINARI_API_KEY,
                    'X-API-Secret-Key': DINARI_API_SECRET,
                    'accept': 'application/json',
                    ...formData.getHeaders()
                }
            }
        );
      
        console.log("KYC doc response:", response.data);

        return response.data;

    } catch (error) {
        /*
        await createErrorLog({
            user_id: data.user_id,
            error_message: error.message,
            error_type: 'Dinari KYC Document Upload Error',
            error_stack_trace: error.stack
        });
        */

        console.error(
            "Error in add_kyc_doc_to_entity:",
            JSON.stringify(error.response?.data || error.message, null, 2)
        );
        throw error;
    }
}

module.exports = {
    add_kyc_doc_to_entity
};



