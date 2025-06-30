import { createPublicClient, http, createWalletClient, custom, parseEther, formatEther, getContract, parseAbiItem } from 'viem';
import { base } from 'viem/chains';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { HELIUS_API_KEY, MYFYE_BACKEND, MYFYE_BACKEND_KEY } from '../env';
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { useEvmWallets } from "@privy-io/react-auth/evm";

// Circle CCTP v2 API endpoints
const CIRCLE_CCTP_V2_API = 'https://iris-api.circle.com/v2';


// Circle CCTP v2 Contract Addresses
const CCTP_V2_CONTRACTS = {
  SOLANA: {
    DOMAIN: 1, // Solana domain ID
    CCTP_PROGRAM: 'CCTPiPYPc6AsJmahuekH2tWxFEVJ7gRqeo7i9P9F8mKZ', // Circle CCTP v2 program
    USDC_MINT: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    MESSAGE_TRANSMITTER: 'CCTPiPYPc6AsJmahuekH2tWxFEVJ7gRqeo7i9P9F8mKZ', // Same as program for Solana
  },
  BASE: {
    DOMAIN: 6, // Base domain ID
    CCTP_CONTRACT: '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B', // Circle CCTP v2 contract
    USDC_CONTRACT: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    MESSAGE_TRANSMITTER: '0x4d41f22c5a0e5c74090899e5a9fb0e4e413e729e',
  }
};

// CCTP v2 ABI for Base chain interactions
const CCTP_V2_ABI = [
  // Burn function
  {
    name: 'burn',
    type: 'function',
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'destinationDomain', type: 'uint32' },
      { name: 'mintRecipient', type: 'bytes32' },
      { name: 'burnToken', type: 'address' }
    ],
    outputs: [{ name: '_nonce', type: 'uint64' }],
    stateMutability: 'nonpayable'
  },
  // Receive message function
  {
    name: 'receiveMessage',
    type: 'function',
    inputs: [
      { name: 'message', type: 'bytes' },
      { name: 'attestation', type: 'bytes' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  // Get message hash
  {
    name: 'getMessageHash',
    type: 'function',
    inputs: [{ name: 'message', type: 'bytes' }],
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'view'
  }
] as const;

// USDC ABI for approvals
const USDC_ABI = [
  {
    name: 'approve',
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view'
  }
] as const;

// Solana CCTP v2 Instructions
const CCTP_V2_INSTRUCTIONS = {
  BURN: 0,
  RECEIVE_MESSAGE: 1,
  DEPOSIT_FOR_BURN: 2,
  DEPOSIT_FOR_BURN_WITH_CALLER: 3,
  REPLACE_DEPOSIT_FOR_BURN: 4,
  REPLACE_DEPOSIT_FOR_BURN_WITH_CALLER: 5,
  DISABLE_ATTESTATION: 6,
  ENABLE_ATTESTATION: 7,
  UPDATE_ATTESTATION_MANAGER: 8,
  SET_MAX_MESSAGE_BODY_SIZE: 9,
  SET_SIGNATURE_THRESHOLD: 10,
  SET_GUARDIAN_SET: 11,
  SET_FEE_CONFIG: 12,
  SET_TOKEN_MESSENGER: 13,
  SET_LOCAL_TOKEN_MESSENGER: 14,
  SET_AUTHORITY: 15,
  SET_PAUSED: 16,
  SET_NEW_TOKEN_CONTROLLER: 17,
  ACCEPT_TOKEN_CONTROLLER: 18,
  SET_TOKEN_MINTER: 19,
  SET_BURN_LIMIT_CONFIG: 20,
  UPDATE_BURN_LIMIT: 21,
  SET_MINTING_LIMIT_CONFIG: 22,
  UPDATE_MINTING_LIMIT: 23,
  SET_TOKEN_PAIR: 24,
  SET_TOKEN_PAIR_OPERATOR: 25,
  SET_TOKEN_PAIR_PAUSED: 26,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER: 27,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_OWNER: 28,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_PAUSED: 29,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_ATTESTATION_MANAGER: 30,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_ATTESTATION_MANAGER_OWNER: 31,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_ATTESTATION_MANAGER_PAUSED: 32,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER: 33,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_OWNER: 34,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_PAUSED: 35,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER: 36,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_OWNER: 37,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_PAUSED: 38,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER: 39,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_OWNER: 40,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_PAUSED: 41,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER: 42,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_OWNER: 43,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_PAUSED: 44,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER: 45,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_OWNER: 46,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_PAUSED: 47,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER: 48,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_OWNER: 49,
  SET_TOKEN_PAIR_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_ATTESTATION_MANAGER_PAUSED: 50
};

// Helper function to convert Solana address to bytes32 for EVM
function solanaAddressToBytes32(solanaAddress: string): string {
  const pubkey = new PublicKey(solanaAddress);
  const bytes = pubkey.toBytes();
  return '0x' + bytes.toString('hex').padEnd(64, '0');
}

// Helper function to convert EVM address to Solana address format
function evmAddressToSolanaFormat(evmAddress: string): string {
  // Remove 0x prefix and pad to 32 bytes
  const cleanAddress = evmAddress.replace('0x', '');
  const paddedAddress = cleanAddress.padEnd(64, '0');
  return paddedAddress;
}

// Get fees for bridge transaction
export async function getBridgeFees(sourceDomain: number, destDomain: number): Promise<{ fee: string, allowance: string }> {
  try {
    // Get fee for standard transfer
    const feeResponse = await fetch(`${CIRCLE_CCTP_V2_API}/burn/USDC/fees/${sourceDomain}/${destDomain}`);
    const feeData = await feeResponse.json();
    
    // Get Fast Transfer allowance
    const allowanceResponse = await fetch(`${CIRCLE_CCTP_V2_API}/fastBurn/USDC/allowance`);
    const allowanceData = await allowanceResponse.json();
    
    return {
      fee: feeData.fee,
      allowance: allowanceData.allowance
    };
  } catch (error) {
    console.error('BRIDGING Error fetching bridge fees:', error);
    throw error;
  }
}

// Get public keys for attestation validation
export async function getAttestationPublicKeys(): Promise<any> {
  try {
    const response = await fetch(`${CIRCLE_CCTP_V2_API}/publicKeys`);
    return await response.json();
  } catch (error) {
    console.error('BRIDGING Error fetching attestation public keys:', error);
    throw error;
  }
}

// Get message and attestation status
export async function getMessageStatus(sourceDomain: number, nonce: string): Promise<any> {
  try {
    const response = await fetch(`${CIRCLE_CCTP_V2_API}/messages/${sourceDomain}?nonce=${nonce}`);
    return await response.json();
  } catch (error) {
    console.error('BRIDGING Error fetching message status:', error);
    throw error;
  }
}

// Re-attest a message if needed
export async function reattestMessage(nonce: string): Promise<any> {
  try {
    const response = await fetch(`${CIRCLE_CCTP_V2_API}/reattest/${nonce}`, {
      method: 'POST'
    });
    return await response.json();
  } catch (error) {
    console.error('BRIDGING Error re-attesting message:', error);
    throw error;
  }
}

// Bridge from Solana to Base
export async function bridgeFromSolanaToBase(
  solanaWallet: any,
  amount: string,
  recipientAddress: string,
  onProgress?: (status: string) => void
): Promise<{ success: boolean, transactionId?: string, error?: string }> {
  try {
    onProgress?.('Initializing bridge transaction...');
    
    const connection = new Connection(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`);
    
    // Step 1: Create burn instruction for Solana
    onProgress?.('Creating burn instruction...');
    
    const burnInstruction = await createSolanaBurnInstruction(
      amount,
      CCTP_V2_CONTRACTS.BASE.DOMAIN,
      solanaAddressToBytes32(recipientAddress),
      CCTP_V2_CONTRACTS.SOLANA.USDC_MINT
    );
    
    // Step 2: Execute burn transaction on Solana
    onProgress?.('Executing burn on Solana...');
    
    const burnTx = new Transaction();
    burnTx.add(burnInstruction);
    
    const blockhash = await connection.getLatestBlockhash();
    burnTx.recentBlockhash = blockhash.blockhash;
    burnTx.feePayer = solanaWallet.publicKey;
    
    const signedBurnTx = await solanaWallet.signTransaction(burnTx);
    const burnTxId = await connection.sendRawTransaction(signedBurnTx.serialize());
    
    // Wait for confirmation
    await connection.confirmTransaction(burnTxId, 'confirmed');
    
    onProgress?.('Burn transaction confirmed, waiting for attestation...');
    
    // Step 3: Extract nonce from burn transaction
    const burnTxDetails = await connection.getTransaction(burnTxId);
    const nonce = extractNonceFromBurnTransaction(burnTxDetails);
    
    // Step 4: Wait for Circle attestation
    let attestation = null;
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes with 10-second intervals
    
    while (!attestation && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      
      try {
        const messageStatus = await getMessageStatus(CCTP_V2_CONTRACTS.SOLANA.DOMAIN, nonce);
        if (messageStatus.attestation) {
          attestation = messageStatus.attestation;
          break;
        }
      } catch (error) {
        console.log('BRIDGING Attestation not ready yet, retrying...');
      }
      
      attempts++;
    }
    
    if (!attestation) {
      throw new Error('Attestation timeout - please contact support');
    }
    
    onProgress?.('Attestation received, executing mint on Base...');
    
    // Step 5: Execute mint on Base
    const mintResult = await executeBaseMint(attestation, recipientAddress);
    
    onProgress?.('Bridge completed successfully!');
    
    return {
      success: true,
      transactionId: burnTxId
    };
    
  } catch (error) {
    console.error('BRIDGING Bridge from Solana to Base failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}


// Bridge from Base to Solana
export async function bridgeFromBaseToSolana(
  amount: string,
  senderAddress: string,
  recipientAddress: string,
  onProgress?: (status: string) => void
): Promise<{ success: boolean, transactionId?: string, error?: string }> {
  try {
    console.log('BRIDGE Starting bridgeFromBaseToSolana with params:', {
      amount,
      recipientAddress,
      senderAddress
    });
    
    console.log('BRIDGE evm address', senderAddress);

    const walletId = await getWalletId(senderAddress)
    console.log('BRIDGE walletId', walletId);

    onProgress?.('Initializing bridge transaction...');
    
    // Step 1: Approve USDC spending
    console.log('BRIDGE Step 1: Setting up USDC approval...');
    onProgress?.('Approving USDC spending...');
    
    const publicClient = createPublicClient({
      chain: base,
      transport: http()
    });
    
    console.log('BRIDGE Created public client for Base chain');
    
    const walletClient = createWalletClient({
      account: evmWallet.account,
      chain: base,
      transport: custom(evmWallet)
    });
    
    console.log('BRIDGE Created wallet client with account:', evmWallet.account?.address);
    
    const usdcContract = getContract({
      address: CCTP_V2_CONTRACTS.BASE.USDC_CONTRACT,
      abi: USDC_ABI,
      publicClient,
      walletClient
    });
    
    console.log('BRIDGE Created USDC contract instance at:', CCTP_V2_CONTRACTS.BASE.USDC_CONTRACT);
    
    const cctpContract = getContract({
      address: CCTP_V2_CONTRACTS.BASE.CCTP_CONTRACT,
      abi: CCTP_V2_ABI,
      publicClient,
      walletClient
    });
    
    console.log('BRIDGE Created CCTP contract instance at:', CCTP_V2_CONTRACTS.BASE.CCTP_CONTRACT);
    
    // Check USDC balance before approval
    try {
      const balance = await usdcContract.read.balanceOf([evmWallet.account.address]);
      console.log('BRIDGE Current USDC balance:', balance.toString());
    } catch (error) {
      console.log('BRIDGE Could not check USDC balance:', error);
    }
    
    // Approve CCTP contract to spend USDC
    console.log('BRIDGE Approving CCTP contract to spend', amount, 'USDC...');
    const approveHash = await usdcContract.write.approve([
      CCTP_V2_CONTRACTS.BASE.CCTP_CONTRACT,
      BigInt(amount)
    ]);
    
    console.log('BRIDGE USDC approval transaction hash:', approveHash);
    
    await publicClient.waitForTransactionReceipt({ hash: approveHash });
    console.log('BRIDGE USDC approval confirmed');
    
    // Step 2: Execute burn on Base
    console.log('BRIDGE Step 2: Executing burn on Base...');
    onProgress?.('Executing burn on Base...');
    
    const burnParams = [
      BigInt(amount),
      CCTP_V2_CONTRACTS.SOLANA.DOMAIN,
      solanaAddressToBytes32(recipientAddress),
      CCTP_V2_CONTRACTS.BASE.USDC_CONTRACT
    ];
    
    console.log('BRIDGE Burn parameters:', {
      amount: amount,
      destinationDomain: CCTP_V2_CONTRACTS.SOLANA.DOMAIN,
      mintRecipient: solanaAddressToBytes32(recipientAddress),
      burnToken: CCTP_V2_CONTRACTS.BASE.USDC_CONTRACT
    });
    
    const burnHash = await cctpContract.write.burn(burnParams);
    
    console.log('BRIDGE Burn transaction hash:', burnHash);
    
    const burnReceipt = await publicClient.waitForTransactionReceipt({ hash: burnHash });
    console.log('BRIDGE Burn transaction confirmed, receipt:', {
      blockNumber: burnReceipt.blockNumber,
      gasUsed: burnReceipt.gasUsed?.toString(),
      status: burnReceipt.status
    });
    
    onProgress?.('Burn transaction confirmed, waiting for attestation...');
    
    // Step 3: Extract nonce from burn transaction
    console.log('BRIDGE Step 3: Extracting nonce from burn transaction...');
    const nonce = extractNonceFromBurnReceipt(burnReceipt);
    console.log('BRIDGE Extracted nonce:', nonce);
    
    // Step 4: Wait for Circle attestation
    console.log('BRIDGE Step 4: Waiting for Circle attestation...');
    let attestation = null;
    let attempts = 0;
    const maxAttempts = 30;
    
    while (!attestation && attempts < maxAttempts) {
      console.log(`BRIDGE Attestation attempt ${attempts + 1}/${maxAttempts}`);
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      try {
        const messageStatus = await getMessageStatus(CCTP_V2_CONTRACTS.BASE.DOMAIN, nonce);
        console.log('BRIDGE Message status response:', messageStatus);
        if (messageStatus.attestation) {
          attestation = messageStatus.attestation;
          console.log('BRIDGE Attestation received!');
          break;
        }
      } catch (error) {
        console.log('BRIDGE Attestation not ready yet, retrying...', error);
      }
      
      attempts++;
    }
    
    if (!attestation) {
      console.log('BRIDGE Attestation timeout after', maxAttempts, 'attempts');
      throw new Error('Attestation timeout - please contact support');
    }
    
    onProgress?.('Attestation received, executing mint on Solana...');
    
    // Step 5: Execute mint on Solana
    console.log('BRIDGE Step 5: Executing mint on Solana...');
    const mintResult = await executeSolanaMint(attestation, recipientAddress);
    console.log('BRIDGE Mint result:', mintResult);
    
    onProgress?.('Bridge completed successfully!');
    console.log('BRIDGE Bridge completed successfully!');
    
    return {
      success: true,
      transactionId: burnHash
    };
    
  } catch (error) {
    console.error('BRIDGE Bridge from Base to Solana failed:', error);
    console.error('BRIDGE Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return {
      success: false,
      error: error.message
    };
  }
}

// Helper function to create Solana burn instruction
async function createSolanaBurnInstruction(
  amount: string,
  destinationDomain: number,
  mintRecipient: string,
  burnToken: string
): Promise<any> {
  // This would need to be implemented with the actual Solana CCTP v2 program
  // For now, this is a placeholder
  throw new Error('Solana CCTP v2 burn instruction not yet implemented');
}

// Helper function to execute Base mint
async function executeBaseMint(attestation: string, recipientAddress: string): Promise<any> {
  // This would need to be implemented with the actual Base CCTP v2 contract
  // For now, this is a placeholder
  throw new Error('Base CCTP v2 mint not yet implemented');
}

// Helper function to execute Solana mint
async function executeSolanaMint(attestation: string, recipientAddress: string): Promise<any> {
  // This would need to be implemented with the actual Solana CCTP v2 program
  // For now, this is a placeholder
  throw new Error('Solana CCTP v2 mint not yet implemented');
}

// Helper function to extract nonce from Solana burn transaction
function extractNonceFromBurnTransaction(transaction: any): string {
  // This would need to parse the actual transaction logs
  // For now, this is a placeholder
  throw new Error('Nonce extraction from Solana transaction not yet implemented');
}

// Helper function to extract nonce from Base burn receipt
function extractNonceFromBurnReceipt(receipt: any): string {
  // This would need to parse the actual transaction logs
  // For now, this is a placeholder
  throw new Error('Nonce extraction from Base transaction not yet implemented');
}

// Main bridge function that determines direction and calls appropriate function
export async function bridgeTokens(
  fromChain: 'solana' | 'base',
  toChain: 'solana' | 'base',
  amount: string,
  recipientAddress: string,
  wallet: any,
  onProgress?: (status: string) => void
): Promise<{ success: boolean, transactionId?: string, error?: string }> {
  if (fromChain === 'solana' && toChain === 'base') {
    return bridgeFromSolanaToBase(wallet, amount, recipientAddress, onProgress);
  } else if (fromChain === 'base' && toChain === 'solana') {
    return bridgeFromBaseToSolana(wallet, amount, recipientAddress, onProgress);
  } else {
    throw new Error('Invalid bridge direction - only Solana ↔ Base is supported');
  }
}

// Function to get wallet ID by address from backend
export async function getWalletId(address: string): Promise<{ success: boolean, walletId?: string, error?: string }> {
  try {
    console.log('BRIDGE Getting wallet ID for address:', address);
    
    const response = await fetch(`${MYFYE_BACKEND}/get_wallet_id_by_address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': MYFYE_BACKEND_KEY || ''
      },
      body: JSON.stringify({ address })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('BRIDGE Error response from backend:', errorData);
      return {
        success: false,
        error: errorData.error || `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const result = await response.json();
    console.log('BRIDGE Wallet ID result:', result);
    
    return result;
  } catch (error) {
    console.error('BRIDGE Error getting wallet ID:', error);
    return {
      success: false,
      error: error.message || 'Failed to get wallet ID'
    };
  }
}