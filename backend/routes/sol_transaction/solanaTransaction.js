const web3 = require('@solana/web3.js');
const buffer = require('buffer');
const bs58 = require('bs58').default;
const VersionedTransaction = web3.VersionedTransaction;
const Keypair = web3.Keypair;
const Transaction = web3.Transaction;
const Buffer = buffer.Buffer;

const SERVER_PRIVATE_KEY = process.env.SOL_PRIV_KEY;

async function signVersionedTransaction(data) {
  try {
    const serverKeypair = Keypair.fromSecretKey(bs58.decode(SERVER_PRIVATE_KEY));

    if (!data.serializedTransaction) {
      throw new Error("No transaction data provided.");
    }

    const transactionBuffer = Buffer.from(data.serializedTransaction, "base64");
    console.log("Transaction buffer:", transactionBuffer);

    const transaction = VersionedTransaction.deserialize(new Uint8Array(transactionBuffer));
    console.log("Deserialized Transaction:", JSON.stringify(transaction, null, 2));
    

    // Ensure the server is the fee payer
    if (!transaction.message.staticAccountKeys || transaction.message.staticAccountKeys.length === 0) {
      console.error("No staticAccountKeys found in transaction message.");
    }

    console.log("Transaction Signers:", transaction.message.staticAccountKeys.map(k => k.toBase58()));

    if (!transaction.message.staticAccountKeys[0].equals(serverKeypair.publicKey)) {
      console.error(`Fee payer mismatch. Expected ${serverKeypair.publicKey.toBase58()}, got ${transaction.message.staticAccountKeys[0].toBase58()}`);
    }

    // Server signs transaction (partial signing)
    transaction.sign([serverKeypair]);

    console.log("Transaction after signing:", transaction);

    return {
      signedTransaction: Buffer.from(transaction.serialize()).toString("base64")
    };

  } catch (error) {
    console.error("Error signing transaction:", error);
    return { error: error.message };
  }
};



async function signTransaction(data) {

  console.log("Signing transaction...", data);
  try {
    const serverKeypair = Keypair.fromSecretKey(bs58.decode(SERVER_PRIVATE_KEY));

    if (!data.serializedTransaction) {
      throw new Error("No transaction data provided.");
    }
  
    // Deserialize the transaction
    const transaction = Transaction.from(Buffer.from(data.serializedTransaction, "base64"));

    // Sign the transaction with the server's key
    transaction.partialSign(serverKeypair);

    // Serialize the signed transaction and return it to the frontend
    const signedTxBase64 = transaction.serialize({ requireAllSignatures: false }).toString("base64");
    return { signedTransaction: signedTxBase64 };
  

  } catch (error) {
    console.error("Error signing transaction:", error);
    return { error: error.message };
  }
};

// Export functions for use in other modules
module.exports = {
  signVersionedTransaction,
  signTransaction
};