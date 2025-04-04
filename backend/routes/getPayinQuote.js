require("dotenv").config();
const axios = require("axios");

const BLIND_PAY_DEV_API_KEY = process.env.BLIND_PAY_DEV_API_KEY;
const BLIND_PAY_DEV_INSTANCE_ID = process.env.BLIND_PAY_DEV_INSTANCE_ID;

const TEST_RECEIVER_ID = "re_tK68LY2AsYW5";
const TEST_BLOCKCHAIN_WALLET_ID = "bw_nGJJ8GjlKvDY";

async function get_payin_quote(data) {
  try {
    const response = await axios.post(
      `https://api.blindpay.com/v1/instances/${BLIND_PAY_DEV_INSTANCE_ID}/payin-quotes`,
      {
        blockchain_wallet_id: TEST_BLOCKCHAIN_WALLET_ID,
        currency_type: "sender",
        cover_fees: true,
        request_amount: 100000,
        payment_method: "spei",
        token: "USDB",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BLIND_PAY_DEV_API_KEY}`,
        },
      }
    );

    console.log("Receiver creation response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error in create_new_receiver:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Export functions for use in other modules
module.exports = {
  get_payin_quote,
};
