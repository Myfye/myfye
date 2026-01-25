import {
  updateExchangeRateUSD,
  getMintAddress,
} from "../features/assets/stores/assetsSlice.ts";
import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "../env";

// Reusable function to get swap quotes from Jupiter API
const getSwapQuote = async (
  inputMintAddress: string,
  amount: number = 1000000
): Promise<any> => {
  try {
    const outputMintAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC

    const response = await fetch(
      `https://lite-api.jup.ag/swap/v1/quote?inputMint=${inputMintAddress}&outputMint=${outputMintAddress}&amount=${amount}&slippageBps=50`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const quoteResponse = await response.json();
    return quoteResponse;
  } catch (error) {
    console.error(
      `QUOTE ERROR in getSwapQuote for ${inputMintAddress}:`,
      error
    );
    throw error;
  }
};

const getStockPrice = async (dispatch: Function): Promise<boolean> => {
  try {
    const response = await fetch(`${MYFYE_BACKEND}/stock-prices`, {
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": MYFYE_BACKEND_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      throw new Error(`Backend error: ${errorData.error || "Unknown error"}`);
    }

    const result = await response.json();

    // Map through the stock data and dispatch exchange rates
    if (result.success && result.data && Array.isArray(result.data)) {
      result.data.forEach((stock: any) => {
        if (stock.symbol && stock.price) {
          // Handle special case: API returns "BRK-B" but assetsSlice uses "BRK.B"
          let assetId = stock.symbol;
          if (stock.symbol === "BRK-B") {
            assetId = "BRK.B";
          }

          try {
            dispatch(
              updateExchangeRateUSD({
                assetId: assetId,
                exchangeRateUSD: stock.price,
              })
            );
          } catch (error) {
            
            throw (
              ("STOCKS - Error dispatching",
              assetId,
              "with price",
              stock.price,
              error)
            );
          }
        }
      });
    } else {
      console.error("STOCKS - Invalid response format:", result);
    }

    return true;
  } catch (error) {
    console.error("STOCKS - Error getting stock prices:", error);
    return false;
  }
};

const getUSDYPriceQuote = async (dispatch: Function): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(getMintAddress("USDY"));
    const priceInUSD = quote.outAmount / 1000000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "USDY",
        exchangeRateUSD: priceInUSD,
      })
    );

    return true;
  } catch (error) {
    console.error("QUOTE ERROR getting USDY price quote:", error);
    return false;
  }
};

const getCETESPriceQuote = async (dispatch: Function): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(getMintAddress("CETES"));
    const priceInUSD = quote.outAmount / 1000000;

    dispatch(
      updateExchangeRateUSD({
        assetId: "CETES",
        exchangeRateUSD: priceInUSD,
      })
    );
    return true;
  } catch (error) {
    console.error("QUOTE ERROR getting CETES price quote:", error);
    return false;
  }
};

// CoinGecko API batch call for crypto prices
const getCryptoPriceQuotes = async (dispatch: Function): Promise<boolean> => {
  try {
    

    // CoinGecko API endpoint for batch price lookup
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ripple,dogecoin,sui,solana,monad&vs_currencies=usd"
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error! status: ${response.status}`);
    }

    const data = await response.json();
    

    // Map CoinGecko IDs to our asset IDs and dispatch prices
    const cryptoMapping = {
      bitcoin: "BTC",
      ripple: "XRP",
      dogecoin: "DOGE",
      sui: "SUI",
      solana: "SOL",
      monad: "MONAD",
    };

    let successCount = 0;

    const fallbackPrices = getHardcodedFallbackPrices();

    Object.entries(cryptoMapping).forEach(([coingeckoId, assetId]) => {
      let price: number;
      let priceSource: string;

      if (data[coingeckoId] && data[coingeckoId].usd) {
        price = data[coingeckoId].usd;
        priceSource = "CoinGecko API";
        successCount++;
      } else {
        // Use fallback price if CoinGecko data is missing
        price = fallbackPrices[assetId];
        priceSource = "Fallback";
        console.warn(
          `COINGECKO - No price data found for ${assetId} (${coingeckoId}), using fallback: $${price}`
        );
      }

      
      dispatch(
        updateExchangeRateUSD({
          assetId: assetId,
          exchangeRateUSD: price,
        })
      );
    });

    
    return successCount > 0;
  } catch (error) {
    console.error("COINGECKO - Error getting crypto price quotes:", error);
    console.log("COINGECKO - Using all fallback prices due to API error");

    // Use all fallback prices when the entire API call fails
    const fallbackPrices = getHardcodedFallbackPrices();
    const cryptoAssets = ["BTC", "XRP", "DOGE", "SUI", "SOL"];

    cryptoAssets.forEach((assetId) => {
      const price = fallbackPrices[assetId];
      
      dispatch(
        updateExchangeRateUSD({
          assetId: assetId,
          exchangeRateUSD: price,
        })
      );
    });

    return true; // Return true since we still provided prices via fallback
  }
};

const getEURPriceQuote = async (dispatch: Function): Promise<boolean> => {
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

const getSOLPriceQuote = async (dispatch: Function): Promise<boolean> => {
  const quote = await getSwapQuote(getMintAddress("SOL"), 1_000_000_000); // wSOL wrapped solana
  const priceInUSD = quote.outAmount / 1000000;

  dispatch(
    updateExchangeRateUSD({
      assetId: "SOL",
      exchangeRateUSD: priceInUSD,
    })
  );

  return true;
};

const getGOLDPriceQuote = async (dispatch: Function): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(getMintAddress("GOLD"));
    const priceInUSD = quote.outAmount / 1000000;

    dispatch(
      updateExchangeRateUSD({
        assetId: "GOLD",
        exchangeRateUSD: priceInUSD,
      })
    );

    // update GLD too
    dispatch(
      updateExchangeRateUSD({
        assetId: "GLD",
        exchangeRateUSD: priceInUSD,
      })
    );

    return true;
  } catch (error) {
    console.error("QUOTE ERROR getting GOLD price quote:", error);
    // Use fallback price for both GOLD and GLD
    const fallbackPrice = getCommodityFallbackPrices().GLD;
    console.warn(`GOLD/GLD - Using fallback price: $${fallbackPrice}`);
    dispatch(
      updateExchangeRateUSD({
        assetId: "GOLD",
        exchangeRateUSD: fallbackPrice,
      })
    );
    dispatch(
      updateExchangeRateUSD({
        assetId: "GLD",
        exchangeRateUSD: fallbackPrice,
      })
    );
    return false;
  }
};

const getSLVRPriceQuote = async (dispatch: Function): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(getMintAddress("SLVR"));
    const priceInUSD = quote.outAmount / 1000000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "SLVR",
        exchangeRateUSD: priceInUSD,
      })
    );
    return true;
  } catch (error) {
    console.error("QUOTE ERROR getting SLVR price quote:", error);
    // Use fallback price - approximate silver price per unit
    const fallbackPrice = getCommodityFallbackPrices().SLVR;
    console.warn(`SLVR - Using fallback price: $${fallbackPrice}`);
    dispatch(
      updateExchangeRateUSD({
        assetId: "SLVR",
        exchangeRateUSD: fallbackPrice,
      })
    );
    return false;
  }
};


const getCPPRPriceQuote = async (dispatch: Function): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(getMintAddress("CPPR"));
    const priceInUSD = quote.outAmount / 1000000;
    dispatch(
      updateExchangeRateUSD({
        assetId: "CPPR",
        exchangeRateUSD: priceInUSD,
      })
    );
    return true;
  } catch (error) {
    console.error("QUOTE ERROR getting CPPR price quote:", error);
    // Use fallback price - approximate copper price per unit
    const fallbackPrice = getCommodityFallbackPrices().CPPR;
    console.warn(`CPPR - Using fallback price: $${fallbackPrice}`);
    dispatch(
      updateExchangeRateUSD({
        assetId: "CPPR",
        exchangeRateUSD: fallbackPrice,
      })
    );
    return false;
  }
};

// Export function that calls all price quotes with Promise.all
export const getPriceQuotes = async (dispatch: Function): Promise<void> => {
  try {
    await Promise.all([
      // Crypto assets (using CoinGecko batch API - includes BTC, XRP, DOGE, SUI, SOL)
      getCryptoPriceQuotes(dispatch),
      // Other assets
      getEURPriceQuote(dispatch),
      // Earn assets
      getUSDYPriceQuote(dispatch),
      getCETESPriceQuote(dispatch),
      getGOLDPriceQuote(dispatch), // update GLD price too
      getSLVRPriceQuote(dispatch),
      getCPPRPriceQuote(dispatch),
      //getEUROBPriceQuote(dispatch),
      //getGILTSPriceQuote(dispatch),
      //getTESOUROPriceQuote(dispatch),
      // Stock assets
      getStockPrice(dispatch),
    ]);
  } catch (error) {
    console.error("QUOTE ERROR GETTING PRICE QUOTES:", error);
  }
};

// Hardcoded fallback prices for crypto assets
const getHardcodedFallbackPrices = (): Record<string, number> => {
  return {
    // Crypto
    BTC: 115800,
    SOL: 237,
    XRP: 3,
    DOGE: 0.27,
    SUI: 3.5,
    MONAD: 0.045,
  };
};

// Hardcoded fallback prices for commodity assets (when Jupiter doesn't have liquidity)
const getCommodityFallbackPrices = (): Record<string, number> => {
  return {
    // Commodities - approximate prices per share/unit
    GLD: 250, // Gold Trust ETF approximate price
    SLVR: 28, // Silver Trust approximate price
    CPPR: 4.5, // Copper Trust approximate price
  };
};
