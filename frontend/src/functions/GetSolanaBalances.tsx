import { Connection, PublicKey } from "@solana/web3.js";
import { HELIUS_API_KEY } from "../env";
import { updateBalance } from "@/features/wallet/assets/assetsSlice.ts";

const getSolanaBalances = async (pubKey: string, dispatch: Function) => {
  try {
    const [tokenBalances, solanaBalance] = await Promise.all([
      TokenBalances(pubKey),
      SolanaBalance(pubKey),
    ]);

    // dispatch(setpyusdSolValue(Number(tokenBalances.pyusd)));
    dispatch(
      updateBalance({
        assetId: "usdc_sol",
        balance: Number(tokenBalances.usdc),
      })
    );
    dispatch(
      updateBalance({
        assetId: "usdt_sol",
        balance: Number(tokenBalances.usdt),
      })
    );
    dispatch(
      updateBalance({
        assetId: "usdy_sol",
        balance: Number(tokenBalances.usdy),
      })
    );
    dispatch(
      updateBalance({
        assetId: "eurc_sol",
        balance: Number(tokenBalances.eurc),
      })
    );
    dispatch(
      updateBalance({ assetId: "btc_sol", balance: Number(tokenBalances.btc) })
    );
    dispatch(updateBalance({ assetId: "sol", balance: Number(solanaBalance) }));
  } catch (e) {
    console.error("Error fetching user balances");
    return false;
  }
};

export const TokenBalances = async (
  address: string
): Promise<{
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

  const USDC_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
  const USDT_MINT_ADDRESS = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
  const USDY_MINT_ADDRESS = "A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6";
  const PYUSD_MINT_ADDRESS = "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo";
  const EURC_MINT_ADDRESS = "HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr";
  const BTC_MINT_ADDRESS = "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij";
  const WSOL_MINT_ADDRESS = "So11111111111111111111111111111111111111112";

  try {
    const publicKey = new PublicKey(address);

    // Fetch all SPL token accounts owned by the wallet address
    const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), // SPL Token program ID
      }
    );

    for (const account of parsedTokenAccounts.value) {
      const mintAddress = account.account.data.parsed.info.mint;

      // Check if the mint address matches that of USDC
      if (mintAddress === USDC_MINT_ADDRESS) {
        const usdcBalance =
          account.account.data.parsed.info.tokenAmount.uiAmount;
        balances.usdc = usdcBalance;
      }
      if (mintAddress === BTC_MINT_ADDRESS) {
        const btcBalance =
          account.account.data.parsed.info.tokenAmount.uiAmount;
        balances.btc = btcBalance;
      }
      if (mintAddress === PYUSD_MINT_ADDRESS) {
        const pyusdBalance =
          account.account.data.parsed.info.tokenAmount.uiAmount;
        balances.pyusd = pyusdBalance;
      }
      if (mintAddress === EURC_MINT_ADDRESS) {
        const eurcBalance =
          account.account.data.parsed.info.tokenAmount.uiAmount;
        balances.eurc = eurcBalance;
      }
      if (mintAddress === USDT_MINT_ADDRESS) {
        const usdtBalance =
          account.account.data.parsed.info.tokenAmount.uiAmount;
        balances.usdt = usdtBalance;
      }
      if (mintAddress === USDY_MINT_ADDRESS) {
        const usdyBalance =
          account.account.data.parsed.info.tokenAmount.uiAmount;
        balances.usdy = usdyBalance;
      }
      if (mintAddress === WSOL_MINT_ADDRESS) {
        const wsolBalance =
          account.account.data.parsed.info.tokenAmount.uiAmount;
        balances.wSol = wsolBalance;
      }
    }

    for (const account of parsedTokenAccounts.value) {
      const mintAddress = account.account.data.parsed.info.mint;

      // Check if the mint address matches that of USDC
      if (mintAddress === USDC_MINT_ADDRESS) {
        const usdcBalance =
          account.account.data.parsed.info.tokenAmount.uiAmount;
        balances.usdc = usdcBalance;
      }
      if (mintAddress === BTC_MINT_ADDRESS) {
        const btcBalance =
          account.account.data.parsed.info.tokenAmount.uiAmount;
        balances.btc = btcBalance;
      }
      if (mintAddress === PYUSD_MINT_ADDRESS) {
        const pyusdBalance =
          account.account.data.parsed.info.tokenAmount.uiAmount;
        balances.pyusd = pyusdBalance;
      }
      if (mintAddress === EURC_MINT_ADDRESS) {
        const eurcBalance =
          account.account.data.parsed.info.tokenAmount.uiAmount;
        balances.eurc = eurcBalance;
      }
      if (mintAddress === USDT_MINT_ADDRESS) {
        const usdtBalance =
          account.account.data.parsed.info.tokenAmount.uiAmount;
        balances.usdt = usdtBalance;
      }
      if (mintAddress === USDY_MINT_ADDRESS) {
        const usdyBalance =
          account.account.data.parsed.info.tokenAmount.uiAmount;
        balances.usdy = usdyBalance;
      }
    }
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
