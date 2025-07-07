import { updateExchangeRateUSD } from "../features/assets/assetsSlice.ts";
import mintAddress from "./MintAddress.tsx";

// Reusable function to get swap quotes from Jupiter API
const getSwapQuote = async (
  inputMintAddress: string,
  amount: number = 1000000
): Promise<any> => {
  try {
    const outputMintAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC

    const response = await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMintAddress}&amount=${amount}&slippageBps=50`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const quoteResponse = await response.json();
    return quoteResponse;
  } catch (error) {
    console.error(`QUOTE ERROR in getSwapQuote for ${inputMintAddress}:`, error)
    throw error;
  }
};

const getUSDYPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("usdy_sol"));
    const priceInUSD = quote.outAmount / 1000000;
    console.log("QUOTE USDY price quote", priceInUSD)
    dispatch(
      updateExchangeRateUSD({
        assetId: "usdy_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE USDY price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting USDY price quote:', error)
    return false;
  }
};

const getBTCPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  const quote = await getSwapQuote(mintAddress("btc_sol"));
  const priceInUSD = quote.outAmount / 10000;
  dispatch(
    updateExchangeRateUSD({
      assetId: "btc_sol",
      exchangeRateUSD: priceInUSD,
    })
  );

  return true;
};

const getXRPPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  const quote = await getSwapQuote(mintAddress("xrp_sol"));
  const priceInUSD = quote.outAmount / 1000;
  console.log("XRP priceInUSD", priceInUSD);
  dispatch(
    updateExchangeRateUSD({
      assetId: "xrp_sol",
      exchangeRateUSD: priceInUSD,
    })
  );

  console.log("XRP quote response:", quote);
  return true;
};

const getSUIPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  const quote = await getSwapQuote(mintAddress("sui_sol"));
  const priceInUSD = quote.outAmount / 1000;
  console.log("SUI priceInUSD", priceInUSD);
  dispatch(
    updateExchangeRateUSD({
      assetId: "sui_sol",
      exchangeRateUSD: priceInUSD,
    })
  );

  console.log("SUI quote response:", quote);
  return true;
};

const getDOGEPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  const quote = await getSwapQuote(mintAddress("doge_sol"));
  const priceInUSD = quote.outAmount / 1000;
  console.log("DOGE priceInUSD", priceInUSD);
  dispatch(
    updateExchangeRateUSD({
      assetId: "doge_sol",
      exchangeRateUSD: priceInUSD,
    })
  );

  console.log("DOGE quote response:", quote);
  return true;
};

const getEURCPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  const quote = await getSwapQuote(mintAddress("eurc_sol"));
  const priceInUSD = quote.outAmount / 1000000;
  dispatch(
    updateExchangeRateUSD({
      assetId: "eurc_sol",
      exchangeRateUSD: priceInUSD,
    })
  );

  return true;
};

const getSOLPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  console.log("getting SOLANA price quote");
  const quote = await getSwapQuote(mintAddress("sol"), 1_000_000_000); // wSOL wrapped solana
  const priceInUSD = quote.outAmount / 1000000;
  console.log("SOLANA priceInUSD", priceInUSD);
  dispatch(
    updateExchangeRateUSD({
      assetId: "sol",
      exchangeRateUSD: priceInUSD,
    })
  );

  return true;
};

// Stock price quote functions
const getAAPLPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("AAPL"));
    const priceInUSD = quote.outAmount / 10000;
    console.log("AAPL price quote", priceInUSD)
    dispatch(
      updateExchangeRateUSD({
        assetId: "AAPL_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE AAPL price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting AAPL price quote:', error)
    return false;
  }
};

const getABTPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("ABT"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "ABT_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE ABT price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting ABT price quote:', error)
    return false;
  }
};

const getABBVPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("ABBV"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "ABBV_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE ABBV price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting ABBV price quote:', error)
    return false;
  }
};

const getACNPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("ACN"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "ACN_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE ACN price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting ACN price quote:', error)
    return false;
  }
};

const getGOOGLPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("GOOGL"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "GOOGL",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE GOOGL price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting GOOGL price quote:', error)
    return false;
  }
};

const getAMZNPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("AMZN"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "AMZN",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE AMZN price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting AMZN price quote:', error)
    return false;
  }
};

const getAMBRPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("AMBR"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "AMBR_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE AMBR price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting AMBR price quote:', error)
    return false;
  }
};

const getAPPPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("APP"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "APP_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE APP price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting APP price quote:', error)
    return false;
  }
};

const getAZNPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("AZN"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "AZN_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE AZN price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting AZN price quote:', error)
    return false;
  }
};

const getBACPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("BAC"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "BAC_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE BAC price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting BAC price quote:', error)
    return false;
  }
};

const getBRKPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("BRK"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "BRK_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE BRK price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting BRK price quote:', error)
    return false;
  }
};

const getAVGOPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("AVGO"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "AVGO_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE AVGO price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting AVGO price quote:', error)
    return false;
  }
};

const getCVXPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("CVX"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "CVX_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE CVX price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting CVX price quote:', error)
    return false;
  }
};

const getCRCLPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("CRCL"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "CRCL_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE CRCL price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting CRCL price quote:', error)
    return false;
  }
};

const getCSCOPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("CSCO"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "CSCO_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE CSCO price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting CSCO price quote:', error)
    return false;
  }
};

const getKOPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("KO"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "KO_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE KO price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting KO price quote:', error)
    return false;
  }
};

const getCOINPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("COIN"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "COIN_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE COIN price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting COIN price quote:', error)
    return false;
  }
};

const getCMCSAPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("CMCSA"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "CMCSA_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE CMCSA price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting CMCSA price quote:', error)
    return false;
  }
};

const getCRWDPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("CRWD"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "CRWD_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE CRWD price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting CRWD price quote:', error)
    return false;
  }
};

const getDHRPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("DHR"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "DHR_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE DHR price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting DHR price quote:', error)
    return false;
  }
};

const getDFDVPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("DFDV"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "DFDV_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE DFDV price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting DFDV price quote:', error)
    return false;
  }
};

const getLLYPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("LLY"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "LLY_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE LLY price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting LLY price quote:', error)
    return false;
  }
};

const getXOMPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("XOM"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "XOM_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE XOM price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting XOM price quote:', error)
    return false;
  }
};

const getGMEPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("GME"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "GME_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE GME price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting GME price quote:', error)
    return false;
  }
};

const getGLDPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("GLD"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "GLD_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE GLD price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting GLD price quote:', error)
    return false;
  }
};

const getGSPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("GS"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "GS_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE GS price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting GS price quote:', error)
    return false;
  }
};

const getHDPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("HD"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "HD_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE HD price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting HD price quote:', error)
    return false;
  }
};

const getHONPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("HON"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "HON_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE HON price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting HON price quote:', error)
    return false;
  }
};

const getINTCPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("INTC"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "INTC_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE INTC price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting INTC price quote:', error)
    return false;
  }
};

const getIBMPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("IBM"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "IBM_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE IBM price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting IBM price quote:', error)
    return false;
  }
};

const getJNJPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("JNJ"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "JNJ_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE JNJ price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting JNJ price quote:', error)
    return false;
  }
};

const getJPMPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("JPM"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "JPM_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE JPM price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting JPM price quote:', error)
    return false;
  }
};

const getLINPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("LIN"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "LIN_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE LIN price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting LIN price quote:', error)
    return false;
  }
};

const getMRVLPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("MRVL"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "MRVL_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE MRVL price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting MRVL price quote:', error)
    return false;
  }
};

const getMAPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("MA"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "MA_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE MA price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting MA price quote:', error)
    return false;
  }
};

const getMCDPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("MCD"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "MCD_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE MCD price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting MCD price quote:', error)
    return false;
  }
};

const getMDTPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("MDT"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "MDT_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE MDT price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting MDT price quote:', error)
    return false;
  }
};

const getMRKPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("MRK"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "MRK_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE MRK price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting MRK price quote:', error)
    return false;
  }
};

const getMETAPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("META"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "META_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE META price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting META price quote:', error)
    return false;
  }
};

const getMSFTPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("MSFT"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "MSFT_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE MSFT price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting MSFT price quote:', error)
    return false;
  }
};

const getMSTRPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("MSTR"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "MSTR_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE MSTR price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting MSTR price quote:', error)
    return false;
  }
};

const getQQQPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("QQQ"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "QQQ_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE QQQ price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting QQQ price quote:', error)
    return false;
  }
};

const getNFLXPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("NFLX"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "NFLX_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE NFLX price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting NFLX price quote:', error)
    return false;
  }
};

const getNVOPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("NVO"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "NVO_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE NVO price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting NVO price quote:', error)
    return false;
  }
};

const getNVDAPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("NVDA"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "NVDA_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE NVDA price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting NVDA price quote:', error)
    return false;
  }
};

const getORCLPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("ORCL"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "ORCL_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE ORCL price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting ORCL price quote:', error)
    return false;
  }
};

const getPLTRPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("PLTR"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "PLTR_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE PLTR price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting PLTR price quote:', error)
    return false;
  }
};

const getPEPPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("PEP"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "PEP_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE PEP price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting PEP price quote:', error)
    return false;
  }
};

const getPFEPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("PFE"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "PFE_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE PFE price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting PFE price quote:', error)
    return false;
  }
};

const getPMPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("PM"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "PM_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE PM price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting PM price quote:', error)
    return false;
  }
};

const getPGPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("PG"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "PG_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE PG price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting PG price quote:', error)
    return false;
  }
};

const getHOODPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("HOOD"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "HOOD_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE HOOD price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting HOOD price quote:', error)
    return false;
  }
};

const getCRMPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("CRM"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "CRM_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE CRM price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting CRM price quote:', error)
    return false;
  }
};

const getSPYPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("SPY"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "SPY_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE SPY price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting SPY price quote:', error)
    return false;
  }
};

const getTSLAPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("TSLA"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "TSLA_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE TSLA price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting TSLA price quote:', error)
    return false;
  }
};

const getTMOPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("TMO"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "TMO_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE TMO price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting TMO price quote:', error)
    return false;
  }
};

const getTQQQPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("TQQQ"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "TQQQ_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE TQQQ price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting TQQQ price quote:', error)
    return false;
  }
};

const getUNHPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("UNH"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "UNH_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE UNH price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting UNH price quote:', error)
    return false;
  }
};

const getVTIPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("VTI"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "VTI_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE VTI price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting VTI price quote:', error)
    return false;
  }
};

const getVPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("V"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "V_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE V price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting V price quote:', error)
    return false;
  }
};

const getWMTPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(mintAddress("WMT"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "WMT_sol",
        exchangeRateUSD: priceInUSD,
      })
    );
    console.log('QUOTE WMT price quote', priceInUSD)
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting WMT price quote:', error)
    return false;
  }
};

// Export function that calls all price quotes with Promise.all
export const getPriceQuotes = async (dispatch: Function): Promise<void> => {
  console.log('QUOTE GETTING PRICE QUOTES')
  try {
    await Promise.all([
      // Crypto & Cash assets
      getUSDYPriceQuote(dispatch),
      getBTCPriceQuote(dispatch),
      getEURCPriceQuote(dispatch),
      getSOLPriceQuote(dispatch),
      getXRPPriceQuote(dispatch),
      getSUIPriceQuote(dispatch),
      getDOGEPriceQuote(dispatch),
      // Stock assets
      getNVDAPriceQuote(dispatch),
      getAAPLPriceQuote(dispatch),
      //getAMZNPriceQuote(dispatch),
      //getGOOGLPriceQuote(dispatch),
      //getMSFTPriceQuote(dispatch),
      //getNFLXPriceQuote(dispatch),
      //getKOPriceQuote(dispatch),
      //getWMTPriceQuote(dispatch),
      //getJPMPriceQuote(dispatch),
      getSPYPriceQuote(dispatch),
      getTSLAPriceQuote(dispatch),
      getCOINPriceQuote(dispatch),
    /*
      getABTPriceQuote(dispatch),
      getABBVPriceQuote(dispatch),
      getACNPriceQuote(dispatch),
      getAMBRPriceQuote(dispatch),
      getAPPPriceQuote(dispatch),
      getAZNPriceQuote(dispatch),
      getBACPriceQuote(dispatch),
      getBRKPriceQuote(dispatch),
      getAVGOPriceQuote(dispatch),
      getCVXPriceQuote(dispatch),
      getCRCLPriceQuote(dispatch),
      getCSCOPriceQuote(dispatch),
      getKOPriceQuote(dispatch),
      getCMCSAPriceQuote(dispatch),
      getCRWDPriceQuote(dispatch),
      getDHRPriceQuote(dispatch),
      getDFDVPriceQuote(dispatch),
      getLLYPriceQuote(dispatch),
      getXOMPriceQuote(dispatch),
      getGMEPriceQuote(dispatch),
      getGLDPriceQuote(dispatch),
      getGSPriceQuote(dispatch),
      getHDPriceQuote(dispatch),
      getHONPriceQuote(dispatch),
      getINTCPriceQuote(dispatch),
      getIBMPriceQuote(dispatch),
      getJNJPriceQuote(dispatch),
      getLINPriceQuote(dispatch),
      getMRVLPriceQuote(dispatch),
      getMAPriceQuote(dispatch),
      getMCDPriceQuote(dispatch),
      getMDTPriceQuote(dispatch),
      getMRKPriceQuote(dispatch),
      getMETAPriceQuote(dispatch),
      getMSTRPriceQuote(dispatch),
      getQQQPriceQuote(dispatch),
      getNFLXPriceQuote(dispatch),
      getNVOPriceQuote(dispatch),
      getORCLPriceQuote(dispatch),
      getPLTRPriceQuote(dispatch),
      getPEPPriceQuote(dispatch),
      getPFEPriceQuote(dispatch),
      getPMPriceQuote(dispatch),
      getPGPriceQuote(dispatch),
      getHOODPriceQuote(dispatch),
      getCRMPriceQuote(dispatch),
      getSPYPriceQuote(dispatch),
      getTMOPriceQuote(dispatch),
      getTQQQPriceQuote(dispatch),
      getUNHPriceQuote(dispatch),
      getVTIPriceQuote(dispatch),
      getVPriceQuote(dispatch),
      */
    ]);
    console.log('QUOTE ALL PRICE QUOTES COMPLETED SUCCESSFULLY')
  } catch (error) {
    console.error('QUOTE ERROR GETTING PRICE QUOTES:', error)
  }
};