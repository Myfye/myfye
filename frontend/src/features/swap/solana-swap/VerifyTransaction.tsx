import { Connection } from "@solana/web3.js";
import { HELIUS_API_KEY } from "../../../env.ts";
import { updateId, updateStatus } from "../swapSlice.ts";
import { Dispatch } from "redux";
import { ConnectedSolanaWallet } from "@privy-io/react-auth";
import { AssetsState } from "@/features/assets/types.ts";
import { updateBalance } from "@/features/assets/assetsSlice.ts";
import { saveNewSwapTransaction } from "@/functions/SaveNewTransaction.tsx";
import { SwapTransaction } from "../types.ts";
import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from '../../../env';
import { useSelector } from "react-redux";

const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
const connection = new Connection(RPC);

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verifyTransaction(
  transactionId: any,
  dispatch: Dispatch,
  type: String,
  transaction: SwapTransaction,
  wallet: ConnectedSolanaWallet,
  assets: AssetsState
) {
  

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
          console.log(
            "Transaction details:",
            JSON.stringify(transaction, null, 2)
          );
          saveTransaction(
            transaction, 
            transactionId, 
            wallet,
            transaction.user_id
          );
          dispatch(updateStatus("success"));
          dispatch(updateId(transactionId));

          // Check if amounts are null before calling updateBalances
          if (!transaction.sell.amount || !transaction.buy.amount) {
            console.error("Amounts are null, cannot update balances:", {
              sellAmount: transaction.sell.amount,
              buyAmount: transaction.buy.amount,
            });
            return true;
          }

          updateBalances(dispatch, transaction, assets);
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
        await delay(1500); // Delay in milliseconds
      }
    }
    console.log("Transaction Uncomfirmed");
    dispatch(updateStatus("fail"));
    return false;
  } else {
    console.log("Transaction Failed: transactionID: ", transactionId);
    // to do save an error log
    dispatch(updateStatus("fail"));
    return false;
  }
}

export default verifyTransaction;

async function saveTransaction(
  transaction: SwapTransaction,
  transactionId: string,
  wallet: ConnectedSolanaWallet,
  user_id: string,
) {
  // Use the transaction's public keys or fall back to the wallet's public key
  const inputPublicKey = transaction.inputPublicKey;
  const outputPublicKey = transaction.outputPublicKey;

  if (!inputPublicKey || !outputPublicKey) {
    console.error("Missing public keys:", { inputPublicKey, outputPublicKey });
    return;
  }

  console.log(
    "Transaction: ",
    "user_id:", user_id,
    "input_amount:", transaction.sell.amount,
    "output_amount:", transaction.buy.amount,
    "input_chain:", "solana",
    "output_chain:", "solana",
    "input_public_key:", inputPublicKey,
    "output_public_key:", outputPublicKey,
    "input_currency:", transaction.sell.assetId,
    "output_currency:", transaction.buy.assetId,
    "transaction_type:", "solana-jupiter",
    "transaction_hash:", transactionId,
    "transaction_status:", "success"
  );

  // Call the swap transaction endpoint
  const response = await fetch(`${MYFYE_BACKEND}/create_swap_transaction`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': MYFYE_BACKEND_KEY,
    },
    body: JSON.stringify({
      user_id: user_id,
      input_amount: transaction.sell.amount,
      output_amount: transaction.buy.amount,
      input_chain: "solana",
      output_chain: "solana",
      input_public_key: inputPublicKey,
      output_public_key: outputPublicKey,
      input_currency: transaction.sell.assetId,
      output_currency: transaction.buy.assetId,
      transaction_type: "solana-jupiter",
      transaction_hash: transactionId,
      transaction_status: "success"
    })
  });

  if (!response.ok) {
    console.error("Failed to save swap transaction:", await response.text());
    throw new Error("Failed to save swap transaction");
  }

  return response.json();
}

function updateBalances(
  dispatch: Dispatch,
  transaction: SwapTransaction,
  assets: AssetsState
) {
  const balances = {
    btcSol: assets.assets["btc_sol"].balance,
    xrpSol: assets.assets["xrp_sol"].balance,
    usdcSol: assets.assets["usdc_sol"].balance,
    usdySol: assets.assets["usdy_sol"].balance,
    eurcSol: assets.assets["eurc_sol"].balance,
    dogeSol: assets.assets["doge_sol"].balance,
    suiSol: assets.assets["sui_sol"].balance,
    sol: assets.assets["sol"].balance,
  };

  const { sell, buy } = transaction;

  if (!sell.amount || !buy.amount) {
    console.warn(`Buy or sell amount is null, cannot update balances:`, {
      sellAmount: sell.amount,
      buyAmount: buy.amount,
    });
    return; // Return early instead of throwing an error
  }

  const buyActions = {
    btcSol: () => {
      dispatch(
        updateBalance({
          assetId: "btc_sol",
          balance: balances.btcSol + buy.amount,
        })
      );
      console.log(`added ${buy.amount} to btc balance`);
    },
    xrpSol: () => {
      dispatch(
        updateBalance({
          assetId: "xrp_sol",
          balance: balances.xrpSol + buy.amount,
        })
      );
      console.log(`added ${buy.amount} to xrp balance`);
    },
    dogeSol: () => {
      dispatch(
        updateBalance({
          assetId: "doge_sol",
          balance: balances.dogeSol + buy.amount,
        })
      );
      console.log(`added ${buy.amount} to doge balance`);
    },
    suiSol: () => {
      dispatch(
        updateBalance({
          assetId: "sui_sol",
          balance: balances.suiSol + buy.amount,
        })
      );
      console.log(`added ${buy.amount} to sui balance`);
    },
    usdcSol: () => {
      dispatch(
        updateBalance({
          assetId: "usdc_sol",
          balance: balances.usdcSol + buy.amount,
        })
      );
      console.log(`added ${buy.amount} to usdc balance`);
    },
    usdySol: () => {
      dispatch(
        updateBalance({
          assetId: "usdy_sol",
          balance: balances.usdySol + buy.amount,
        })
      );
      console.log(`added ${buy.amount} to usdy balance`);
    },
    eurcSol: () => {
      dispatch(
        updateBalance({
          assetId: "eurc_sol",
          balance: balances.eurcSol + buy.amount,
        })
      );
      console.log(`added ${buy.amount} to eurc balance`);
    },
    sol: () => {
      dispatch(
        updateBalance({
          assetId: "sol",
          balance: balances.sol + buy.amount,
        })
      );
      console.log(`added ${buy.amount} to sol balance`);
    },
  };

  const sellActions = {
    btcSol: () => {
      const newBalance = Math.max(0, balances.btcSol - sell.amount);
      dispatch(
        updateBalance({
          assetId: "btc_sol",
          balance: newBalance,
        })
      );
    },
    xrpSol: () => {
      const newBalance = Math.max(0, balances.xrpSol - sell.amount);
      dispatch(
        updateBalance({
          assetId: "xrp_sol",
          balance: newBalance,
        })
      );
    },
    dogeSol: () => {
      const newBalance = Math.max(0, balances.dogeSol - sell.amount);
      dispatch(
        updateBalance({
          assetId: "doge_sol",
          balance: newBalance,
        })
      );
    },
    suiSol: () => {
      const newBalance = Math.max(0, balances.suiSol - sell.amount);
      dispatch(
        updateBalance({
          assetId: "sui_sol",
          balance: newBalance,
        })
      );
    },
    usdcSol: () => {
      const newBalance = Math.max(0, balances.usdcSol - sell.amount);
      dispatch(
        updateBalance({
          assetId: "usdc_sol",
          balance: newBalance,
        })
      );
    },
    usdySol: () => {
      const newBalance = Math.max(0, balances.usdySol - sell.amount);
      dispatch(
        updateBalance({
          assetId: "usdy_sol",
          balance: newBalance,
        })
      );
    },
    eurcSol: () => {
      const newBalance = Math.max(0, balances.eurcSol - sell.amount);
      dispatch(
        updateBalance({
          assetId: "eurc_sol",
          balance: newBalance,
        })
      );
    },
    sol: () => {
      const newBalance = Math.max(0, balances.sol - sell.amount);
      dispatch(
        updateBalance({
          assetId: "sol",
          balance: newBalance,
        })
      );
    },
    usdtSol: () => {
      const newBalance = Math.max(0, balances.usdtSol - sell.amount);
      dispatch(
        updateBalance({
          assetId: "usdt_sol",
          balance: newBalance,
        })
      );
    },
  };

  if (!sell.assetId || !buy.assetId) {
    console.error("Missing asset IDs in transaction:", { sell, buy });
    return; // Return early instead of throwing an error
  }

  // Map the mint addresses to our asset IDs
  const sellAssetId = mapMintToAssetId(sell.assetId);
  const buyAssetId = mapMintToAssetId(buy.assetId);
  console.log("Original mint addresses:", { sellMint: sell.assetId, buyMint: buy.assetId });
  console.log("Mapped asset IDs:", { sellAssetId, buyAssetId });
  console.log("Available action keys:", {
    sellActions: Object.keys(sellActions),
    buyActions: Object.keys(buyActions)
  });

  if (!sellActions[sellAssetId] || !buyActions[buyAssetId]) {
    console.error("Invalid asset IDs:", { 
      sellAssetId, 
      buyAssetId,
      availableSellActions: Object.keys(sellActions),
      availableBuyActions: Object.keys(buyActions)
    });
    return; // Return early instead of throwing an error
  }

  console.log("Executing sell action for:", sellAssetId);
  sellActions[sellAssetId]();
  console.log("Executing buy action for:", buyAssetId);
  buyActions[buyAssetId]();
}


// Helper function to map asset IDs to mint addresses
function mapMintToAssetId(mintAddress: string): string {
  // Map of mint addresses to asset IDs (matching the action map keys)
  const mintToAssetMap: Record<string, string> = {
    "So11111111111111111111111111111111111111112": "sol",
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "usdcSol",
    "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": "usdtSol",
    "A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6": "usdySol",
    "HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr": "eurcSol",
    "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij": "btcSol", // BUG ? should be 9n4nb2ow5xB2ywvDy8v52N2qN1xzybapC8G4wEGGkZwyTDt1v
    "2jcHBYd9T2Mc9nhvFEBCDuBN1XjbbQUVow67WGWhv6zT": "xrpSol",
    "BFARNBVWNfZfh3JQJLhogQJ9bkop4Y8LaDHeSxDDk5nn": "dogeSol",
    "756wWVqA9tpZpxqNxCiJYSCGWi3gD2NXfwKHh4YsYJg9": "suiSol"
    // Add more mappings as needed
  };

  const mappedId = mintToAssetMap[mintAddress];
  if (!mappedId) {
    console.error("Unknown mint address:", mintAddress);
    return mintAddress;
  }
  return mappedId;
}
