
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
import { HELIUS_API_KEY } from '../../../env.ts';

async function ensureTokenAccount(userPublicKeyString: String, mintAddress: String) {

    const USDC_MINT_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
    const USDT_MINT_ADDRESS = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';
    const USDY_MINT_ADDRESS = 'A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6';
    const PYUSD_MINT_ADDRESS = '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo';
    const EURC_MINT_ADDRESS = 'HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr';

    let programId: string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'

    if (mintAddress === PYUSD_MINT_ADDRESS) { // special case
      mintAddress = PYUSD_MINT_ADDRESS;
      programId = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
    } 

    const userPublicKey = new PublicKey(userPublicKeyString);

    const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
    const connection = new Connection(RPC);

    const receiverParsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
        userPublicKey,
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
                receiverPubKey: userPublicKeyString,
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
                    userPublicKey,
                    { programId: new PublicKey(programId) }
                );
            
                receiverAccountInfo = receiverParsedTokenAccounts.value.find(
                    (accountInfo: { account: { data: { parsed: { info: { mint: string } } } } }) => 
                        accountInfo.account.data.parsed.info.mint === mintAddress
                );
            
                if (receiverAccountInfo) {
                    console.log(userPublicKey + " account found.");
                    return;
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
        console.log(" account found");
        return false;
    }
}

export default ensureTokenAccount;