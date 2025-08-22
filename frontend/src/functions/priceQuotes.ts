import { updateExchangeRateUSD, getMintAddress } from "../features/assets/assetsSlice.ts";
import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from '../env';

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

const getStockPrice = async (
  dispatch: Function
): Promise<boolean> => {
  try {
      console.log("STOCKS - getting stock prices")
  const response = await fetch(`${MYFYE_BACKEND}/stock-prices`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': MYFYE_BACKEND_KEY,
    },
  });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("STOCKS - Backend error:", errorData);
        throw new Error(`Backend error: ${errorData.error || 'Unknown error'}`);
    }

    const result = await response.json();

    console.log("STOCKS - result", result)

    // Map through the stock data and dispatch exchange rates
    if (result.success && result.data && Array.isArray(result.data)) {
      console.log("STOCKS - Processing", result.data.length, "stocks");
      result.data.forEach((stock: any) => {
        if (stock.symbol && stock.price) {
          // Handle special case: API returns "BRK-B" but assetsSlice uses "BRK.B"
          let assetId = stock.symbol;
          if (stock.symbol === "BRK-B") {
            assetId = "BRK.B";
          }

          console.log("STOCKS - Dispatching", assetId, "with price", stock.price);
          
          try {
            dispatch(
              updateExchangeRateUSD({
                assetId: assetId,
                exchangeRateUSD: stock.price,
              })
            );
          } catch (error) {
            console.error("STOCKS - Error dispatching", assetId, "with price", stock.price, error);
            throw ("STOCKS - Error dispatching", assetId, "with price", stock.price, error);
          }
        }
      });
      console.log("STOCKS - Successfully processed all stocks");
    } else {
      console.error("STOCKS - Invalid response format:", result);
    }

    return true;
  } catch (error) {
    console.error("STOCKS - Error getting stock prices:", error);
    return false;
  }
}


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

const getCETESPriceQuote = async (
  dispatch: Function
): Promise<boolean> => {
  try {
    const quote = await getSwapQuote(getMintAddress("CETES"));
    const priceInUSD = quote.outAmount / 1000000;
    console.log("QUOTE CETES price quote", priceInUSD)
    dispatch(
      updateExchangeRateUSD({
        assetId: "CETES",
        exchangeRateUSD: priceInUSD,
      })
    );
    return true;
  } catch (error) {
    console.error('QUOTE ERROR getting CETES price quote:', error)
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




// Export function that calls all price quotes with Promise.all
export const getPriceQuotes = async (dispatch: Function): Promise<void> => {
  console.log('QUOTE GETTING PRICE QUOTES')
  try {
    await Promise.all([
      // Crypto & Cash assets
      getBTCPriceQuote(dispatch),
      getEURPriceQuote(dispatch),
      getSOLPriceQuote(dispatch),
      getXRPPriceQuote(dispatch),
      getSUIPriceQuote(dispatch),
      getDOGEPriceQuote(dispatch),
      // Earn assets
      getUSDYPriceQuote(dispatch),
      getCETESPriceQuote(dispatch),
      //getEUROBPriceQuote(dispatch),
      //getGILTSPriceQuote(dispatch),
      //getTESOUROPriceQuote(dispatch),
      // Stock assets
      getStockPrice(dispatch)
    ]);
    console.log('QUOTE ALL PRICE QUOTES COMPLETED SUCCESSFULLY')
  } catch (error) {
    console.error('QUOTE ERROR GETTING PRICE QUOTES:', error)
  }
};