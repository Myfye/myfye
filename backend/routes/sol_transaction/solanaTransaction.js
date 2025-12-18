const web3 = require('@solana/web3.js');
const Token = require('@solana/spl-token');
const buffer = require('buffer');
const bs58 = require('bs58').default;
const VersionedTransaction = web3.VersionedTransaction;
const Keypair = web3.Keypair;
const Transaction = web3.Transaction;
const PublicKey = web3.PublicKey;
const TransactionMessage = web3.TransactionMessage;
const Connection = web3.Connection;
const AddressLookupTableAccount = web3.AddressLookupTableAccount;
const Buffer = buffer.Buffer;

const SERVER_PRIVATE_KEY = process.env.SOL_PRIV_KEY;
const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const RPC = HELIUS_API_KEY 
  ? `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`
  : 'https://api.mainnet-beta.solana.com';
const connection = new Connection(RPC, 'confirmed');

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
  const instruction = Token.createSetAuthorityInstruction(
    accountPubkey,
    ownerPubkey, // Current authority (owner)
    Token.AuthorityType.CloseAccount,
    serverPubkey, // New authority - SERVER controls closing
    [], // No multi-signers needed
    programId
  );
  
  // Fix the owner account to be writable (required for SetAuthority)
  // The current authority must be writable because we're modifying the account's authority field
  // SetAuthority instruction structure:
  // - Key 0: Token account (writable, not signer)
  // - Key 1: Current authority/owner (writable, signer) - MUST be writable
  // Note: New authority (serverPubkey) is encoded in instruction data, not as a separate key
  const fixedKeys = instruction.keys.map((key, index) => {
    // The current authority (owner) must be writable
    // Check both by pubkey match and by index (should be index 1 for current authority)
    if (key.pubkey.equals(ownerPubkey) && key.isSigner) {
      if (!key.isWritable) {
        console.warn(`[SECURITY] Fixing SetAuthority instruction: making owner key at index ${index} writable`);
        return {
          ...key,
          isWritable: true
        };
      }
    }
    // Also ensure token account (index 0) is writable
    if (index === 0 && key.pubkey.equals(accountPubkey) && !key.isWritable) {
      console.warn(`[SECURITY] Fixing SetAuthority instruction: making token account at index 0 writable`);
      return {
        ...key,
        isWritable: true
      };
    }
    return key;
  });
  
  // Validate the instruction structure
  if (fixedKeys.length < 2) {
    throw new Error(`SetAuthority instruction must have at least 2 keys, got ${fixedKeys.length}`);
  }
  
  // Validate token account (index 0)
  if (!fixedKeys[0].pubkey.equals(accountPubkey)) {
    throw new Error(`SetAuthority instruction key 0 should be token account ${accountPubkey.toBase58()}, got ${fixedKeys[0].pubkey.toBase58()}`);
  }
  if (!fixedKeys[0].isWritable) {
    throw new Error(`SetAuthority instruction key 0 (token account) must be writable`);
  }
  
  // Validate owner/current authority (index 1)
  if (!fixedKeys[1].pubkey.equals(ownerPubkey)) {
    throw new Error(`SetAuthority instruction key 1 should be owner ${ownerPubkey.toBase58()}, got ${fixedKeys[1].pubkey.toBase58()}`);
  }
  if (!fixedKeys[1].isSigner) {
    throw new Error(`SetAuthority instruction key 1 (owner) must be a signer`);
  }
  if (!fixedKeys[1].isWritable) {
    throw new Error(`SetAuthority instruction key 1 (owner) must be writable`);
  }
  
  return {
    ...instruction,
    keys: fixedKeys
  };
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
 * Resolve address lookup tables for a v0 transaction message
 */
async function resolveAddressLookupTables(message) {
  if (!message.addressTableLookups || message.addressTableLookups.length === 0) {
    return [];
  }
  
  const lookupTableAddresses = message.addressTableLookups.map(
    lookup => lookup.accountKey
  );
  
  const addressLookupTableAccountInfos = await connection.getMultipleAccountsInfo(
    lookupTableAddresses.map(key => new PublicKey(key))
  );
  
  return addressLookupTableAccountInfos.reduce((acc, accountInfo, index) => {
    const addressLookupTableAddress = lookupTableAddresses[index];
    if (accountInfo) {
      const addressLookupTableAccount = new AddressLookupTableAccount({
        key: new PublicKey(addressLookupTableAddress),
        state: AddressLookupTableAccount.deserialize(accountInfo.data),
      });
      acc.push(addressLookupTableAccount);
    }
    return acc;
  }, []);
}

/**
 * Check if a compiled instruction is a close account instruction
 */
function isCloseAccountInstruction(compiledInstruction, message) {
  const programIdIndex = compiledInstruction.programIdIndex;
  
  // Check if program ID index is valid
  if (programIdIndex >= message.staticAccountKeys.length) {
    return false;
  }
  
  const programId = message.staticAccountKeys[programIdIndex];
  
  // CloseAccount instructions come from Token Program or Token 2022 Program
  if (!programId.equals(TOKEN_PROGRAM_ID) && !programId.equals(TOKEN_2022_PROGRAM_ID)) {
    return false;
  }
  
  // CloseAccount instruction type is 9
  if (compiledInstruction.data && compiledInstruction.data.length > 0) {
    const instructionType = compiledInstruction.data[0];
    return instructionType === 9; // CloseAccount
  }
  
  return false;
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
    let transaction = VersionedTransaction.deserialize(new Uint8Array(transactionBuffer));

    // Ensure the server is the fee payer
    if (!transaction.message.staticAccountKeys || transaction.message.staticAccountKeys.length === 0) {
      throw new Error("No staticAccountKeys found in transaction message.");
    }

    if (!transaction.message.staticAccountKeys[0].equals(serverKeypair.publicKey)) {
      throw new Error(`Fee payer mismatch. Expected ${serverKeypair.publicKey.toBase58()}, got ${transaction.message.staticAccountKeys[0].toBase58()}`);
    }

    // Centralized transaction modifications for security:
    // 1. Modify cleanup instruction to return rent to server (always check)
    // 2. Modify setup instructions (payer) if needed
    // 3. Add SetAuthority instructions to set server as close authority (if account creation detected)
    const message = transaction.message;
    const isV0 = message.addressTableLookups && message.addressTableLookups.length > 0;
    const creationCheck = checkVersionedTransactionAccountCreation(transaction, serverKeypair.publicKey);
    
    // Resolve address lookup tables if v0 (needed for decompilation)
    let addressLookupTableAccounts = [];
    if (isV0) {
      addressLookupTableAccounts = await resolveAddressLookupTables(message);
    }
    
    // Decompile message to check for modifications needed
    let decompiledMessage;
    let needsModification = false;
    
    try {
      if (isV0) {
        decompiledMessage = TransactionMessage.decompile(message, {
          addressLookupTableAccounts: addressLookupTableAccounts
        });
      } else {
        decompiledMessage = TransactionMessage.decompile(message);
      }
      
      // Check if there's a cleanup instruction that needs modification
      const hasCleanupInstruction = decompiledMessage.instructions.some((instruction) => {
        return (instruction.programId.equals(TOKEN_PROGRAM_ID) || instruction.programId.equals(TOKEN_2022_PROGRAM_ID)) &&
               instruction.data && instruction.data.length > 0 && instruction.data[0] === 9;
      });
      
      // Check if we need to modify setup instructions (ATA creation with wrong payer)
      const hasATACreation = decompiledMessage.instructions.some((instruction) => {
        return instruction.programId.equals(ASSOCIATED_TOKEN_PROGRAM_ID) &&
               instruction.keys.length > 0 &&
               !instruction.keys[0].pubkey.equals(serverKeypair.publicKey);
      });
      
      needsModification = creationCheck.accountCreations.length > 0 || hasCleanupInstruction || hasATACreation;
      
    } catch (decompileError) {
      // If we can't decompile, we can't modify - this is okay, just sign as-is
      console.warn(`[SECURITY] Could not decompile transaction: ${decompileError.message}. Signing as-is.`);
    }
    
    if (needsModification && decompiledMessage) {
      if (creationCheck.accountCreations.length > 0 && creationCheck.serverKeyIndex === -1) {
        throw new Error(`Transaction creates ${creationCheck.accountCreations.length} token account(s) but server wallet is not in transaction. Cannot set closeAuthority. Transaction rejected.`);
      }
      
      console.warn(`[SECURITY] Modifying transaction for security: ${creationCheck.accountCreations.length} account creation(s), cleanup modification, and setup verification.`);
      
      // Get instructions from decompiled message
      let instructions = decompiledMessage.instructions || [];
      
      // 1. Modify cleanup instruction to return rent to server wallet
      instructions = instructions.map((instruction) => {
        // Check if this is a closeAccount instruction (cleanup)
        if ((instruction.programId.equals(TOKEN_PROGRAM_ID) || instruction.programId.equals(TOKEN_2022_PROGRAM_ID)) &&
            instruction.data && instruction.data.length > 0 && instruction.data[0] === 9) {
          // CloseAccount instruction structure:
          // Account 0: Token account to close (writable)
          // Account 1: Destination account (where rent goes) - THIS IS WHAT WE CHANGE
          // Account 2: Owner account (writable, signer)
          if (instruction.keys.length >= 2) {
            // Only modify if destination is not already server
            if (!instruction.keys[1].pubkey.equals(serverKeypair.publicKey)) {
              console.warn(`[SECURITY] Modifying cleanup instruction to return rent to server wallet`);
              const modifiedKeys = instruction.keys.map((key, index) => {
                if (index === 1) {
                  // Change destination to server wallet
                  return {
                    ...key,
                    pubkey: serverKeypair.publicKey,
                    isSigner: false,
                    isWritable: true
                  };
                }
                return key;
              });
              
              return {
                ...instruction,
                keys: modifiedKeys
              };
            }
          }
        }
        return instruction;
      });
      
      // 2. Modify setup instructions (ATA creation) to ensure server is payer
      // AND add SetAuthority instructions IMMEDIATELY after each ATA creation
      // This ensures the account exists and hasn't been modified before SetAuthority runs
      const newInstructions = [];
      const setAuthorityMap = new Map(); // Map ATA address to SetAuthority instruction
      
      // First, prepare all SetAuthority instructions
      for (const creation of creationCheck.accountCreations) {
        if (creation.type === 'ATA' && creation.details) {
          const { ataAddress, owner, programId } = creation.details;
          
          // Check if owner is in the decompiled message's account keys
          const ownerInDecompiled = decompiledMessage.instructions.some(ix => 
            ix.keys.some(key => key.pubkey.equals(owner) && key.isSigner)
          );
          
          if (!ownerInDecompiled) {
            const ownerInStatic = message.staticAccountKeys.find(k => k.equals(owner));
            if (!ownerInStatic) {
              console.error(`[SECURITY] Owner ${owner.toBase58()} not found as signer in transaction. Skipping SetAuthority for ATA ${ataAddress.toBase58()}.`);
              continue;
            }
          }
          
          // CRITICAL: Detect the actual token program from the ATA creation instruction
          // The ATA creation instruction has the token program as one of its keys
          // We need to find the ATA creation instruction and check which token program it uses
          let actualTokenProgramId = programId; // Default to what we detected
          
          // Find the ATA creation instruction to determine the actual token program
          // Match by ATA address to ensure we're looking at the right instruction
          for (const ix of decompiledMessage.instructions) {
            if (ix.programId.equals(ASSOCIATED_TOKEN_PROGRAM_ID) && 
                ix.keys.length >= 2 && 
                ix.keys[1].pubkey.equals(ataAddress)) {
              // ATA creation instruction structure:
              // Key 0: Payer
              // Key 1: ATA address (matches our ataAddress)
              // Key 2: Owner
              // Key 3: Mint
              // Key 4: System Program
              // Key 5: Token Program (optional, present for Token-2022)
              console.warn(`[SECURITY] Found matching ATA creation instruction for ${ataAddress.toBase58()}`);
              console.warn(`[SECURITY] ATA instruction has ${ix.keys.length} keys`);
              if (ix.keys.length >= 6) {
                console.warn(`[SECURITY] Key 5 (Token Program): ${ix.keys[5].pubkey.toBase58()}`);
                if (ix.keys[5].pubkey.equals(TOKEN_2022_PROGRAM_ID)) {
                  actualTokenProgramId = TOKEN_2022_PROGRAM_ID;
                  console.warn(`[SECURITY] ✓ Detected Token-2022 program from ATA creation instruction`);
                } else {
                  actualTokenProgramId = TOKEN_PROGRAM_ID;
                  console.warn(`[SECURITY] ✓ Detected standard Token program from ATA creation instruction`);
                }
              } else {
                // If less than 6 keys, it's standard Token program (Token-2022 always has 6 keys)
                actualTokenProgramId = TOKEN_PROGRAM_ID;
                console.warn(`[SECURITY] ✓ ATA instruction has ${ix.keys.length} keys, defaulting to standard Token program`);
              }
              break;
            }
          }
          
          if (!actualTokenProgramId) {
            console.error(`[SECURITY] ERROR: Could not determine token program for ATA ${ataAddress.toBase58()}, defaulting to standard Token`);
            actualTokenProgramId = TOKEN_PROGRAM_ID;
          }
          
          // IMPORTANT: We cannot set close authority during ATA creation (not supported by ATA program)
          // The ATA program always sets close authority to the owner initially
          // We must use SetAuthority immediately after creation to change it to the server
          console.warn(`[SECURITY] ========== PREPARING SETAUTHORITY INSTRUCTION ==========`);
          console.warn(`[SECURITY] ATA Address: ${ataAddress.toBase58()}`);
          console.warn(`[SECURITY] Owner (current authority): ${owner.toBase58()}`);
          console.warn(`[SECURITY] Server (new authority): ${serverKeypair.publicKey.toBase58()}`);
          console.warn(`[SECURITY] Detected Program ID: ${programId.toBase58()}`);
          console.warn(`[SECURITY] Actual Token Program ID (from ATA instruction): ${actualTokenProgramId.toBase58()}`);
          console.warn(`[SECURITY] Using ${actualTokenProgramId.equals(TOKEN_2022_PROGRAM_ID) ? 'Token-2022' : 'standard Token'} program for SetAuthority`);
          console.warn(`[SECURITY] ATA will be created with owner as close authority, then SetAuthority will change it to server`);
          
          const setAuthorityIx = createSetCloseAuthorityInstruction(
            ataAddress,
            owner,
            serverKeypair.publicKey,
            actualTokenProgramId  // Use the actual token program detected from ATA creation
          );
          
          console.warn(`[SECURITY] SetAuthority instruction created. Details:`);
          console.warn(`[SECURITY]   Program ID: ${setAuthorityIx.programId.toBase58()}`);
          console.warn(`[SECURITY]   Number of keys: ${setAuthorityIx.keys.length}`);
          console.warn(`[SECURITY]   Instruction data length: ${setAuthorityIx.data ? setAuthorityIx.data.length : 0}`);
          if (setAuthorityIx.data && setAuthorityIx.data.length > 0) {
            console.warn(`[SECURITY]   Instruction data (first 10 bytes): ${Buffer.from(setAuthorityIx.data.slice(0, 10)).toString('hex')}`);
          }
          
          // Validate the instruction before adding
          console.warn(`[SECURITY] Validating SetAuthority instruction structure...`);
          if (setAuthorityIx.keys.length < 2) {
            console.error(`[SECURITY] ERROR: SetAuthority instruction has insufficient keys (${setAuthorityIx.keys.length}), expected at least 2`);
            continue;
          }
          
          console.warn(`[SECURITY] Key 0 (Token Account):`);
          console.warn(`[SECURITY]   Pubkey: ${setAuthorityIx.keys[0].pubkey.toBase58()}`);
          console.warn(`[SECURITY]   Expected: ${ataAddress.toBase58()}`);
          console.warn(`[SECURITY]   Match: ${setAuthorityIx.keys[0].pubkey.equals(ataAddress)}`);
          console.warn(`[SECURITY]   isSigner: ${setAuthorityIx.keys[0].isSigner}`);
          console.warn(`[SECURITY]   isWritable: ${setAuthorityIx.keys[0].isWritable}`);
          
          if (!setAuthorityIx.keys[0].pubkey.equals(ataAddress)) {
            console.error(`[SECURITY] ERROR: SetAuthority instruction token account mismatch`);
            console.error(`[SECURITY]   Expected: ${ataAddress.toBase58()}`);
            console.error(`[SECURITY]   Got: ${setAuthorityIx.keys[0].pubkey.toBase58()}`);
            continue;
          }
          
          if (!setAuthorityIx.keys[0].isWritable) {
            console.error(`[SECURITY] ERROR: SetAuthority instruction token account must be writable`);
            continue;
          }
          
          console.warn(`[SECURITY] Key 1 (Owner/Current Authority):`);
          console.warn(`[SECURITY]   Pubkey: ${setAuthorityIx.keys[1].pubkey.toBase58()}`);
          console.warn(`[SECURITY]   Expected: ${owner.toBase58()}`);
          console.warn(`[SECURITY]   Match: ${setAuthorityIx.keys[1].pubkey.equals(owner)}`);
          console.warn(`[SECURITY]   isSigner: ${setAuthorityIx.keys[1].isSigner}`);
          console.warn(`[SECURITY]   isWritable: ${setAuthorityIx.keys[1].isWritable}`);
          
          if (!setAuthorityIx.keys[1].pubkey.equals(owner)) {
            console.error(`[SECURITY] ERROR: SetAuthority instruction owner mismatch`);
            console.error(`[SECURITY]   Expected: ${owner.toBase58()}`);
            console.error(`[SECURITY]   Got: ${setAuthorityIx.keys[1].pubkey.toBase58()}`);
            continue;
          }
          
          if (!setAuthorityIx.keys[1].isSigner) {
            console.error(`[SECURITY] ERROR: SetAuthority instruction owner must be a signer`);
            continue;
          }
          
          if (!setAuthorityIx.keys[1].isWritable) {
            console.error(`[SECURITY] ERROR: SetAuthority instruction owner must be writable`);
            continue;
          }
          
          console.warn(`[SECURITY] SetAuthority instruction validated successfully!`);
          console.warn(`[SECURITY] ========== END SETAUTHORITY PREPARATION ==========`);
          
          setAuthorityMap.set(ataAddress.toBase58(), setAuthorityIx);
        } else if (creation.type === 'TokenAccount' && creation.details) {
          const { account, owner, programId } = creation.details;
          
          const ownerInDecompiled = decompiledMessage.instructions.some(ix => 
            ix.keys.some(key => key.pubkey.equals(owner) && key.isSigner)
          );
          
          if (!ownerInDecompiled) {
            const ownerInStatic = message.staticAccountKeys.find(k => k.equals(owner));
            if (!ownerInStatic) {
              console.error(`[SECURITY] Owner ${owner.toBase58()} not found as signer in transaction. Skipping SetAuthority for token account ${account.toBase58()}.`);
              continue;
            }
          }
          
          console.warn(`[SECURITY] Preparing SetAuthority to set closeAuthority for token account ${account.toBase58()}, owner ${owner.toBase58()} must sign`);
          const setAuthorityIx = createSetCloseAuthorityInstruction(
            account,
            owner,
            serverKeypair.publicKey,
            programId
          );
          
          console.warn(`[SECURITY] SetAuthority instruction keys:`, setAuthorityIx.keys.map((k, i) => ({
            index: i,
            pubkey: k.pubkey.toBase58(),
            isSigner: k.isSigner,
            isWritable: k.isWritable
          })));
          
          setAuthorityMap.set(account.toBase58(), setAuthorityIx);
        }
      }
      
      // Now rebuild instructions, inserting SetAuthority immediately after ATA creation
      // IMPORTANT: We cannot set close authority during ATA creation (not supported by ATA program)
      // So we must use SetAuthority immediately after creation
      for (let i = 0; i < instructions.length; i++) {
        const instruction = instructions[i];
        newInstructions.push(instruction);
        
        // Check if this is an ATA creation instruction
        if (instruction.programId.equals(ASSOCIATED_TOKEN_PROGRAM_ID)) {
          // ATA creation instruction structure:
          // Key 0: Payer (should be server)
          // Key 1: ATA address (the account being created)
          // Key 2: Owner (user)
          // Key 3: Mint
          // Key 4: System Program
          // Key 5: Token Program (optional, for Token-2022)
          
          // ATA creation: first account should be payer (server)
          if (instruction.keys.length > 0 && !instruction.keys[0].pubkey.equals(serverKeypair.publicKey)) {
            console.warn(`[SECURITY] Fixing ATA creation instruction: setting server as payer`);
            const modifiedKeys = instruction.keys.map((key, index) => {
              if (index === 0) {
                return {
                  ...key,
                  pubkey: serverKeypair.publicKey,
                  isSigner: true,
                  isWritable: true
                };
              }
              return key;
            });
            
            // Replace the instruction with the modified one
            newInstructions[newInstructions.length - 1] = {
              ...instruction,
              keys: modifiedKeys
            };
          }
          
          // Find the ATA address from the instruction (it's the second account, index 1)
          // NOTE: The ATA program always sets close authority to the owner during creation
          // We cannot change this - we must use SetAuthority immediately after creation
          console.warn(`[SECURITY] ========== PROCESSING ATA CREATION INSTRUCTION ==========`);
          console.warn(`[SECURITY] ATA creation instruction has ${instruction.keys.length} keys`);
          instruction.keys.forEach((key, idx) => {
            console.warn(`[SECURITY]   Key ${idx}: ${key.pubkey.toBase58()}, isSigner: ${key.isSigner}, isWritable: ${key.isWritable}`);
          });
          
          if (instruction.keys.length >= 2) {
            const ataAddress = instruction.keys[1].pubkey;
            const ataAddressStr = ataAddress.toBase58();
            console.warn(`[SECURITY] ATA address from instruction: ${ataAddressStr}`);
            
            const setAuthorityIx = setAuthorityMap.get(ataAddressStr);
            if (setAuthorityIx) {
              console.warn(`[SECURITY] Found SetAuthority instruction for ATA ${ataAddressStr}`);
              // Verify the SetAuthority instruction matches the ATA address
              if (!setAuthorityIx.keys[0].pubkey.equals(ataAddress)) {
                console.error(`[SECURITY] ERROR: SetAuthority instruction token account (${setAuthorityIx.keys[0].pubkey.toBase58()}) doesn't match ATA address (${ataAddressStr})`);
              } else {
                console.warn(`[SECURITY] Inserting SetAuthority immediately after ATA creation for ${ataAddressStr}`);
                console.warn(`[SECURITY] Instruction order: ATA creation (index ${newInstructions.length - 1}) -> SetAuthority (index ${newInstructions.length})`);
                console.warn(`[SECURITY] ATA will be created with owner as close authority, then SetAuthority will change it to server`);
                console.warn(`[SECURITY] SetAuthority will execute right after ATA creation completes, ensuring account exists`);
                newInstructions.push(setAuthorityIx);
                setAuthorityMap.delete(ataAddressStr); // Remove so we don't add it again
                console.warn(`[SECURITY] SetAuthority instruction inserted successfully`);
              }
            } else {
              console.warn(`[SECURITY] WARNING: No SetAuthority instruction found for ATA ${ataAddressStr} - this ATA will have owner as close authority (INSECURE)`);
            }
          } else {
            console.error(`[SECURITY] ERROR: ATA creation instruction has insufficient keys (${instruction.keys.length}), expected at least 2`);
          }
          console.warn(`[SECURITY] ========== END ATA CREATION PROCESSING ==========`);
        }
        // Check if this is a token account creation (InitializeAccount)
        else if ((instruction.programId.equals(TOKEN_PROGRAM_ID) || instruction.programId.equals(TOKEN_2022_PROGRAM_ID)) &&
                 instruction.data && instruction.data.length > 0 && 
                 (instruction.data[0] === 1 || instruction.data[0] === 16 || instruction.data[0] === 18)) {
          // Token account creation - find the account address (first key)
          if (instruction.keys.length > 0) {
            const accountAddress = instruction.keys[0].pubkey.toBase58();
            const setAuthorityIx = setAuthorityMap.get(accountAddress);
            if (setAuthorityIx) {
              console.warn(`[SECURITY] Inserting SetAuthority immediately after token account creation for ${accountAddress}`);
              newInstructions.push(setAuthorityIx);
              setAuthorityMap.delete(accountAddress);
            }
          }
        }
      }
      
      // Use the new instruction array
      instructions = newInstructions;
      
      // Rebuild the transaction with all modifications
      const payerKey = decompiledMessage.payerKey || message.staticAccountKeys[0];
      const recentBlockhash = decompiledMessage.recentBlockhash || message.recentBlockhash;
      
      if (!recentBlockhash) {
        throw new Error("Cannot rebuild transaction: missing recent blockhash");
      }
      
      let newMessage;
      if (isV0 && addressLookupTableAccounts.length > 0) {
        newMessage = new TransactionMessage({
          payerKey: payerKey,
          recentBlockhash: recentBlockhash,
          instructions: instructions,
        }).compileToV0Message(addressLookupTableAccounts);
      } else {
        newMessage = new TransactionMessage({
          payerKey: payerKey,
          recentBlockhash: recentBlockhash,
          instructions: instructions,
        }).compileToLegacyMessage();
      }
      
      // Validate that all required signers are in the transaction
      // The TransactionMessage constructor should handle this automatically, but let's verify
      const requiredSigners = new Set();
      let setAuthorityCount = 0;
      instructions.forEach((ix, ixIndex) => {
        // Check if this is a SetAuthority instruction (Token program with SetAuthority instruction type)
        const isSetAuthority = (ix.programId.equals(TOKEN_PROGRAM_ID) || ix.programId.equals(TOKEN_2022_PROGRAM_ID)) &&
                               ix.data && ix.data.length > 0 && ix.data[0] === 6; // SetAuthority instruction type is 6
        if (isSetAuthority) {
          setAuthorityCount++;
        }
        
        ix.keys.forEach((key, keyIndex) => {
          if (key.isSigner) {
            requiredSigners.add(key.pubkey.toBase58());
            // Log SetAuthority instruction details for debugging
            if (isSetAuthority) {
              console.warn(`[SECURITY] SetAuthority instruction ${ixIndex}, key ${keyIndex}: ${key.pubkey.toBase58()}, isSigner: ${key.isSigner}, isWritable: ${key.isWritable}`);
            }
          }
        });
      });
      
      // Check if all required signers are in staticAccountKeys
      const missingSigners = Array.from(requiredSigners).filter(signer => 
        !newMessage.staticAccountKeys.some(k => k.toBase58() === signer)
      );
      
      if (missingSigners.length > 0 && isV0) {
        // In v0 transactions, signers might be in lookup tables, which is okay
        console.warn(`[SECURITY] Some required signers are not in staticAccountKeys (may be in lookup tables):`, missingSigners);
      } else if (missingSigners.length > 0) {
        console.error(`[SECURITY] ERROR: Required signers missing from transaction:`, missingSigners);
      }
      
      console.warn(`[SECURITY] Rebuilt transaction with ${setAuthorityCount} SetAuthority instruction(s) and security modifications`);
      console.warn(`[SECURITY] Required signers:`, Array.from(requiredSigners));
      console.warn(`[SECURITY] Transaction staticAccountKeys (${newMessage.staticAccountKeys.length}):`, newMessage.staticAccountKeys.map(k => k.toBase58()));
      console.warn(`[SECURITY] Transaction header - numRequiredSignatures: ${newMessage.header.numRequiredSignatures}, numReadonlySignedAccounts: ${newMessage.header.numReadonlySignedAccounts}, numReadonlyUnsignedAccounts: ${newMessage.header.numReadonlyUnsignedAccounts}`);
      
      // Log all instructions for debugging
      console.warn(`[SECURITY] ========== FINAL TRANSACTION INSTRUCTIONS ==========`);
      console.warn(`[SECURITY] Total instructions: ${instructions.length}`);
      instructions.forEach((ix, idx) => {
        const isSetAuthority = (ix.programId.equals(TOKEN_PROGRAM_ID) || ix.programId.equals(TOKEN_2022_PROGRAM_ID)) &&
                               ix.data && ix.data.length > 0 && ix.data[0] === 6; // SetAuthority instruction type is 6
        const isATACreation = ix.programId.equals(ASSOCIATED_TOKEN_PROGRAM_ID);
        const isCloseAccount = (ix.programId.equals(TOKEN_PROGRAM_ID) || ix.programId.equals(TOKEN_2022_PROGRAM_ID)) &&
                              ix.data && ix.data.length > 0 && ix.data[0] === 9; // CloseAccount instruction type is 9
        
        if (isSetAuthority || isATACreation || isCloseAccount) {
          console.warn(`[SECURITY] Instruction ${idx}:`);
          console.warn(`[SECURITY]   Type: ${isSetAuthority ? 'SetAuthority' : isATACreation ? 'ATA Creation' : isCloseAccount ? 'CloseAccount' : 'Other'}`);
          console.warn(`[SECURITY]   Program ID: ${ix.programId.toBase58()}`);
          console.warn(`[SECURITY]   Number of keys: ${ix.keys.length}`);
          console.warn(`[SECURITY]   Keys:`);
          ix.keys.forEach((k, i) => {
            console.warn(`[SECURITY]     Key ${i}: ${k.pubkey.toBase58()}, isSigner: ${k.isSigner}, isWritable: ${k.isWritable}`);
          });
          if (ix.data && ix.data.length > 0) {
            console.warn(`[SECURITY]   Data length: ${ix.data.length}`);
            console.warn(`[SECURITY]   Data (first 20 bytes): ${Buffer.from(ix.data.slice(0, Math.min(20, ix.data.length))).toString('hex')}`);
            if (isSetAuthority) {
              console.warn(`[SECURITY]   Instruction type byte: ${ix.data[0]} (should be 6 for SetAuthority)`);
            }
          }
        }
      });
      console.warn(`[SECURITY] ========== END FINAL TRANSACTION INSTRUCTIONS ==========`);
      
      transaction = new VersionedTransaction(newMessage);
    }

    // Server signs transaction (partial signing)
    transaction.sign([serverKeypair]);

    // Extract signature for logging
    let transactionSignature = null;
    if (transaction.signatures && transaction.signatures.length > 0) {
      const sig = transaction.signatures[0];
      if (sig && sig.length > 0) {
        transactionSignature = Buffer.from(sig).toString('base64');
      }
    }

    return {
      signedTransaction: Buffer.from(transaction.serialize()).toString("base64"),
      transactionSignature: transactionSignature
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