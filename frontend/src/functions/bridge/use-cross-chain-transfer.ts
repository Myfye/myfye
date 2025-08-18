"use client";

import { useState } from "react";
import {
  createWalletClient,
  http,
  encodeFunctionData,
  HttpTransport,
  type Chain,
  type Account,
  type WalletClient,
  type Hex,
  TransactionExecutionError,
  parseUnits,
  createPublicClient,
  formatUnits,
  parseEther,
} from "viem";
import { privateKeyToAccount, nonceManager } from "viem/accounts";
import axios from "axios";
import {
  sepolia,
  avalancheFuji,
  baseSepolia,
  sonicBlazeTestnet,
  lineaSepolia,
  arbitrumSepolia,
  worldchainSepolia,
  optimismSepolia,
  unichainSepolia,
  polygonAmoy,
} from "viem/chains";
import { defineChain } from "viem";
// Solana imports
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from "@solana/spl-token";
import bs58 from "bs58";
import { toHex, toBytes } from "viem";
// Import BN at top level like Circle's examples
import { BN } from "@coral-xyz/anchor";
import {
  SupportedChainId,
  CHAIN_IDS_TO_USDC_ADDRESSES,
  CHAIN_IDS_TO_TOKEN_MESSENGER,
  CHAIN_IDS_TO_MESSAGE_TRANSMITTER,
  DESTINATION_DOMAINS,
  CHAIN_TO_CHAIN_NAME,
  SOLANA_RPC_ENDPOINT,
  IRIS_API_URL,
} from "./chains";
import { SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { BICONOMY_API_KEY, BICONOMY_ID } from '../../env.ts';
import { biconomyGaslessService } from "./biconomy-gasless";

// Custom Codex chain definition with Thirdweb RPC

const codexTestnet = defineChain({
  id: 812242,
  name: "Codex Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Codex",
    symbol: "CDX",
  },
  rpcUrls: {
    default: {
      http: ["https://812242.rpc.thirdweb.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Codex Explorer",
      url: "https://explorer.codex-stg.xyz/",
    },
  },
  testnet: true,
});

export type TransferStep =
  | "idle"
  | "approving"
  | "burning"
  | "waiting-attestation"
  | "minting"
  | "completed"
  | "error";

const chains = {
  [SupportedChainId.ETH_SEPOLIA]: sepolia,
  [SupportedChainId.AVAX_FUJI]: avalancheFuji,
  [SupportedChainId.BASE_SEPOLIA]: baseSepolia,
  [SupportedChainId.SONIC_BLAZE]: sonicBlazeTestnet,
  [SupportedChainId.LINEA_SEPOLIA]: lineaSepolia,
  [SupportedChainId.ARBITRUM_SEPOLIA]: arbitrumSepolia,
  [SupportedChainId.WORLDCHAIN_SEPOLIA]: worldchainSepolia,
  [SupportedChainId.OPTIMISM_SEPOLIA]: optimismSepolia,
  [SupportedChainId.CODEX_TESTNET]: codexTestnet,
  [SupportedChainId.UNICHAIN_SEPOLIA]: unichainSepolia,
  [SupportedChainId.POLYGON_AMOY]: polygonAmoy,
};

// Solana RPC endpoint imported from chains.ts

// Utility function to check if a chain is Solana
const isSolanaChain = (chainId: number): boolean => {
  return chainId === SupportedChainId.SOLANA_DEVNET || chainId === SupportedChainId.SOLANA_MAINNET;
};

// Function to get private key for a specific chain
const getPrivateKeyForChain = (chainId: SupportedChainId): string => {
  // Check if it's a Solana chain
  if (isSolanaChain(chainId)) {
    // For Solana chains, we need a Solana private key
    const solanaPrivateKey = process.env.NEXT_PUBLIC_SOLANA_PRIVATE_KEY || process.env.VITE_REACT_APP_SOLANA_PRIVATE_KEY;
    if (!solanaPrivateKey) {
      throw new Error(`Solana private key not found for chain ${chainId}. Please set NEXT_PUBLIC_SOLANA_PRIVATE_KEY or VITE_REACT_APP_SOLANA_PRIVATE_KEY environment variable.`);
    }
    return solanaPrivateKey;
  }
  
  // For EVM chains, use EVM private key
  const privateKey = process.env.NEXT_PUBLIC_EVM_PRIVATE_KEY || process.env.VITE_REACT_APP_EVM_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error(`EVM private key not found for chain ${chainId}. Please set NEXT_PUBLIC_EVM_PRIVATE_KEY or VITE_REACT_APP_EVM_PRIVATE_KEY environment variable.`);
  }
  return privateKey;
};

export function useCrossChainTransfer(embeddedWallet?: any, walletClient?: WalletClient) {
  const [currentStep, setCurrentStep] = useState<TransferStep>("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Only log when wallet data is available
  if (embeddedWallet && walletClient) {
    console.log("BRIDGING embeddedWallet", embeddedWallet);
    console.log("BRIDGING walletClient", walletClient);
  }
  
  const DEFAULT_DECIMALS = 6;

  const addLog = (message: string) =>
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${message}`,
    ]);

  // Utility function to create Solana keypair from private key
  const getSolanaKeypair = (privateKey: string): Keypair => {
    try {
      // Try to decode as base58 first (standard Solana format)
      const privateKeyBytes = bs58.decode(privateKey);
      if (privateKeyBytes.length === 64) {
        // This is a 64-byte secret key (32 bytes seed + 32 bytes public key)
        return Keypair.fromSecretKey(privateKeyBytes);
      } else if (privateKeyBytes.length === 32) {
        // This is a 32-byte seed
        return Keypair.fromSeed(privateKeyBytes);
      }
    } catch (error) {
      // If base58 decode fails, try hex format (fallback)
      const cleanPrivateKey = privateKey.replace(/^0x/, "");
      if (cleanPrivateKey.length === 64) {
        // Convert hex to Uint8Array (32 bytes for ed25519 seed)
        const privateKeyBytes = new Uint8Array(32);
        for (let i = 0; i < 32; i++) {
          privateKeyBytes[i] = parseInt(cleanPrivateKey.substr(i * 2, 2), 16);
        }
        return Keypair.fromSeed(privateKeyBytes);
      }
    }

    throw new Error(
      "Invalid Solana private key format. Expected base58 encoded key or 32-byte hex string.",
    );
  };


  // Solana connection
  const getSolanaConnection = (): Connection => {
    return new Connection(SOLANA_RPC_ENDPOINT, "confirmed");
  };

  const getPublicClient = (chainId: SupportedChainId) => {
    if (isSolanaChain(chainId)) {
      return getSolanaConnection();
    }
    return createPublicClient({
      chain: chains[chainId as keyof typeof chains],
      transport: http(),
    });
  };

  const getClients = (chainId: SupportedChainId) => {
    const privateKey = getPrivateKeyForChain(chainId);

    if (isSolanaChain(chainId)) {
      return getSolanaKeypair(privateKey);
    }
    const account = privateKeyToAccount(`0x${privateKey.replace(/^0x/, "")}`, {
      nonceManager,
    });
    return createWalletClient({
      chain: chains[chainId as keyof typeof chains],
      transport: http(),
      account,
    });
  };

  const getBalance = async (chainId: SupportedChainId, walletAddress: String) => {
    if (isSolanaChain(chainId)) {
      return getSolanaBalance(chainId);
    }
    return getEVMBalance(chainId, walletAddress);
  };

  const getSolanaBalance = async (chainId: SupportedChainId) => {
    const connection = getSolanaConnection();
    const privateKey = getPrivateKeyForChain(chainId);
    const keypair = getSolanaKeypair(privateKey);
    const usdcMint = new PublicKey(
      CHAIN_IDS_TO_USDC_ADDRESSES[chainId] as string,
    );

    try {
      const associatedTokenAddress = await getAssociatedTokenAddress(
        usdcMint,
        keypair.publicKey,
      );

      const tokenAccount = await getAccount(connection, associatedTokenAddress);
      const balance =
        Number(tokenAccount.amount) / Math.pow(10, DEFAULT_DECIMALS);
      return balance.toString();
    } catch (error) {
      if (
        error instanceof TokenAccountNotFoundError ||
        error instanceof TokenInvalidAccountOwnerError
      ) {
        return "0";
      }
      throw error;
    }
  };

  const getEVMBalance = async (chainId: SupportedChainId, walletAddress: String ) => {
    const publicClient = createPublicClient({
      chain: chains[chainId as keyof typeof chains],
      transport: http(),
    });
    const privateKey = getPrivateKeyForChain(chainId);
    const account = privateKeyToAccount(`0x${privateKey.replace(/^0x/, "")}`, {
      nonceManager,
    });
    console.log("BRIDGING Fetching getEVMBalance for:", walletAddress);

    const balance = await publicClient.readContract({
      address: CHAIN_IDS_TO_USDC_ADDRESSES[chainId] as `0x${string}`,
      abi: [
        {
          constant: true,
          inputs: [{ name: "_owner", type: "address" }],
          name: "balanceOf",
          outputs: [{ name: "balance", type: "uint256" }],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
      ],
      functionName: "balanceOf",
      args: [walletAddress as `0x${string}`],
    });
    console.log("BRIDGING Balance getevm fetched:", balance);

    const formattedBalance = formatUnits(balance, DEFAULT_DECIMALS);
    return formattedBalance;
  };

  // EVM functions (existing)
  const approveUSDC = async (
    embeddedWallet: any, // Use embedded wallet directly
    sourceChainId: number,
  ) => {
    console.log("🔐 BRIDGE: Starting USDC approval...", {
      sourceChainId,
      usdcAddress: CHAIN_IDS_TO_USDC_ADDRESSES[sourceChainId],
      tokenMessenger: CHAIN_IDS_TO_TOKEN_MESSENGER[sourceChainId]
    });
    
    setCurrentStep("approving");
    addLog("Approving USDC transfer...");

    try {
      // Check if Biconomy gasless service is available for this chain
      const isGaslessAvailable = biconomyGaslessService.isAvailable() && 
        biconomyGaslessService.getSupportedChains().includes(sourceChainId);

      if (isGaslessAvailable) {
        console.log("🔐 BICONOMY: Using gasless approval for Base chain");
        addLog("Using gasless approval (no gas fees required)...");
        
        const gaslessResult = await biconomyGaslessService.executeGaslessApproval(
          embeddedWallet.address,
          sourceChainId as SupportedChainId,
          embeddedWallet
        );

        if (gaslessResult.success) {
          console.log("✅ BICONOMY: Gasless approval successful:", gaslessResult.txHash);
          addLog(`Gasless USDC Approval Tx: ${gaslessResult.txHash}`);
          return gaslessResult.txHash;
        } else {
          console.error("❌ BICONOMY: Gasless approval failed:", gaslessResult.error);
          throw new Error(gaslessResult.error || "Gasless approval failed");
        }
      } else {
        console.log("🔐 BRIDGE: Using regular approval (gas fees required)");
        addLog("Using regular approval (gas fees required)...");
        
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
            10000000000n,
          ],
        });
        
        console.log("🔐 BRIDGE: Approval transaction data:", {
          to: CHAIN_IDS_TO_USDC_ADDRESSES[sourceChainId],
          data: approvalData,
          spender: CHAIN_IDS_TO_TOKEN_MESSENGER[sourceChainId],
          amount: "10000000000"
        });

        const provider = await embeddedWallet.getEthereumProvider();
        const txHash = await provider.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: embeddedWallet.address,
              to: CHAIN_IDS_TO_USDC_ADDRESSES[sourceChainId],
              data: approvalData,
              value: "0x0"
            }
          ]
        });

        console.log("🔐 BRIDGE: Approval transaction sent:", txHash);
        addLog(`USDC Approval Tx: ${txHash}`);
        return txHash;
      }
    } catch (err) {
      console.error("❌ BRIDGE: Approval failed:", err);
      setError("Approval failed");
      throw err;
    }
  };

  // Solana approve function (Note: SPL tokens don't require explicit approval like ERC20)
  const approveSolanaUSDC = async (keypair: Keypair, sourceChainId: number) => {
    setCurrentStep("approving");
    // For SPL tokens, we don't need explicit approval like ERC20
    // The burn transaction will handle the token transfer authorization
    return "solana-approve-placeholder";
  };

  const burnUSDC = async (
    embeddedWallet: any, // Privy embedded wallet
    sourceChainId: number,
    amount: bigint,
    destinationChainId: number,
    destinationAddress: string,
    transferType: "fast" | "standard"
  ) => {
    // Check if embedded wallet is available
    if (!embeddedWallet) {
      console.error("❌ BRIDGE: Embedded wallet not available for burn");
      throw new Error("Embedded wallet not available");
    }

    console.log("🔥 BRIDGE: Starting USDC burn...", {
      sourceChainId,
      destinationChainId,
      amount: amount.toString(),
      destinationAddress,
      transferType
    });
    
    setCurrentStep("burning");
    addLog("Burning USDC...");
  
    try {
      // Check if Biconomy gasless service is available for this chain
      const isGaslessAvailable = biconomyGaslessService.isAvailable() && 
        biconomyGaslessService.getSupportedChains().includes(sourceChainId);

      if (isGaslessAvailable) {
        console.log("🔥 BICONOMY: Using gasless burn for Base chain");
        addLog("Using gasless burn (no gas fees required)...");
        
        const gaslessResult = await biconomyGaslessService.executeGaslessBurn(
          embeddedWallet.address,
          sourceChainId as SupportedChainId,
          destinationChainId as SupportedChainId,
          amount,
          destinationAddress,
          transferType,
          embeddedWallet
        );

        if (gaslessResult.success) {
          console.log("✅ BICONOMY: Gasless burn successful:", gaslessResult.txHash);
          addLog(`Gasless Burn Tx: ${gaslessResult.txHash}`);
          return gaslessResult.txHash;
        } else {
          console.error("❌ BICONOMY: Gasless burn failed:", gaslessResult.error);
          throw new Error(gaslessResult.error || "Gasless burn failed");
        }
      } else {
        console.log("🔥 BRIDGE: Using regular burn (gas fees required)");
        addLog("Using regular burn (gas fees required)...");
        
        const finalityThreshold = transferType === "fast" ? 1000 : 2000;
        const maxFee = amount - 1n;
        
        console.log("🔥 BRIDGE: Burn parameters:", {
          finalityThreshold,
          maxFee: maxFee.toString(),
          amount: amount.toString()
        });
    
        let mintRecipient: string;
        if (isSolanaChain(destinationChainId)) {
          console.log("🔥 BRIDGE: Processing Solana destination...");
          const usdcMint = new PublicKey(CHAIN_IDS_TO_USDC_ADDRESSES[SupportedChainId.SOLANA_DEVNET]!);
          const destinationWallet = new PublicKey(destinationAddress);
          const tokenAccount = await getAssociatedTokenAddress(usdcMint, destinationWallet);
          mintRecipient = toHex(bs58.decode(tokenAccount.toBase58()));
          console.log("🔥 BRIDGE: Solana mint recipient:", {
            tokenAccount: tokenAccount.toBase58(),
            mintRecipient
          });
        } else {
          console.log("🔥 BRIDGE: Processing EVM destination...");
          mintRecipient = `0x${destinationAddress.replace(/^0x/, "").padStart(64, "0")}`;
          console.log("🔥 BRIDGE: EVM mint recipient:", mintRecipient);
        }
    
        const data = encodeFunctionData({
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
        
        console.log("🔥 BRIDGE: Burn transaction data:", {
          to: CHAIN_IDS_TO_TOKEN_MESSENGER[sourceChainId],
          data: data,
          destinationDomain: DESTINATION_DOMAINS[destinationChainId],
          burnToken: CHAIN_IDS_TO_USDC_ADDRESSES[sourceChainId]
        });
    
        const provider = await embeddedWallet.getEthereumProvider();
        console.log("🔥 BRIDGE: Got Ethereum provider from embedded wallet");
        
        const txHash = await provider.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: embeddedWallet.address,
              to: CHAIN_IDS_TO_TOKEN_MESSENGER[sourceChainId],
              data,
              value: "0x0"
            }
          ]
        });
    
        console.log("🔥 BRIDGE: Burn transaction sent:", txHash);
        addLog(`Burn Tx: ${txHash}`);
        return txHash;
      }
    } catch (err) {
      console.error("❌ BRIDGE: Burn failed:", err);
      setError("Burn failed");
      throw err;
    }
  };
  
  

  // const burnUSDC = async (
  //   client: WalletClient<HttpTransport, Chain, Account>,
  //   sourceChainId: number,
  //   amount: bigint,
  //   destinationChainId: number,
  //   destinationAddress: string,
  //   transferType: "fast" | "standard",
  // ) => {
  //   setCurrentStep("burning");
  //   addLog("Burning USDC...");

  //   try {
  //     const finalityThreshold = transferType === "fast" ? 1000 : 2000;
  //     const maxFee = amount - 1n;

  //     // Handle Solana destination addresses differently
  //     let mintRecipient: string;
  //     if (isSolanaChain(destinationChainId)) {
  //       // For Solana destinations, use the Solana token account as mintRecipient
  //       // Get the associated token account for the destination wallet
  //       const usdcMint = new PublicKey(
  //         CHAIN_IDS_TO_USDC_ADDRESSES[SupportedChainId.SOLANA_DEVNET] as string,
  //       );
  //       const destinationWallet = new PublicKey(destinationAddress);
  //       const tokenAccount = await getAssociatedTokenAddress(
  //         usdcMint,
  //         destinationWallet,
  //       );
  //       mintRecipient = hexlify(bs58.decode(tokenAccount.toBase58()));
  //     } else {
  //       // For EVM destinations, pad the hex address
  //       mintRecipient = `0x${destinationAddress
  //         .replace(/^0x/, "")
  //         .padStart(64, "0")}`;
  //     }

  //     const tx = await client.sendTransaction({
  //       to: CHAIN_IDS_TO_TOKEN_MESSENGER[sourceChainId] as `0x${string}`,
  //       data: encodeFunctionData({
  //         abi: [
  //           {
  //             type: "function",
  //             name: "depositForBurn",
  //             stateMutability: "nonpayable",
  //             inputs: [
  //               { name: "amount", type: "uint256" },
  //               { name: "destinationDomain", type: "uint32" },
  //               { name: "mintRecipient", type: "bytes32" },
  //               { name: "burnToken", type: "address" },
  //               { name: "hookData", type: "bytes32" },
  //               { name: "maxFee", type: "uint256" },
  //               { name: "finalityThreshold", type: "uint32" },
  //             ],
  //             outputs: [],
  //           },
  //         ],
  //         functionName: "depositForBurn",
  //         args: [
  //           amount,
  //           DESTINATION_DOMAINS[destinationChainId],
  //           mintRecipient as Hex,
  //           CHAIN_IDS_TO_USDC_ADDRESSES[sourceChainId] as `0x${string}`,
  //           "0x0000000000000000000000000000000000000000000000000000000000000000",
  //           maxFee,
  //           finalityThreshold,
  //         ],
  //       }),
  //     });

  //     addLog(`Burn Tx: ${tx}`);
  //     return tx;
  //   } catch (err) {
  //     setError("Burn failed");
  //     throw err;
  //   }
  // };

  // Solana burn function
  const burnSolanaUSDC = async (
    keypair: Keypair,
    sourceChainId: number,
    amount: bigint,
    destinationChainId: number,
    destinationAddress: string,
    transferType: "fast" | "standard",
  ) => {
    console.log("🔥 BRIDGE: Starting Solana USDC burn...", {
      sourceChainId,
      destinationChainId,
      amount: amount.toString(),
      destinationAddress,
      transferType,
      keypairPublicKey: keypair.publicKey.toBase58()
    });
    
    setCurrentStep("burning");
    addLog("Burning Solana USDC...");

    try {
      const {
        getAnchorConnection,
        getPrograms,
        getDepositForBurnPdas,
        evmAddressToBytes32,
        findProgramAddress,
      } = await import("./solana-utils");
      const {
        getAssociatedTokenAddress,
        createAssociatedTokenAccountInstruction,
        getAccount,
      } = await import("@solana/spl-token");

      console.log("🔥 BRIDGE: Setting up Solana connection and programs...");
      const connection = getSolanaConnection();
      const provider = getAnchorConnection(keypair, SOLANA_RPC_ENDPOINT);
      const { messageTransmitterProgram, tokenMessengerMinterProgram } =
        getPrograms(provider);
      console.log("🔥 BRIDGE: Solana programs loaded");

      const usdcMint = new PublicKey(
        CHAIN_IDS_TO_USDC_ADDRESSES[SupportedChainId.SOLANA_DEVNET] as string,
      );
      console.log("🔥 BRIDGE: USDC mint address:", usdcMint.toBase58());

      const pdas = getDepositForBurnPdas(
        { messageTransmitterProgram, tokenMessengerMinterProgram },
        usdcMint,
        DESTINATION_DOMAINS[destinationChainId],
      );
      console.log("🔥 BRIDGE: PDAs generated for deposit for burn");

      // Generate event account keypair
      const messageSentEventAccountKeypair = Keypair.generate();
      console.log("🔥 BRIDGE: Generated event account keypair:", messageSentEventAccountKeypair.publicKey.toBase58());

      // Get user's token account
      const userTokenAccount = await getAssociatedTokenAddress(
        usdcMint,
        keypair.publicKey,
      );
      console.log("🔥 BRIDGE: User token account:", userTokenAccount.toBase58());

      // Convert destination address based on chain type
      let mintRecipient: PublicKey;

      if (isSolanaChain(destinationChainId)) {
        console.log("🔥 BRIDGE: Processing Solana destination...");
        // For Solana destinations, use the Solana public key directly
        mintRecipient = new PublicKey(destinationAddress);
      } else {
        console.log("🔥 BRIDGE: Processing EVM destination...");
        // For EVM chains, ensure address is properly formatted
        const cleanAddress = destinationAddress
          .replace(/^0x/, "")
          .toLowerCase();
        if (cleanAddress.length !== 40) {
          throw new Error(
            `Invalid EVM address length: ${cleanAddress.length}, expected 40`,
          );
        }
        const formattedAddress = `0x${cleanAddress}`;
        // Convert address to bytes32 format then to PublicKey
        const bytes32Address = evmAddressToBytes32(formattedAddress);
        mintRecipient = new PublicKey(toBytes(bytes32Address));
      }
      console.log("🔥 BRIDGE: Mint recipient:", mintRecipient.toBase58());

      // Get the EVM address that will call receiveMessage
      const evmAccount = privateKeyToAccount(
        `0x${process.env.NEXT_PUBLIC_EVM_PRIVATE_KEY}`,
      );
      const evmAddress = evmAccount.address;
      const destinationCaller = new PublicKey(
        toBytes(evmAddressToBytes32(evmAddress)),
      );
      console.log("🔥 BRIDGE: Destination caller:", {
        evmAddress,
        destinationCaller: destinationCaller.toBase58()
      });

      console.log("🔥 BRIDGE: Calling depositForBurn...");
      // Call depositForBurn using Circle's exact approach
      const depositForBurnTx = await (
        tokenMessengerMinterProgram as any
      ).methods
        .depositForBurn({
          amount: new BN(amount.toString()),
          destinationDomain: DESTINATION_DOMAINS[destinationChainId],
          mintRecipient,
          maxFee: new BN((amount - 1n).toString()),
          minFinalityThreshold: transferType === "fast" ? 1000 : 2000,
          destinationCaller,
        })
        .accounts({
          owner: keypair.publicKey,
          eventRentPayer: keypair.publicKey,
          senderAuthorityPda: pdas.authorityPda.publicKey,
          burnTokenAccount: userTokenAccount,
          messageTransmitter: pdas.messageTransmitterAccount.publicKey,
          tokenMessenger: pdas.tokenMessengerAccount.publicKey,
          remoteTokenMessenger: pdas.remoteTokenMessengerKey.publicKey,
          tokenMinter: pdas.tokenMinterAccount.publicKey,
          localToken: pdas.localToken.publicKey,
          burnTokenMint: usdcMint,
          messageSentEventData: messageSentEventAccountKeypair.publicKey,
          messageTransmitterProgram: messageTransmitterProgram.programId,
          tokenMessengerMinterProgram: tokenMessengerMinterProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([messageSentEventAccountKeypair])
        .rpc();

      console.log("✅ BRIDGE: Solana burn transaction completed:", depositForBurnTx);
      addLog(`Solana burn transaction: ${depositForBurnTx}`);
      return depositForBurnTx;
    } catch (err) {
      console.error("❌ BRIDGE: Solana burn failed:", err);
      setError("Solana burn failed");
      addLog(
        `Solana burn error: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
      throw err;
    }
  };

  const retrieveAttestation = async (
    transactionHash: string,
    sourceChainId: number,
  ) => {
    console.log("⏳ BRIDGE: Starting attestation retrieval...", {
      transactionHash,
      sourceChainId,
      destinationDomain: DESTINATION_DOMAINS[sourceChainId]
    });
    
    setCurrentStep("waiting-attestation");
    addLog("Retrieving attestation...");

    const url = `${IRIS_API_URL}/v2/messages/${DESTINATION_DOMAINS[sourceChainId]}?transactionHash=${transactionHash}`;
    console.log("⏳ BRIDGE: Attestation URL:", url);
    addLog(`Attestation URL: ${url}`);

    let attempts = 0;
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    
    while (attempts < maxAttempts) {
      attempts++;
      console.log(`⏳ BRIDGE: Attestation attempt ${attempts}/${maxAttempts}...`);
      
      try {
        const response = await axios.get(url);
        console.log("⏳ BRIDGE: Attestation response:", {
          status: response.status,
          messageCount: response.data?.messages?.length,
          firstMessageStatus: response.data?.messages?.[0]?.status
        });
        
        if (response.data?.messages?.[0]?.status === "complete") {
          console.log("✅ BRIDGE: Attestation retrieved successfully!");
          addLog("Attestation retrieved!");
          return response.data.messages[0];
        }
        
        console.log("⏳ BRIDGE: Waiting for attestation completion...");
        addLog("Waiting for attestation...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          console.log("⏳ BRIDGE: Attestation not found yet, retrying...");
          await new Promise((resolve) => setTimeout(resolve, 5000));
          continue;
        }
        console.error("❌ BRIDGE: Attestation retrieval failed:", error);
        setError("Attestation retrieval failed");
        addLog(
          `Attestation error: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        throw error;
      }
    }
    
    console.error("❌ BRIDGE: Attestation timeout after", maxAttempts, "attempts");
    throw new Error("Attestation timeout");
  };

  const mintUSDC = async (
    client: WalletClient<HttpTransport, Chain, Account>,
    destinationChainId: number,
    attestation: any,
  ) => {
    console.log("🪙 BRIDGE: Starting USDC mint...", {
      destinationChainId,
      messageTransmitter: CHAIN_IDS_TO_MESSAGE_TRANSMITTER[destinationChainId],
      messageLength: attestation.message?.length,
      attestationLength: attestation.attestation?.length
    });
    
    const MAX_RETRIES = 3;
    let retries = 0;
    setCurrentStep("minting");
    addLog("Minting USDC...");

    while (retries < MAX_RETRIES) {
      try {
        console.log(`🪙 BRIDGE: Mint attempt ${retries + 1}/${MAX_RETRIES}...`);
        
        const publicClient = createPublicClient({
          chain: chains[destinationChainId as keyof typeof chains],
          transport: http(),
        });
        const feeData = await publicClient.estimateFeesPerGas();
        console.log("🪙 BRIDGE: Fee data:", {
          maxFeePerGas: feeData.maxFeePerGas?.toString(),
          maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString()
        });
        
        const contractConfig = {
          address: CHAIN_IDS_TO_MESSAGE_TRANSMITTER[
            destinationChainId
          ] as `0x${string}`,
          abi: [
            {
              type: "function",
              name: "receiveMessage",
              stateMutability: "nonpayable",
              inputs: [
                { name: "message", type: "bytes" },
                { name: "attestation", type: "bytes" },
              ],
              outputs: [],
            },
          ] as const,
        };

        console.log("🪙 BRIDGE: Estimating gas for mint transaction...");
        // Estimate gas with buffer
        const gasEstimate = await publicClient.estimateContractGas({
          ...contractConfig,
          functionName: "receiveMessage",
          args: [attestation.message, attestation.attestation],
          account: client.account,
        });

        // Add 20% buffer to gas estimate
        const gasWithBuffer = (gasEstimate * 120n) / 100n;
        console.log("🪙 BRIDGE: Gas estimation:", {
          originalEstimate: gasEstimate.toString(),
          withBuffer: gasWithBuffer.toString(),
          gasInGwei: formatUnits(gasWithBuffer, 9)
        });
        addLog(`Gas Used: ${formatUnits(gasWithBuffer, 9)} Gwei`);

        const mintData = encodeFunctionData({
          ...contractConfig,
          functionName: "receiveMessage",
          args: [attestation.message, attestation.attestation],
        });
        
        console.log("🪙 BRIDGE: Mint transaction data:", {
          to: contractConfig.address,
          data: mintData,
          gas: gasWithBuffer.toString()
        });

        const tx = await client.sendTransaction({
          to: contractConfig.address,
          data: mintData,
          gas: gasWithBuffer,
          maxFeePerGas: feeData.maxFeePerGas,
          maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        });

        console.log("✅ BRIDGE: Mint transaction sent:", tx);
        addLog(`Mint Tx: ${tx}`);
        setCurrentStep("completed");
        break;
      } catch (err) {
        console.error(`❌ BRIDGE: Mint attempt ${retries + 1} failed:`, err);
        if (err instanceof TransactionExecutionError && retries < MAX_RETRIES) {
          retries++;
          addLog(`Retry ${retries}/${MAX_RETRIES}...`);
          await new Promise((resolve) => setTimeout(resolve, 2000 * retries));
          continue;
        }
        throw err;
      }
    }
  };

  // Solana mint function
  const mintSolanaUSDC = async (
    keypair: Keypair,
    destinationChainId: number,
    attestation: any,
  ) => {
    console.log("🪙 BRIDGE: Starting Solana USDC mint...", {
      destinationChainId,
      keypairPublicKey: keypair.publicKey.toBase58(),
      messageLength: attestation.message?.length,
      attestationLength: attestation.attestation?.length
    });
    
    setCurrentStep("minting");
    addLog("Minting Solana USDC...");

    try {
      const {
        getAnchorConnection,
        getPrograms,
        getReceiveMessagePdas,
        decodeNonceFromMessage,
        evmAddressToBytes32,
      } = await import("./solana-utils");
      const {
        getAssociatedTokenAddress,
        createAssociatedTokenAccountInstruction,
        getAccount,
      } = await import("@solana/spl-token");

      console.log("🪙 BRIDGE: Setting up Solana connection and programs...");
      const provider = getAnchorConnection(keypair, SOLANA_RPC_ENDPOINT);
      const { messageTransmitterProgram, tokenMessengerMinterProgram } =
        getPrograms(provider);
      const connection = getSolanaConnection();
      console.log("🪙 BRIDGE: Solana programs loaded");

      const usdcMint = new PublicKey(
        CHAIN_IDS_TO_USDC_ADDRESSES[SupportedChainId.SOLANA_DEVNET] as string,
      );
      const messageHex = attestation.message;
      const attestationHex = attestation.attestation;
      console.log("🪙 BRIDGE: USDC mint address:", usdcMint.toBase58());

      // Extract the nonce and source domain from the message
      const nonce = decodeNonceFromMessage(messageHex);
      const messageBuffer = Buffer.from(messageHex.replace("0x", ""), "hex");
      const sourceDomain = messageBuffer.readUInt32BE(4);
      console.log("🪙 BRIDGE: Message analysis:", {
        nonce: nonce.toString(),
        sourceDomain,
        messageLength: messageHex.length
      });

      // For EVM to Solana, we need to determine the remote token address
      // This would typically be the USDC address on the source chain
      let remoteTokenAddressHex = "";
      // Find the source chain USDC address
      for (const [chainId, usdcAddress] of Object.entries(
        CHAIN_IDS_TO_USDC_ADDRESSES,
      )) {
        if (
          DESTINATION_DOMAINS[parseInt(chainId)] === sourceDomain &&
          !isSolanaChain(parseInt(chainId))
        ) {
          remoteTokenAddressHex = evmAddressToBytes32(usdcAddress as string);
          console.log("🪙 BRIDGE: Found remote token address:", {
            chainId,
            usdcAddress,
            remoteTokenAddressHex
          });
          break;
        }
      }

      console.log("🪙 BRIDGE: Getting PDAs for receive message...");
      // Get PDAs for receive message
      const pdas = await getReceiveMessagePdas(
        { messageTransmitterProgram, tokenMessengerMinterProgram },
        usdcMint,
        remoteTokenAddressHex,
        sourceDomain.toString(),
        nonce,
      );
      console.log("🪙 BRIDGE: PDAs generated for receive message");

      // Get user's token account
      const userTokenAccount = await getAssociatedTokenAddress(
        usdcMint,
        keypair.publicKey,
      );
      console.log("🪙 BRIDGE: User token account:", userTokenAccount.toBase58());

      // Build account metas array for remaining accounts
      const accountMetas = [
        {
          isSigner: false,
          isWritable: false,
          pubkey: pdas.tokenMessengerAccount.publicKey,
        },
        {
          isSigner: false,
          isWritable: false,
          pubkey: pdas.remoteTokenMessengerKey.publicKey,
        },
        {
          isSigner: false,
          isWritable: true,
          pubkey: pdas.tokenMinterAccount.publicKey,
        },
        {
          isSigner: false,
          isWritable: true,
          pubkey: pdas.localToken.publicKey,
        },
        {
          isSigner: false,
          isWritable: false,
          pubkey: pdas.tokenPair.publicKey,
        },
        {
          isSigner: false,
          isWritable: true,
          pubkey: pdas.feeRecipientTokenAccount,
        },
        { isSigner: false, isWritable: true, pubkey: userTokenAccount },
        {
          isSigner: false,
          isWritable: true,
          pubkey: pdas.custodyTokenAccount.publicKey,
        },
        { isSigner: false, isWritable: false, pubkey: TOKEN_PROGRAM_ID },
        {
          isSigner: false,
          isWritable: false,
          pubkey: pdas.tokenMessengerEventAuthority.publicKey,
        },
        {
          isSigner: false,
          isWritable: false,
          pubkey: tokenMessengerMinterProgram.programId,
        },
      ];
      console.log("🪙 BRIDGE: Built account metas array with", accountMetas.length, "accounts");

      console.log("🪙 BRIDGE: Calling receiveMessage...");
      // Call receiveMessage using Circle's official structure
      const receiveMessageTx = await (messageTransmitterProgram as any).methods
        .receiveMessage({
          message: Buffer.from(messageHex.replace("0x", ""), "hex"),
          attestation: Buffer.from(attestationHex.replace("0x", ""), "hex"),
        })
        .accounts({
          payer: keypair.publicKey,
          caller: keypair.publicKey,
          authorityPda: pdas.authorityPda,
          messageTransmitter: pdas.messageTransmitterAccount.publicKey,
          usedNonce: pdas.usedNonce,
          receiver: tokenMessengerMinterProgram.programId,
          systemProgram: SystemProgram.programId,
        })
        .remainingAccounts(accountMetas)
        .signers([keypair])
        .rpc();

      console.log("✅ BRIDGE: Solana mint transaction completed:", receiveMessageTx);
      addLog(`Solana mint transaction: ${receiveMessageTx}`);
      setCurrentStep("completed");
      return receiveMessageTx;
    } catch (err) {
      console.error("❌ BRIDGE: Solana mint failed:", err);
      setError("Solana mint failed");
      addLog(
        `Solana mint error: ${
          err instanceof Error
            ? err.message
            : typeof err === "string"
              ? err
              : JSON.stringify(err)
        }`,
      );
      throw err;
    }
  };

  const executeTransfer = async (
    sourceChainId: number,
    destinationChainId: number,
    amount: string,
    transferType: "fast" | "standard",
    solPubKey: string,
    embeddedWalletParam?: any,
    walletClientParam?: WalletClient
  ) => {
    // Use passed parameters or fall back to hook parameters
    const walletToUse = embeddedWalletParam || embeddedWallet;
    const clientToUse = walletClientParam || walletClient;
    
    // Check if required wallet data is available
    if (!walletToUse || !clientToUse) {
      console.log("🚫 BRIDGE: Wallet data not available, skipping transfer", {
        hasEmbeddedWallet: !!walletToUse,
        hasWalletClient: !!clientToUse
      });
      setError("Wallet not connected. Please connect your wallet first.");
      return;
    }

    console.log("🚀 BRIDGE: Starting executeTransfer with params:", {
      sourceChainId,
      destinationChainId,
      amount,
      transferType,
      solPubKey
    });
    
    try {
      const numericAmount = parseUnits(amount, DEFAULT_DECIMALS);
      console.log("🔢 BRIDGE: Parsed amount:", {
        originalAmount: amount,
        numericAmount: numericAmount.toString(),
        decimals: DEFAULT_DECIMALS
      });

      // Handle different chain types
      const isSourceSolana = isSolanaChain(sourceChainId);
      const isDestinationSolana = isSolanaChain(destinationChainId);
      
      console.log("🔗 BRIDGE: Chain type analysis:", {
        isSourceSolana,
        isDestinationSolana,
        sourceChainId,
        destinationChainId
      });

      let sourceClient: any, destinationClient: any, defaultDestination: string;

      console.log("🔄 BRIDGE: Switching chain to source chain:", sourceChainId);
      await walletToUse.switchChain(sourceChainId);
      console.log("✅ BRIDGE: Chain switched successfully");

      // If provided, use the embedded wallet client
      if (!isSourceSolana && walletToUse && clientToUse) {
        sourceClient = clientToUse
        console.log("💼 BRIDGE: Using embedded wallet client for source:", {
          walletAddress: walletToUse.address,
          chainId: walletToUse.chainId
        });
      } else {
        sourceClient = getClients(sourceChainId);
        console.log("🔑 BRIDGE: Using private key client for source chain");
      }

      // For cross-chain transfers, destination address should be derived from destination chain's private key
      if (isDestinationSolana) {
        // Destination is Solana, so get Solana public key
        defaultDestination = solPubKey;
        console.log("🎯 BRIDGE: Using Solana destination address:", defaultDestination);
      } else {
        // Destination is EVM, so get EVM address
        // For cross-chain transfers, we'll use the provided solPubKey as the destination
        // since we're bridging to the user's wallet
        defaultDestination = solPubKey;
        console.log("🎯 BRIDGE: Using provided destination address:", defaultDestination);
      }

      // Check native balance for destination chain (only for informational purposes)
      const checkNativeBalance = async (chainId: SupportedChainId) => {
        console.log("💰 BRIDGE: Checking native balance for chain:", chainId);
        if (isSolanaChain(chainId)) {
          const connection = getSolanaConnection();
          const pubKey = new PublicKey(solPubKey)
          const balance = await connection.getBalance(pubKey);
          console.log("💰 BRIDGE: Solana native balance:", {
            balance: balance.toString(),
            solBalance: balance / LAMPORTS_PER_SOL
          });
          return BigInt(balance);
        } else {
          // For EVM chains, we'll skip balance checking for cross-chain transfers
          console.log("💰 BRIDGE: Skipping EVM balance check for cross-chain transfer");
          return BigInt(0);
        }
      };

      console.log("✅ BRIDGE: Starting approval step...");
      // Execute approve step
      if (isSourceSolana) {
        console.log("🔐 BRIDGE: Approving Solana USDC (no-op for SPL tokens)");
        await approveSolanaUSDC(sourceClient, sourceChainId);
      } else {
        console.log("🔐 BRIDGE: Approving EVM USDC...");
        await approveUSDC(walletToUse, sourceChainId);
      }
      console.log("✅ BRIDGE: Approval completed");

      console.log("🔥 BRIDGE: Starting burn step...");
      // Execute burn step
      let burnTx: string;
      if (isSourceSolana) {
        console.log("🔥 BRIDGE: Burning Solana USDC...");
        burnTx = await burnSolanaUSDC(
          sourceClient,
          sourceChainId,
          numericAmount,
          destinationChainId,
          defaultDestination,
          transferType,
        );
      } else {
        console.log("🔥 BRIDGE: Burning EVM USDC...");
        burnTx = await burnUSDC(
          walletToUse,
          sourceChainId,
          numericAmount,
          destinationChainId,
          defaultDestination,
          transferType,
        );
      }
      console.log("✅ BRIDGE: Burn transaction completed:", burnTx);

      console.log("⏳ BRIDGE: Starting attestation retrieval...");
      // Retrieve attestation
      const attestation = await retrieveAttestation(burnTx, sourceChainId);
      console.log("✅ BRIDGE: Attestation retrieved:", {
        messageLength: attestation.message?.length,
        attestationLength: attestation.attestation?.length
      });

      console.log("💰 BRIDGE: Checking destination chain balance...");
      // Check destination chain balance (informational only)
      const balance = await checkNativeBalance(destinationChainId);
      console.log("💰 BRIDGE: Balance check result:", {
        balance: balance.toString(),
        destinationChain: destinationChainId
      });
      
      console.log("🪙 BRIDGE: Skipping automatic minting for cross-chain transfer");
      console.log("🪙 BRIDGE: User will need to manually mint on destination chain using attestation");
      addLog("Burn completed. Manual minting required on destination chain.");
      addLog(`Attestation received. To complete the transfer, mint on Solana mainnet using the attestation.`);
      setCurrentStep("completed");
      
    } catch (error) {
      console.error("❌ BRIDGE: Transfer failed with error:", error);
      setCurrentStep("error");
      addLog(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const reset = () => {
    setCurrentStep("idle");
    setLogs([]);
    setError(null);
  };

  // Check if gasless transactions are available for a specific chain
  const isGaslessAvailable = (chainId: number): boolean => {
    return biconomyGaslessService.isAvailable() && 
      biconomyGaslessService.getSupportedChains().includes(chainId);
  };

  return {
    currentStep,
    logs,
    error,
    executeTransfer,
    getBalance,
    reset,
    isGaslessAvailable,
  };
}
