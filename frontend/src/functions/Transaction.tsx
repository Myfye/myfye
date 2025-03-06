import { HELIUS_API_KEY } from '../env.ts';
import { 
    createTransferInstruction, 
    TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Buffer } from 'buffer';
import bs58 from 'bs58';
import { 
    getFunctions, 
    httpsCallable } from 'firebase/functions';
import { 
  ComputeBudgetProgram, 
  PublicKey, 
  Connection, 
  Keypair, 
  LAMPORTS_PER_SOL, 
  sendAndConfirmTransaction, 
  SystemProgram, 
  Transaction, 
  TransactionInstruction,
  VersionedTransaction, } from "@solana/web3.js";
import {useSendTransaction} from '@privy-io/react-auth';
  const USDC_MINT_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // Mainnet USDC mint address
  const USDT_MINT_ADDRESS = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'; // Replace with actual USDT mint address on Solana
  const USDY_MINT_ADDRESS = 'A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6';
  const PYUSD_MINT_ADDRESS = '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo';
  const EURC_MINT_ADDRESS = 'HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr';

export const tokenTransfer = async (
    payerPubKey: string, 
    receiverPubKey: string, 
    amountSmallestDenomination: number, 
    currencySelected: string, 
    wallet: any
    ): Promise<boolean> => {
  

      const PRIORITY_RATE = 1001000; // MICRO_LAMPORTS 1^-15 solana  250000
      const PRIORITY_FEE_IX = ComputeBudgetProgram.setComputeUnitPrice({microLamports: PRIORITY_RATE});

      const senderPublicKey = new PublicKey(payerPubKey);
      const destinationPublicKey = new PublicKey(receiverPubKey);

      let mintAddress: string;
      let programId: string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
      if (currencySelected === 'usdcSol') {
          mintAddress = USDC_MINT_ADDRESS;
      } else if (currencySelected === 'usdtSol') {
          mintAddress = USDT_MINT_ADDRESS;
      } else if (currencySelected === 'usdySol') {
        mintAddress = USDY_MINT_ADDRESS;
      } else if (currencySelected === 'eurcSol') {
        mintAddress = EURC_MINT_ADDRESS;
      } else if (currencySelected === 'pyusdSol') {
        mintAddress = PYUSD_MINT_ADDRESS;
        programId = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
      }
      
      const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
      const connection = new Connection(RPC);
    
        const payerParsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
          senderPublicKey,
          { programId: new PublicKey(programId) }
        );
  
        //currencySelected = usdcSol or usdtSol
        const payerAccountInfo = payerParsedTokenAccounts.value.find(
          (accountInfo: { account: { data: { parsed: { info: { mint: string } } } } }) => accountInfo.account.data.parsed.info.mint === mintAddress
        );
        
        if (!payerAccountInfo) {
          throw new Error(currencySelected + " account not found for payer.", payerAccountInfo);
        } else {
          console.log(currencySelected + " account found for payer.");
        }
  
        const receiverParsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
          destinationPublicKey,
          { programId: new PublicKey(programId) }
        );
  
        let receiverAccountInfo: any = receiverParsedTokenAccounts.value.find(
          (accountInfo: { account: { data: { parsed: { info: { mint: string } } } } }) => accountInfo.account.data.parsed.info.mint === mintAddress
        );
        

        if (!receiverAccountInfo) {
          const functions = getFunctions();
          const newTokenAccount = httpsCallable(functions, 'createNewTokenAccount');
        
          try {
            const result = newTokenAccount({
              payerPubKey: payerPubKey,
              receiverPubKey: receiverPubKey,
              mintAddress: mintAddress!,
              programId: programId,
            });

            // the create new account promise is not working 
            // on the backend so try waiting 10 seconds and then 
            // search for it again

            let attempts = 0;
            const maxAttempts = 10;
            
            while (attempts < maxAttempts) {
                console.log("Looking for newly created token account (Attempt " + (attempts + 1) + ")");
                
                await new Promise(resolve => setTimeout(resolve, 8000)); // Wait 8 seconds
            
                const receiverParsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
                    destinationPublicKey,
                    { programId: new PublicKey(programId) }
                );
            
                receiverAccountInfo = receiverParsedTokenAccounts.value.find(
                    (accountInfo: { account: { data: { parsed: { info: { mint: string } } } } }) => 
                        accountInfo.account.data.parsed.info.mint === mintAddress
                );
            
                if (receiverAccountInfo) {
                    console.log(currencySelected + " account found for receiver.");
                    break; // Exit loop if the account is found
                }
            
                attempts++;
            }
            
            if (!receiverAccountInfo) {
                throw new Error("Token account not found after 10 attempts.");
            }

          } catch (error) {
            console.error("Failed to create or fetch the token account:", error);
            return false;
          }
        } else {
          console.log(currencySelected + " account found for receiver.");
        }
  
        if (!payerAccountInfo || !receiverAccountInfo) {
          console.error(currencySelected + " account not found");
          return false;
        }
  
        const senderTokenAccount = new PublicKey(payerAccountInfo.pubkey);
        const receiverTokenAccount = new PublicKey(receiverAccountInfo.pubkey);
  
        const programIdKey = new PublicKey(programId);

        const transferInstruction = createTransferInstruction(
          senderTokenAccount, // Source account: PublicKey
          receiverTokenAccount, // Destination account: PublicKey
          senderPublicKey, // Owner of source account: PublicKey
          amountSmallestDenomination, // Amount: number | bigint
          [], // multiSigners
          programIdKey, // Amount: number | bigint
        );

        const blockhashInfo = await connection.getLatestBlockhash();
        
        // Create the priority transaction
        const transaction = new Transaction();
        transaction.add(transferInstruction);
        transaction.feePayer = senderPublicKey;
        transaction.recentBlockhash = blockhashInfo.blockhash;
        transaction.lastValidBlockHeight = blockhashInfo.lastValidBlockHeight;
  
        
        // Create the priority transaction
        const txPriority = new Transaction();
        txPriority.add(transferInstruction);
        txPriority.add(PRIORITY_FEE_IX); // Add priority fee instruction
        txPriority.feePayer = senderPublicKey;
        txPriority.recentBlockhash = blockhashInfo.blockhash;
        txPriority.lastValidBlockHeight = blockhashInfo.lastValidBlockHeight;

      try {
        
        /*
        await wallet.signTransaction!(transaction, connection);
        const transactionId = await wallet.sendTransaction!(transaction, connection);
        */

        /*
        const signedTX = await wallet.signTransaction(
          transaction
        );*/

        const transactionId = await wallet.sendTransaction!(txPriority, connection);
        
        
        /*
        const transactionId = await sendAndConfirmTransaction(
          connection,
          signedTX.serialize(),
          [], //Signers
        );
        */

        if (transactionId) {
          let transactionConfirmed = false
          for (let attempt = 1; attempt <= 3 && !transactionConfirmed; attempt++) {
            try {
              const confirmation = await connection.confirmTransaction(transactionId, 'confirmed');
              console.log('got confirmation', confirmation, 'on attempt', attempt);
              if (confirmation && confirmation.value && confirmation.value.err === null) {
                console.log(`Transaction successful: https://solscan.io/tx/${transactionId}`);
                return true;
              }
              } catch (error) {
                console.error('Error sending transaction or in post-processing:', error, 'on attempt', attempt);
              }
              if (!transactionConfirmed) {
                await delay(1000); // Delay in milliseconds
              }
            }
            console.log("Transaction Uncomfirmed");
            return false
        } else {
          console.log("Transaction Failed: transactionID: ", transactionId);
          return false;
        }
  
      } catch (error) {
        console.error("Transaction Failed with error: ", error);
        return false;
      }

  }


  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }