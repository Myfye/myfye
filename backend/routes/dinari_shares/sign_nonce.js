require("dotenv").config();
const { createWalletClient, http, parseEther, hashMessage } = require('viem');
const { privateKeyToAccount, signMessage } = require('viem/accounts');
const { createErrorLog } = require('../errorLog');

// Get private key from environment variables
const EVM_PRIV_KEY = process.env.EVM_PRIV_KEY;

async function sign_nonce(data) {
  try {
    // Validate EVM_PRIV_KEY
    if (!EVM_PRIV_KEY) {
      throw new Error('EVM_PRIV_KEY environment variable is not set');
    }

    if (typeof EVM_PRIV_KEY !== 'string' || EVM_PRIV_KEY.trim() === '') {
      throw new Error('EVM_PRIV_KEY environment variable is empty or invalid');
    }

    // Validate private key format (should start with 0x and be 66 characters long)
    if (!EVM_PRIV_KEY.startsWith('0x') || EVM_PRIV_KEY.length !== 66) {
      throw new Error('EVM_PRIV_KEY must be a valid 32-byte hex string starting with 0x');
    }

    // Handle both direct message and Dinari nonce response structure
    let messageToSign;
    let nonceValue;

    if (data.message && data.nonce) {
      // This is the Dinari nonce response structure
      messageToSign = data.message;
      nonceValue = data.nonce;
    } else if (data.nonce_message) {
      // This is the direct message structure
      messageToSign = data.nonce_message;
      nonceValue = data.nonce || 'unknown';
    } else {
      throw new Error('Either nonce_message or both message and nonce are required');
    }

    console.log("EVM_PRIV_KEY length:", EVM_PRIV_KEY.length);
    console.log("EVM_PRIV_KEY starts with 0x:", EVM_PRIV_KEY.startsWith('0x'));
    console.log("Message to sign length:", messageToSign.length);

    // Create account from private key
    const account = privateKeyToAccount(EVM_PRIV_KEY);
    
    console.log("Signing nonce message with address:", account.address);
    console.log("Nonce message:", messageToSign);
    console.log("Nonce value:", nonceValue);

    // Try alternative signing approach
    try {
      // First, try the standard signMessage approach
      const signature = await signMessage({
        account,
        message: messageToSign
      });

      console.log("Signature generated:", signature);

      return {
        signature: signature,
        signer_address: account.address,
        nonce_message: messageToSign,
        nonce: nonceValue
      };
    } catch (signError) {
      console.error("Standard signMessage failed, trying alternative approach:", signError.message);
      
      // Alternative approach: hash the message first, then sign
      const messageHash = hashMessage(messageToSign);
      console.log("Message hash:", messageHash);
      
      // Use the account's sign method directly
      const signature = await account.signMessage({ message: messageToSign });
      
      console.log("Alternative signature generated:", signature);

      return {
        signature: signature,
        signer_address: account.address,
        nonce_message: messageToSign,
        nonce: nonceValue
      };
    }

  } catch (error) {
    console.error("Error in sign_nonce:", {
      message: error.message,
      stack: error.stack,
      EVM_PRIV_KEY_set: !!EVM_PRIV_KEY,
      EVM_PRIV_KEY_length: EVM_PRIV_KEY ? EVM_PRIV_KEY.length : 0,
      EVM_PRIV_KEY_starts_with_0x: EVM_PRIV_KEY ? EVM_PRIV_KEY.startsWith('0x') : false
    });

    /*
    await createErrorLog({
      user_id: data.user_id || 'UNKNOWN',
      error_message: error.message,
      error_type: 'Dinari Nonce Signing Error',
      error_stack_trace: error.stack
    });
    */

    throw error;
  }
}

module.exports = {
  sign_nonce
};