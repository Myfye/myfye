import axios from "axios";
import { encodeFunctionData, type Hex } from "viem";
import {
  CHAIN_IDS_TO_USDC_ADDRESSES,
  CHAIN_IDS_TO_TOKEN_MESSENGER,
  DESTINATION_DOMAINS,
  SupportedChainId,
} from "./chains";
import { BICONOMY_API_KEY, BICONOMY_ID } from '../../env.ts';

// Biconomy API configuration
const BICONOMY_API_URL = "https://api.biconomy.io/api/v2/meta-tx/native";

export interface BiconomyGaslessResponse {
  success: boolean;
  txHash?: string;
  error?: string;
}

export class BiconomyGaslessService {
  private static instance: BiconomyGaslessService;

  private constructor() {
    console.log("🔧 BICONOMY: Initializing service...", {
      hasApiKey: !!BICONOMY_API_KEY,
      hasApiId: !!BICONOMY_ID,
      apiKeyLength: BICONOMY_API_KEY?.length,
      apiIdLength: BICONOMY_ID?.length
    });
    
    if (!BICONOMY_API_KEY || !BICONOMY_ID) {
      console.warn("Biconomy API key or ID not found. Gasless transactions will not work.");
    } else {
      console.log("✅ BICONOMY: Service initialized successfully");
    }
  }

  public static getInstance(): BiconomyGaslessService {
    if (!BiconomyGaslessService.instance) {
      BiconomyGaslessService.instance = new BiconomyGaslessService();
    }
    return BiconomyGaslessService.instance;
  }

  /**
   * Execute a gasless USDC approval transaction
   */
  async executeGaslessApproval(
    userAddress: string,
    sourceChainId: SupportedChainId,
    embeddedWallet: any
  ): Promise<BiconomyGaslessResponse> {
    console.log("🔐 BICONOMY: Starting gasless USDC approval...", {
      userAddress,
      sourceChainId,
      usdcAddress: CHAIN_IDS_TO_USDC_ADDRESSES[sourceChainId],
      tokenMessenger: CHAIN_IDS_TO_TOKEN_MESSENGER[sourceChainId]
    });

    try {
      // Create approval transaction data
      const approvalData = encodeFunctionData({
        abi: [
          {
            type: "function",
            name: "approve",
            stateMutability: "nonpayable",
            inputs: [
              { name: "spender", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            outputs: [{ name: "", type: "bool" }],
          },
        ],
        functionName: "approve",
        args: [
          CHAIN_IDS_TO_TOKEN_MESSENGER[sourceChainId] as `0x${string}`,
          10000000000n, // 10B USDC allowance
        ],
      });

      // Get user signature
      const provider = await embeddedWallet.getEthereumProvider();
      const signature = await provider.request({
        method: "personal_sign",
        params: [
          `Approve USDC spending for cross-chain bridge\n\nChain: ${sourceChainId}\nAmount: 10,000,000,000 USDC\n\nClick sign to approve.`,
          userAddress
        ]
      });

      // Execute via Biconomy
      const response = await this.executeBiconomyTransaction({
        to: CHAIN_IDS_TO_USDC_ADDRESSES[sourceChainId] as string,
        data: approvalData,
        from: userAddress,
        chainId: sourceChainId,
        signature
      });

      return response;
    } catch (error) {
      console.error("❌ BICONOMY: Approval failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Execute a gasless USDC burn transaction
   */
  async executeGaslessBurn(
    userAddress: string,
    sourceChainId: SupportedChainId,
    destinationChainId: SupportedChainId,
    amount: bigint,
    destinationAddress: string,
    transferType: "fast" | "standard",
    embeddedWallet: any
  ): Promise<BiconomyGaslessResponse> {
    console.log("🔥 BICONOMY: Starting gasless USDC burn...", {
      userAddress,
      sourceChainId,
      destinationChainId,
      amount: amount.toString(),
      destinationAddress,
      transferType
    });

    try {
      const finalityThreshold = transferType === "fast" ? 1000 : 2000;
      const maxFee = amount - 1n;

      // Handle Solana destination addresses
      let mintRecipient: string;
      if (destinationChainId === SupportedChainId.SOLANA_DEVNET || 
          destinationChainId === SupportedChainId.SOLANA_MAINNET) {
        mintRecipient = `0x${destinationAddress.replace(/^0x/, "").padStart(64, "0")}`;
      } else {
        mintRecipient = `0x${destinationAddress.replace(/^0x/, "").padStart(64, "0")}`;
      }

      // Create burn transaction data
      const burnData = encodeFunctionData({
        abi: [
          {
            type: "function",
            name: "depositForBurn",
            stateMutability: "nonpayable",
            inputs: [
              { name: "amount", type: "uint256" },
              { name: "destinationDomain", type: "uint32" },
              { name: "mintRecipient", type: "bytes32" },
              { name: "burnToken", type: "address" },
              { name: "hookData", type: "bytes32" },
              { name: "maxFee", type: "uint256" },
              { name: "finalityThreshold", type: "uint32" }
            ],
            outputs: []
          }
        ],
        functionName: "depositForBurn",
        args: [
          amount,
          DESTINATION_DOMAINS[destinationChainId],
          mintRecipient as Hex,
          CHAIN_IDS_TO_USDC_ADDRESSES[sourceChainId] as `0x${string}`,
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          maxFee,
          finalityThreshold
        ]
      });

      // Get user signature
      const provider = await embeddedWallet.getEthereumProvider();
      const signature = await provider.request({
        method: "personal_sign",
        params: [
          `Burn USDC for cross-chain bridge\n\nFrom: ${sourceChainId}\nTo: ${destinationChainId}\nAmount: ${amount.toString()} USDC\nDestination: ${destinationAddress}\n\nClick sign to burn.`,
          userAddress
        ]
      });

      // Execute via Biconomy
      const response = await this.executeBiconomyTransaction({
        to: CHAIN_IDS_TO_TOKEN_MESSENGER[sourceChainId] as string,
        data: burnData,
        from: userAddress,
        chainId: sourceChainId,
        signature
      });

      return response;
    } catch (error) {
      console.error("❌ BICONOMY: Burn failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Execute transaction through Biconomy
   */
  private async executeBiconomyTransaction(request: {
    to: string;
    data: string;
    from: string;
    chainId: number;
    signature: string;
  }): Promise<BiconomyGaslessResponse> {
    if (!BICONOMY_API_KEY || !BICONOMY_ID) {
      throw new Error("Biconomy API key or ID not configured");
    }

    try {
      console.log("🚀 BICONOMY: Executing gasless transaction...", {
        to: request.to,
        from: request.from,
        chainId: request.chainId
      });

      // For the free plan, we need to use a different approach
      // Let's try using the meta-transaction endpoint with proper headers
      const response = await axios.post(
        BICONOMY_API_URL,
        {
          to: request.to,
          data: request.data,
          from: request.from,
          signature: request.signature,
          apiId: BICONOMY_ID,
          chainId: request.chainId
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": BICONOMY_API_KEY,
            "Accept": "application/json"
          },
          timeout: 30000 // 30 second timeout
        }
      );

      console.log("✅ BICONOMY: Gasless transaction successful:", response.data);
      return {
        success: true,
        txHash: response.data.txHash
      };
    } catch (error) {
      console.error("❌ BICONOMY: Gasless transaction failed:", error);
      
      // If it's a CORS error, we'll fall back to regular transaction
      if (error instanceof Error && error.message.includes('Network Error')) {
        console.log("🔄 BICONOMY: CORS error detected, falling back to regular transaction");
        return {
          success: false,
          error: "CORS error - Biconomy not available in browser"
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Check if Biconomy gasless service is available
   */
  isAvailable(): boolean {
    const available = !!(BICONOMY_API_KEY && BICONOMY_ID);
    console.log("🔧 BICONOMY: Checking availability...", {
      hasApiKey: !!BICONOMY_API_KEY,
      hasApiId: !!BICONOMY_ID,
      isAvailable: available
    });
    return available;
  }

  /**
   * Get supported chains
   */
  getSupportedChains(): number[] {
    return [
      84532, // Base Sepolia
      8453   // Base Mainnet
    ];
  }
}

// Export singleton instance
export const biconomyGaslessService = BiconomyGaslessService.getInstance(); 