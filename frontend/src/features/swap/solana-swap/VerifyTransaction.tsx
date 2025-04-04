import { Connection } from "@solana/web3.js";
import { HELIUS_API_KEY } from "../../../env.ts";
import { SwapTransaction, updateStatus } from "../swapSlice.ts";
import {
  UserWalletDataState,
  setbtcSolValue,
  seteurcSolValue,
  setsolValue,
  setusdcSolValue,
  setusdySolValue,
} from "@/redux/userWalletData.tsx";
import { Dispatch } from "redux";
import { ConnectedSolanaWallet } from "@privy-io/react-auth";

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
  walletData: UserWalletDataState
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
          updateBalances(dispatch, transaction, walletData);
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
  walletData: UserWalletDataState
) {
  const balances = {
    btcSol: walletData.btcSolBalance,
    usdcSol: walletData.usdcSolBalance,
    usdySol: walletData.usdySolBalance,
    eurcSol: walletData.eurcSolBalance,
    sol: walletData.solBalance,
  };

  const { sell, buy } = transaction;

  if (!sell.amount || !buy.amount)
    throw new Error(`Buy or sell amount is null`);

  const buyActions = {
    btcSol: () => {
      dispatch(setbtcSolValue(balances.btcSol + buy.amount));
      console.log(`added ${buy.amount} to btc balance`);
    },
    usdcSol: () => {
      dispatch(setusdcSolValue(balances.usdcSol + buy.amount));
      console.log(`added ${buy.amount} to usdc balance`);
    },
    usdySol: () => {
      dispatch(setusdcSolValue(balances.usdySol + buy.amount));
      console.log(`added ${buy.amount} to usdy balance`);
    },
    eurcSol: () => {
      dispatch(seteurcSolValue(balances.eurcSol + buy.amount));
      console.log(`added ${buy.amount} to eurc balance`);
    },
    sol: () => {
      dispatch(setsolValue(balances.sol + buy.amount));
      console.log(`added ${buy.amount} to sol balance`);
    },
  };

  const sellActions = {
    btcSol: () => {
      dispatch(setbtcSolValue(balances.btcSol - sell.amount));
      console.log(`subtracted ${sell.amount} from btc balance`);
    },
    usdcSol: () => {
      void dispatch(setusdcSolValue(balances.usdcSol - sell.amount));
      console.log(`subtracted ${sell.amount} from usdc balance`);
    },
    usdySol: () => {
      void dispatch(setusdySolValue(balances.usdySol - sell.amount));
      console.log(`subtracted ${sell.amount} from usdy balance`);
    },
    eurcSol: () => {
      void dispatch(seteurcSolValue(balances.eurcSol - sell.amount));
      console.log(`subtracted ${sell.amount} from eurc balance`);
    },
    sol: () => {
      void dispatch(setsolValue(balances.sol - sell.amount));
      console.log(`subtracted ${sell.amount} from sol balance`);
    },
  };

  if (!sell.coinId || !buy.coinId)
    throw new Error(`Buy coin id or sell coin id is null`);

  if (!sellActions[sell.coinId] || !buyActions[buy.coinId]) {
    throw new Error(`Invalid transaction from ${sell.coinId} to ${buy.coinId}`);
  }
  sellActions[sell.coinId]();
  buyActions[buy.coinId]();
}
