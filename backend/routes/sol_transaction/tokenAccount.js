const web3 = require('@solana/web3.js');
const Token = require('@solana/spl-token');
const bs58 = require('bs58').default;
const { Connection, Keypair, PublicKey } = web3;

const SOL_PRIV_KEY = process.env.SOL_PRIV_KEY;
const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
const connection = new Connection(RPC);

async function ensureTokenAccount(data) {
    /*
    Take in the user's solana pub key and create
    a new token account for them if they do not
    have one already. Server pays for the transaction.
    */
    try {
        const receiverPubKey = new PublicKey(data.receiverPubKey);
        const mintPubKey = new PublicKey(data.mintAddress);
        const programId = new PublicKey(data.programId);

        // Check if user already has a token account for this mint
        const receiverParsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
            receiverPubKey,
            { programId: programId }
        );

        const existingAccount = receiverParsedTokenAccounts.value.find(
            accountInfo => accountInfo.account.data.parsed.info.mint === data.mintAddress
        );

        // If account exists, return early
        if (existingAccount) {
            return { pubkey: existingAccount.pubkey.toString() };
        }

        // If no account exists, create a new one
        let payerKeypair;
        
        try {
            // Check if the private key is in base58 format
            if (!SOL_PRIV_KEY) {
                throw new Error('SOL_PRIV_KEY environment variable is not set');
            }
            
            // Trim any whitespace or newlines that might be present
            const trimmedKey = SOL_PRIV_KEY.trim();
            
            // Try to decode the private key
            try {
                const decodedPrivateKey = bs58.decode(trimmedKey);
                payerKeypair = Keypair.fromSecretKey(decodedPrivateKey);
            } catch (bs58Error) {
                console.error("Base58 decode error:", bs58Error.message);
                
                // If the private key is not in base58 format, try to parse it as a JSON array
                if (trimmedKey.startsWith('[') && trimmedKey.endsWith(']')) {
                    try {
                        const privateKeyArray = JSON.parse(trimmedKey);
                        payerKeypair = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
                    } catch (jsonError) {
                        console.error("JSON parse error:", jsonError.message);
                        throw new Error('Private key is not in a valid format (neither base58 nor JSON array)');
                    }
                } else {
                    // Try to create a keypair directly from the string
                    try {
                        // This is a fallback method that might work in some cases
                        const secretKey = new Uint8Array(trimmedKey.split('').map(c => c.charCodeAt(0)));
                        payerKeypair = Keypair.fromSecretKey(secretKey);
                    } catch (directError) {
                        console.error("Direct conversion error:", directError.message);
                        throw new Error('Failed to parse private key. Please ensure it is in base58 format or a JSON array of numbers.');
                    }
                }
            }
        } catch (keyError) {
            console.error('Error processing private key:', keyError);
            throw keyError;
        }

        const newTokenAccountPubKey = await Token.createAccount(
            connection,
            payerKeypair,
            mintPubKey,
            receiverPubKey,
            null,
            null,
            programId
        );

        return { pubkey: newTokenAccountPubKey.toString() };
    } catch (error) {
        console.error('Error handling token account:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

// Export functions for use in other modules
module.exports = {
    ensureTokenAccount
}; 