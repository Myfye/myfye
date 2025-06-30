import { SolanaAdapterConnector } from '@privy-io/react-auth/solana';
import { createPublicClient, http, parseAbiItem, getContract } from 'viem';
import { base } from 'viem/chains';
import { bridgeFromBaseToSolana } from './bridge';

// USDC contract address on BASE
const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// BASE RPC URL
const BASE_RPC_URL = 'https://mainnet.base.org';

// USDC ERC-20 ABI - we only need the balanceOf function
// This is the standard ERC-20 interface for checking token balances
const USDC_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;


export async function getUSDCBalanceOnBase(evmPublicKey: string, solanaPublicKey: string): Promise<number> {

    console.log('GETTING USDC BASE AMOUNT evmPublicKey', evmPublicKey);
    try {
      // Step 1: Create a public client for BASE network
      // This client can only read data from the blockchain (no transactions)
      const client = createPublicClient({
        chain: base, // Viem's built-in BASE chain configuration
        transport: http(BASE_RPC_URL), // HTTP transport to connect to BASE RPC
      });
  
      // Step 2: Create a contract instance for USDC
      // This gives us an interface to interact with the USDC smart contract
      const usdcContract = getContract({
        address: USDC_CONTRACT_ADDRESS as `0x${string}`, // Contract address
        abi: USDC_ABI, // Contract ABI (Application Binary Interface)
        client, // The client we created above
      });
  
      // Step 3: Call the balanceOf function on the USDC contract
      // This returns the balance for the specified wallet address
      const balance = await usdcContract.read.balanceOf([evmPublicKey as `0x${string}`]);
  
      // Step 4: Convert micro-USDC to actual USDC and round to 2 decimal places
      // USDC has 6 decimal places, so we divide by 1,000,000
      const usdcAmount = Number(balance) / 1000000;
      const roundedAmount = Math.round(usdcAmount * 100) / 100; // Round to 2 decimal places

      return usdcAmount;
    } catch (error) {
      // Step 5: Handle any errors that might occur
      console.error('Error checking USDC balance on BASE:', error);
      throw new Error(`Failed to check USDC balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**   
   * Helper function to convert USDC balance from micro-USDC to actual USDC
   * 
   * @param microUsdcBalance - Balance in micro-USDC (smallest unit)
   * @returns number - Balance in actual USDC
   * 
   * USDC has 6 decimal places, so we divide by 10^6
   */
  export function convertMicroUsdcToUsdc(microUsdcBalance: string): number {
    return Number(microUsdcBalance) / 1000000;
  }
  
  /**
   * Format USDC amount as currency string
   * 
   * @param usdcAmount - USDC amount as number
   * @returns string - Formatted currency string (e.g., "$3.59")
   */
  export function formatUSDCAsCurrency(usdcAmount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(usdcAmount);
  }
  
  /**
   * Complete example of how to use the balance checking function
   */
  export async function exampleUsage() {
    try {
      // Example wallet address (replace with actual address)
      const walletAddress = '0x1234567890123456789012345678901234567890';
      
      // Get the balance in USDC
      const usdcBalance = await getUSDCBalanceOnBase(walletAddress);
      console.log('Balance in USDC:', usdcBalance); // e.g., 3.59
      
      // Format as currency
      const formattedBalance = formatUSDCAsCurrency(usdcBalance);
      console.log('Formatted Balance:', formattedBalance); // e.g., "$3.59"
      
      return { usdcBalance, formattedBalance };
    } catch (error) {
      console.error('Example usage failed:', error);
      throw error;
    }
  }