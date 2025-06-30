import {
  setRecentlyUsedSolanaAddresses,
  setCurrentUserKYCVerified,
  setcurrentUserEmail,
  setSolanaPubKey,
  setEvmPubKey,
  setMFAStatus,
  setCurrentUserID,
  setPrivyUserId,
  setUsers,
  setBlindPayEvmWalletId,
  setBlindPayReceiverId,
} from "../../redux/userWalletData.tsx";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { PublicKey, Connection } from "@solana/web3.js";
import { useLoginWithPasskey } from "@privy-io/react-auth";
import { useSelector } from "react-redux";
import {
  getFunctions,
  httpsCallable,
  HttpsCallableResult,
} from "firebase/functions";
import { HELIUS_API_KEY, MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "../../env.ts";
import { updateExchangeRateUSD } from "../assets/assetsSlice.ts";
import {
  getAAPLPriceQuote,
  getMSFTPriceQuote,
  getGOOGLPriceQuote,
  getNFLXPriceQuote,
  getAMZNPriceQuote,
  getSQPriceQuote,
  getDISPriceQuote,
  getTSLAPriceQuote,
  getAMDPriceQuote,
  getSPYPriceQuote,
  getMSTRPriceQuote,
  getIAUPriceQuote,
  getKOPriceQuote,
  getAMCPriceQuote,
  getGMEPriceQuote
} from "../../functions/StockPrices.ts";
import { getUSDCBalanceOnBase } from '../../functions/checkForEVMDeposit.ts'
import { bridgeFromBaseToSolana } from '../../functions/bridge.ts'

const userCreationInProgress = new Set();

export const getUser = async (
  email: string,
  privyUserId?: string
): Promise<any> => {
  if (userCreationInProgress.has(email)) {
    return null;
  }

  try {
    const checkUserResponse = await fetch(
      `${MYFYE_BACKEND}/get_user_by_privy_id`,
      {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": MYFYE_BACKEND_KEY,
        },
        body: JSON.stringify({ privyUserId }),
      }
    );

    const existingUser = await checkUserResponse.json();

    if (!existingUser) {
      userCreationInProgress.add(email);

      try {
        const newUser = await createUser(email, privyUserId);
        console.log("Created new user:", newUser);
        return newUser;
      } finally {
        userCreationInProgress.delete(email);
      }
    }
    console.log("Existing user:", existingUser);
    return existingUser;
  } catch (error) {
    console.error("Error in getUser:", error);
    throw error;
  }
};

export const createUser = async (
  email: string,
  privyUserId: string
): Promise<any> => {
  try {
    const createUserResponse = await fetch(`${MYFYE_BACKEND}/create_user`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": MYFYE_BACKEND_KEY,
      },
      body: JSON.stringify({
        email,
        phoneNumber: null,
        firstName: null,
        lastName: null,
        country: null,
        evmPubKey: null,
        solanaPubKey: null,
        privyUserId,
        personaAccountId: null,
        blindPayReceiverId: null,
        blindPayEvmWalletId: null,
      }),
    });

    const newUser = await createUserResponse.json();
    console.log("User response:", newUser);
    return newUser;
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error;
  }
};

export const updateUserEvmPubKey = async (
  privyUserId: string,
  evmPubKey: string
): Promise<any> => {
  console.log(
    "Updating EVM public key MYFYE_BACKEND",
    MYFYE_BACKEND,
    "MYFYE_BACKEND_KEY",
    MYFYE_BACKEND_KEY
  );
  try {
    const response = await fetch(`${MYFYE_BACKEND}/update_evm_pub_key`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": MYFYE_BACKEND_KEY,
      },
      body: JSON.stringify({
        privyUserId,
        evmPubKey,
      }),
    });

    const result = await response.json();
    console.log("Updated EVM public key:", result);
    return result;
  } catch (error) {
    console.error("Error updating EVM public key:", error);
    throw error;
  }
};

export const updateUserSolanaPubKey = async (
  privyUserId: string,
  solanaPubKey: string
): Promise<any> => {
  try {
    const response = await fetch(`${MYFYE_BACKEND}/update_solana_pub_key`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": MYFYE_BACKEND_KEY,
      },
      body: JSON.stringify({
        privyUserId,
        solanaPubKey,
      }),
    });

    const result = await response.json();
    console.log("Updated Solana public key:", result);
    return result;
  } catch (error) {
    console.error("Error updating Solana public key:", error);
    throw error;
  }
};

const HandleUserLogIn = async (
  user: any,
  dispatch: Function,
  wallets: any,
): Promise<{ success: boolean }> => {

  

  dispatch(setcurrentUserEmail(user.email.address));
  dispatch(setPrivyUserId(user.id));
  if (user) {
    try {
      const dbUser = await getUser(user.email.address, user.id); // user.id is privyUserId 
      if (dbUser && dbUser.uid) {
        dispatch(setCurrentUserID(dbUser.uid));
        console.log("dbUser.KYCverified", dbUser.kyc_verified);
        dispatch(setCurrentUserKYCVerified(dbUser.kyc_verified));
        dispatch(setBlindPayEvmWalletId(dbUser.blind_pay_evm_wallet_id));
        dispatch(setBlindPayReceiverId(dbUser.blind_pay_receiver_id));

        //getUSDCBalanceOnBase(dbUser.evm_pub_key, dbUser.solana_pub_key);
        console.log('BRIDGING USDC BASE AMOUNT to SOLANA AMOUNT evm and solana keys', dbUser.evm_pub_key, dbUser.solana_pub_key)
        console.log('BRIDGING running bridgeFromBaseToSolana', wallets)

        if (user.wallet && dbUser.solana_pub_key) {
          bridgeFromBaseToSolana(0.01, dbUser.evm_pub_key, dbUser.solana_pub_key);
        }
      }
      
    } catch (error) {
      console.error("Error handling user:", error);
    }
  }

  if (user.wallet) {
    dispatch(setEvmPubKey(user.wallet.address));

    // Update the EVM public key in the database
    try {
      await updateUserEvmPubKey(user.id, user.wallet.address);
    } catch (error) {
      console.error("Error updating EVM public key:", error);
    }
  }

  checkMFAState(user, dispatch);

  // Get price quotes for all assets
  try {
    await Promise.all([
      // Stock prices
      getAAPLPriceQuote(dispatch),
      getMSFTPriceQuote(dispatch),
      getGOOGLPriceQuote(dispatch),
      getNFLXPriceQuote(dispatch),
      getAMZNPriceQuote(dispatch),
      getSQPriceQuote(dispatch),
      getDISPriceQuote(dispatch),
      getTSLAPriceQuote(dispatch),
      getAMDPriceQuote(dispatch),
      getSPYPriceQuote(dispatch),
      getMSTRPriceQuote(dispatch),
      getIAUPriceQuote(dispatch),
      getKOPriceQuote(dispatch),
      getAMCPriceQuote(dispatch),
      getGMEPriceQuote(dispatch),
      // On-chain assets
      getUSDYPriceQuote(dispatch),
      getBTCPriceQuote(dispatch),
      getEURCPriceQuote(dispatch),
      getSOLPriceQuote(dispatch),
      getXRPPriceQuote(dispatch),
      getSUIPriceQuote(dispatch),
      getDOGEPriceQuote(dispatch),
      getUserData(user.wallet.address, dispatch),
      // need to update these
      updateExchangeRateUSD({ assetId: "usdc_sol", exchangeRateUSD: 1 }),
      updateExchangeRateUSD({ assetId: "usdt_sol", exchangeRateUSD: 1 }),
      updateExchangeRateUSD({ assetId: "usdc_base", exchangeRateUSD: 1 }),
    ]);
    return { success: true };
  } catch (e) {
    console.error("Error fetching user data or balances:", e);
    return { success: false };
  }
};

const checkMFAState = async (user: any, dispatch: Function) => {
  if (!user) return;

  // Check mfaMethods if they exist
  if (user.mfaMethods && Array.isArray(user.mfaMethods)) {
    for (const mfaMethod of user.mfaMethods) {
      if (mfaMethod === "passkey") {
        dispatch(setMFAStatus("enrolled"));
        return;
      }
    }
  }

  // Check linkedAccounts if they exist
  if (user.linkedAccounts && Array.isArray(user.linkedAccounts)) {
    for (const linkedAccount of user.linkedAccounts) {
      if (linkedAccount.type === "passkey") {
        dispatch(setMFAStatus("createdPasskey"));
        return;
      }
    }
  }

  // If no MFA is found, set empty status
  dispatch(setMFAStatus(""));
};

export const getUserData = async (
  pubKey: string,
  dispatch: Function
): Promise<boolean> => {
  const db = getFirestore();
  const pubKeyDocRef = doc(db, "pubKeys", pubKey);

  const docSnapshot = await getDoc(pubKeyDocRef);
  const data = docSnapshot.data();

  if (data) {
    if (data.recentlyUsedAddresses) {
      dispatch(setRecentlyUsedSolanaAddresses(data.recentlyUsedAddresses));
    }
    if (data.KYCverified) {
      dispatch(setCurrentUserKYCVerified(data.KYCverified));
    }
  }
  return true;
};

const getUSDYPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  const quote = await getSwapQuote();
  const priceInUSD = quote.outAmount / 1000000;
  dispatch(
    updateExchangeRateUSD({
      assetId: "usdy_sol",
      exchangeRateUSD: quote.outAmount / 1000000,
    })
  );

  async function getSwapQuote() {
    const outputMintAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
    const inputMintAddress = "A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6"; // USDY

    const quoteResponse = await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMintAddress}&amount=${
        1 * 1000000
      }&slippageBps=50`
    ).then((response) => response.json());

    return quoteResponse;
  }

  return true;
};

const getBTCPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  const quote = await getSwapQuote();
  const priceInUSD = quote.outAmount / 1000000;
  dispatch(
    updateExchangeRateUSD({
      assetId: "btc_sol",
      exchangeRateUSD: quote.outAmount / 10000,
    })
  );

  async function getSwapQuote() {
    const outputMintAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
    const inputMintAddress = "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij"; // BTC

    const quoteResponse = await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMintAddress}&amount=${
        1 * 1000000
      }&slippageBps=50`
    ).then((response) => response.json());

    return quoteResponse;
  }

  return true;
};

const getXRPPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  const quote = await getSwapQuote();
  const priceInUSD = quote.outAmount / 1000;
  console.log("XRP priceInUSD", priceInUSD);
  dispatch(
    updateExchangeRateUSD({
      assetId: "xrp_sol",
      exchangeRateUSD: priceInUSD,
    })
  );

  async function getSwapQuote() {
    const outputMintAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
    const inputMintAddress = "2jcHBYd9T2Mc9nhvFEBCDuBN1XjbbQUVow67WGWhv6zT"; // XRP

    const quoteResponse = await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMintAddress}&amount=${
        1 * 1000000
      }&slippageBps=50`
    ).then((response) => response.json());

    console.log("XRP quote response:", quoteResponse);
    return quoteResponse;
  }

  return true;
};

const getSUIPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  const quote = await getSwapQuote();
  const priceInUSD = quote.outAmount / 1000;
  console.log("SUI priceInUSD", priceInUSD);
  dispatch(
    updateExchangeRateUSD({
      assetId: "sui_sol",
      exchangeRateUSD: priceInUSD,
    })
  );

  async function getSwapQuote() {
    const outputMintAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
    const inputMintAddress = "756wWVqA9tpZpxqNxCiJYSCGWi3gD2NXfwKHh4YsYJg9";

    const quoteResponse = await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMintAddress}&amount=${
        1 * 1000000
      }&slippageBps=50`
    ).then((response) => response.json());

    console.log("SUI quote response:", quoteResponse);
    return quoteResponse;
  }

  return true;
};

const getDOGEPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  const quote = await getSwapQuote();
  const priceInUSD = quote.outAmount / 1000;
  console.log("DOGE priceInUSD", priceInUSD);
  dispatch(
    updateExchangeRateUSD({
      assetId: "doge_sol",
      exchangeRateUSD: priceInUSD,
    })
  );

  async function getSwapQuote() {
    const outputMintAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
    const inputMintAddress = "BFARNBVWNfZfh3JQJLhogQJ9bkop4Y8LaDHeSxDDk5nn";

    const quoteResponse = await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMintAddress}&amount=${
        1 * 1000000
      }&slippageBps=50`
    ).then((response) => response.json());

    console.log("DOGE quote response:", quoteResponse);
    return quoteResponse;
  }

  return true;
};

const getEURCPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  const quote = await getSwapQuote();
  const priceInUSD = quote.outAmount / 1000000;
  dispatch(
    updateExchangeRateUSD({
      assetId: "eurc_sol",
      exchangeRateUSD: priceInUSD,
    })
  );


  async function getSwapQuote() {
    const outputMintAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
    const inputMintAddress = "HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr"; // EURC

    const quoteResponse = await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMintAddress}&amount=${
        1 * 1000000
      }&slippageBps=50`
    ).then((response) => response.json());

    return quoteResponse;
  }

  return true;
};

const getSOLPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  console.log("getting SOLANA price quote");
  const quote = await getSwapQuote();
  const priceInUSD = quote.outAmount / 1000000;
  console.log("SOLANA priceInUSD", priceInUSD);
  dispatch(
    updateExchangeRateUSD({
      assetId: "sol",
      exchangeRateUSD: priceInUSD,
    })
  );


  async function getSwapQuote() {
    const outputMintAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
    const inputMintAddress = "So11111111111111111111111111111111111111112"; // wSOL wrapped solana

    const quoteResponse = await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMintAddress}&amount=${1_000_000_000}&slippageBps=50`
    ).then((response) => response.json());
    return quoteResponse;
  }

  return true;
};

export { HandleUserLogIn };
