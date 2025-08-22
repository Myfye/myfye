import { Connection, PublicKey } from "@solana/web3.js";
import { HELIUS_API_KEY } from "../env";
import { updateBalance, getMintAddressToAssetIdMap } from "@/features/assets/assetsSlice";

const getSolanaBalances = async (pubKey: string, dispatch: Function) => {
  try {
    const [tokenBalances, solanaBalance] = await Promise.all([
      TokenBalances(pubKey),
      SolanaBalance(pubKey),
    ]);

    // Update balances for all assets found in the wallet
    Object.entries(tokenBalances).forEach(([assetId, balance]) => {
      if (assetId !== 'success' && typeof balance === 'number') {
        dispatch(updateBalance({ assetId, balance }));
      }
    });

    // Update SOL balance separately since it's not a token
    dispatch(updateBalance({ assetId: "SOL", balance: Number(solanaBalance) }));
  } catch (e) {
    console.error("Error fetching user balances", e);
    return false;
  }
};

export const TokenBalances = async (
  address: string
): Promise<{
  success: boolean;
  [assetId: string]: number | boolean;
}> => {
  const balances: { success: boolean; [assetId: string]: number | boolean } = {
    success: false,
  };

  const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
  const connection = new Connection(RPC);

  try {
    const publicKey = new PublicKey(address);
    const mintAddressToAssetId = getMintAddressToAssetIdMap();

    // Initialize all asset balances to 0
    Object.values(mintAddressToAssetId).forEach(assetId => {
      balances[assetId] = 0;
    });

    // Fetch all SPL token accounts owned by the wallet address
    const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), // SPL Token program ID
      }
    );

    const parsedToken2022Accounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      {
        programId: new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"), // Token-2022 program ID
      }
    );

    // Process all token accounts (both SPL and Token-2022)
    const processTokenAccounts = (accounts: any[], accountType: string) => {
      for (const account of accounts) {
        const mintAddress = account.account.data.parsed.info.mint;
        const amount = account.account.data.parsed.info.tokenAmount.uiAmount;
        
        // Find the asset ID for this mint address
        const assetId = mintAddressToAssetId[mintAddress];
        
        if (assetId) {
          console.log(`Found ${assetId} (${accountType}): ${amount}`);
          balances[assetId] = amount;
        } else {
          console.log(`Unknown mint address (${accountType}): ${mintAddress}`);
        }
      }
    };

    // Process both account types
    processTokenAccounts(parsedTokenAccounts.value, "SPL");
    processTokenAccounts(parsedToken2022Accounts.value, "Token-2022");

    console.log("Final balances object:", balances);
    balances.success = true;
    return balances;
  } catch (err) {
    console.error(`Failed to fetch balance: ${err}`);
    balances.success = false;
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
    console.log("solana balance", balanceInSol);
    return balanceInSol;
  } catch (err) {
    console.error(`Failed to fetch balance: ${err}`);
    return 0;
  }
};

export default getSolanaBalances;
