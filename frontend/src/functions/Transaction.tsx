import { HELIUS_API_KEY, SERVER_PUBLIC_KEY } from '../env.ts';
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
import { logError } from "./LogError.tsx";
import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from '../env';

export const tokenTransfer = async (
    payerPubKey: string, 
    receiverPubKey: string, 
    amountSmallestDenomination: number, 
    currencySelected: string, 
    wallet: any
    ): Promise<any> => {
      try {
        console.log("tokenTransfer", payerPubKey, receiverPubKey, amountSmallestDenomination, currencySelected, wallet);
  
        console.log("SERVER_PUBLIC_KEY", SERVER_PUBLIC_KEY);
        // Validate public keys
        if (!payerPubKey || typeof payerPubKey !== 'string') {
          throw new Error(`Invalid payer public key: ${payerPubKey}`);
        }
        if (!receiverPubKey || typeof receiverPubKey !== 'string') {
          throw new Error(`Invalid receiver public key: ${receiverPubKey}`);
        }

        // Validate amount
        if (!amountSmallestDenomination || typeof amountSmallestDenomination !== 'number') {
          throw new Error(`Invalid amount: ${amountSmallestDenomination}`);
        }

        // Validate wallet
        if (!wallet) {
          throw new Error('Wallet is required');
        }

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
          throw new Error(currencySelected + " account not found for payer.");
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

        const userPublicKey = new PublicKey(receiverPubKey);
        
        if (!receiverAccountInfo) {

          
          const response = await fetch(`${MYFYE_BACKEND}/create_solana_token_account`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': MYFYE_BACKEND_KEY,
            },
            body: JSON.stringify({
                receiverPubKey: receiverPubKey,
                mintAddress: mintAddress,
                programId: programId
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Backend error:", errorData);
            throw new Error(`Backend error: ${errorData.error || 'Unknown error'}`);
        } else {
          console.log("Token account created for receiver.", response);
        }

        const result = await response.json();
        
          try {
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
            throw new Error("Failed to create or fetch the token account: " + error);
          }
        } else {
          console.log(currencySelected + " account found for receiver.");
        }
  
        if (!payerAccountInfo || !receiverAccountInfo) {
          throw new Error(currencySelected + " account not found");
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
          programIdKey,
        );

        const blockhashInfo = await connection.getLatestBlockhash();
        
        const feePayerPublicKey = new PublicKey(SERVER_PUBLIC_KEY!);

        // Create the priority transaction
        const txPriority = new Transaction();
        txPriority.add(transferInstruction);
        txPriority.add(PRIORITY_FEE_IX); // Add priority fee instruction
        txPriority.recentBlockhash = blockhashInfo.blockhash;
        txPriority.lastValidBlockHeight = blockhashInfo.lastValidBlockHeight;
        txPriority.feePayer = feePayerPublicKey;

        // Serialize the transaction (before signing)
        const serializedTx = txPriority.serialize({ requireAllSignatures: false }).toString("base64");

        // Send to backend for signing
        const response = await fetch(`${MYFYE_BACKEND}/sign_transaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': MYFYE_BACKEND_KEY,
          },
          body: JSON.stringify({
            serializedTransaction: serializedTx,
          }),
        });

        if (!response.ok) {
          throw new Error("Server signing failed: " + await response.text());
        }

        const responseData = await response.json();
        if (responseData.error) {
          throw new Error("Server signing failed: " + responseData.error);
        }

        if (!responseData.signedTransaction) {
          throw new Error("Server signing failed: No signed transaction returned");
        }

        // Deserialize the signed transaction
        const signedTx = Transaction.from(Buffer.from(responseData.signedTransaction, "base64"));

        const transactionId = await wallet.sendTransaction!(signedTx, connection);
        
        if (transactionId) {
          let transactionConfirmed = false
          for (let attempt = 1; attempt <= 3 && !transactionConfirmed; attempt++) {
            try {
              const confirmation = await connection.confirmTransaction(transactionId, 'confirmed');
              console.log('got confirmation', confirmation, 'on attempt', attempt);
              if (confirmation && confirmation.value && confirmation.value.err === null) {
                console.log(`Transaction successful: https://solscan.io/tx/${transactionId}`);
                return { success: true, transactionId };
              }
            } catch (error) {
              console.error('Error sending transaction or in post-processing:', error, 'on attempt', attempt);
              throw new Error("Transaction confirmation failed: " + error);
            }
            if (!transactionConfirmed) {
              await delay(1000); // Delay in milliseconds
            }
          }
          throw new Error("Transaction Unconfirmed after 3 attempts");
        } else {
          throw new Error("Transaction Failed: No transaction ID returned");
        }

      } catch (error) {
        console.error("Transaction Failed with error: ", error);
        logError(error.message, "tokenTransfer", error.stack);
        return { success: false, error: error.message };
      }
  }

  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }