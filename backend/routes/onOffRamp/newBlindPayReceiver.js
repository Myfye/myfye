/**
 * On-Ramp Service
 *
 * This module handles cryptocurrency on-ramp operations,
 * allowing users to convert fiat currency to cryptocurrency.
 */

// Load environment variables
require("dotenv").config();
const axios = require("axios");

// Get API key from environment variables
//const BLIND_PAY_API_KEY = process.env.BLIND_PAY_API_KEY;
//const BLIND_PAY_INSTANCE_ID = process.env.BLIND_PAY_INSTANCE_ID;

const BLIND_PAY_DEV_API_KEY = process.env.BLIND_PAY_DEV_API_KEY;
const BLIND_PAY_DEV_INSTANCE_ID = process.env.BLIND_PAY_DEV_INSTANCE_ID;

async function create_new_on_ramp_path(data) {
  console.log("On-ramp called!");
  console.log(
    "Processing on-ramp request with data:",
    JSON.stringify(data, null, 2)
  );

  try {
    console.log("About to create new receiver...");
    const receiver = await create_new_receiver();
    // to do save receiver data
    console.log(
      "Receiver created successfully:",
      JSON.stringify(receiver, null, 2)
    );

    console.log("About to create blockchain wallet...");
    const blockchain_wallet = await create_blockchain_wallet(receiver.id);
    // to do: save user's blockchain wallet id
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
    return {
      success: false,
      error: error.message,
      details: error.response?.data || error.stack,
    };
  }
}

async function create_new_receiver() {
  // to do: pass in the KYC data
  try {
    console.log("Creating new receiver...");
    const response = await axios.post(
      `https://api.blindpay.com/v1/instances/${BLIND_PAY_DEV_INSTANCE_ID}/receivers`,
      {
        type: "individual",
        kyc_type: "standard",
        email: "email@example.com",
        tax_id: "12345678",
        address_line_1: "8 The Green",
        address_line_2: "#12345",
        city: "Dover",
        state_province_region: "DE",
        country: "US",
        postal_code: "02050",
        ip_address: "127.0.0.1",
        phone_number: "+1234567890",
        proof_of_address_doc_type: "UTILITY_BILL",
        proof_of_address_doc_file:
          "https://pub-4fabf5dd55154f19a0384b16f2b816d9.r2.dev/v4-460px-Get-Proof-of-Address-Step-3-Version-2.jpg.jpeg",
        first_name: "John",
        last_name: "Doe",
        date_of_birth: "1998-01-01T00:00:00Z",
        id_doc_country: "US",
        id_doc_type: "PASSPORT",
        id_doc_front_file:
          "https://pub-4fabf5dd55154f19a0384b16f2b816d9.r2.dev/1000_F_365165797_VwQbNaD4yjWwQ6y1ENKh1xS0TXauOQvj.jpg",
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

async function create_blockchain_wallet(receiverId) {
  // to do: pass in the user public key
  try {
    console.log("Creating blockchain wallet for receiver:", receiverId);
    const response = await axios.post(
      `https://api.blindpay.com/v1/instances/${BLIND_PAY_DEV_INSTANCE_ID}/receivers/${receiverId}/blockchain-wallets`,
      {
        name: "Wallet Display Name",
        network: "sepolia",
        address: "0xDD6a3aD0949396e57C7738ba8FC1A46A5a1C372C",
        is_account_abstraction: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BLIND_PAY_DEV_API_KEY}`,
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

// Export functions for use in other modules
module.exports = {
  create_new_on_ramp_path,
};
