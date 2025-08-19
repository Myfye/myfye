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
import { assetId } from "@/functions/MintAddress.tsx";

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
  const { sell, buy } = transaction;

  if (!sell.amount || !buy.amount) {
    console.warn(`Buy or sell amount is null, cannot update balances:`, {
      sellAmount: sell.amount,
      buyAmount: buy.amount,
    });
    return;
  }

  if (!sell.assetId || !buy.assetId) {
    console.error("Missing asset IDs in transaction:", { sell, buy });
    return;
  }

  // Get current balances for sell and buy assets
  const sellAsset = assets.assets[sell.assetId];
  const buyAsset = assets.assets[buy.assetId];

  if (!sellAsset || !buyAsset) {
    console.error("Assets not found in state:", { 
      sellAssetId: sell.assetId, 
      buyAssetId: buy.assetId,
      availableAssets: Object.keys(assets.assets)
    });
    return;
  }

  // Update sell asset balance (subtract the sold amount)
  const newSellBalance = Math.max(0, sellAsset.balance - sell.amount);
  dispatch(
    updateBalance({
      assetId: sell.assetId,
      balance: newSellBalance,
    })
  );
  console.log(`Subtracted ${sell.amount} from ${sell.assetId} balance (new balance: ${newSellBalance})`);

  // Update buy asset balance (add the bought amount)
  const newBuyBalance = buyAsset.balance + buy.amount;
  dispatch(
    updateBalance({
      assetId: buy.assetId,
      balance: newBuyBalance,
    })
  );
  console.log(`Added ${buy.amount} to ${buy.assetId} balance (new balance: ${newBuyBalance})`);
}



