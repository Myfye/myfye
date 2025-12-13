const web3 = require('@solana/web3.js');
const Token = require('@solana/spl-token');
const buffer = require('buffer');
const bs58 = require('bs58').default;
const VersionedTransaction = web3.VersionedTransaction;
const Keypair = web3.Keypair;
const Transaction = web3.Transaction;
const PublicKey = web3.PublicKey;
const TransactionMessage = web3.TransactionMessage;
const Buffer = buffer.Buffer;

const SERVER_PRIVATE_KEY = process.env.SOL_PRIV_KEY;

// Program IDs
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const TOKEN_2022_PROGRAM_ID = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');

/**
 * Check if an instruction creates a token account
 */
function isTokenAccountCreationInstruction(instruction) {
  const programId = instruction.programId;
  
  // Associated Token Program creates ATAs
  if (programId.equals(ASSOCIATED_TOKEN_PROGRAM_ID)) {
    return { isCreation: true, type: 'ATA' };
  }
  
  // Token Program InitializeAccount instructions
  if (programId.equals(TOKEN_PROGRAM_ID) || programId.equals(TOKEN_2022_PROGRAM_ID)) {
    if (instruction.data && instruction.data.length > 0) {
      const instructionType = instruction.data[0];
      // InitializeAccount = 1, InitializeAccount2 = 16, InitializeAccount3 = 18
      if (instructionType === 1 || instructionType === 16 || instructionType === 18) {
        return { isCreation: true, type: 'TokenAccount' };
      }
    }
  }
  
  return { isCreation: false };
}

/**
 * Extract token account address and owner from ATA creation instruction
 */
function extractATADetails(instruction) {
  if (!instruction.keys || instruction.keys.length < 4) {
    return null;
  }
  
  // ATA creation structure:
  // [0] Payer
  // [1] ATA address (the new account)
  // [2] Owner (wallet that owns the ATA)
  // [3] Mint
  // [4] System Program
  // [5] Token Program
  
  return {
    ataAddress: instruction.keys[1]?.pubkey,
    owner: instruction.keys[2]?.pubkey,
    mint: instruction.keys[3]?.pubkey,
  };
}

/**
 * Extract token account details from InitializeAccount instruction
 */
function extractTokenAccountDetails(instruction) {
  if (!instruction.keys || instruction.keys.length < 3) {
    return null;
  }
  
  // InitializeAccount structure:
  // [0] Account (the token account being initialized)
  // [1] Mint
  // [2] Owner
  
  return {
    account: instruction.keys[0]?.pubkey,
    mint: instruction.keys[1]?.pubkey,
    owner: instruction.keys[2]?.pubkey,
  };
}

/**
 * Add SetAuthority instruction to set closeAuthority to server wallet
 */
function createSetCloseAuthorityInstruction(accountPubkey, ownerPubkey, serverPubkey, programId) {
  return Token.createSetAuthorityInstruction(
    accountPubkey,
    ownerPubkey, // Current authority (owner)
    Token.AuthorityType.CloseAccount,
    serverPubkey, // New authority - SERVER controls closing
    [], // No multi-signers needed
    programId
  );
}

/**
 * Extract account details from VersionedTransaction compiled instruction
 */
function extractAccountFromCompiledInstruction(compiledInstruction, message, type) {
  const accountKeys = message.staticAccountKeys;
  const accountIndices = compiledInstruction.accountKeyIndexes || [];
  
  if (type === 'ATA') {
    // ATA creation structure in compiled instruction:
    // [0] Payer
    // [1] ATA address (the new account)
    // [2] Owner (wallet that owns the ATA)
    // [3] Mint
    // [4] System Program
    // [5] Token Program (optional, might be in lookup table)
    if (accountIndices.length >= 3) {
      const ataAddress = accountKeys[accountIndices[1]];
      const owner = accountKeys[accountIndices[2]];
      const mint = accountKeys[accountIndices[3]];
      
      // Determine program ID - check if Token 2022
      let programId = TOKEN_PROGRAM_ID;
      if (accountIndices.length > 5) {
        const tokenProgramKey = accountKeys[accountIndices[5]];
        if (tokenProgramKey && tokenProgramKey.equals(TOKEN_2022_PROGRAM_ID)) {
          programId = TOKEN_2022_PROGRAM_ID;
        }
      }
      
      return { ataAddress, owner, mint, programId };
    }
  } else if (type === 'TokenAccount') {
    // InitializeAccount structure:
    // [0] Account (the token account being initialized)
    // [1] Mint
    // [2] Owner
    if (accountIndices.length >= 3) {
      const account = accountKeys[accountIndices[0]];
      const mint = accountKeys[accountIndices[1]];
      const owner = accountKeys[accountIndices[2]];
      const programId = message.staticAccountKeys[compiledInstruction.programIdIndex];
      
      return { account, owner, mint, programId };
    }
  }
  
  return null;
}

/**
 * Check for token account creation in VersionedTransaction and extract details
 */
function checkVersionedTransactionAccountCreation(transaction, serverPublicKey) {
  const message = transaction.message;
  const accountCreations = [];
  
  // Find server wallet index
  const serverKeyIndex = message.staticAccountKeys.findIndex(
    key => key.equals(serverPublicKey)
  );
  
  if (serverKeyIndex === -1) {
    console.warn(`[SECURITY] Server wallet not in VersionedTransaction - cannot add SetAuthority instructions`);
  }

  for (const compiledInstruction of message.compiledInstructions) {
    const programIdIndex = compiledInstruction.programIdIndex;
    if (programIdIndex >= message.staticAccountKeys.length) {
      continue;
    }
    
    const programId = message.staticAccountKeys[programIdIndex];
    
    // Check for ATA creation
    if (programId.equals(ASSOCIATED_TOKEN_PROGRAM_ID)) {
      console.warn(`[SECURITY] Detected ATA creation in VersionedTransaction`);
      const details = extractAccountFromCompiledInstruction(compiledInstruction, message, 'ATA');
      if (details) {
        accountCreations.push({ type: 'ATA', details, compiledInstruction });
      }
    }
    
    // Check for Token Program InitializeAccount
    if ((programId.equals(TOKEN_PROGRAM_ID) || programId.equals(TOKEN_2022_PROGRAM_ID)) && 
        compiledInstruction.data && compiledInstruction.data.length > 0) {
      const instructionType = compiledInstruction.data[0];
      if (instructionType === 1 || instructionType === 16 || instructionType === 18) {
        console.warn(`[SECURITY] Detected token account initialization in VersionedTransaction`);
        const details = extractAccountFromCompiledInstruction(compiledInstruction, message, 'TokenAccount');
        if (details) {
          accountCreations.push({ type: 'TokenAccount', details, compiledInstruction });
        }
      }
    }
  }
  
  return { accountCreations, serverKeyIndex };
}

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
      throw new Error("No staticAccountKeys found in transaction message.");
    }

    console.log("Transaction Signers:", transaction.message.staticAccountKeys.map(k => k.toBase58()));

    if (!transaction.message.staticAccountKeys[0].equals(serverKeypair.publicKey)) {
      throw new Error(`Fee payer mismatch. Expected ${serverKeypair.publicKey.toBase58()}, got ${transaction.message.staticAccountKeys[0].toBase58()}`);
    }

    // Check for token account creation
    const creationCheck = checkVersionedTransactionAccountCreation(transaction, serverKeypair.publicKey);
    
    // If account creations are found, we need to add SetAuthority instructions
    if (creationCheck.accountCreations.length > 0) {
      if (creationCheck.serverKeyIndex === -1) {
        throw new Error(`Transaction creates ${creationCheck.accountCreations.length} token account(s) but server wallet is not in transaction. Cannot set closeAuthority. Transaction rejected.`);
      }
      
      console.warn(`[SECURITY] Detected ${creationCheck.accountCreations.length} token account creation(s). Adding SetAuthority instructions to set closeAuthority.`);
      
      // Decompile the message to get instructions
      const message = transaction.message;
      let instructions;
      try {
        // For v0 transactions, decompile might need lookup tables
        // However, TransactionMessage.decompile() should work without lookup tables
        // as it will just reference the lookup table indices
        instructions = TransactionMessage.decompile(message);
      } catch (decompileError) {
        // If decompile fails, we cannot safely modify the transaction
        // This should be rare, but we need to handle it
        console.error(`[SECURITY] Failed to decompile VersionedTransaction message: ${decompileError.message}`);
        throw new Error(`Cannot modify VersionedTransaction: failed to decompile message. This may occur with complex v0 transactions. Error: ${decompileError.message}`);
      }
      
      // Create SetAuthority instructions for each account creation
      const setAuthorityInstructions = [];
      for (const creation of creationCheck.accountCreations) {
        if (creation.type === 'ATA' && creation.details) {
          const { ataAddress, owner, programId } = creation.details;
          console.warn(`[SECURITY] Adding SetAuthority to set closeAuthority for ATA: ${ataAddress.toBase58()}`);
          const setAuthorityIx = createSetCloseAuthorityInstruction(
            ataAddress,
            owner,
            serverKeypair.publicKey,
            programId
          );
          setAuthorityInstructions.push(setAuthorityIx);
        } else if (creation.type === 'TokenAccount' && creation.details) {
          const { account, owner, programId } = creation.details;
          console.warn(`[SECURITY] Adding SetAuthority to set closeAuthority for token account: ${account.toBase58()}`);
          const setAuthorityIx = createSetCloseAuthorityInstruction(
            account,
            owner,
            serverKeypair.publicKey,
            programId
          );
          setAuthorityInstructions.push(setAuthorityIx);
        }
      }
      
      // Add SetAuthority instructions after the creation instructions
      instructions.push(...setAuthorityInstructions);
      
      // Rebuild the transaction message
      // Note: SetAuthority instructions only use static accounts (token account, owner, server wallet)
      // So we can compile as legacy even if original was v0, since we're not adding lookup table dependencies
      const payerKey = message.staticAccountKeys[0];
      const recentBlockhash = message.recentBlockhash;
      
      if (!recentBlockhash) {
        throw new Error("Cannot rebuild VersionedTransaction: missing recent blockhash");
      }
      
      // Check if original was v0 (has address lookup tables)
      const isV0 = message.addressTableLookups && message.addressTableLookups.length > 0;
      if (isV0) {
        console.warn(`[SECURITY] Original transaction was v0, but SetAuthority instructions only use static accounts. Compiling as legacy.`);
      }
      
      // Compile as legacy message (SetAuthority doesn't need lookup tables)
      const newMessage = new TransactionMessage({
        payerKey: payerKey,
        recentBlockhash: recentBlockhash,
        instructions: instructions,
      }).compileToLegacyMessage();
      
      // Create new transaction with modified message
      transaction = new VersionedTransaction(newMessage);
      
      console.warn(`[SECURITY] Rebuilt VersionedTransaction with ${setAuthorityInstructions.length} SetAuthority instruction(s) to set closeAuthority`);
    }

    // Server signs transaction (partial signing)
    transaction.sign([serverKeypair]);

    console.log("Transaction after signing:", transaction);

    // Extract signature for logging
    // For VersionedTransaction, signatures are Uint8Array in the signatures array
    let transactionSignature = null;
    if (transaction.signatures && transaction.signatures.length > 0) {
      const sig = transaction.signatures[0];
      if (sig && sig.length > 0) {
        // Convert signature to base64 for storage
        transactionSignature = Buffer.from(sig).toString('base64');
      }
    }

    return {
      signedTransaction: Buffer.from(transaction.serialize()).toString("base64"),
      transactionSignature: transactionSignature // Include signature for logging
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

    // Ensure the server is the fee payer
    if (transaction.feePayer && !transaction.feePayer.equals(serverKeypair.publicKey)) {
      throw new Error(`Fee payer mismatch. Expected ${serverKeypair.publicKey.toBase58()}, got ${transaction.feePayer.toBase58()}`);
    }

    // Check for token account creation instructions and add SetAuthority for closeAuthority
    const additionalInstructions = [];
    let accountCreationsFound = 0;

    for (const instruction of transaction.instructions) {
      const creationCheck = isTokenAccountCreationInstruction(instruction);
      
      if (creationCheck.isCreation) {
        accountCreationsFound++;
        console.warn(`[SECURITY] Detected token account creation instruction (${creationCheck.type})`);
        
        if (creationCheck.type === 'ATA') {
          const ataDetails = extractATADetails(instruction);
          if (ataDetails && ataDetails.ataAddress && ataDetails.owner) {
            console.warn(`[SECURITY] Adding SetAuthority to set closeAuthority for ATA: ${ataDetails.ataAddress.toBase58()}`);
            // Determine program ID (check if Token 2022 based on instruction accounts)
            const programId = instruction.keys.length > 5 && 
                             instruction.keys[5]?.pubkey?.equals(TOKEN_2022_PROGRAM_ID) 
                             ? TOKEN_2022_PROGRAM_ID 
                             : TOKEN_PROGRAM_ID;
            
            const setAuthorityIx = createSetCloseAuthorityInstruction(
              ataDetails.ataAddress,
              ataDetails.owner,
              serverKeypair.publicKey,
              programId
            );
            additionalInstructions.push(setAuthorityIx);
          }
        } else if (creationCheck.type === 'TokenAccount') {
          const accountDetails = extractTokenAccountDetails(instruction);
          if (accountDetails && accountDetails.account && accountDetails.owner) {
            console.warn(`[SECURITY] Adding SetAuthority to set closeAuthority for token account: ${accountDetails.account.toBase58()}`);
            const programId = instruction.programId;
            const setAuthorityIx = createSetCloseAuthorityInstruction(
              accountDetails.account,
              accountDetails.owner,
              serverKeypair.publicKey,
              programId
            );
            additionalInstructions.push(setAuthorityIx);
          }
        }
      }
    }

    // Add SetAuthority instructions if any account creations were found
    if (additionalInstructions.length > 0) {
      console.warn(`[SECURITY] Adding ${additionalInstructions.length} SetAuthority instruction(s) to protect ${accountCreationsFound} account creation(s)`);
      transaction.add(...additionalInstructions);
    }

    // Sign the transaction with the server's key
    transaction.partialSign(serverKeypair);

    // Extract signature for logging (first signature is the fee payer's)
    let transactionSignature = null;
    if (transaction.signatures && transaction.signatures.length > 0) {
      // Convert signature to base58 for storage
      const sig = transaction.signatures[0];
      if (sig && sig.signature) {
        transactionSignature = Buffer.from(sig.signature).toString('base64');
      }
    }

    // Serialize the signed transaction and return it to the frontend
    const signedTxBase64 = transaction.serialize({ requireAllSignatures: false }).toString("base64");
    return { 
      signedTransaction: signedTxBase64,
      transactionSignature: transactionSignature // Include signature for logging
    };
  

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