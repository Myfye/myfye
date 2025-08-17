require("dotenv").config();
const axios = require("axios");
const { ethers } = require("ethers");
const { emailService } = require("../emailService");

const BLIND_PAY_API_KEY = process.env.BLIND_PAY_API_KEY;
const BLIND_PAY_INSTANCE_ID = process.env.BLIND_PAY_INSTANCE_ID;
const RPC_PROVIDER_URL = process.env.RPC_PROVIDER_URL;
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const TOKEN = 'USDC';
const NETWORK = 'base'; // base, ethereum, arbitrum, polygon

//const BLIND_PAY_API_KEY = process.env.BLIND_PAY_DEV_API_KEY;
//const BLIND_PAY_INSTANCE_ID = process.env.BLIND_PAY_DEV_INSTANCE_ID;
//const TOKEN = 'USDB';
//const NETWORK = 'base_sepolia';

async function create_new_payout(data) {
  console.log("Creating new payout:", data);
  
  try {
    // Step 1: Create a quote
    const payout_quote = await get_payout_quote(data);
    console.log("Payout quote:", payout_quote);

    // Step 2: Approve tokens
    await approve_tokens(payout_quote);
    console.log("Tokens approved successfully");

    // Step 3: Execute payout
    const payout_response = await execute_payout(payout_quote, data);
    console.log("Payout execution response:", payout_response);

    // Send confirmation email
    send_payout_email(data, payout_response);

    return payout_response;
  } catch (error) {
    console.error("Error in create_new_payout:");
    console.error("Status:", error.response?.status);
    console.error("Status Text:", error.response?.statusText);
    console.error("Response Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Stack Trace:", error.stack);
    throw error;
  }
}

async function get_payout_quote(data) {
  const formattedAmount = data.amount * 100; // Convert to cents
  
  try {
    const response = await axios.post(
      `https://api.blindpay.com/v1/instances/${BLIND_PAY_INSTANCE_ID}/quotes`,
      {
        bank_account_id: data.bank_account_id,
        currency_type: "sender",
        cover_fees: data.cover_fees || false,
        request_amount: formattedAmount,
        network: NETWORK,
        token: TOKEN, 
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BLIND_PAY_API_KEY}`,
        },
      }
    );

    console.log("Payout quote creation response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error in get_payout_quote:",
      error.response?.data || error.message
    );
    
    if (error.response && error.response.data && error.response.data.message) {
      const customError = new Error(error.response.data.message);
      customError.response = error.response;
      throw customError;
    }
    
    throw error;
  }
}

async function approve_tokens(quote) {
  try {
    // Set up provider and wallet
    const provider = new ethers.JsonRpcProvider(RPC_PROVIDER_URL, quote.contract.network);
    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
    
    const contract = new ethers.Contract(
      quote.contract.address,
      quote.contract.abi,
      provider
    );
    const contractSigner = contract.connect(wallet);
    
    const tx = await contractSigner.approve(
      quote.contract.blindpayContractAddress,
      quote.contract.amount
    );
    
    await tx.wait();
    console.log("Token approval transaction confirmed:", tx.hash);
    
    return tx;
  } catch (error) {
    console.error("Error in approve_tokens:", error.message);
    throw error;
  }
}

async function execute_payout(quote, data) {
  try {
    // Set up wallet to get sender address
    const provider = new ethers.JsonRpcProvider(RPC_PROVIDER_URL, quote.contract.network);
    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
    const senderWalletAddress = await wallet.getAddress();

    const response = await axios.post(
      `https://api.blindpay.com/v1/instances/${BLIND_PAY_INSTANCE_ID}/payouts/evm`,
      {
        quote_id: quote.id,
        sender_wallet_address: senderWalletAddress,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BLIND_PAY_API_KEY}`,
        },
      }
    );

    console.log("Payout execution response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in execute_payout:", error.response?.data || error.message);
    
    // Extract the error message from BlindPay API response
    if (error.response && error.response.data && error.response.data.message) {
      const customError = new Error(error.response.data.message);
      customError.response = error.response;
      throw customError;
    }
    
    throw error;
  }
}

async function send_payout_email(data, payout) {
  const emailTemplateID = 'd-2c4af21695eb4196926447ed87b37236'; // Payout fix

  let subject = ``;
  if (data.currency === "MXN") {
    subject = `Confirmación de pago`;
  } else if (data.currency === "BRL") {
    subject = `Confirmação de pagamento`;
  } else if (data.currency === "USD") {
    subject = `Payment Confirmation`;
  }

  let instructionFirstLine = ``;
  if (data.currency === "MXN") {
    instructionFirstLine = `Tu pago de ${payout.sender_amount/100} ${data.currency} ha sido procesado exitosamente.`;
  } else if (data.currency === "BRL") {
    instructionFirstLine = `Seu pagamento de ${payout.sender_amount/100} ${data.currency} foi processado com sucesso.`;
  } else if (data.currency === "USD") {
    instructionFirstLine = `Your payment of ${payout.sender_amount/100} ${data.currency} has been processed successfully.`;
  }

  let instructionSecondLine = ``;
  if (data.currency === "MXN") {
    instructionSecondLine = `ID de transacción: ${payout.id}`;
  } else if (data.currency === "BRL") {
    instructionSecondLine = `ID da transação: ${payout.id}`;
  } else if (data.currency === "USD") {
    instructionSecondLine = `Transaction ID: ${payout.id}`;
  }

  let instructionThirdLine = ``;
  if (data.currency === "MXN") {
    instructionThirdLine = `Los fondos deberían llegar a tu cuenta bancaria en 1-3 días hábiles.`;
  } else if (data.currency === "BRL") {
    instructionThirdLine = `Os fundos devem chegar à sua conta bancária em 1-3 dias úteis.`;
  } else if (data.currency === "USD") {
    instructionThirdLine = `Funds should arrive in your bank account within 1-3 business days.`;
  }

  let instructionFourthLine = ``;
  if (data.currency === "MXN") {
    instructionFourthLine = `Gracias por usar nuestro servicio.`;
  } else if (data.currency === "BRL") {
    instructionFourthLine = `Obrigado por usar nosso serviço.`;
  } else if (data.currency === "USD") {
    instructionFourthLine = `Thank you for using our service.`;
  }

  let instructionFifthLine = ``;

  // Send email
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
    console.log("Payout confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending payout confirmation email:", error);
  }
}

// Export functions for use in other modules
module.exports = {
  create_new_payout,
  get_payout_quote,
  approve_tokens,
  execute_payout,
};