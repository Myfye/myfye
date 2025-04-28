import { Connection } from "@solana/web3.js";
import { HELIUS_API_KEY } from "../../../env.ts";
import { SwapTransaction, updateId, updateStatus } from "../swapSlice.ts";
import { Dispatch } from "redux";
import { ConnectedSolanaWallet } from "@privy-io/react-auth";
import { AssetsState } from "@/features/assets/types.ts";
import { updateBalance } from "@/features/assets/assetsSlice.ts";
import { saveNewSwapTransaction } from "@/functions/SaveNewTransaction.tsx";

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
          console.log("Transaction details:", JSON.stringify(transaction, null, 2));
          console.log("Transaction: ", 
            "user_id", 
            "input_amount", transaction.sell.amount,
            "output_amount", transaction.buy.amount,
            "input_chain", "solana",
            "output_chain", transaction.buy.chain,
            "creation_date", new Date().toISOString(),
            "public_key", wallet.publicKey,
            "input_currency", transaction.sell.assetId,
            "output_currency", transaction.buy.assetId,
            "transaction_type", transaction.transactionType,
            "transaction_hash", transactionId,
            "transaction_status", "success"
          );
          dispatch(updateStatus("success"));
          dispatch(updateId(transactionId));
          
          // Check if amounts are null before calling updateBalances
          if (!transaction.sell.amount || !transaction.buy.amount) {
            console.error("Amounts are null, cannot update balances:", {
              sellAmount: transaction.sell.amount,
              buyAmount: transaction.buy.amount
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

function updateBalances(
  dispatch: Dispatch,
  transaction: SwapTransaction,
  assets: AssetsState
) {
  const balances = {
    btcSol: assets.assets["btc_sol"].balance,
    usdcSol: assets.assets["usdc_sol"].balance,
    usdySol: assets.assets["usdy_sol"].balance,
    eurcSol: assets.assets["eurc_sol"].balance,
    sol: assets.assets["sol"].balance,
  };

  const { sell, buy } = transaction;

  if (!sell.amount || !buy.amount) {
    console.warn(`Buy or sell amount is null, cannot update balances:`, {
      sellAmount: sell.amount,
      buyAmount: buy.amount
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
      dispatch(
        updateBalance({
          assetId: "btc_sol",
          balance: balances.btcSol - sell.amount,
        })
      );
      console.log(`subtracted ${sell.amount} from btc balance`);
    },
    usdcSol: () => {
      dispatch(
        updateBalance({
          assetId: "usdc_sol",
          balance: balances.usdcSol - sell.amount,
        })
      );
      console.log(`subtracted ${sell.amount} from usdc balance`);
    },
    usdySol: () => {
      dispatch(
        updateBalance({
          assetId: "usdy_sol",
          balance: balances.usdySol - sell.amount,
        })
      );
      console.log(`subtracted ${sell.amount} from usdy balance`);
    },
    eurcSol: () => {
      dispatch(
        updateBalance({
          assetId: "eurc_sol",
          balance: balances.eurcSol - sell.amount,
        })
      );
      console.log(`subtracted ${sell.amount} from eurc balance`);
    },
    sol: () => {
      dispatch(
        updateBalance({
          assetId: "sol",
          balance: balances.sol - sell.amount,
        })
      );
      console.log(`subtracted ${sell.amount} from sol balance`);
    },
  };

  if (!sell.assetId || !buy.assetId) {
    console.error("Missing asset IDs in transaction:", { sell, buy });
    return; // Return early instead of throwing an error
  }

  // Map the mint addresses to our asset IDs if needed
  const sellAssetId = mapMintToAssetId(sell.assetId);
  const buyAssetId = mapMintToAssetId(buy.assetId);

  if (!sellActions[sellAssetId] || !buyActions[buyAssetId]) {
    console.error("Invalid asset IDs:", { sellAssetId, buyAssetId });
    return; // Return early instead of throwing an error
  }
  
  sellActions[sellAssetId]();
  buyActions[buyAssetId]();
}

// Helper function to map mint addresses to asset IDs
function mapMintToAssetId(mintAddress: string): string {
  // Map of mint addresses to asset IDs
  const mintToAssetMap: Record<string, string> = {
    "So11111111111111111111111111111111111111112": "sol",
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "usdc_sol",
    "A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6": "usdy_sol",
    "2wpTqWqJwYwUp3UF9L3on7bq8GpAVydo1bHh5gqZq5Y": "eurc_sol",
    "9n4nb2ow5xB2ywvDy8v52N2qkqZZzQ3H5PJsrZnSGxan": "btc_sol",
    // Add more mappings as needed
  };
  
  return mintToAssetMap[mintAddress] || mintAddress;
}
