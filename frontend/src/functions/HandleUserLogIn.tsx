import { 
    setsolValue,
    setusdcSolValue, 
    setusdtSolValue, 
    setpyusdSolValue,
    seteurcSolValue,
    setbtcSolValue,
    setusdySolValue,
    setRecentlyUsedSolanaAddresses,
    setCurrentUserKYCVerified,
    setcurrentUserEmail,
    setWalletPubKey,
    setPassKeyState,
    setPriceOfUSDYinUSDC,
    setPriceOfBTCinUSDC,
    setPriceOfEURCinUSDC,
    setUsers
    } from '../redux/userWalletData.tsx';
import { 
    getFirestore, 
    getDoc, 
    doc
    } from 'firebase/firestore';
import { 
    PublicKey, 
    Connection, 
    } from "@solana/web3.js";
import {useLoginWithPasskey} from '@privy-io/react-auth';
import { useSelector } from 'react-redux';
import { getFunctions, httpsCallable, HttpsCallableResult } from 'firebase/functions';
import User from './UserInterface.tsx';
import { HELIUS_API_KEY } from "../env.ts";

const HandleUserLogIn = async (
  user: any, 
  dispatch: Function,
  priceOfUSDYinUSDC: number,
  priceOfBTCinUSDC: number,
  priceOfEURCinUSDC: number ): Promise<{ success: boolean;}> => {

    console.log('user', user)

    // Set some user data
    dispatch(setcurrentUserEmail(user.email.address))
    dispatch(setWalletPubKey(user.wallet.address))
    
    // Check if the user has set up a pass key
    for (const linkedAccount of user.linkedAccounts) {
      if (linkedAccount.type === 'passkey') {
        await UpdatePasskey(dispatch);
      }
    }
    

    try {
        await Promise.all([
          getUSDYPriceQuote(priceOfUSDYinUSDC, dispatch),
          getBTCPriceQuote(priceOfBTCinUSDC, dispatch),
          getEURCPriceQuote(priceOfEURCinUSDC, dispatch),
          getUserBalances(user.wallet.address, dispatch),
          getUserData(user.wallet.address, dispatch),
        ]);
        return { success: true };
      } catch (e) {
        console.error('Error fetching user data or balances:', e);
        return { success: false };
      }
    
}

export const getUserData = async (pubKey: string, 
    dispatch: Function): Promise<boolean> => {
    
    const db = getFirestore();
    const pubKeyDocRef = doc(db, 'pubKeys', pubKey);

    const docSnapshot = await getDoc(pubKeyDocRef);
    const data = docSnapshot.data();

    if (data) {
        if (data.recentlyUsedAddresses) {
            dispatch(setRecentlyUsedSolanaAddresses(data.recentlyUsedAddresses))
        }
        if (data.KYCverified) {
            dispatch(setCurrentUserKYCVerified(data.KYCverified));
        }
    }
    return true
};

const getUserBalances = async (pubKey: string, dispatch: Function) => {
    
    try {
        const [
          tokenBalances,
          solanaBalance
        ] = await Promise.all([
            TokenBalances(pubKey),
            SolanaBalance(pubKey)
        ]);
    
          dispatch(setusdcSolValue(Number(tokenBalances.usdc)));
          dispatch(setusdtSolValue(Number(tokenBalances.usdt)));
          dispatch(setusdySolValue(Number(tokenBalances.usdy)));
          dispatch(setpyusdSolValue(Number(tokenBalances.pyusd)));
          dispatch(seteurcSolValue(Number(tokenBalances.eurc)));
          dispatch(setbtcSolValue(Number(tokenBalances.btc)));
          dispatch(setsolValue(Number(solanaBalance)));

          console.log('tokenBalances', tokenBalances)

        } catch (e) {
            console.error('Error fetching user balances');
            return false
        }
}



export const TokenBalances = async (address: string): Promise<{
    success: boolean;
    usdc: number;
    usdt: number;
    usdy: number;
    pyusd: number;
    eurc: number;
    btc: number;
  }> => {
    let balances = {
      success: false, // default to false
      usdc: 0,
      usdt: 0,
      usdy: 0,
      pyusd: 0,
      eurc: 0,
      btc: 0,
    };
  
    const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
    const connection = new Connection(RPC);
  
    const USDC_MINT_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; 
    const USDT_MINT_ADDRESS = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'; 
    const USDY_MINT_ADDRESS = 'A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6';
    const PYUSD_MINT_ADDRESS = '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo';
    const EURC_MINT_ADDRESS = 'HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr';
    const BTC_MINT_ADDRESS = "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij";


    try {

      console.log('publicKey', address);
      const publicKey = new PublicKey(address);

      // Fetch all SPL token accounts owned by the wallet address
      const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') // SPL Token program ID
      });
  
      for (const account of parsedTokenAccounts.value) {
        const mintAddress = account.account.data.parsed.info.mint;
  
        // Check if the mint address matches that of USDC
        if (mintAddress === USDC_MINT_ADDRESS) {
          const usdcBalance = account.account.data.parsed.info.tokenAmount.uiAmount;
          balances.usdc = usdcBalance;
        }
        if (mintAddress === BTC_MINT_ADDRESS) {
            const btcBalance = account.account.data.parsed.info.tokenAmount.uiAmount;
            balances.btc = btcBalance;
        }
        if (mintAddress === PYUSD_MINT_ADDRESS) {
            const pyusdBalance = account.account.data.parsed.info.tokenAmount.uiAmount;
            balances.pyusd = pyusdBalance;
        }
        if (mintAddress === EURC_MINT_ADDRESS) {
            const eurcBalance = account.account.data.parsed.info.tokenAmount.uiAmount;
            balances.eurc = eurcBalance
        }
        if (mintAddress === USDT_MINT_ADDRESS) {
            const usdtBalance = account.account.data.parsed.info.tokenAmount.uiAmount;
            balances.usdt = usdtBalance
        }
        if (mintAddress === USDY_MINT_ADDRESS) {
            const usdyBalance = account.account.data.parsed.info.tokenAmount.uiAmount;
            balances.usdy = usdyBalance
        }
      }
      balances.success = true
      return balances;
    } catch (err) {
      console.error(`Failed to fetch balance: ${err}`);
      balances.success = false
      return balances;
    }
  };
  
  export const SolanaBalance = async (address: string): Promise<number> => {
    const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
    const connection = new Connection(RPC);
  
    try {
      const publicKey = new PublicKey(address);
      
      // Fetch native SOL balance
      const balanceInLamports = await connection.getBalance(publicKey);
      
      // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
      const balanceInSol = balanceInLamports / 1e9;
  
      // console.log(`Balance of ${address}: ${balanceInSol} SOL`);
      return balanceInSol;
    } catch (err) {
      console.error(`Failed to fetch balance: ${err}`);
      return 0;
    }
  };


const UpdatePasskey = async (dispatch: Function) => {

  dispatch(setPassKeyState('done'));

}

const getUSDYPriceQuote = async (price: number, dispatch: Function): Promise<boolean> => {

  if (price <= 0.01) {
      const quote = await getSwapQuote()
      const priceInUSD = quote.outAmount/1000000
      if (priceInUSD && priceInUSD>0.01) {
          dispatch(setPriceOfUSDYinUSDC(quote.outAmount/1000000))
      } else {
          dispatch(setPriceOfUSDYinUSDC(1.06)) // default to $1.06
      }
      
  }

  async function getSwapQuote() {

      const outputMintAddress = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' // USDC
      const inputMintAddress = 'A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6'; // USDY

      const quoteResponse = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMintAddress}&amount=${1* 1000000}&slippageBps=50`
      ).then(response => response.json());
      
      return quoteResponse
    }

  return true
}


const getBTCPriceQuote = async (price: number, dispatch: Function): Promise<boolean> => {

  if (price <= 0.01) {
      const quote = await getSwapQuote()
      const priceInUSD = quote.outAmount/1000000
      if (priceInUSD && priceInUSD>0.01) {
          console.log("Setting BTC PRice", quote.outAmount/10000)
          dispatch(setPriceOfBTCinUSDC(quote.outAmount/10000))
      } else {
          dispatch(setPriceOfBTCinUSDC(100000)) // default to $100,000
      }
      
  }

  async function getSwapQuote() {

      const outputMintAddress = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // USDC
      const inputMintAddress = 'cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij'; // BTC

      const quoteResponse = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMintAddress}&amount=${1* 1000000}&slippageBps=50`
      ).then(response => response.json());
      
      return quoteResponse
    }

  return true
}


const getEURCPriceQuote = async (price: number, dispatch: Function): Promise<boolean> => {

  if (price <= 0.01) {
      const quote = await getSwapQuote()
      const priceInUSD = quote.outAmount/1000000
      if (priceInUSD && priceInUSD>0.01) {
          console.log("Setting EURC PRice",priceInUSD )
          dispatch(setPriceOfEURCinUSDC(priceInUSD))
      } else {
          dispatch(setPriceOfEURCinUSDC(1.025)) // default to $100,000
      }
      
  }

  async function getSwapQuote() {

      const outputMintAddress = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // USDC
      const inputMintAddress = 'HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr'; // EURC

      const quoteResponse = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMintAddress}&amount=${1* 1000000}&slippageBps=50`
      ).then(response => response.json());
      
      return quoteResponse
    }

  return true
}

export async function getUsers(dispatch: Function) {
  const functions = getFunctions();
  const getUsersFn = httpsCallable(functions, 'fetchPageOfUsers');
  
  let cursor = null;
  let users: any = [];
  
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
        return userData.map((user: any): User => ({
          created_at: user.created_at,
          has_accepted_terms: user.has_accepted_terms,
          id: user.id,
          is_guest: user.is_guest,
          linked_accounts: user.linked_accounts
        }));
      };

      const users = mapToUsers(result);
      
      if (users) {
        console.log("setting users", users)
        dispatch(setUsers(users))
      }



    } catch (error) {
      console.error("Error calling fetchPageOfUsers:", error);

    }
  
  
  return users;
}

export { HandleUserLogIn, UpdatePasskey }