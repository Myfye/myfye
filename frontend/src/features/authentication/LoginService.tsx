import {
  setRecentlyUsedSolanaAddresses,
  setCurrentUserKYCVerified,
  setcurrentUserEmail,
  setSolanaPubKey,
  setEvmPubKey,
  setMFAStatus,
  setPriceOfUSDYinUSDC,
  setPriceOfBTCinUSDC,
  setPriceOfEURCinUSDC,
  setPriceOfSOLinUSDC,
  setCurrentUserID,
  setPrivyUserId,
  setUsers,
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
        mode: 'cors',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          "x-api-key": MYFYE_BACKEND_KEY,
        },
        body: JSON.stringify({ email }),
      }
    );

    const existingUser = await checkUserResponse.json();

    if (!existingUser) {
      userCreationInProgress.add(email);

      try {
        const newUser = await createUser(email, privyUserId);
        return newUser;
      } finally {
        userCreationInProgress.delete(email);
      }
    }

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
    const createUserResponse = await fetch(
      `${MYFYE_BACKEND}/create_user`,
      {
        method: "POST",
        mode: 'cors',
        credentials: 'include',
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
      }
    );

    const newUser = await createUserResponse.json();
    console.log("Created new user:", newUser);
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

  console.log("Updating EVM public key MYFYE_BACKEND", MYFYE_BACKEND, "MYFYE_BACKEND_KEY", MYFYE_BACKEND_KEY);
  try {
    const response = await fetch(`${MYFYE_BACKEND}/update_evm_pub_key`, {
      method: "POST",
      mode: 'cors',
      credentials: 'include',
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
    const response = await fetch(
      `${MYFYE_BACKEND}/update_solana_pub_key`, 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": MYFYE_BACKEND_KEY,
        },
        body: JSON.stringify({
          privyUserId,
          solanaPubKey,
        }),
      }
    );

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
  priceOfUSDYinUSDC: number,
  priceOfBTCinUSDC: number,
  priceOfSOLinUSDC: number,
  priceOfEURCinUSDC: number
): Promise<{ success: boolean }> => {
  dispatch(setcurrentUserEmail(user.email.address));
  dispatch(setPrivyUserId(user.id));
  if (user) {
    try {
      const dbUser = await getUser(user.email.address, user.id);
      if (dbUser && dbUser.id) {
        dispatch(setCurrentUserID(dbUser.id));
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

  checkMFAState(user, dispatch)

  try {
    await Promise.all([
      getUSDYPriceQuote(priceOfUSDYinUSDC, dispatch),
      getBTCPriceQuote(priceOfBTCinUSDC, dispatch),
      getEURCPriceQuote(priceOfEURCinUSDC, dispatch),
      getSOLPriceQuote(priceOfSOLinUSDC, dispatch),
      getUserData(user.wallet.address, dispatch),
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
}

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
  price: number,
  dispatch: Function
): Promise<boolean> => {
  if (price <= 0.01) {
    const quote = await getSwapQuote();
    const priceInUSD = quote.outAmount / 1000000;
    if (priceInUSD && priceInUSD > 0.01) {
      dispatch(setPriceOfUSDYinUSDC(quote.outAmount / 1000000));
    } else {
      dispatch(setPriceOfUSDYinUSDC(1.09)); // default
    }
  }

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
  price: number,
  dispatch: Function
): Promise<boolean> => {
  if (price <= 0.01) {
    const quote = await getSwapQuote();
    const priceInUSD = quote.outAmount / 1000000;
    if (priceInUSD && priceInUSD > 0.01) {
      dispatch(setPriceOfBTCinUSDC(quote.outAmount / 10000));
    } else {
      dispatch(setPriceOfBTCinUSDC(100000)); // default to $100,000
    }
  }

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

const getEURCPriceQuote = async (
  price: number,
  dispatch: Function
): Promise<boolean> => {
  if (price <= 0.01) {
    const quote = await getSwapQuote();
    const priceInUSD = quote.outAmount / 1000000;
    if (priceInUSD && priceInUSD > 0.01) {
      dispatch(setPriceOfEURCinUSDC(priceInUSD));
    } else {
      dispatch(setPriceOfEURCinUSDC(1.025)); // default
    }
  }

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
  price: number,
  dispatch: Function
): Promise<boolean> => {
  console.log("getting SOLANA price quote");
  if (price <= 0.01) {
    const quote = await getSwapQuote();
    const priceInUSD = quote.outAmount / 1000000;
    if (priceInUSD && priceInUSD > 0.01) {
      console.log("SOLANA priceInUSD", priceInUSD);
      dispatch(setPriceOfSOLinUSDC(priceInUSD));
    } else {
      dispatch(setPriceOfSOLinUSDC(125)); // default
    }
  }

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

export async function getUsers(dispatch: Function) {
  const functions = getFunctions();
  const getUsersFn = httpsCallable(functions, "fetchPageOfUsers");

  let cursor = null;
  let users = [];

  try {
    const result: any = await getUsersFn({ cursor });

    if (!result.data.success) {
      console.error("Failed to fetch users:", result.data.error);
    }

    cursor = result.data.next_cursor;

    // Map the API response to User[]
    const mapToUsers = (result: any): User[] => {
      // Access the nested users array from the response
      const userData = result.data.users.data;

      // Map each user object to our User interface
      return userData.map(
        (user: any): User => ({
          created_at: user.created_at,
          has_accepted_terms: user.has_accepted_terms,
          id: user.id,
          is_guest: user.is_guest,
          linked_accounts: user.linked_accounts,
        })
      );
    };

    const users = mapToUsers(result);

    if (users) {
      dispatch(setUsers(users));
    }
  } catch (error) {
    console.error("Error calling fetchPageOfUsers:", error);
  }

  return users;
}

export { HandleUserLogIn };
