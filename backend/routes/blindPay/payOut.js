require("dotenv").config();
const axios = require("axios");

const BLIND_PAY_API_KEY = process.env.BLIND_PAY_API_KEY;
const BLIND_PAY_INSTANCE_ID = process.env.BLIND_PAY_INSTANCE_ID;
const TOKEN = 'USDC'
const NETWORK = 'base'

//const BLIND_PAY_API_KEY = process.env.BLIND_PAY_DEV_API_KEY;
//const BLIND_PAY_INSTANCE_ID = process.env.BLIND_PAY_DEV_INSTANCE_ID;
//const TOKEN = 'USDB'
//const NETWORK = 'sepolia'

async function create_new_payout(data) {

  /*
  curl --request POST \
  --url https://api.blindpay.com/v1/instances/(instance ID)/quotes \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
  "bank_account_id": "ba_000000000000",
  "currency_type": "sender",
  "cover_fees": false,
  "request_amount": 1000,
  "network": "sepolia",
  "token": "USDC"
}'
*/


}

async function get_payout_quote(data) {
  // BlindPay API endpoint for payout quotes
  const url = `https://api.blindpay.com/v1/instances/${BLIND_PAY_INSTANCE_ID}/quotes`;
  try {
    const response = await axios.post(
      url,
      {
        bank_account_id: data.bank_account_id,
        currency_type: 'sender',
        cover_fees: false,
        request_amount: data.request_amount, // should be in cents
        network: NETWORK, // default to prod
        token: TOKEN,
      },
      {
        headers: {
          'Authorization': `Bearer ${BLIND_PAY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("response:", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data.error || error.response.data.message || 'BlindPay error' };
    }
    return { error: error.message || 'Unknown error from BlindPay' };
  }
}

// Export functions for use in other modules
module.exports = {
  create_new_payout,
  get_payout_quote,
};
