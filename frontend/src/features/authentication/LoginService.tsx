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
import { getUSDCBalanceOnBase } from "../../functions/checkForEVMDeposit.ts";
import { bridgeFromBaseToSolana } from "../../functions/bridge.ts";
import { getPriceQuotes } from "../../functions/priceQuotes.ts";
import { updateExchangeRateUSD } from "../../features/assets/assetsSlice.ts";

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
    return result;
  } catch (error) {
    console.error("Error updating Solana public key:", error);
    throw error;
  }
};

const HandleUserLogIn = async (
  user: any,
  dispatch: Function,
  wallets: any
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
        console.log(
          "BRIDGING USDC BASE AMOUNT to SOLANA AMOUNT evm and solana keys",
          dbUser.evm_pub_key,
          dbUser.solana_pub_key
        );
        console.log("BRIDGING running bridgeFromBaseToSolana", wallets);

        if (user.wallet && dbUser.solana_pub_key) {
          bridgeFromBaseToSolana(
            0.01,
            dbUser.evm_pub_key,
            dbUser.solana_pub_key
          );
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
    updateExchangeRateUSD({ assetId: "usdc_sol", exchangeRateUSD: 1 });
    updateExchangeRateUSD({ assetId: "usdt_sol", exchangeRateUSD: 1 });
    updateExchangeRateUSD({ assetId: "usdc_base", exchangeRateUSD: 1 });

    await getUserData(user.wallet.address, dispatch);
    await getPriceQuotes(dispatch);

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

export { HandleUserLogIn };
