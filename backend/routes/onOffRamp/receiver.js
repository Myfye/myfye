/**
 * On-Ramp Service
 *
 * This module handles cryptocurrency on-ramp operations,
 * allowing users to convert fiat currency to cryptocurrency.
 */

// Load environment variables
require("dotenv").config();
const axios = require("axios");
const { 
  updateBlindPayReceiverId,
  updateBlindPayEvmWalletId } = require('../userDb');
const { createErrorLog } = require('../errorLog');

// Get API key from environment variables
const BLIND_PAY_API_KEY = process.env.BLIND_PAY_API_KEY;
const BLIND_PAY_INSTANCE_ID = process.env.BLIND_PAY_INSTANCE_ID;

//const BLIND_PAY_DEV_API_KEY = process.env.BLIND_PAY_DEV_API_KEY;
//const BLIND_PAY_DEV_INSTANCE_ID = process.env.BLIND_PAY_DEV_INSTANCE_ID;

async function create_new_on_ramp_path(data) {
  console.log("On-ramp called!");
  console.log(
    "Processing on-ramp request with data:",
    JSON.stringify(data, null, 2)
  );

  
  try {
    console.log("About to create new receiver...");
    const receiver = await create_new_receiver(data);
    // to do save receiver data
    console.log("Receiver result", receiver);
    await updateBlindPayReceiverId(data.user_id, receiver.id);
    console.log(
      "Receiver created successfully:",
      JSON.stringify(receiver, null, 2)
    );

    console.log("About to create blockchain wallet...");
    console.log(" ", "evmPublicKey", data.userEvmPublicKey, "receiver.id", receiver.id);
    const blockchain_wallet = await create_blockchain_wallet(receiver.id, data.userEvmPublicKey);
    // to do: save user's blockchain wallet id
    console.log("Blockchain wallet result", blockchain_wallet);
    await updateBlindPayEvmWalletId(data.user_id, blockchain_wallet.id);
    console.log(
      "Blockchain wallet created successfully:",
      JSON.stringify(blockchain_wallet, null, 2)
    );

    return {
      success: true,
      receiver,
      blockchain_wallet,
    };
  } catch (error) {
    console.error("Detailed error in create_new_on_ramp_path:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    // Create error log
    await createErrorLog({
      user_id: data.user_id,
      error_message: error.message,
      error_type: 'BlindPay Creation Error',
      error_stack_trace: error.stack
    });

    return {
      success: false,
      error: error.message,
      details: error.response?.data || error.stack,
    };
  }
}

async function create_new_receiver(data) {
  // to do: pass in the KYC data
  try {

    // Format date_of_birth to ISO 8601 with UTC timezone
    const formattedDateOfBirth = new Date(data.date_of_birth).toISOString();

    console.log("Creating new receiver...");
    console.log(data);
    const response = await axios.post(
      `https://api.blindpay.com/v1/instances/${BLIND_PAY_INSTANCE_ID}/receivers`,
      {
        type: "individual",
        kyc_type: "standard",
        email: data.email,
        tax_id: data.tax_id,
        address_line_1: data.address_line_1, // not required
        //address_line_2: data.address_line_2, // not required
        city: data.city,
        state_province_region: data.state_province_region,
        country: data.country, // required
        postal_code: data.postal_code,
        //ip_address: data.ip_address, // not required
        //phone_number: data.phone_number, // not required
        //proof_of_address_doc_type: data.proof_of_address_doc_type, // not required
        //proof_of_address_doc_file: data.proof_of_address_doc_file, // not required
        first_name: data.first_name, // not required
        last_name: data.last_name, // not required
        date_of_birth: formattedDateOfBirth,
        id_doc_country: data.id_doc_country,
        id_doc_type: data.id_doc_type,
        id_doc_front_file: data.id_doc_front_file,
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
      "Error in create_new_receiver:",
      JSON.stringify(error.response?.data || error.message, null, 2)
    );
    throw error;
  }
}

async function create_blockchain_wallet(receiverId, userEvmPublicKey) {
  // to do: pass in the user public key
  try {
    console.log("Creating blockchain wallet for receiver:", receiverId);
    const response = await axios.post(
      `https://api.blindpay.com/v1/instances/${BLIND_PAY_INSTANCE_ID}/receivers/${receiverId}/blockchain-wallets`,
      {
        name: "Wallet Display Name",
        network: "base", // sepolia, base
        address: userEvmPublicKey,
        is_account_abstraction: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BLIND_PAY_API_KEY}`,
        },
      }
    );

    console.log("Blockchain wallet creation response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error in create_blockchain_wallet:",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function get_all_receivers() {
  try {
    console.log("Getting all receivers...");
    const response = await axios.get(
      `https://api.blindpay.com/v1/instances/${BLIND_PAY_INSTANCE_ID}/receivers`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BLIND_PAY_API_KEY}`,
        },
      }
    );

    // For each receiver, get their blockchain wallets
    const receiversWithWallets = await Promise.all(
      response.data.map(async (receiver) => {
        try {
          const walletsResponse = await axios.get(
            `https://api.blindpay.com/v1/instances/${BLIND_PAY_INSTANCE_ID}/receivers/${receiver.id}/blockchain-wallets`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${BLIND_PAY_API_KEY}`,
              },
            }
          );
          return {
            ...receiver,
            blockchain_wallets: walletsResponse.data,
          };
        } catch (error) {
          console.error(`Error fetching wallets for receiver ${receiver.id}:`, error);
          return {
            ...receiver,
            blockchain_wallets: [],
            error: error.message,
          };
        }
      })
    );

    console.log("Receivers with wallets:", JSON.stringify(receiversWithWallets, null, 2));
    return receiversWithWallets;
  } catch (error) {
    console.error("Error in get_all_receivers:", error.response?.data || error.message);
    throw error;
  }
}

async function delete_blockchain_wallet(receiverId, walletId) {
  try {
    console.log(`Deleting blockchain wallet ${walletId} for receiver ${receiverId}...`);
    const response = await axios.delete(
      `https://api.blindpay.com/v1/instances/${BLIND_PAY_INSTANCE_ID}/receivers/${receiverId}/blockchain-wallets/${walletId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BLIND_PAY_API_KEY}`,
        },
      }
    );

    console.log("Blockchain wallet deletion response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in delete_blockchain_wallet:", error.response?.data || error.message);
    throw error;
  }
}

async function delete_receiver(receiverId) {
  try {
    console.log(`Deleting receiver ${receiverId}...`);
    const response = await axios.delete(
      `https://api.blindpay.com/v1/instances/${BLIND_PAY_INSTANCE_ID}/receivers/${receiverId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BLIND_PAY_API_KEY}`,
        },
      }
    );

    console.log("Receiver deletion response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in delete_receiver:", error.response?.data || error.message);
    throw error;
  }
}

async function delete_blockchain_wallet_and_receiver(receiverId, walletId) {
  try {
    console.log(`Starting deletion process for receiver ${receiverId} and wallet ${walletId}...`);
    
    // First delete the blockchain wallet
    console.log(`Deleting blockchain wallet ${walletId}...`);
    await delete_blockchain_wallet(receiverId, walletId);
    
    // Then delete the receiver
    console.log(`Deleting receiver ${receiverId}...`);
    await delete_receiver(receiverId);
    
    return {
      success: true,
      message: "Successfully deleted blockchain wallet and receiver",
      receiverId,
      walletId
    };
  } catch (error) {
    console.error("Error in delete_blockchain_wallet_and_receiver:", error.response?.data || error.message);
    throw error;
  }
}

// TO DO GET RECEIVERS THEIR CORRESPONDING BLOCKCHAIN WALLETS
/*
import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://api.blindpay.com/v1/instances/in_000000000000/receivers',
  headers: {Authorization: 'Bearer YOUR_SECRET_TOKEN'}
};

try {
  const { data } = await axios.request(options);
  console.log(data);
} catch (error) {
  console.error(error);
}

import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://api.blindpay.com/v1/instances/in_000000000000/receivers/re_000000000000/blockchain-wallets',
  headers: {Authorization: 'Bearer YOUR_SECRET_TOKEN'}
};

try {
  const { data } = await axios.request(options);
  console.log(data);
} catch (error) {
  console.error(error);
}

*/

// TO DO DELETE RECEIVER AND BLOCKCHAIN WALLET
/*

const options = {
  method: 'DELETE',
  url: 'https://api.blindpay.com/v1/instances/in_000000000000/receivers/re_000000000000',
  headers: {Authorization: 'Bearer YOUR_SECRET_TOKEN'}
};

try {
  const { data } = await axios.request(options);
  console.log(data);
} catch (error) {
  console.error(error);
}


import axios from 'axios';

const options = {
  method: 'DELETE',
  url: 'https://api.blindpay.com/v1/instances/in_000000000000/receivers/re_000000000000/blockchain-wallets/bw_000000000000',
  headers: {Authorization: 'Bearer YOUR_SECRET_TOKEN'}
};

try {
  const { data } = await axios.request(options);
  console.log(data);
} catch (error) {
  console.error(error);
}
  */

// Export functions for use in other modules
module.exports = {
  create_new_on_ramp_path,
  get_all_receivers,
  delete_blockchain_wallet,
  delete_receiver,
  delete_blockchain_wallet_and_receiver,
};
