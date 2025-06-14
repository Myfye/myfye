import { PublicKey, Connection, VersionedTransaction } from "@solana/web3.js";
import { HELIUS_API_KEY } from "../../../env.ts";
import getTokenAccountData from "../../../functions/GetSolanaTokenAccount.tsx";
import prepareTransaction from "./PrepareSwap.tsx";
import mintAddress from "./MintAddress.tsx";
import verifyTransaction from "./VerifyTransaction.tsx";
import ensureTokenAccount from "../../../functions/ensureTokenAccount.tsx";
import { SwapTransaction, updateStatus } from "../swapSlice.ts";
import { Dispatch } from "redux";
import { ConnectedSolanaWallet } from "@privy-io/react-auth";
import { Asset, AssetsState } from "@/features/assets/types.ts";
import { logError } from "../../../functions/LogError.tsx";
import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from '../../../env';

const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
const connection = new Connection(RPC);

const SERVER_SOLANA_PUBLIC_KEY = import.meta.env
  .VITE_REACT_APP_SERVER_SOLANA_PUBLIC_KEY;

export const swap = async ({
  wallet,
  assets,
  publicKey,
  inputAmount,
  inputCurrency,
  outputCurrency,
  dispatch,
  type = "deposit",
  microPlatformFeeAmount = 0,
  transaction,
}: {
  wallet: ConnectedSolanaWallet;
  assets: AssetsState;
  publicKey: string;
  inputAmount: number;
  inputCurrency: Asset["id"];
  outputCurrency: Asset["id"];
  dispatch: Dispatch;
  type?: string;
  microPlatformFeeAmount?: number;
  transaction: SwapTransaction;
}) => {
  console.log(
    "swapping",
    publicKey,
    inputAmount,
    inputCurrency,
    outputCurrency,
    type,
    microPlatformFeeAmount
  );
  const output_mint = mintAddress(outputCurrency);
  const inputMint = mintAddress(inputCurrency);

  await ensureTokenAccount(publicKey, output_mint);

  console.log("Done ensuring token account");

  let platformFeeAccountData: any;

  if (microPlatformFeeAmount > 0) {
    platformFeeAccountData = await getTokenAccountData(
      //'DR5s8mAdygzmHihziLzDBwjuux1R131ydAG2rjYhpAmn',
      "688pzWEMqC52hiVgFviu45A24EzJ6ZfVoHiSzPSahJgh",
      inputMint,
      "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
    );
  }

  const microInputAmount = convertToMicro(inputAmount, inputCurrency);

  console.log("Calling getSwapQuote...");
  getSwapQuote(
    microInputAmount,
    inputCurrency,
    output_mint,
    microPlatformFeeAmount
  )
    .then((quote) => {
      console.log("getSwapQuote succeeded with quote:", quote);
      swapTransaction(
        wallet,
        quote,
        publicKey,
        dispatch,
        type,
        platformFeeAccountData,
        transaction,
        assets
      );
    })
    .catch((error) => {
      console.error(
        "Error calling getSwapQuote retrying becuase error: ",
        error
      );
      logError("Error calling getSwapQuote", "swap", error);
      dispatch(updateStatus("fail"));
    });
};

const convertToMicro = (amount: number, currency: string) => {
  if (currency === "btc_sol") { // 8 decimals
    return Math.round(amount * 100000000);
  } else if ( // 9 decimals
    currency === "w_sol" || currency === "sol" || 
    currency === "xrp_sol" || currency === 'xrp' || 
    currency === "doge_sol" || currency === "doge" || 
    currency === "sui_sol" || currency === "sui") { 
    return Math.round(amount * 1000000000);
  } else {
    return Math.round(amount * 1000000);
  }
};

{
  /* Get Swap Quote*/
}
async function getSwapQuote(
  microInputAmount: number,
  inputCurrencyType: Asset["id"],
  outputMint: String = "A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6", // default to some mint address (USDY)
  microPlatformFeeAmount: number = 0
) {
  console.log("getSwapQuote called with:", {
    microInputAmount,
    inputCurrencyType,
    outputMint,
    microPlatformFeeAmount
  });
  
  // Input mint
  const inputMintAddress = mintAddress(inputCurrencyType);

  try {
    let url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMint}&amount=${microInputAmount}&slippageBps=300&maxAccounts=54&feeAccount${SERVER_SOLANA_PUBLIC_KEY}`;
    console.log("microPlatformFeeAmount", microPlatformFeeAmount);
    if (microPlatformFeeAmount > 0) {
      url += `&platformFeeBps=100`;
    }
    console.log("Quote url", url);
    
    console.log("Fetching quote from Jupiter API...");
    const response = await fetch(url);
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Jupiter API error response:", errorText);
      throw new Error(`Jupiter API error: ${response.status} ${errorText}`);
    }
    
    const quoteResponse = await response.json();
    console.log("Quote response:", quoteResponse);
    
    // Ensure the response has the expected structure
    if (!quoteResponse.inputAmount || !quoteResponse.outputAmount) {
      console.error("Quote response missing required fields:", quoteResponse);
    }
    
    // Add the input and output mint addresses to the response for easier access
    return {
      ...quoteResponse,
      inputMint: inputMintAddress,
      outputMint: outputMint
    };
  } catch (error) {
    console.error("Error in getSwapQuote:", error);
    const errorLogMessage = "Error getting the swap quote" + `Quote url: https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMint}&amount=${microInputAmount}&slippageBps=300&maxAccounts=54&feeAccount${SERVER_SOLANA_PUBLIC_KEY}`
    const errorStackTrace = `${error} Quote url: https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMint}&amount=${microInputAmount}&slippageBps=300&maxAccounts=54&feeAccount${SERVER_SOLANA_PUBLIC_KEY}`

    // to do log the error
    logError(errorLogMessage, "swap", errorStackTrace);
    throw error; // rethrow the error if you want to handle it in the calling function
  }
}

{
  /* Swap Transaction */
}
const swapTransaction = async (
  wallet: any,
  quoteData: any,
  userPublicKey: string,
  dispatch: Dispatch,
  type: string,
  platformFeeAccountData: any,
  transaction: any,
  assets: AssetsState
) => {
  // get the platform fee account
  let platformFeeAccount: PublicKey | null = null;
  if (platformFeeAccountData?.pubkey) {
    platformFeeAccount = new PublicKey(platformFeeAccountData.pubkey);
  }

  console.log("User Public Key:", userPublicKey);
  console.log("Server Fee Payer:", SERVER_SOLANA_PUBLIC_KEY);

  // Get balances for both accounts
  const userBalance = await connection.getBalance(new PublicKey(userPublicKey));
  const serverBalance = await connection.getBalance(
    new PublicKey(SERVER_SOLANA_PUBLIC_KEY!)
  );
  console.log("User SOL Balance:", userBalance / 1e9, "SOL");
  console.log("Server SOL Balance:", serverBalance / 1e9, "SOL");

  const instructions = await fetchSwapTransaction(
    quoteData,
    userPublicKey,
    platformFeeAccount
  );
  if (instructions.error) {
    throw new Error("Failed to get swap instructions: " + instructions.error);
  }

  const preparedTransaction = await prepareTransaction(instructions);
  console.log("Prepared Transaction Details:", {
    feePayer: preparedTransaction.message.staticAccountKeys[0].toString(),
    numSigners: preparedTransaction.message.header.numRequiredSignatures,
    staticAccountKeys: preparedTransaction.message.staticAccountKeys.map(
      (key) => key.toString()
    ),
  });

  const serverSignedTransaction = await signTransactionOnBackend(
    preparedTransaction
  );
  console.log("Server Signed Transaction Details:", {
    feePayer: serverSignedTransaction.message.staticAccountKeys[0].toString(),
    numSigners: serverSignedTransaction.message.header.numRequiredSignatures,
    staticAccountKeys: serverSignedTransaction.message.staticAccountKeys.map(
      (key) => key.toString()
    ),
  });

  try {
    const fullySignedTx = await wallet.signTransaction(serverSignedTransaction);
    
    //simulate(fullySignedTx);

    // Instead of using wallet.sendTransaction, use connection.sendRawTransaction
    const rawTransaction = fullySignedTx.serialize();
    const transactionId = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true, // Skip preflight checks including balance check
      maxRetries: 3
    });

    // Update the transaction object with the correct amounts from the quote
    if (quoteData && transaction) {
      console.log("Quote data:", quoteData);
      console.log("Original transaction:", JSON.stringify(transaction, null, 2));
      
      // Extract the amounts from the quote data
      let inputAmount = null;
      let outputAmount = null;
      
      if (quoteData.inputAmount && quoteData.outputAmount) {
        inputAmount = quoteData.inputAmount / 1e9;
        outputAmount = quoteData.outputAmount / 1e9;
      } else if (transaction.sell.amount && transaction.buy.amount) {
        // Fallback to using the original transaction amounts
        console.log("Using original transaction amounts as fallback");
        inputAmount = transaction.sell.amount;
        outputAmount = transaction.buy.amount;
      }
      
      console.log("Extracted amounts:", { inputAmount, outputAmount });
      
      // Create a new transaction object instead of modifying the existing one
      const updatedTransaction = {
        ...transaction,
        buy: {
          ...transaction.buy,
          amount: outputAmount || transaction.buy.amount,
          assetId: transaction.buy.assetId || quoteData.outputMint
        },
        sell: {
          ...transaction.sell,
          amount: inputAmount || transaction.sell.amount,
          assetId: transaction.sell.assetId || quoteData.inputMint
        }
      };
      
      console.log("Updated transaction object:", JSON.stringify(updatedTransaction, null, 2));

      await verifyTransaction(
        transactionId,
        dispatch,
        type,
        updatedTransaction,
        wallet,
        assets
      );
    } else {
      console.log("Missing quote data or transaction:", { 
        hasQuoteData: !!quoteData, 
        hasTransaction: !!transaction 
      });
      
      await verifyTransaction(
        transactionId,
        dispatch,
        type,
        transaction,
        wallet,
        assets
      );
    }
  } catch (error) {
    console.error("Error in swapTransaction:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      logs: error.logs,
      fullError: error
    });
    
    const transactionDetails = {
      userPublicKey,
      quoteData,
      platformFeeAccount: platformFeeAccount?.toString() || null,
      serverPublicKey: SERVER_SOLANA_PUBLIC_KEY,
      type,
      transaction
    };
    
    logError(
      `Swap transaction failed: ${error.message}`, 
      "swap", 
      `Error details: ${JSON.stringify({
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code,
        logs: error.logs,
        transactionDetails: transactionDetails
      }, null, 2)}`
    );
    
    dispatch(updateStatus("fail"));
  }
};

{
  /* Sign Transaction On Backend */
}
async function signTransactionOnBackend(transaction: any) {
  console.log("Starting server signing process");
  console.log(
    "Original transaction fee payer:",
    transaction.message.staticAccountKeys[0].toString()
  );

  // Serialize for server signing
  const serializedTx = Buffer.from(transaction.serialize()).toString("base64");

  // Send to backend for signing
  const response = await fetch(`${MYFYE_BACKEND}/sign_versioned_transaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': MYFYE_BACKEND_KEY,
    },
    body: JSON.stringify({
      serializedTransaction: serializedTx,
    }),
  });

  if (!response.ok) {
    console.error("Server signing error:", response.status, await response.text());
    return false;
  }

  const responseData = await response.json();
  const { signedTransaction, error } = responseData;

  if (error) {
    console.error("Server signing error:", error);
    return false;
  }

  if (!signedTransaction) {
    console.error("Error: signedTransaction is undefined.");
    return false;
  }

  const deserializedTransaction = VersionedTransaction.deserialize(
    Buffer.from(signedTransaction, "base64")
  );

  console.log("Server signed transaction details:", {
    feePayer: deserializedTransaction.message.staticAccountKeys[0].toString(),
    numSigners: deserializedTransaction.message.header.numRequiredSignatures,
    staticAccountKeys: deserializedTransaction.message.staticAccountKeys.map(
      (key) => key.toString()
    ),
    signatures: deserializedTransaction.signatures.map((sig) =>
      sig ? Buffer.from(sig).toString("base64") : null
    ),
  });

  if (
    error ||
    !signedTransaction
  ) {
    console.error("Signing failed:", error);
    return false;
  }

  // Deserialize and send the signed transaction
  const signedTx = VersionedTransaction.deserialize(
    new Uint8Array(
      Buffer.from(signedTransaction, "base64")
    )
  );
  return signedTx;
}

{
  /* Fetch Swap Transaction */
}
async function fetchSwapTransaction(
  quoteResponse: any,
  userPublicKey: String,
  platformFeeAccountPubKey: PublicKey | null
): Promise<any> {
  const response = await fetch(
    "https://quote-api.jup.ag/v6/swap-instructions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quoteResponse, // quoteResponse from /quote api
        userPublicKey: userPublicKey, // user public key to be used for the swap
        dynamicComputeUnitLimit: true, // Set this to true to get the best optimized CU usage.
        dynamicSlippage: {
          // This will set an optimized slippage to ensure high success rate
          maxBps: 300, // Make sure to set a reasonable cap here to prevent MEV
        },
        prioritizationFeeLamports: {
          priorityLevelWithMaxLamports: {
            maxLamports: 10_000_000,
            priorityLevel: "veryHigh", // If you want to land transaction fast, set this to use `veryHigh`. You will pay on average higher priority fee.
          },
        },
        platformFeeAccount: platformFeeAccountPubKey,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
