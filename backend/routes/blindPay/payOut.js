const axios = require("axios");
const { getUserByEmail, getUserById } = require("../userDb");
const { emailService } = require("../emailService");

//const BLIND_PAY_API_KEY = process.env.BLIND_PAY_API_KEY;
//const BLIND_PAY_INSTANCE_ID = process.env.BLIND_PAY_INSTANCE_ID;
//const TOKEN = 'USDC';

const BLIND_PAY_API_KEY = process.env.BLIND_PAY_DEV_API_KEY;
const BLIND_PAY_INSTANCE_ID = process.env.BLIND_PAY_DEV_INSTANCE_ID;
const TOKEN = 'USDB'

const NETWORK = 'base';

async function create_new_payout({ user_id, bank_account_id, amount, currency }) {
  try {
    const user = await getUserById(user_id);

    console.log("User:", user);
    console.log("User ID:", user_id);
    console.log("Bank Account ID:", bank_account_id);
    console.log("Amount:", amount);
    console.log("Currency:", currency);

    if (!user || !user.blind_pay_evm_wallet_id) {
      return {
        success: false,
        error: "User not registered or missing wallet_id",
      };
    }

    const quote = await get_payout_quote({
      bank_account_id,
      amount,
      wallet_id: user.blind_pay_evm_wallet_id,
    });

    const payoutRes = await axios.post(
      `https://api.blindpay.xyz/instances/${BLIND_PAY_INSTANCE_ID}/payouts/evm`,
      {
        quote_id: quote.id,
      },
      {
        headers: { Authorization: `Bearer ${BLIND_PAY_API_KEY}` },
      }
    );

    // to do sned withdraw email

    return { success: true, payout: payoutRes.data };
  } catch (error) {
    console.error("[create_new_payout] Error:", error);
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
}

async function get_payout_quote({ bank_account_id, amount, wallet_id }) {
  const quoteRes = await axios.post(
    `https://api.blindpay.xyz/instances/${BLIND_PAY_INSTANCE_ID}/quotes`,
    {
      currency_type: "sender",
      request_amount: amount.toString(),
      token: TOKEN,
      network: NETWORK,
      wallet_id: wallet_id,
      bank_account_id: bank_account_id,
    },
    {
      headers: { Authorization: `Bearer ${BLIND_PAY_API_KEY}` },
    }
  );
  return quoteRes.data;
}

async function send_withdraw_email({ email, amount, currency, payout }) {
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
