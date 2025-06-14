require("dotenv").config();
const axios = require("axios");

//const BLIND_PAY_DEV_API_KEY = process.env.BLIND_PAY_DEV_API_KEY;
//const BLIND_PAY_DEV_INSTANCE_ID = process.env.BLIND_PAY_DEV_INSTANCE_ID;

const BLIND_PAY_API_KEY = process.env.BLIND_PAY_API_KEY;
const BLIND_PAY_INSTANCE_ID = process.env.BLIND_PAY_INSTANCE_ID;

async function create_new_payin(data) {

  console.log("Creating new payin:", data);
  
  try {

    const payin_quote = await get_payin_quote(data);

    console.log("Payin quote:", payin_quote);

    const response = await axios.post(
      `https://api.blindpay.com/v1/instances/${BLIND_PAY_INSTANCE_ID}/payins/evm`,
      {
        payin_quote_id: payin_quote.id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BLIND_PAY_API_KEY}`,
        },
      }
    );

    console.log("Payin creation response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in create_new_payin:");
    console.error("Status:", error.response?.status);
    console.error("Status Text:", error.response?.statusText);
    console.error("Response Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Stack Trace:", error.stack);
    throw error;
  }
  
}

async function get_payin_quote(data) {

  const currency = data.currency;
  const formattedAmount = data.amount * 100;
  
  let paymentMethod = "spei";
  if (currency === "MXN") {
    paymentMethod = "spei";
  } else if (currency === "BRL") {
    paymentMethod = "pix";
  } else if (currency === "USD") {
    paymentMethod = "ach";
  }

  // to do: send an email to the user with the payin quote

  try {
    const response = await axios.post(
      `https://api.blindpay.com/v1/instances/${BLIND_PAY_INSTANCE_ID}/payin-quotes`,
      {
        blockchain_wallet_id: data.blockchain_wallet_id,
        currency_type: "sender",
        cover_fees: true,
        request_amount: formattedAmount, // 100 represents 1, 2050 represents 20.50
        payment_method: paymentMethod, // ach wire pix spei
        token: "USDC", // USDB for dev USDC for prod
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BLIND_PAY_API_KEY}`,
        },
      }
    );

    console.log("Receiver creation response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error in create pay in:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Export functions for use in other modules
module.exports = {
  create_new_payin,
  get_payin_quote,
};
