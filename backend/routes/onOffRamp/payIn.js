require("dotenv").config();
const axios = require("axios");
const { emailService } = require("../emailService");

//const BLIND_PAY_API_KEY = process.env.BLIND_PAY_API_KEY;
//const BLIND_PAY_INSTANCE_ID = process.env.BLIND_PAY_INSTANCE_ID;
//const TOKEN = 'USDC'

const BLIND_PAY_API_KEY = process.env.BLIND_PAY_DEV_API_KEY;
const BLIND_PAY_INSTANCE_ID = process.env.BLIND_PAY_DEV_INSTANCE_ID;
const TOKEN = 'USDB'

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

    const clabe = response.data.clabe
    const pix = response.data.pix_code

    send_deposit_email(data, clabe, pix, response.data);

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
        token: TOKEN, // USDB for dev USDC for prod
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
    
    // Extract the error message from BlindPay API response
    if (error.response && error.response.data && error.response.data.message) {
      const customError = new Error(error.response.data.message);
      customError.response = error.response;
      throw customError;
    }
    
    throw error;
  }
}


async function send_deposit_email(data, clabe, pix, payin) {
  
    const emailTemplateID = 'd-2c4af21695eb4196926447ed87b37236'

    let subject = ``
    if (data.currency === "MXN") {
      subject = `Instrucciones de depósito`
    } else if (data.currency === "BRL") {
      subject = `Instruções de depósito`
    } else if (data.currency === "USD") {
      subject = `Deposit Instructions`
    }

    let instructionFirstLine = ``
    if (data.currency === "MXN") {
      instructionFirstLine = `Cantidad: ${payin.sender_amount/100}`
    } else if (data.currency === "BRL") {
      instructionFirstLine = `Quantia: ${payin.sender_amount/100}`
    } else if (data.currency === "USD") {
      instructionFirstLine = `Amount: ${payin.sender_amount/100}`
    }

    let instructionSecondLine = ``
    if (data.currency === "MXN") {
      instructionSecondLine = `CLABE: ${clabe}`
    } else if (data.currency === "BRL") {
      instructionSecondLine = `PIX: ${pix}`
    } else if (data.currency === "USD") {
      instructionSecondLine = `ACH: ${data.ach}`
    }

    let instructionThirdLine = ``
    if (data.currency === "MXN") {
      instructionThirdLine = `Nombre del banco: Nvio`
    }

    let instructionFourthLine = ``
    if (data.currency === "MXN") {
      instructionFourthLine = `Beneficiario: BlindPay, Inc.`
    } else if (data.currency === "BRL") {
      instructionFourthLine = `Beneficiário: BlindPay, Inc.`
    } else if (data.currency === "USD") {
      instructionFourthLine = `Beneficiary: BlindPay, Inc.`
    }

    let instructionFifthLine = ``
    if (data.currency === "MXN") {
      instructionFifthLine = `Accede a la app de tu banco y sigue estas instrucciones. Este depósito será válido durante los próximos 60 minutos.`
    } else if (data.currency === "BRL") {
      instructionFifthLine = `Acesse o aplicativo do seu banco e siga estas instruções. Este depósito será válido pelos próximos 60 minutos.`
    } else if (data.currency === "USD") {
      instructionFifthLine = `Please go to your bank app and follow these instructions. This deposit will be valid for the next 60 minutes.`
    }

    // send email
    try {
        await emailService({
            templateId: emailTemplateID,
            emailAddress: data.email,
            subject,
            instructionFirstLine,
            instructionSecondLine,
            instructionThirdLine,
            instructionFourthLine,
            instructionFifthLine
        });
        console.log("Deposit email sent successfully");
    } catch (error) {
        console.error("Error sending deposit email:", error);
    }

  }

// Export functions for use in other modules
module.exports = {
  create_new_payin,
  get_payin_quote,
};
