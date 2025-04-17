import { PublicKey, Connection, VersionedTransaction } from "@solana/web3.js";
import { HELIUS_API_KEY } from "../../../env.ts";
import getTokenAccountData from "../../../functions/GetSolanaTokenAccount.tsx";
import { getFunctions, httpsCallable } from "firebase/functions";
const SERVER_SOLANA_PUBLIC_KEY = import.meta.env
  .VITE_REACT_APP_SERVER_SOLANA_PUBLIC_KEY;
import prepareTransaction from "./PrepareSwap.tsx";
import mintAddress from "./MintAddress.tsx";
import verifyTransaction from "./VerifyTransaction.tsx";
import ensureTokenAccount from "./ensureTokenAccount.tsx";
import { SwapTransaction, updateStatus } from "../swapSlice.ts";
import { Dispatch } from "redux";
import { ConnectedSolanaWallet } from "@privy-io/react-auth";
import { Asset, AssetsState } from "@/features/wallet/assets/types.ts";

const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
const connection = new Connection(RPC);

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

  getSwapQuote(
    microInputAmount,
    inputCurrency,
    output_mint,
    microPlatformFeeAmount
  )
    .then((quote) => {
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
      dispatch(updateStatus("fail"));
      console.error(
        "Error calling getSwapQuote retrying becuase error: ",
        error
      );
    });
};

const convertToMicro = (amount: number, currency: string) => {
  if (currency === "btc_sol") {
    return amount * 100000000;
  } else if (currency === "w_sol" || currency === "sol") {
    return amount * 1000000000;
  } else {
    return amount * 1000000;
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
  // Input mint
  const inputMintAddress = mintAddress(inputCurrencyType);

  try {
    let url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMint}&amount=${microInputAmount}&slippageBps=300&maxAccounts=54&feeAccount${SERVER_SOLANA_PUBLIC_KEY}`;
    console.log("microPlatformFeeAmount", microPlatformFeeAmount);
    if (microPlatformFeeAmount > 0) {
      url += `&platformFeeBps=100`;
    }
    console.log("Quote url", url);
    const quoteResponse = await fetch(url).then((response) => response.json());

    return quoteResponse;
  } catch (error) {
    console.error("Error fetching swap quote:", error);
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

  const fullySignedTx = await wallet.signTransaction(serverSignedTransaction);
  //simulate(fullySignedTx);

  const transactionId = await wallet.sendTransaction!(
    fullySignedTx,
    connection
  );

  await verifyTransaction(
    transactionId,
    dispatch,
    type,
    transaction,
    wallet,
    assets
  );
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

  const functions = getFunctions();
  const signTransactionFn = httpsCallable(
    functions,
    "signVersionedTransaction"
  );

  // Send to Firebase for signing
  const signTransactionResponse = (await signTransactionFn({
    serializedTransaction: serializedTx,
  })) as { data: { signedTransaction?: string; error?: string } };

  const { signedTransaction, error } = signTransactionResponse.data;

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
    signTransactionResponse.data.error ||
    !signTransactionResponse.data.signedTransaction
  ) {
    console.error("Signing failed:", signTransactionResponse.data.error);
    return false;
  }

  // Deserialize and send the signed transaction
  const signedTx = VersionedTransaction.deserialize(
    new Uint8Array(
      Buffer.from(signTransactionResponse.data.signedTransaction, "base64")
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
