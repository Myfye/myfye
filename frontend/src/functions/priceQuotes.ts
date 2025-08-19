import { updateExchangeRateUSD, getMintAddress } from "../features/assets/assetsSlice.ts";

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
    const quote = await getSwapQuote(getMintAddress("USDY"));
    const priceInUSD = quote.outAmount / 1000000;
    console.log("QUOTE USDY price quote", priceInUSD)
    dispatch(
      updateExchangeRateUSD({
        assetId: "USDY",
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
      const quote = await getSwapQuote(getMintAddress("BTC"));
  const priceInUSD = quote.outAmount / 10000;
  dispatch(
    updateExchangeRateUSD({
      assetId: "BTC",
      exchangeRateUSD: priceInUSD,
    })
  );

  return true;
};

const getXRPPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
      const quote = await getSwapQuote(getMintAddress("XRP"));
  const priceInUSD = quote.outAmount / 1000;
  console.log("XRP priceInUSD", priceInUSD);
  dispatch(
    updateExchangeRateUSD({
      assetId: "XRP",
      exchangeRateUSD: priceInUSD,
    })
  );

  console.log("XRP quote response:", quote);
  return true;
};

const getSUIPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
      const quote = await getSwapQuote(getMintAddress("SUI"));
  const priceInUSD = quote.outAmount / 1000;
  console.log("SUI priceInUSD", priceInUSD);
  dispatch(
    updateExchangeRateUSD({
      assetId: "SUI",
      exchangeRateUSD: priceInUSD,
    })
  );

  console.log("SUI quote response:", quote);
  return true;
};

const getDOGEPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
      const quote = await getSwapQuote(getMintAddress("DOGE"));
  const priceInUSD = quote.outAmount / 1000;
  console.log("DOGE priceInUSD", priceInUSD);
  dispatch(
    updateExchangeRateUSD({
      assetId: "DOGE",
      exchangeRateUSD: priceInUSD,
    })
  );

  console.log("DOGE quote response:", quote);
  return true;
};

const getEURPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
      const quote = await getSwapQuote(getMintAddress("EUR"));
  const priceInUSD = quote.outAmount / 1000000;
  dispatch(
    updateExchangeRateUSD({
      assetId: "EUR",
      exchangeRateUSD: priceInUSD,
    })
  );

  return true;
};

const getSOLPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  console.log("getting SOLANA price quote");
    const quote = await getSwapQuote(getMintAddress("SOL"), 1_000_000_000); // wSOL wrapped solana
  const priceInUSD = quote.outAmount / 1000000;
  console.log("SOLANA priceInUSD", priceInUSD);
  dispatch(
    updateExchangeRateUSD({
      assetId: "SOL",
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
    const quote = await getSwapQuote(getMintAddress("AAPL"));
    const priceInUSD = quote.outAmount / 10000;
    console.log("AAPL price quote", priceInUSD)
    dispatch(
      updateExchangeRateUSD({
        assetId: "AAPL",
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
    const quote = await getSwapQuote(getMintAddress("ABT"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "ABT",
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
    const quote = await getSwapQuote(getMintAddress("ABBV"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "ABBV",
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
    const quote = await getSwapQuote(getMintAddress("ACN"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "ACN",
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
    const quote = await getSwapQuote(getMintAddress("GOOGL"));
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
    const quote = await getSwapQuote(getMintAddress("AMZN"));
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
    const quote = await getSwapQuote(getMintAddress("AMBR"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "AMBR",
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
    const quote = await getSwapQuote(getMintAddress("APP"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "APP",
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
    const quote = await getSwapQuote(getMintAddress("AZN"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "AZN",
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
    const quote = await getSwapQuote(getMintAddress("BAC"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "BAC",
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
    const quote = await getSwapQuote(getMintAddress("BRK"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "BRK",
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
    const quote = await getSwapQuote(getMintAddress("AVGO"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "AVGO",
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
    const quote = await getSwapQuote(getMintAddress("CVX"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "CVX",
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
    const quote = await getSwapQuote(getMintAddress("CRCL"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "CRCL",
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
    const quote = await getSwapQuote(getMintAddress("CSCO"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "CSCO",
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
    const quote = await getSwapQuote(getMintAddress("KO"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "KO",
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
    const quote = await getSwapQuote(getMintAddress("COIN"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "COIN",
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
    const quote = await getSwapQuote(getMintAddress("CMCSA"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "CMCSA",
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
    const quote = await getSwapQuote(getMintAddress("CRWD"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "CRWD",
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
    const quote = await getSwapQuote(getMintAddress("DHR"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "DHR",
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
    const quote = await getSwapQuote(getMintAddress("DFDV"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "DFDV",
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
    const quote = await getSwapQuote(getMintAddress("LLY"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "LLY",
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
    const quote = await getSwapQuote(getMintAddress("XOM"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "XOM",
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
    const quote = await getSwapQuote(getMintAddress("GME"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "GME",
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
    const quote = await getSwapQuote(getMintAddress("GLD"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "GLD",
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
    const quote = await getSwapQuote(getMintAddress("GS"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "GS",
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
    const quote = await getSwapQuote(getMintAddress("HD"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "HD",
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
    const quote = await getSwapQuote(getMintAddress("HON"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "HON",
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
    const quote = await getSwapQuote(getMintAddress("INTC"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "INTC",
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
    const quote = await getSwapQuote(getMintAddress("IBM"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "IBM",
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
    const quote = await getSwapQuote(getMintAddress("JNJ"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "JNJ",
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
    const quote = await getSwapQuote(getMintAddress("JPM"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "JPM",
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
    const quote = await getSwapQuote(getMintAddress("LIN"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "LIN",
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
    const quote = await getSwapQuote(getMintAddress("MRVL"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "MRVL",
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
    const quote = await getSwapQuote(getMintAddress("MA"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "MA",
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
    const quote = await getSwapQuote(getMintAddress("MCD"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "MCD",
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
    const quote = await getSwapQuote(getMintAddress("MDT"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "MDT",
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
    const quote = await getSwapQuote(getMintAddress("MRK"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "MRK",
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
    const quote = await getSwapQuote(getMintAddress("META"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "META",
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
    const quote = await getSwapQuote(getMintAddress("MSFT"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "MSFT",
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
    const quote = await getSwapQuote(getMintAddress("MSTR"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "MSTR",
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
    const quote = await getSwapQuote(getMintAddress("QQQ"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "QQQ",
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
    const quote = await getSwapQuote(getMintAddress("NFLX"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "NFLX",
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
    const quote = await getSwapQuote(getMintAddress("NVO"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "NVO",
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
    const quote = await getSwapQuote(getMintAddress("NVDA"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "NVDA",
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
    const quote = await getSwapQuote(getMintAddress("ORCL"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "ORCL",
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
    const quote = await getSwapQuote(getMintAddress("PLTR"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "PLTR",
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
    const quote = await getSwapQuote(getMintAddress("PEP"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "PEP",
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
    const quote = await getSwapQuote(getMintAddress("PFE"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "PFE",
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
    const quote = await getSwapQuote(getMintAddress("PM"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "PM",
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
    const quote = await getSwapQuote(getMintAddress("PG"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "PG",
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
    const quote = await getSwapQuote(getMintAddress("HOOD"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "HOOD",
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
    const quote = await getSwapQuote(getMintAddress("CRM"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "CRM",
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
    const quote = await getSwapQuote(getMintAddress("SPY"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "SPY",
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
    const quote = await getSwapQuote(getMintAddress("TSLA"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "TSLA",
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
    const quote = await getSwapQuote(getMintAddress("TMO"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "TMO",
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
    const quote = await getSwapQuote(getMintAddress("TQQQ"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "TQQQ",
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
    const quote = await getSwapQuote(getMintAddress("UNH"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "UNH",
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
    const quote = await getSwapQuote(getMintAddress("VTI"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "VTI",
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
    const quote = await getSwapQuote(getMintAddress("V"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "V",
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
    const quote = await getSwapQuote(getMintAddress("WMT"));
    const priceInUSD = quote.outAmount / 10000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "WMT",
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
      getEURPriceQuote(dispatch),
      getSOLPriceQuote(dispatch),
      getXRPPriceQuote(dispatch),
      getSUIPriceQuote(dispatch),
      getDOGEPriceQuote(dispatch),
      // Stock assets
      getNVDAPriceQuote(dispatch),
      getAAPLPriceQuote(dispatch),
      //getAMZNPriceQuote(dispatch),
      getGOOGLPriceQuote(dispatch),
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