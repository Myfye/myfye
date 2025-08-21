const axios = require("axios");
const { getUserByEmail, getUserById } = require("../userDb");
const { emailService } = require("../emailService");

//const BLIND_PAY_API_KEY = process.env.BLIND_PAY_API_KEY;
//const BLIND_PAY_INSTANCE_ID = process.env.BLIND_PAY_INSTANCE_ID;
//const TOKEN = 'USDC';
//const NETWORK = 'base';

const BLIND_PAY_API_KEY = process.env.BLIND_PAY_DEV_API_KEY;
const BLIND_PAY_INSTANCE_ID = process.env.BLIND_PAY_DEV_INSTANCE_ID;
const TOKEN = 'USDB'
const NETWORK = 'base_sepolia';

async function create_new_payout(data) {
  try {
    console.log("create_new_payout called with data:", data);

    if (!data) {
      return {
        success: false,
        error: "No data provided",
      };
    }

    const user_id = data.user_id;
    const bank_account_id = data.bank_account_id;
    const amount = data.amount;
    const currency = data.currency;

    if (!user_id || !bank_account_id || !amount || !currency) {
      return {
        success: false,
        error: "Missing required fields: user_id, bank_account_id, amount, or currency",
      };
    }

    const user = await getUserById(user_id);

    const sender_wallet_address = data.evm_pub_key;

    console.log("User:", user);
    console.log("Amount:", amount);
    console.log("currency:", currency);

    if (!user || !user.blind_pay_evm_wallet_id) {
      return {
        success: false,
        error: "User not registered or missing wallet_id",
      };
    }

    const quote = await get_payout_quote({
      bank_account_id,
      amount,
      wallet_id: user.blind_pay_evm_wallet_id, // Keep for logging purposes
    });

    console.log("Quote:", quote);

    let payoutRes;
    try {
      payoutRes = await axios.post(
        `https://api.blindpay.com/v1/instances/${BLIND_PAY_INSTANCE_ID}/payouts/evm`,
        {
          quote_id: quote.id,
          sender_wallet_address: sender_wallet_address,
        },
        {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${BLIND_PAY_API_KEY}` 
          },
        }
      );
      console.log("Payout API response:", payoutRes.data);
    } catch (error) {
      console.error("[payout API] Error:", error);
      console.error("[payout API] Error response:", error.response?.data);
      console.error("[payout API] Error status:", error.response?.status);
      throw error;
    }

    // to do sned withdraw email
    send_withdraw_email({
      email: user.email,
      amount: amount,
      currency: "MXN",
      payout: payoutRes.data
    });

    return { success: true, payout: payoutRes.data };
  } catch (error) {
    console.error("[create_new_payout] Error:", error);
    console.error("[create_new_payout] Error response:", error.response?.data);
    console.error("[create_new_payout] Error status:", error.response?.status);
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
}

async function get_payout_quote({ bank_account_id, amount, wallet_id }) {
  console.log("get_payout_quote called with:", { bank_account_id, amount, wallet_id });

  if (!bank_account_id || !amount) {
    throw new Error("Missing required fields: bank_account_id or amount");
  }

  const request_amount = amount * 100;

  try {
    const quoteRes = await axios.post(
      `https://api.blindpay.com/v1/instances/${BLIND_PAY_INSTANCE_ID}/quotes`,
      {
        bank_account_id: bank_account_id,
        currency_type: "sender",
        cover_fees: true,
        request_amount: request_amount,
        network: NETWORK,
        token: TOKEN,
      },
      {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${BLIND_PAY_API_KEY}` 
        },
      }
    );
    console.log("Quote API response:", quoteRes.data);
    return quoteRes.data;
  } catch (error) {
    console.error("[get_payout_quote] Error:", error);
    console.error("[get_payout_quote] Error response:", error.response?.data);
    console.error("[get_payout_quote] Error status:", error.response?.status);
    throw error;
  }
}

async function send_withdraw_email({ email, amount, currency, payout }) {
  console.log("send_withdraw_email called with:", { email, amount, currency, payout });

  if (!email || !amount || !currency) {
    console.error("Missing required fields for send_withdraw_email:", { email, amount, currency });
    return;
  }

  const emailTemplateID = 'd-xxxxxxxxxxxxxxxxxxxx'; // Replace with actual template ID

  let subject = `Withdrawal Initiated`;
  let instructionLines = [];

  if (currency === "MXN") {
    subject = "Retiro Iniciado";
    instructionLines.push(`Cantidad: ${amount} ${currency}`);
    instructionLines.push(`Beneficiario: BlindPay, Inc.`);
    instructionLines.push(`Este retiro será procesado en breve.`);
  } else if (currency === "BRL") {
    subject = "Retirada Iniciada";
    instructionLines.push(`Quantia: ${amount} ${currency}`);
    instructionLines.push(`Beneficiário: BlindPay, Inc.`);
    instructionLines.push(`Esta retirada será processada em breve.`);
  } else {
    instructionLines.push(`Amount: ${amount} ${currency}`);
    instructionLines.push(`Beneficiary: BlindPay, Inc.`);
    instructionLines.push(`This withdrawal will be processed shortly.`);
  }

  try {
    await emailService({
      templateId: emailTemplateID,
      emailAddress: email,
      subject,
      instructionLines
    });
    console.log("Withdraw email sent successfully");
  } catch (err) {
    console.error("Error sending withdraw email:", err);
  }
}

module.exports = {
  create_new_payout,
  get_payout_quote,
};
