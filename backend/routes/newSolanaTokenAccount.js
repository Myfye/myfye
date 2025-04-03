const web3 = require('@solana/web3.js');
const Token = require('@solana/spl-token');
const bs58 = require('bs58').default;
const { Connection, Keypair, PublicKey } = web3;

const SOL_PRIV_KEY = process.env.SOL_PRIV_KEY;
const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
const connection = new Connection(RPC);

async function createNewTokenAccount(data) {
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
        const decodedPrivateKey = bs58.decode(SOL_PRIV_KEY);
        const payerKeypair = Keypair.fromSecretKey(decodedPrivateKey);

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
    }
}

// Export functions for use in other modules
module.exports = {
    createNewTokenAccount
}; 