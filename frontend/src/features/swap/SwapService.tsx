import promiseRetry from "promise-retry";
import {
  ComputeBudgetProgram,
  PublicKey,
  Connection,
  VersionedTransaction,
  BlockhashWithExpiryBlockHeight,
  TransactionExpiredBlockheightExceededError,
  VersionedTransactionResponse,
} from "@solana/web3.js";

import { HELIUS_API_KEY } from "../../env.ts";
import getTokenAccountData from "../../functions/GetSolanaTokenAccount.tsx";
import { updateStatus } from "./swapSlice.ts";

// Swapping pairs
const USDC_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const USDT_MINT_ADDRESS = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
const USDY_MINT_ADDRESS = "A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6";
const PYUSD_MINT_ADDRESS = "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo";
const EURC_MINT_ADDRESS = "HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr";
const BTC_MINT_ADDRESS = "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij";

type TransactionSenderAndConfirmationWaiterArgs = {
  connection: Connection;
  serializedTransaction: Buffer;
  blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight;
};

const SEND_OPTIONS = {
  skipPreflight: true,
};

const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
const connection = new Connection(RPC);

function mintAddress(currencyCode: String): String {
  let mintAddress = USDC_MINT_ADDRESS;
  if (currencyCode === "usdcSol") {
    mintAddress = USDC_MINT_ADDRESS;
  } else if (currencyCode === "usdtSol") {
    mintAddress = USDT_MINT_ADDRESS;
  } else if (currencyCode === "usdySol") {
    mintAddress = USDY_MINT_ADDRESS;
  } else if (currencyCode === "pyusdSol") {
    mintAddress = PYUSD_MINT_ADDRESS;
  } else if (currencyCode === "eurcSol") {
    mintAddress = EURC_MINT_ADDRESS;
  } else if (currencyCode === "btcSol") {
    mintAddress = BTC_MINT_ADDRESS;
  }
  return mintAddress;
}

export const swap = async (
  wallet: any,
  publicKey: String,
  inputAmount: number,
  outputAmount: number,
  inputCurrency: String,
  outputCurrency: String,
  dispatch: Function,
  type: String,
  microPlatformFeeAmount: number = 0
) => {
  console.log("microPlatformFeeAmount", microPlatformFeeAmount);
  // Output mint
  const output_mint = mintAddress(outputCurrency);
  // Input mint
  const inputMint = mintAddress(inputCurrency);

  let platformFeeAccountData: any;

  if (microPlatformFeeAmount > 0) {
    platformFeeAccountData = await getTokenAccountData(
      "DR5s8mAdygzmHihziLzDBwjuux1R131ydAG2rjYhpAmn",
      inputMint,
      "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
    );
  }
  console.log("Got token account", platformFeeAccountData);

  getSwapQuote(inputAmount, inputCurrency, output_mint, microPlatformFeeAmount)
    .then((quote) => {
      swapTransaction(
        wallet,
        quote,
        publicKey,
        dispatch,
        type,
        platformFeeAccountData
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

async function getSwapQuote(
  microInputAmount: number,
  inputCurrencyType: String,
  outputMint: string = USDY_MINT_ADDRESS,
  microPlatformFeeAmount: number = 0
) {
  // Input mint
  const inputMintAddress = mintAddress(inputCurrencyType);

  try {
    let url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMint}&amount=${microInputAmount}&slippageBps=300`;

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

const swapTransaction = async (
  wallet: any,
  quoteData: any,
  receiverPubKey: String,
  dispatch: Function,
  type: String,
  platformFeeAccountData: any
) => {
  // get the platform fee account
  let platformFeeAccount: PublicKey | null = null;
  if (platformFeeAccountData?.pubkey) {
    platformFeeAccount = new PublicKey(platformFeeAccountData.pubkey);
  }

  console.log("platformFeeAccount", platformFeeAccount);

  const swapTransactionSignature = await getJupiterSwapTransaction(
    wallet,
    quoteData,
    receiverPubKey,
    dispatch,
    type,
    platformFeeAccount
  );
};

async function getJupiterSwapTransaction(
  wallet: any,
  quoteResponse: any,
  userPublicKey: String,
  dispatch: Function,
  type: String,
  platformFeeAccountPubKey: PublicKey | null
) {
  console.log("platformFeeAccountPubKey", platformFeeAccountPubKey);
  try {
    window.Buffer = Buffer;

    const response = await fetch("https://quote-api.jup.ag/v6/swap", {
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
            maxLamports: 10000000,
            priorityLevel: "veryHigh", // If you want to land transaction fast, set this to use `veryHigh`. You will pay on average higher priority fee.
          },
        },
        feeAccount: platformFeeAccountPubKey,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Get recent blockhash and create a new transaction

    const swapTransactionBuf = Buffer.from(data.swapTransaction, "base64");
    var transaction = VersionedTransaction.deserialize(
      new Uint8Array(swapTransactionBuf)
    );
    console.log("transaction", transaction);

    const { blockhash: latestBlockHash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    transaction.message.recentBlockhash = latestBlockHash;

    const transactionId = await wallet.sendTransaction!(
      transaction,
      connection
    );

    console.log("transactionId", transactionId);

    if (transactionId) {
      let transactionConfirmed = false;
      for (let attempt = 1; attempt <= 3 && !transactionConfirmed; attempt++) {
        try {
          const confirmation = await connection.confirmTransaction(
            transactionId,
            "confirmed"
          );
          console.log("got confirmation", confirmation, "on attempt", attempt);
          if (
            confirmation &&
            confirmation.value &&
            confirmation.value.err === null
          ) {
            console.log(
              `Transaction successful: https://solscan.io/tx/${transactionId}`
            );
            // update status on swap screen
            dispatch(updateStatus("success"));
            // then, update wallet amounts

            return true;
          }
        } catch (error) {
          console.error(
            "Error sending transaction or in post-processing:",
            error,
            "on attempt",
            attempt
          );
        }
        if (!transactionConfirmed) {
          await delay(1000); // Delay in milliseconds
        }
      }
      dispatch(updateStatus("fail"));
      console.error("Transaction Uncomfirmed");
      return false;
    } else {
      dispatch(updateStatus("fail"));
      console.error("Transaction Failed: transactionID: ", transactionId);
      return false;
    }

    /*
      const signedTransaction = await wallet.signTransaction(transaction);
      updateUI(dispatch, type, 'Signed')

      const serializedTransaction = Buffer.from(signedTransaction.serialize());

      const sendTransactionResponse = await transactionSenderAndConfirmationWaiter({
        connection,
        serializedTransaction,
        blockhashWithExpiryBlockHeight: {
            blockhash: latestBlockHash,          // Pass the blockhash
            lastValidBlockHeight: lastValidBlockHeight // Pass the last valid block height
          }
      });
      
      if (sendTransactionResponse) {
        console.log(`Transaction succeeded: https://solscan.io/tx/${response}`);
        updateUI(dispatch, type, 'Success')
      } else {
        console.log('Transaction failed due to block height expiration or other issue');
        updateUI(dispatch, type, 'Fail')
      }
*/
  } catch (error) {
    dispatch(updateStatus("fail"));
    console.error("Error with swap transaction", error);
    return `Unable to confirm transaction txid: `; // Re-throw the error for further handling if necessary
  }
}

async function transactionSenderAndConfirmationWaiter({
  connection,
  serializedTransaction,
  blockhashWithExpiryBlockHeight,
}: TransactionSenderAndConfirmationWaiterArgs): Promise<VersionedTransactionResponse | null> {
  console.log("Preparing to send transaction...");
  const txid = await connection.sendRawTransaction(
    serializedTransaction,
    SEND_OPTIONS
  );

  console.log("Transaction sent, txid:", txid);

  const controller = new AbortController();
  const abortSignal = controller.signal;

  const abortableResender = async () => {
    while (!abortSignal.aborted) {
      try {
        await delay(1_000);
        await connection.sendRawTransaction(
          serializedTransaction,
          SEND_OPTIONS
        );
      } catch (e: any) {
        console.warn(`Resending transaction failed: ${e.message}`);
      }
    }
  };

  try {
    abortableResender();
    const lastValidBlockHeight =
      blockhashWithExpiryBlockHeight.lastValidBlockHeight - 25;

    console.log("Starting transaction confirmation...");
    await Promise.race([
      connection
        .confirmTransaction(
          {
            ...blockhashWithExpiryBlockHeight,
            lastValidBlockHeight,
            signature: txid,
            abortSignal,
          },
          "confirmed"
        )
        .catch((e) => {
          console.error("Error during confirmTransaction:", e);
          // throw e; Getting premature failures when the chain actually
          // ends up approving the transaction
          if (e instanceof TransactionExpiredBlockheightExceededError) {
            throw e;
          }
        }),
      new Promise(async (resolve, reject) => {
        while (!abortSignal.aborted) {
          await delay(2_000);
          const tx = await connection.getSignatureStatus(txid, {
            searchTransactionHistory: false,
          });
          if (tx?.value?.confirmationStatus === "confirmed") {
            console.log("Transaction confirmed via polling.");
            resolve(tx);
            return;
          }
        }
        reject(new Error("Transaction polling timeout"));
      }),
    ]);
  } catch (e) {
    if (e instanceof TransactionExpiredBlockheightExceededError) {
      console.error("TransactionExpiredBlockheightExceededError:", e);
      controller.abort();
      console.log("e instanceof TransactionExpiredBlockheightExceededError");
      return null;
    } else {
      console.error("Error during confirmation:", e);
      throw e;
    }
  } finally {
    controller.abort();
  }

  console.log("Fetching transaction details...");
  const response = await promiseRetry(
    async (retry) => {
      const transaction = await connection.getTransaction(txid, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });
      if (!transaction) {
        console.warn("Transaction not found, retrying...");
        retry(transaction);
      }
      return transaction;
    },
    {
      retries: 7,
      minTimeout: 1_000,
    }
  );

  console.log("Transaction response:", response);
  return response;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//      const signedVersionedTransaction = VersionedTransaction.deserialize(signedTransaction);

//const transactionId = await wallet.sendTransaction!(transaction, connection);

/*
      console.log('SendTransaction: ', transactionId)

      if (transactionId) {
        let transactionConfirmed = false
        for (let attempt = 1; attempt <= 3 && !transactionConfirmed; attempt++) {
          try {
            const confirmation = await connection.confirmTransaction(transactionId, 'confirmed');
            console.log('got confirmation', confirmation, 'on attempt', attempt);
            if (confirmation && confirmation.value && confirmation.value.err === null) {
              console.log(`Transaction successful: https://solscan.io/tx/${transactionId}`);
              updateUI(dispatch, type, 'Success')
              return true;
            }
            } catch (error) {
              console.error('Error sending transaction or in post-processing:', error, 'on attempt', attempt);
            }
            if (!transactionConfirmed) {
              await delay(1000); // Delay in milliseconds
            }
          }
          console.log("Transaction Uncomfirmed");
          updateUI(dispatch, type, 'Fail')
          return false
      } else {
        console.log("Transaction Failed: transactionID: ", transactionId);
        updateUI(dispatch, type, 'Fail')
        return false;
      }
        */

// const signedTransaction = await wallet.signTransaction(transaction);
// updateUI(dispatch, type, 'Signed')

//const signedTransactionBuffer = new Uint8Array(Buffer.from(signedTransaction));
// const signedVersionedTransaction = VersionedTransaction.deserialize(signedTransactionBuffer);
//const serializedTransaction = Buffer.from(signedVersionedTransaction.serialize());

// const serializedTransaction = Buffer.from(signedTransaction.serialize());

// Simulation
/*
      const simulationResult = await connection.simulateTransaction(signedTransaction);

      if (simulationResult.value.err) {
          console.log("Simulation failed:", simulationResult.value.err);
      } else {
          console.log("Simulation succeeded. Logs:", simulationResult.value.logs);
      }
          */
