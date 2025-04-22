import { Connection } from "@solana/web3.js";
import { HELIUS_API_KEY } from "../../../env.ts";
import { SwapTransaction, updateId, updateStatus } from "../swapSlice.ts";
import { Dispatch } from "redux";
import { ConnectedSolanaWallet } from "@privy-io/react-auth";
import { AssetsState } from "@/features/assets/types.ts";
import { updateBalance } from "@/features/assets/assetsSlice.ts";

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
          dispatch(updateStatus("success"));
          dispatch(updateId(transactionId));
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
        await delay(1000); // Delay in milliseconds
      }
    }
    console.log("Transaction Uncomfirmed");
    dispatch(updateStatus("fail"));
    return false;
  } else {
    console.log("Transaction Failed: transactionID: ", transactionId);
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

  if (sell.amount || !buy.amount) throw new Error(`Buy or sell amount is null`);

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

  if (!sell.assetId || !buy.assetId)
    throw new Error(`Buy coin id or sell coin id is null`);

  if (!sellActions[sell.assetId] || !buyActions[buy.assetId]) {
    throw new Error(
      `Invalid transaction from ${sell.assetId} to ${buy.assetId}`
    );
  }
  sellActions[sell.assetId]();
  buyActions[buy.assetId]();
}
