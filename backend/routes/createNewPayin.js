require('dotenv').config();
const axios = require('axios');

const BLIND_PAY_DEV_API_KEY = process.env.BLIND_PAY_DEV_API_KEY;
const BLIND_PAY_DEV_INSTANCE_ID = process.env.BLIND_PAY_DEV_INSTANCE_ID;

async function create_new_payin(data) {
    try {

        const response = await axios.post(
            `https://api.blindpay.com/v1/instances/${BLIND_PAY_DEV_INSTANCE_ID}/payins/evm`,
            {
                payin_quote_id: 'qu_LH2MJBLYysHX'
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${BLIND_PAY_DEV_API_KEY}`
                }
            }
        );

        console.log('Payin creation response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in create_new_payin:');
        console.error('Status:', error.response?.status);
        console.error('Status Text:', error.response?.statusText);
        console.error('Response Data:', error.response?.data);
        console.error('Error Message:', error.message);
        console.error('Stack Trace:', error.stack);
        throw error;
    }
}

// Export functions for use in other modules
module.exports = {
    create_new_payin
}; 



