import { 
    ComputeBudgetProgram, 
    PublicKey, 
    Connection,
    VersionedTransaction } from "@solana/web3.js";
  import { HELIUS_API_KEY } from '../../../env.ts';
  import getTokenAccountData from "../../../functions/GetSolanaTokenAccount.tsx";
  import { 
    getFunctions, 
    httpsCallable } from 'firebase/functions';
  const SERVER_SOLANA_PUBLIC_KEY = import.meta.env.VITE_REACT_APP_SERVER_SOLANA_PUBLIC_KEY;
  import prepareTransaction from "./PrepareSwap.tsx";
  import mintAddress from "./MintAddress.tsx";
  import updateUI from "./UpdateUI.tsx";
  import verifyTransaction from "./VerifyTransaction.tsx";
  import simulate from "./Simulate.tsx"; 
  import ensureTokenAccount from "./ensureTokenAccount.tsx";
  
  const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
  const connection = new Connection(RPC);
  
  
  export const swap = async (
    wallet: any, 
    publicKey: String, 
    inputAmount: number, 
    inputCurrency: String, 
    outputCurrency: String, 
    dispatch: Function, 
    type: String = "deposit",
    microPlatformFeeAmount: number = 0
  ) => {
  
    console.log("swapping", publicKey, inputAmount, inputCurrency, outputCurrency, type, microPlatformFeeAmount)
    const output_mint = mintAddress(outputCurrency);
    const inputMint = mintAddress(inputCurrency);
  
    await ensureTokenAccount(publicKey, output_mint);
  
    console.log("Done ensuring token account");
  
    let platformFeeAccountData: any;
  
    if (microPlatformFeeAmount > 0) {
      platformFeeAccountData = await getTokenAccountData(
        //'DR5s8mAdygzmHihziLzDBwjuux1R131ydAG2rjYhpAmn',
        '688pzWEMqC52hiVgFviu45A24EzJ6ZfVoHiSzPSahJgh',
        inputMint,
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
      )
    }
  
    const microInputAmount = convertToMicro(inputAmount, inputCurrency)
  
    getSwapQuote(
      microInputAmount, 
      inputCurrency, 
      output_mint,
      microPlatformFeeAmount
    ).then(quote => {
      swapTransaction(wallet, quote, publicKey, dispatch, type, platformFeeAccountData);
    }).catch(error => {
        updateUI(dispatch, type, 'Fail')
        console.error('Error calling getSwapQuote retrying becuase error: ', error)
      });
  }
  
  const convertToMicro = (amount: number, currency: string) => {
    if (currency === 'btcSol') {
      return amount * 100000000;
    } else if (currency === 'wSol' || currency === 'sol') {
      return amount * 1000000000;
    }else {
      return amount * 1000000;
    }
  }
  
  
  
  {/* Get Swap Quote*/}
  async function getSwapQuote(
    microInputAmount: number, 
    inputCurrencyType: String, 
    outputMint,
    microPlatformFeeAmount: number = 0
  ) {
    // Input mint
    const inputMintAddress = mintAddress(inputCurrencyType);
    
    try {
      let url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMint}&amount=${microInputAmount}&slippageBps=300&maxAccounts=54&feeAccount${SERVER_SOLANA_PUBLIC_KEY}`;
      console.log("microPlatformFeeAmount", microPlatformFeeAmount)
      if (microPlatformFeeAmount > 0) {
        url += `&platformFeeBps=100`
      } 
      console.log("Quote url", url);
      const quoteResponse = await fetch(
        url
      ).then(response => response.json());
  
      return quoteResponse;
  
    } catch (error) {
      
      console.error('Error fetching swap quote:', error);
      throw error; // rethrow the error if you want to handle it in the calling function
    }
  }
  
  
  
  
  {/* Swap Transaction */}
  const swapTransaction = async (
    wallet: any, 
    quoteData: any, 
    userPublicKey: String, 
    dispatch: Function, 
    type: String,
    platformFeeAccountData: any
  ) => {
    
  
    // get the platform fee account 
    let platformFeeAccount: PublicKey | null = null;
    if (platformFeeAccountData?.pubkey) {
      platformFeeAccount = new PublicKey(platformFeeAccountData.pubkey);
    }
  
    const instructions = await fetchSwapTransaction(quoteData, userPublicKey, platformFeeAccount);
    if (instructions.error) {
      throw new Error("Failed to get swap instructions: " + instructions.error);
    }
  
    const preparedTransaction = await prepareTransaction(instructions);
    
    const serverSignedTransaction = await signTransactionOnBackend(preparedTransaction);
  
    const fullySignedTx = await wallet.signTransaction(serverSignedTransaction);
  
    console.log("fully signed transaction", fullySignedTx);
    //simulate(fullySignedTx);
  
    const transactionId = await wallet.sendTransaction!(serverSignedTransaction, connection);
  
    await verifyTransaction(transactionId, dispatch, type);
  };
  
  
  
  
  {/* Sign Transaction On Backend */}
  async function signTransactionOnBackend(transaction: any) {
    // Serialize for server signing
    const serializedTx = Buffer.from(transaction.serialize()).toString("base64");
  
    const functions = getFunctions();
    const signTransactionFn = httpsCallable(functions, "signVersionedTransaction");
  
    // Send to Firebase for signing
    const signTransactionResponse = await signTransactionFn({ 
      serializedTransaction: serializedTx 
    }) as { data: { signedTransaction?: string; error?: string } };
  
    const { signedTransaction, error } = signTransactionResponse.data;
  
    if (error) {
        console.error("Signing error:", error);
        return false;
    }
    
    if (!signedTransaction) {
        console.error("Error: signedTransaction is undefined.");
        return false;
    }
    
    const deserializedTransaction = VersionedTransaction.deserialize(Buffer.from(signedTransaction, "base64"));
    
    console.log("Deserialized Transaction:", deserializedTransaction);
  
    if (signTransactionResponse.data.error || !signTransactionResponse.data.signedTransaction) {
      console.error("Signing failed:", signTransactionResponse.data.error);
      return false;
    }
  
    // Deserialize and send the signed transaction
    const signedTx = VersionedTransaction.deserialize(
      new Uint8Array(Buffer.from(signTransactionResponse.data.signedTransaction, "base64"))
    );
    return signedTx;
  }
  
  
  
  
  {/* Fetch Swap Transaction */}
  async function fetchSwapTransaction(
    quoteResponse: any,
    userPublicKey: String,
    platformFeeAccountPubKey: PublicKey | null
  ): Promise<any> {
    const response = await fetch("https://quote-api.jup.ag/v6/swap-instructions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quoteResponse, // quoteResponse from /quote api
        userPublicKey: userPublicKey, // user public key to be used for the swap
        dynamicComputeUnitLimit: true, // Set this to true to get the best optimized CU usage.
        dynamicSlippage: {
          // This will set an optimized slippage to ensure high success rate
          maxBps: 300, // Make sure to set a reasonable cap here to prevent MEV
        },
        prioritizationFeeLamports: {
          priorityLevelWithMaxLamports: {
            maxLamports: 10_000_000,
            priorityLevel: "veryHigh", // If you want to land transaction fast, set this to use `veryHigh`. You will pay on average higher priority fee.
          },
        },
        platformFeeAccount: platformFeeAccountPubKey,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return response.json();
  }
  
  
  
  
  