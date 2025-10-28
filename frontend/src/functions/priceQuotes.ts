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

    console.log("STOCKS - Response:", response);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("STOCKS - Backend error:", errorData);
      throw new Error(`Backend error: ${errorData.error || "Unknown error"}`);
    }

    const result = await response.json();
    console.log("STOCKS - Full response data:", JSON.stringify(result, null, 2));

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
            console.error(
              "STOCKS - Error dispatching",
              assetId,
              "with price",
              stock.price,
              error
            );
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
    console.log(
      "COINGECKO - Starting batch price fetch for BTC, XRP, DOGE, SUI, SOL"
    );

    // CoinGecko API endpoint for batch price lookup
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ripple,dogecoin,sui,solana&vs_currencies=usd"
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("COINGECKO - Raw API response:", data);

    // Map CoinGecko IDs to our asset IDs and dispatch prices
    const cryptoMapping = {
      bitcoin: "BTC",
      ripple: "XRP",
      dogecoin: "DOGE",
      sui: "SUI",
      solana: "SOL",
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

      console.log(`COINGECKO - ${assetId} price: $${price} (${priceSource})`);

      dispatch(
        updateExchangeRateUSD({
          assetId: assetId,
          exchangeRateUSD: price,
        })
      );
    });

    console.log(
      `COINGECKO - Successfully fetched ${successCount}/5 crypto prices`
    );
    return successCount > 0;
  } catch (error) {
    console.error("COINGECKO - Error getting crypto price quotes:", error);
    console.log("COINGECKO - Using all fallback prices due to API error");

    // Use all fallback prices when the entire API call fails
    const fallbackPrices = getHardcodedFallbackPrices();
    const cryptoAssets = ["BTC", "XRP", "DOGE", "SUI", "SOL"];

    cryptoAssets.forEach((assetId) => {
      const price = fallbackPrices[assetId];
      console.log(
        `COINGECKO - ${assetId} price: $${price} (Fallback - API Error)`
      );

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

    return true;
  } catch (error) {
    console.error("QUOTE ERROR getting GOLD price quote:", error);
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
      getGOLDPriceQuote(dispatch),
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
  };
};
