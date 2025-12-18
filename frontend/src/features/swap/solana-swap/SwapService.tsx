import { PublicKey, Connection, VersionedTransaction } from "@solana/web3.js";
import { HELIUS_API_KEY } from "../../../env.ts";
import getTokenAccountData from "../../../functions/GetSolanaTokenAccount.tsx";
import prepareTransaction from "./PrepareSwap.tsx";
import { getMintAddress } from "../../assets/stores/assetsSlice.ts";
import { getAssetDecimals } from "../../assets/utils/utils.ts";
import verifyTransaction from "./VerifyTransaction.tsx";
// import ensureTokenAccount from "../../../functions/ensureTokenAccount.tsx"; // No longer needed - Jupiter handles ATA creation
import { updateStatus } from "../stores/swapSlice.ts";
import { Dispatch } from "redux";
import { ConnectedSolanaWallet } from "@privy-io/react-auth";
import { Asset, AssetsState } from "@/features/assets/types/types.ts";
import { logError } from "../../../functions/LogError.tsx";
import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "../../../env";
import toast from "react-hot-toast/headless";
import { SwapTransaction } from "../types/types.ts";

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
  privyUserId,
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
  privyUserId?: string;
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
  const output_mint = getMintAddress(outputCurrency);
  const inputMint = getMintAddress(inputCurrency);

  // Check if the output token account already exists
  // If it exists, Jupiter shouldn't try to create it (which causes the error)
  console.log("Checking if output token account exists...");
  try {
    const userPublicKeyObj = new PublicKey(publicKey);
    const outputMintObj = new PublicKey(output_mint);

    const existingTokenAccounts =
      await connection.getParsedTokenAccountsByOwner(userPublicKeyObj, {
        mint: outputMintObj,
      });

    if (existingTokenAccounts.value.length > 0) {
      console.log(
        "Output token account already exists, Jupiter should not create it"
      );
      console.log(
        "Existing account:",
        existingTokenAccounts.value[0].pubkey.toString()
      );
    } else {
      console.log(
        "Output token account does not exist, Jupiter will create it"
      );
    }
  } catch (error) {
    console.log("Error checking token account existence:", error);
  }

  let platformFeeAccountData: any;

  if (microPlatformFeeAmount > 0) {
    platformFeeAccountData = await getTokenAccountData(
      //'DR5s8mAdygzmHihziLzDBwjuux1R131ydAG2rjYhpAmn',
      "688pzWEMqC52hiVgFviu45A24EzJ6ZfVoHiSzPSahJgh",
      inputMint,
      "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" // To do test with other program IDs like stocks
    );
  }

  const microInputAmount = convertToMicro(inputAmount, inputCurrency, assets);

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
        assets,
        privyUserId
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

const convertToMicro = (
  amount: number,
  currency: string,
  assets: AssetsState
) => {
  console.log("convertToMicro currency: ", currency);
  const decimals = getAssetDecimals(assets, currency);
  const multiplier = Math.pow(10, decimals);
  return Math.round(amount * multiplier);
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
    microPlatformFeeAmount,
  });

  // Input mint
  const inputMintAddress = getMintAddress(inputCurrencyType);

  try {
    let url = `https://lite-api.jup.ag/swap/v1/quote?inputMint=${inputMintAddress}&outputMint=${outputMint}&amount=${microInputAmount}&slippageBps=300&maxAccounts=54&feeAccount${SERVER_SOLANA_PUBLIC_KEY}`;
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
    if (!quoteResponse.inAmount || !quoteResponse.outAmount) {
      console.error("Quote response missing required fields:", quoteResponse);
    }

    // Add the input and output mint addresses to the response for easier access
    return {
      ...quoteResponse,
      inputMint: inputMintAddress,
      outputMint: outputMint,
    };
  } catch (error) {
    console.error("Error in getSwapQuote:", error);
    parseErrorAndDisplayToast(error);
    const errorLogMessage =
      "Error getting the swap quote" +
      `Quote url: https://lite-api.jup.ag/swap/v1/quote?inputMint=${inputMintAddress}&outputMint=${outputMint}&amount=${microInputAmount}&slippageBps=300&maxAccounts=54&feeAccount${SERVER_SOLANA_PUBLIC_KEY}`;
    const errorStackTrace = `${error} Quote url: https://lite-api.jup.ag/swap/v1/quote?inputMint=${inputMintAddress}&outputMint=${outputMint}&amount=${microInputAmount}&slippageBps=300&maxAccounts=54&feeAccount${SERVER_SOLANA_PUBLIC_KEY}`;

    // to do log the error
    logError(errorLogMessage, "swap", errorStackTrace);
    throw error; // rethrow the error if you want to handle it in the calling function
  }
}

const parseErrorAndDisplayToast = (error: any) => {
  let errorCode = "Unknown error";

  // Check if error has errorCode property (from our custom error object)
  if (error.errorCode) {
    errorCode = error.errorCode;
  }
  // Check if error.message contains Jupiter API error response
  else if (error.message && error.message.includes("Jupiter API error:")) {
    try {
      // Extract the JSON part from the error message
      const jsonStart = error.message.indexOf("{");
      const jsonEnd = error.message.lastIndexOf("}") + 1;
      const jsonString = error.message.substring(jsonStart, jsonEnd);
      const errorData = JSON.parse(jsonString);

      errorCode = errorData.errorCode || errorCode;
    } catch (parseError) {
      console.error("Failed to parse Jupiter API error:", parseError);
    }
  }

  toast.error(`Blockchain error: ${errorCode}`);
};

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
  assets: AssetsState,
  privyUserId?: string
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

  // Log Jupiter's setup instructions to debug token account creation
  console.log("Jupiter instructions received:", {
    setupInstructions: instructions.setupInstructions?.length || 0,
    computeBudgetInstructions:
      instructions.computeBudgetInstructions?.length || 0,
    hasSwapInstruction: !!instructions.swapInstruction,
    hasCleanupInstruction: !!instructions.cleanupInstruction,
  });

  if (
    instructions.setupInstructions &&
    instructions.setupInstructions.length > 0
  ) {
    console.log("Setup instructions details:");
    instructions.setupInstructions.forEach((instruction, index) => {
      console.log(`  Setup ${index}:`, {
        programId: instruction.programId,
        accounts: instruction.accounts?.length || 0,
        accountDetails:
          instruction.accounts?.map((acc, i) => ({
            index: i,
            pubkey: acc.pubkey,
            isSigner: acc.isSigner,
            isWritable: acc.isWritable,
          })) || [],
      });
    });

    // Check if the token account already exists and filter out ATA creation instructions
    try {
      const userPublicKeyObj = new PublicKey(userPublicKey);
      const outputMintObj = new PublicKey(quoteData.outputMint);

      const existingTokenAccounts =
        await connection.getParsedTokenAccountsByOwner(userPublicKeyObj, {
          mint: outputMintObj,
        });

      if (existingTokenAccounts.value.length > 0) {
        console.log(
          "Token account already exists, filtering out ATA creation instructions"
        );
        console.log(
          "Existing token account:",
          existingTokenAccounts.value[0].pubkey.toString()
        );
        // Filter out Associated Token Account creation instructions
        instructions.setupInstructions = instructions.setupInstructions.filter(
          (instruction) =>
            instruction.programId !==
            "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        );
        console.log(
          "Filtered setup instructions:",
          instructions.setupInstructions.length
        );
      } else {
        console.log(
          "No existing token account found, ATA creation should proceed"
        );
        // Note: Backend will handle setting server as payer and adding SetAuthority
      }
    } catch (error) {
      console.log("Error checking token account existence:", error);
    }
  }

  // Note: All transaction modifications (cleanup instruction rent destination, 
  // setup instruction payer, and SetAuthority) are now handled by the backend
  // for centralized security and simplicity

  const preparedTransaction = await prepareTransaction(instructions);
  console.log("Prepared Transaction Details:", {
    feePayer: preparedTransaction.message.staticAccountKeys[0].toString(),
    numSigners: preparedTransaction.message.header.numRequiredSignatures,
    staticAccountKeys: preparedTransaction.message.staticAccountKeys.map(
      (key) => key.toString()
    ),
  });

  const serverSignedTransaction = await signTransactionOnBackend(
    preparedTransaction,
    privyUserId
  );

  if (!serverSignedTransaction) {
    dispatch(updateStatus("fail"));
    return;
  }

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
      maxRetries: 3,
    });

    // Update the transaction object with the correct amounts from the quote
    if (quoteData && transaction) {
      console.log("Quote data:", quoteData);
      console.log(
        "Original transaction:",
        JSON.stringify(transaction, null, 2)
      );

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
          assetId: transaction.buy.assetId || quoteData.outputMint,
        },
        sell: {
          ...transaction.sell,
          amount: inputAmount || transaction.sell.amount,
          assetId: transaction.sell.assetId || quoteData.inputMint,
        },
      };

      console.log(
        "Updated transaction object:",
        JSON.stringify(updatedTransaction, null, 2)
      );

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
        hasTransaction: !!transaction,
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
      fullError: error,
    });

    // Specific analysis for InstructionError
    if (error.message && error.message.includes("InstructionError")) {
      console.error("=== INSTRUCTION ERROR DEBUG ===");
      console.error("Error details:", error.message);
      if (error.logs && Array.isArray(error.logs)) {
        console.error("Transaction logs:");
        error.logs.forEach((log, index) => {
          console.error(`  ${index}: ${log}`);
        });
      }
    }

    const transactionDetails = {
      userPublicKey,
      quoteData,
      platformFeeAccount: platformFeeAccount?.toString() || null,
      serverPublicKey: SERVER_SOLANA_PUBLIC_KEY,
      type,
      transaction,
    };

    logError(
      `Swap transaction failed: ${error.message}`,
      "swap",
      `Error details: ${JSON.stringify(
        {
          message: error.message,
          stack: error.stack,
          name: error.name,
          code: error.code,
          logs: error.logs,
          transactionDetails: transactionDetails,
        },
        null,
        2
      )}`
    );

    dispatch(updateStatus("fail"));
  }
};

{
  /* Sign Transaction On Backend */
}
async function signTransactionOnBackend(transaction: any, privyUserId?: string) {
  console.log("Starting server signing process");
  console.log(
    "Original transaction fee payer:",
    transaction.message.staticAccountKeys[0].toString()
  );

  if (!privyUserId) {
    throw new Error("privyUserId is required for sponsored transactions");
  }

  // Serialize for server signing
  const serializedTx = Buffer.from(transaction.serialize()).toString("base64");

  // Send to backend for signing
  const response = await fetch(`${MYFYE_BACKEND}/sign_versioned_transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": MYFYE_BACKEND_KEY,
    },
    body: JSON.stringify({
      serializedTransaction: serializedTx,
      privyUserId: privyUserId,
    }),
  });

  if (!response.ok) {
    console.error(
      "Server signing error:",
      response.status,
      await response.text()
    );
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

  if (error || !signedTransaction) {
    console.error("Signing failed:", error);
    return false;
  }

  // Deserialize and send the signed transaction
  const signedTx = VersionedTransaction.deserialize(
    new Uint8Array(Buffer.from(signedTransaction, "base64"))
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
    "https://lite-api.jup.ag/swap/v1/swap-instructions",
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
            maxLamports: 2_000_000, // Reduced from 10M to 2M to save costs (~0.002 SOL max vs ~0.01 SOL)
            priorityLevel: "medium", // Changed from "veryHigh" to "medium" - still reliable but much cheaper
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
