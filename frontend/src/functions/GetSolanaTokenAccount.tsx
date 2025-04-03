import { PublicKey, Connection } from "@solana/web3.js";
import { HELIUS_API_KEY } from '../env.ts';

async function getTokenAccountData(
  publicKey: String,
  mintAddress: String,
  programId: String = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
): Promise<any> {
  // Convert input to PublicKey objects
  const ownerPublicKey = new PublicKey(publicKey);

  const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
  const connection = new Connection(RPC);

  try {
    // Fetch parsed token accounts by owner
    const ownerParsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
        ownerPublicKey,
      { programId: new PublicKey(programId) }
    );

    // Find the token account that matches the mint address
    let ownerAccountInfo = ownerParsedTokenAccounts.value.find(
      (accountInfo: { account: { data: { parsed: { info: { mint: string } } } } }) =>
        accountInfo.account.data.parsed.info.mint === mintAddress
    );

    console.log("ownerAccountInfo", ownerAccountInfo)

    // Return the found or newly created token account info
    return ownerAccountInfo;
  } catch (error) {
    console.error("Error fetching token accounts:", error);
    throw new Error("Failed to fetch token account data.");
  }
}

export default getTokenAccountData;