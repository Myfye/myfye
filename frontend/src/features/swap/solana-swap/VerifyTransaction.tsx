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
  // Add debugging to see what assets are available
  console.log("Available assets:", Object.keys(assets.assets));
  console.log("COIN_sol asset:", assets.assets["COIN_sol"]);
  
  // Check which assets are missing
      const requiredAssets = [
      "btc_sol", "xrp_sol", "usdc_sol", "usdy_sol", "eurc_sol", "doge_sol", "sui_sol", "sol",
      "AAPL", "MSFT", "AMZN", "GOOGL", "NVDA", "TSLA", "NFLX", "KO",
      "WMT", "JPM", "SPY", "LLY", "AVGO", "JNJ", "V", "UNH",
      "XOM", "MA", "PG", "HD", "CVX", "MRK", "PFE", "ABT",
      "ABBV", "ACN", "AZN", "BAC", "BRK.B", "CSCO", "COIN", "CMCSA",
      "CRWD", "DHR", "GS", "HON", "IBM", "INTC", "LIN", "MRVL",
      "MCD", "MDT", "NDAQ", "NVO", "ORCL", "PLTR", "PM", "HOOD",
      "CRM", "TMO", "MSTR", "GME"
    ];
  
  const missingAssets = requiredAssets.filter(asset => !assets.assets[asset]);
  console.log("Missing assets:", missingAssets);
  
  const balances = {
    btcSol: assets.assets["btc_sol"].balance,
    xrpSol: assets.assets["xrp_sol"].balance,
    usdcSol: assets.assets["usdc_sol"].balance,
    usdySol: assets.assets["usdy_sol"].balance,
    eurcSol: assets.assets["eurc_sol"].balance,
    dogeSol: assets.assets["doge_sol"].balance,
    suiSol: assets.assets["sui_sol"].balance,
    sol: assets.assets["sol"].balance,
    // Stock balances
    aaplSol: assets.assets["AAPL_sol"].balance,
    //msftSol: assets.assets["MSFT_sol"].balance,
    //amznSol: assets.assets["AMZN_sol"].balance,
    //googlSol: assets.assets["GOOGL_sol"].balance,
    nvdaSol: assets.assets["NVDA_sol"].balance,
    tslaSol: assets.assets["TSLA_sol"].balance,
    //nflxSol: assets.assets["NFLX_sol"].balance,
    //koSol: assets.assets["KO_sol"].balance,
    //wmtSol: assets.assets["WMT_sol"].balance,
    //jpmSol: assets.assets["JPM_sol"].balance,
    spySol: assets.assets["SPY_sol"].balance,
    //llySol: assets.assets["LLY_sol"].balance,
    //avgoSol: assets.assets["AVGO_sol"].balance,
    //jnjSol: assets.assets["JNJ_sol"].balance,
    //vSol: assets.assets["V_sol"].balance,
    //unhSol: assets.assets["UNH_sol"].balance,
    //xomSol: assets.assets["XOM_sol"].balance,
    //maSol: assets.assets["MA_sol"].balance,
    //pgSol: assets.assets["PG_sol"].balance,
    //hdSol: assets.assets["HD_sol"].balance,
    //cvxSol: assets.assets["CVX_sol"].balance,
    //mrkSol: assets.assets["MRK_sol"].balance,
    //pfeSol: assets.assets["PFE_sol"].balance,
    //abtSol: assets.assets["ABT_sol"].balance,
    //abbvSol: assets.assets["ABBV_sol"].balance,
    //acnSol: assets.assets["ACN_sol"].balance,
    //aznSol: assets.assets["AZN_sol"].balance,
    //bacSol: assets.assets["BAC_sol"].balance,
    //brkBSol: assets.assets["BRK.B_sol"].balance,
    //cscoSol: assets.assets["CSCO_sol"].balance,
    coinSol: assets.assets["COIN_sol"].balance,
    //cmcsaSol: assets.assets["CMCSA_sol"].balance,
    //crwdSol: assets.assets["CRWD_sol"].balance,
    //dhrSol: assets.assets["DHR_sol"].balance,
    //gsSol: assets.assets["GS_sol"].balance,
    //honSol: assets.assets["HON_sol"].balance,
    //ibmSol: assets.assets["IBM_sol"].balance,
    //intcSol: assets.assets["INTC_sol"].balance,
    //linSol: assets.assets["LIN_sol"].balance,
    //mrvlSol: assets.assets["MRVL_sol"].balance,
    //mcdSol: assets.assets["MCD_sol"].balance,
    //mdtSol: assets.assets["MDT_sol"].balance,
    //ndaqSol: assets.assets["NDAQ_sol"].balance,
    //nvoSol: assets.assets["NVO_sol"].balance,
    //orclSol: assets.assets["ORCL_sol"].balance,
    //pltrSol: assets.assets["PLTR_sol"].balance,
    //pmSol: assets.assets["PM_sol"].balance,
    //hoodSol: assets.assets["HOOD_sol"].balance,
    //crmSol: assets.assets["CRM_sol"].balance,
    //tmoSol: assets.assets["TMO_sol"].balance,
    //mstrSol: assets.assets["MSTR_sol"].balance,
    //gmeSol: assets.assets["GME_sol"].balance,
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
    // Stock buy actions
    AAPL: () => {
      dispatch(
        updateBalance({
          assetId: "AAPL_sol",
          balance: balances.aaplSol + buy.amount,
        })
      );
      console.log(`added ${buy.amount} to aapl balance`);
    },
    NVDA: () => {
      dispatch(
        updateBalance({
          assetId: "NVDA_sol",
          balance: balances.nvdaSol + buy.amount,
        })
      );
      console.log(`added ${buy.amount} to nvda balance`);
    },
    TSLA: () => {
      dispatch(
        updateBalance({
          assetId: "TSLA_sol",
          balance: balances.tslaSol + buy.amount,
        })
      );
      console.log(`added ${buy.amount} to tsla balance`);
    },
    SPY: () => {
      dispatch(
        updateBalance({
          assetId: "SPY_sol",
          balance: balances.spySol + buy.amount,
        })
      );
      console.log(`added ${buy.amount} to spy balance`);
    },
    COIN: () => {
      console.log("adding coin balance", balances.coinSol, buy.amount)
      dispatch(
        updateBalance({
          assetId: "COIN_sol",
          balance: balances.coinSol + buy.amount,
        })
      );
      console.log(`added ${buy.amount} to coin balance`);
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
    // Stock sell actions
    AAPL: () => {
      const newBalance = Math.max(0, balances.aaplSol - sell.amount);
      dispatch(
        updateBalance({
          assetId: "AAPL_sol",
          balance: newBalance,
        })
      );
    },
    NVDA: () => {
      const newBalance = Math.max(0, balances.nvdaSol - sell.amount);
      dispatch(
        updateBalance({
          assetId: "NVDA_sol",
          balance: newBalance,
        })
      );
    },
    TSLA: () => {
      const newBalance = Math.max(0, balances.tslaSol - sell.amount);
      dispatch(
        updateBalance({
          assetId: "TSLA_sol",
          balance: newBalance,
        })
      );
    },
    SPY: () => {
      const newBalance = Math.max(0, balances.spySol - sell.amount);
      dispatch(
        updateBalance({
          assetId: "SPY_sol",
          balance: newBalance,
        })
      );
    },
    COIN: () => {
      const newBalance = Math.max(0, balances.coinSol - sell.amount);
      dispatch(
        updateBalance({
          assetId: "COIN_sol",
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
  const sellAssetId = assetId(sell.assetId);
  const buyAssetId = assetId(buy.assetId);
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



