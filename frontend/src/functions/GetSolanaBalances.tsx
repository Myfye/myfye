import { Connection, PublicKey } from "@solana/web3.js";
import { HELIUS_API_KEY } from "../env";
import { updateBalance } from "@/features/assets/assetsSlice";
import {
  USDC_MINT_ADDRESS,
  USDT_MINT_ADDRESS,
  USDY_MINT_ADDRESS,
  PYUSD_MINT_ADDRESS,
  EURC_MINT_ADDRESS,
  BTC_MINT_ADDRESS,
  WSOL_MINT_ADDRESS,
  XRP_MINT_ADDRESS,
  DOGE_MINT_ADDRESS,
  SUI_MINT_ADDRESS,
  AAPL_MINT_ADDRESS,
  ABT_MINT_ADDRESS,
  ABBV_MINT_ADDRESS,
  ACN_MINT_ADDRESS,
  GOOGL_MINT_ADDRESS,
  AMZN_MINT_ADDRESS,
  AMBR_MINT_ADDRESS,
  APP_MINT_ADDRESS,
  AZN_MINT_ADDRESS,
  BAC_MINT_ADDRESS,
  BRK_MINT_ADDRESS,
  AVGO_MINT_ADDRESS,
  CVX_MINT_ADDRESS,
  CRCL_MINT_ADDRESS,
  CSCO_MINT_ADDRESS,
  KO_MINT_ADDRESS,
  COIN_MINT_ADDRESS,
  CMCSA_MINT_ADDRESS,
  CRWD_MINT_ADDRESS,
  DHR_MINT_ADDRESS,
  DFDV_MINT_ADDRESS,
  LLY_MINT_ADDRESS,
  XOM_MINT_ADDRESS,
  GME_MINT_ADDRESS,
  GLD_MINT_ADDRESS,
  GS_MINT_ADDRESS,
  HD_MINT_ADDRESS,
  HON_MINT_ADDRESS,
  INTC_MINT_ADDRESS,
  IBM_MINT_ADDRESS,
  JNJ_MINT_ADDRESS,
  JPM_MINT_ADDRESS,
  LIN_MINT_ADDRESS,
  MRVL_MINT_ADDRESS,
  META_MINT_ADDRESS,
  MCD_MINT_ADDRESS,
  MDT_MINT_ADDRESS,
  MRK_MINT_ADDRESS,
  MSFT_MINT_ADDRESS,
  MSTR_MINT_ADDRESS,
  QQQ_MINT_ADDRESS,
  NFLX_MINT_ADDRESS,
  NVO_MINT_ADDRESS,
  NVDA_MINT_ADDRESS,
  ORCL_MINT_ADDRESS,
  PLTR_MINT_ADDRESS,
  PEP_MINT_ADDRESS,
  PFE_MINT_ADDRESS,
  PM_MINT_ADDRESS,
  PG_MINT_ADDRESS,
  HOOD_MINT_ADDRESS,
  CRM_MINT_ADDRESS,
  SPY_MINT_ADDRESS,
  TSLA_MINT_ADDRESS,
  TMO_MINT_ADDRESS,
  TQQQ_MINT_ADDRESS,
  UNH_MINT_ADDRESS,
  VTI_MINT_ADDRESS,
  V_MINT_ADDRESS,
  WMT_MINT_ADDRESS,
  MA_MINT_ADDRESS,
} from "./MintAddress";

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

    console.log("eurc balance", tokenBalances.eurc);
    dispatch(
      updateBalance({
        assetId: "eurc_sol",
        balance: Number(tokenBalances.eurc),
      })
    );
    dispatch(
      updateBalance({ assetId: "btc_sol", balance: Number(tokenBalances.btc) })
    );
    dispatch(
      updateBalance({ 
        assetId: "xrp_sol", 
        balance: Number(tokenBalances.xrp) 
      })
    );
    dispatch(
      updateBalance({ 
        assetId: "sui_sol", 
        balance: Number(tokenBalances.sui) 
      })
    );
    dispatch(
      updateBalance({ 
        assetId: "doge_sol", 
        balance: Number(tokenBalances.doge) 
      })
    );
    dispatch(
      updateBalance({ 
        assetId: "sol", 
        balance: Number(solanaBalance) 
      })
    );

    console.log("AAPL balance", tokenBalances.aapl)
    console.log("NVDA balance", tokenBalances.nvda)
    // Add stock asset dispatches
    dispatch(updateBalance({ assetId: "AAPL_sol", balance: Number(tokenBalances.aapl) }));
    //dispatch(updateBalance({ assetId: "MSFT_sol", balance: Number(tokenBalances.msft) }));
    dispatch(updateBalance({ assetId: "NVDA_sol", balance: Number(tokenBalances.nvda) }));
    dispatch(updateBalance({ assetId: "SPY_sol", balance: Number(tokenBalances.spy) }));
    dispatch(updateBalance({ assetId: "COIN_sol", balance: Number(tokenBalances.coin) }));
    dispatch(updateBalance({ assetId: "TSLA_sol", balance: Number(tokenBalances.tsla) }));
    /*
    dispatch(updateBalance({ assetId: "NFLX_sol", balance: Number(tokenBalances.nflx) }));
    dispatch(updateBalance({ assetId: "KO_sol", balance: Number(tokenBalances.ko) }));
    dispatch(updateBalance({ assetId: "WMT_sol", balance: Number(tokenBalances.wmt) }));
    dispatch(updateBalance({ assetId: "JPM_sol", balance: Number(tokenBalances.jpm) }));
    dispatch(updateBalance({ assetId: "AVGO_sol", balance: Number(tokenBalances.avgo) }));
    dispatch(updateBalance({ assetId: "JNJ_sol", balance: Number(tokenBalances.jnj) }));
    dispatch(updateBalance({ assetId: "V_sol", balance: Number(tokenBalances.v) }));
    dispatch(updateBalance({ assetId: "UNH_sol", balance: Number(tokenBalances.unh) }));
    dispatch(updateBalance({ assetId: "XOM_sol", balance: Number(tokenBalances.xom) }));
    dispatch(updateBalance({ assetId: "MA_sol", balance: Number(tokenBalances.ma) }));
    dispatch(updateBalance({ assetId: "PG_sol", balance: Number(tokenBalances.pg) }));
    dispatch(updateBalance({ assetId: "HD_sol", balance: Number(tokenBalances.hd) }));
    dispatch(updateBalance({ assetId: "CVX_sol", balance: Number(tokenBalances.cvx) }));
    dispatch(updateBalance({ assetId: "MRK_sol", balance: Number(tokenBalances.mrk) }));
    dispatch(updateBalance({ assetId: "PFE_sol", balance: Number(tokenBalances.pfe) }));
    dispatch(updateBalance({ assetId: "ABT_sol", balance: Number(tokenBalances.abt) }));
    dispatch(updateBalance({ assetId: "ABBV_sol", balance: Number(tokenBalances.abbv) }));
    dispatch(updateBalance({ assetId: "ACN_sol", balance: Number(tokenBalances.acn) }));
    dispatch(updateBalance({ assetId: "AZN_sol", balance: Number(tokenBalances.azn) }));
    dispatch(updateBalance({ assetId: "BAC_sol", balance: Number(tokenBalances.bac) }));
    dispatch(updateBalance({ assetId: "BRK_sol", balance: Number(tokenBalances.brk) }));
    dispatch(updateBalance({ assetId: "CSCO_sol", balance: Number(tokenBalances.csco) }));
    dispatch(updateBalance({ assetId: "CMCSA_sol", balance: Number(tokenBalances.cmcsa) }));
    dispatch(updateBalance({ assetId: "CRWD_sol", balance: Number(tokenBalances.crwd) }));
    dispatch(updateBalance({ assetId: "DHR_sol", balance: Number(tokenBalances.dhr) }));
    dispatch(updateBalance({ assetId: "GS_sol", balance: Number(tokenBalances.gs) }));
    dispatch(updateBalance({ assetId: "HON_sol", balance: Number(tokenBalances.hon) }));
    dispatch(updateBalance({ assetId: "IBM_sol", balance: Number(tokenBalances.ibm) }));
    dispatch(updateBalance({ assetId: "INTC_sol", balance: Number(tokenBalances.intc) }));
    dispatch(updateBalance({ assetId: "LIN_sol", balance: Number(tokenBalances.lin) }));
    dispatch(updateBalance({ assetId: "MRVL_sol", balance: Number(tokenBalances.mrvl) }));
    dispatch(updateBalance({ assetId: "MCD_sol", balance: Number(tokenBalances.mcd) }));
    dispatch(updateBalance({ assetId: "MDT_sol", balance: Number(tokenBalances.mdt) }));
    dispatch(updateBalance({ assetId: "NVO_sol", balance: Number(tokenBalances.nvo) }));
    dispatch(updateBalance({ assetId: "ORCL_sol", balance: Number(tokenBalances.orcl) }));
    dispatch(updateBalance({ assetId: "PLTR_sol", balance: Number(tokenBalances.pltr) }));
    dispatch(updateBalance({ assetId: "PM_sol", balance: Number(tokenBalances.pm) }));
    dispatch(updateBalance({ assetId: "HOOD_sol", balance: Number(tokenBalances.hood) }));
    dispatch(updateBalance({ assetId: "CRM_sol", balance: Number(tokenBalances.crm) }));
    dispatch(updateBalance({ assetId: "TMO_sol", balance: Number(tokenBalances.tmo) }));
    dispatch(updateBalance({ assetId: "GOOGL_sol", balance: Number(tokenBalances.googl) }));
    dispatch(updateBalance({ assetId: "AMZN_sol", balance: Number(tokenBalances.amzn) }));
    dispatch(updateBalance({ assetId: "MSTR_sol", balance: Number(tokenBalances.mstr) }));
    dispatch(updateBalance({ assetId: "GME_sol", balance: Number(tokenBalances.gme) }));
    */
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
  xrp: number;
  doge: number;
  sui: number;
  aapl: number;
  msft: number;
  nvda: number;
  tsla: number;
  nflx: number;
  ko: number;
  wmt: number;
  jpm: number;
  spy: number;
  avgo: number;
  jnj: number;
  v: number;
  unh: number;
  xom: number;
  ma: number;
  pg: number;
  hd: number;
  cvx: number;
  mrk: number;
  pfe: number;
  abt: number;
  abbv: number;
  acn: number;
  azn: number;
  bac: number;
  brk: number;
  csco: number;
  coin: number;
  cmcsa: number;
  crwd: number;
  dhr: number;
  gs: number;
  hon: number;
  ibm: number;
  intc: number;
  lin: number;
  mrvl: number;
  mcd: number;
  mdt: number;
  ndaq: number;
  nvo: number;
  orcl: number;
  pltr: number;
  pm: number;
  hood: number;
  crm: number;
  tmo: number;
  googl: number;
  amzn: number;
  mstr: number;
  gme: number;
}> => {
  let balances = {
    success: false, // default to false
    usdc: 0,
    usdt: 0,
    usdy: 0,
    pyusd: 0,
    eurc: 0,
    btc: 0,
    xrp: 0,
    doge: 0,
    sui: 0,
    aapl: 0,
    msft: 0,
    nvda: 0,
    tsla: 0,
    nflx: 0,
    ko: 0,
    wmt: 0,
    jpm: 0,
    spy: 0,
    avgo: 0,
    jnj: 0,
    v: 0,
    unh: 0,
    xom: 0,
    ma: 0,
    pg: 0,
    hd: 0,
    cvx: 0,
    mrk: 0,
    pfe: 0,
    abt: 0,
    abbv: 0,
    acn: 0,
    azn: 0,
    bac: 0,
    brk: 0,
    csco: 0,
    coin: 0,
    cmcsa: 0,
    crwd: 0,
    dhr: 0,
    gs: 0,
    hon: 0,
    ibm: 0,
    intc: 0,
    lin: 0,
    mrvl: 0,
    mcd: 0,
    mdt: 0,
    ndaq: 0,
    nvo: 0,
    orcl: 0,
    pltr: 0,
    pm: 0,
    hood: 0,
    crm: 0,
    tmo: 0,
    googl: 0,
    amzn: 0,
    mstr: 0,
    gme: 0,
  };

  const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
  const connection = new Connection(RPC);

  try {
    const publicKey = new PublicKey(address);

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
        programId: new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"), // SPL Token program ID
      }
    );
    
    for (const account of parsedTokenAccounts.value) {
      const mintAddress = account.account.data.parsed.info.mint;
      const amount = account.account.data.parsed.info.tokenAmount.uiAmount;
      
      // Debug logging for specific tokens
      if (mintAddress === USDC_MINT_ADDRESS) {
        console.log(`Found USDC: ${amount}`);
        balances.usdc = amount;
      }
      if (mintAddress === USDT_MINT_ADDRESS) {
        console.log(`Found USDT: ${amount}`);
        balances.usdt = amount;
      }
      if (mintAddress === USDY_MINT_ADDRESS) {
        console.log(`Found USDY: ${amount}`);
        balances.usdy = amount;
      }
      if (mintAddress === PYUSD_MINT_ADDRESS) {
        console.log(`Found PYUSD: ${amount}`);
        balances.pyusd = amount;
      }
      if (mintAddress === EURC_MINT_ADDRESS) {
        console.log(`Found EURC: ${amount}`);
        balances.eurc = amount;
      }
      if (mintAddress === BTC_MINT_ADDRESS) {
        console.log(`Found BTC: ${amount}`);
        balances.btc = amount;
      }
      if (mintAddress === XRP_MINT_ADDRESS) {
        console.log(`Found XRP: ${amount}`);
        balances.xrp = amount;
      }
      if (mintAddress === DOGE_MINT_ADDRESS) {
        console.log(`Found DOGE: ${amount}`);
        balances.doge = amount;
      }
      if (mintAddress === SUI_MINT_ADDRESS) {
        console.log(`Found SUI: ${amount}`);
        balances.sui = amount;
      }
    }




    for (const account of parsedToken2022Accounts.value) {
      const mintAddress = account.account.data.parsed.info.mint;
      const amount = account.account.data.parsed.info.tokenAmount.uiAmount;
      
      if (mintAddress === AAPL_MINT_ADDRESS) {
        console.log(`Found AAPL: ${amount}`);
        balances.aapl = amount;
      }
      if (mintAddress === MSFT_MINT_ADDRESS) {
        console.log(`Found MSFT: ${amount}`);
        balances.msft = amount;
      }
      if (mintAddress === NVDA_MINT_ADDRESS) {
        console.log(`Found NVDA: ${amount}`);
        balances.nvda = amount;
      }
      if (mintAddress === TSLA_MINT_ADDRESS) {
        console.log(`Found TSLA: ${amount}`);
        balances.tsla = amount;
      }
      if (mintAddress === NFLX_MINT_ADDRESS) {
        console.log(`Found NFLX: ${amount}`);
        balances.nflx = amount;
      }
      if (mintAddress === KO_MINT_ADDRESS) {
        console.log(`Found KO: ${amount}`);
        balances.ko = amount;
      }
      if (mintAddress === WMT_MINT_ADDRESS) {
        console.log(`Found WMT: ${amount}`);
        balances.wmt = amount;
      }
      if (mintAddress === JPM_MINT_ADDRESS) {
        console.log(`Found JPM: ${amount}`);
        balances.jpm = amount;
      }
      if (mintAddress === SPY_MINT_ADDRESS) {
        console.log(`Found SPY: ${amount}`);
        balances.spy = amount;
      }
      if (mintAddress === AVGO_MINT_ADDRESS) {
        console.log(`Found AVGO: ${amount}`);
        balances.avgo = amount;
      }
      if (mintAddress === JNJ_MINT_ADDRESS) {
        console.log(`Found JNJ: ${amount}`);
        balances.jnj = amount;
      }
      if (mintAddress === V_MINT_ADDRESS) {
        console.log(`Found V: ${amount}`);
        balances.v = amount;
      }
      if (mintAddress === UNH_MINT_ADDRESS) {
        console.log(`Found UNH: ${amount}`);
        balances.unh = amount;
      }
      if (mintAddress === XOM_MINT_ADDRESS) {
        console.log(`Found XOM: ${amount}`);
        balances.xom = amount;
      }
      if (mintAddress === MA_MINT_ADDRESS) {
        console.log(`Found MA: ${amount}`);
        balances.ma = amount;
      }
      if (mintAddress === PG_MINT_ADDRESS) {
        console.log(`Found PG: ${amount}`);
        balances.pg = amount;
      }
      if (mintAddress === HD_MINT_ADDRESS) {
        console.log(`Found HD: ${amount}`);
        balances.hd = amount;
      }
      if (mintAddress === CVX_MINT_ADDRESS) {
        console.log(`Found CVX: ${amount}`);
        balances.cvx = amount;
      }
      if (mintAddress === MRK_MINT_ADDRESS) {
        console.log(`Found MRK: ${amount}`);
        balances.mrk = amount;
      }
      if (mintAddress === PFE_MINT_ADDRESS) {
        console.log(`Found PFE: ${amount}`);
        balances.pfe = amount;
      }
      if (mintAddress === ABT_MINT_ADDRESS) {
        console.log(`Found ABT: ${amount}`);
        balances.abt = amount;
      }
      if (mintAddress === ABBV_MINT_ADDRESS) {
        console.log(`Found ABBV: ${amount}`);
        balances.abbv = amount;
      }
      if (mintAddress === ACN_MINT_ADDRESS) {
        console.log(`Found ACN: ${amount}`);
        balances.acn = amount;
      }
      if (mintAddress === AZN_MINT_ADDRESS) {
        console.log(`Found AZN: ${amount}`);
        balances.azn = amount;
      }
      if (mintAddress === BAC_MINT_ADDRESS) {
        console.log(`Found BAC: ${amount}`);
        balances.bac = amount;
      }
      if (mintAddress === BRK_MINT_ADDRESS) {
        console.log(`Found BRK: ${amount}`);
        balances.brk = amount;
      }
      if (mintAddress === CSCO_MINT_ADDRESS) {
        console.log(`Found CSCO: ${amount}`);
        balances.csco = amount;
      }
      if (mintAddress === COIN_MINT_ADDRESS) {
        console.log(`Found COIN: ${amount}`);
        balances.coin = amount;
      }
      if (mintAddress === CMCSA_MINT_ADDRESS) {
        console.log(`Found CMCSA: ${amount}`);
        balances.cmcsa = amount;
      }
      if (mintAddress === CRWD_MINT_ADDRESS) {
        console.log(`Found CRWD: ${amount}`);
        balances.crwd = amount;
      }
      if (mintAddress === DHR_MINT_ADDRESS) {
        console.log(`Found DHR: ${amount}`);
        balances.dhr = amount;
      }
      if (mintAddress === GS_MINT_ADDRESS) {
        console.log(`Found GS: ${amount}`);
        balances.gs = amount;
      }
      if (mintAddress === HON_MINT_ADDRESS) {
        console.log(`Found HON: ${amount}`);
        balances.hon = amount;
      }
      if (mintAddress === IBM_MINT_ADDRESS) {
        console.log(`Found IBM: ${amount}`);
        balances.ibm = amount;
      }
      if (mintAddress === INTC_MINT_ADDRESS) {
        console.log(`Found INTC: ${amount}`);
        balances.intc = amount;
      }
      if (mintAddress === LIN_MINT_ADDRESS) {
        console.log(`Found LIN: ${amount}`);
        balances.lin = amount;
      }
      if (mintAddress === MRVL_MINT_ADDRESS) {
        console.log(`Found MRVL: ${amount}`);
        balances.mrvl = amount;
      }
      if (mintAddress === MCD_MINT_ADDRESS) {
        console.log(`Found MCD: ${amount}`);
        balances.mcd = amount;
      }
      if (mintAddress === MDT_MINT_ADDRESS) {
        console.log(`Found MDT: ${amount}`);
        balances.mdt = amount;
      }
      if (mintAddress === NVO_MINT_ADDRESS) {
        console.log(`Found NVO: ${amount}`);
        balances.nvo = amount;
      }
      if (mintAddress === ORCL_MINT_ADDRESS) {
        console.log(`Found ORCL: ${amount}`);
        balances.orcl = amount;
      }
      if (mintAddress === PLTR_MINT_ADDRESS) {
        console.log(`Found PLTR: ${amount}`);
        balances.pltr = amount;
      }
      if (mintAddress === PM_MINT_ADDRESS) {
        console.log(`Found PM: ${amount}`);
        balances.pm = amount;
      }
      if (mintAddress === HOOD_MINT_ADDRESS) {
        console.log(`Found HOOD: ${amount}`);
        balances.hood = amount;
      }
      if (mintAddress === CRM_MINT_ADDRESS) {
        console.log(`Found CRM: ${amount}`);
        balances.crm = amount;
      }
      if (mintAddress === TMO_MINT_ADDRESS) {
        console.log(`Found TMO: ${amount}`);
        balances.tmo = amount;
      }
      if (mintAddress === GOOGL_MINT_ADDRESS) {
        console.log(`Found GOOGL: ${amount}`);
        balances.googl = amount;
      }
      if (mintAddress === AMZN_MINT_ADDRESS) {
        console.log(`Found AMZN: ${amount}`);
        balances.amzn = amount;
      }
      if (mintAddress === MSTR_MINT_ADDRESS) {
        console.log(`Found MSTR: ${amount}`);
        balances.mstr = amount;
      }
      if (mintAddress === GME_MINT_ADDRESS) {
        console.log(`Found GME: ${amount}`);
        balances.gme = amount;
      }
    }




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
