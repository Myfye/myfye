import { updateExchangeRateUSD } from "../features/assets/assetsSlice.ts";
import { DINARI_API_KEY, MYFYE_BACKEND_KEY } from '../env';

const getAAPLPriceQuote = async (
    dispatch: Function
  ): Promise<boolean> => {

    const stock_id = "0196ea6d-b6de-70d5-ae41-9525959ef309";
    
      const quote = await getQuote(stock_id);
      console.log("APPL.d_base quote", quote);
      console.log("APPL.d_base priceInUSD", quote.price);
      dispatch(
        updateExchangeRateUSD({
          assetId: "APPL.d_base",
          exchangeRateUSD: quote.price,
        })
      );
  
    return true;
  };

const getMSFTPriceQuote = async (
    dispatch: Function
  ): Promise<boolean> => {
    const stock_id = "0196ea6d-b6e0-77b6-a3a6-908dfdd73699";
    
    const quote = await getQuote(stock_id);
    console.log("MSFT.d_base quote", quote);
    console.log("MSFT.d_base priceInUSD", quote.price);
    dispatch(
      updateExchangeRateUSD({
        assetId: "MSFT.d_base",
        exchangeRateUSD: quote.price,
      })
    );

    return true;
  };

const getGOOGLPriceQuote = async (
    dispatch: Function
  ): Promise<boolean> => {
    const stock_id = "0196ea6d-b6e0-72e1-9720-40cb42c336f7";
    
    const quote = await getQuote(stock_id);
    console.log("GOOGL.d_base quote", quote);
    console.log("GOOGL.d_base priceInUSD", quote.price);
    dispatch(
      updateExchangeRateUSD({
        assetId: "GOOGL.d_base",
        exchangeRateUSD: quote.price,
      })
    );

    return true;
  };

const getNFLXPriceQuote = async (
    dispatch: Function
  ): Promise<boolean> => {
    const stock_id = "0196ea6d-b6e0-7ad1-97d0-df7728329df1";
    
    const quote = await getQuote(stock_id);
    console.log("NFLX.d_base quote", quote);
    console.log("NFLX.d_base priceInUSD", quote.price);
    dispatch(
      updateExchangeRateUSD({
        assetId: "NFLX.d_base",
        exchangeRateUSD: quote.price,
      })
    );

    return true;
  };

const getAMZNPriceQuote = async (
    dispatch: Function
  ): Promise<boolean> => {
    const stock_id = "0196ea6d-b6df-7dcb-a1de-d7733e7bcc51";
    
    const quote = await getQuote(stock_id);
    console.log("AMZN.d_base quote", quote);
    console.log("AMZN.d_base priceInUSD", quote.price);
    dispatch(
      updateExchangeRateUSD({
        assetId: "AMZN.d_base",
        exchangeRateUSD: quote.price,
      })
    );

    return true;
  };

const getSQPriceQuote = async (
    dispatch: Function
  ): Promise<boolean> => {
    const stock_id = "0196ea6d-b6f3-7db2-9254-f8a55a59f514";
    
    const quote = await getQuote(stock_id);
    console.log("SQ.d_base quote", quote);
    console.log("SQ.d_base priceInUSD", quote.price);
    dispatch(
      updateExchangeRateUSD({
        assetId: "SQ.d_base",
        exchangeRateUSD: quote.price,
      })
    );

    return true;
  };

const getDISPriceQuote = async (
    dispatch: Function
  ): Promise<boolean> => {
    const stock_id = "0196ea6d-b6e0-701d-80dd-4b44d4244976";
    
    const quote = await getQuote(stock_id);
    console.log("DIS.d_base quote", quote);
    console.log("DIS.d_base priceInUSD", quote.price);
    dispatch(
      updateExchangeRateUSD({
        assetId: "DIS.d_base",
        exchangeRateUSD: quote.price,
      })
    );

    return true;
  };

const getTSLAPriceQuote = async (
    dispatch: Function
  ): Promise<boolean> => {
    const stock_id = "0196ea6d-b6e4-730e-a611-28c6f11c9b52";
    
    const quote = await getQuote(stock_id);
    console.log("TSLA.d_base quote", quote);
    console.log("TSLA.d_base priceInUSD", quote.price);
    dispatch(
      updateExchangeRateUSD({
        assetId: "TSLA.d_base",
        exchangeRateUSD: quote.price,
      })
    );

    return true;
  };

const getAMDPriceQuote = async (
    dispatch: Function
  ): Promise<boolean> => {
    const stock_id = "0196ea6d-b6eb-7821-9612-342a66287480";
    
    const quote = await getQuote(stock_id);
    console.log("AMD.d_base quote", quote);
    console.log("AMD.d_base priceInUSD", quote.price);
    dispatch(
      updateExchangeRateUSD({
        assetId: "AMD.d_base",
        exchangeRateUSD: quote.price,
      })
    );

    return true;
  };

const getSPYPriceQuote = async (
    dispatch: Function
  ): Promise<boolean> => {
    const stock_id = "0196ea6d-b6e6-72e1-90b9-2bb5b3efb0a5";
    
    const quote = await getQuote(stock_id);
    console.log("SPY.d_base quote", quote);
    console.log("SPY.d_base priceInUSD", quote.price);
    dispatch(
      updateExchangeRateUSD({
        assetId: "SPY.d_base",
        exchangeRateUSD: quote.price,
      })
    );

    return true;
  };

const getMSTRPriceQuote = async (
    dispatch: Function
  ): Promise<boolean> => {
    const stock_id = "0196ea6d-b6e0-7ccd-b848-0f4ce139af2e";
    
    const quote = await getQuote(stock_id);
    console.log("MSTR.d_base quote", quote);
    console.log("MSTR.d_base priceInUSD", quote.price);
    dispatch(
      updateExchangeRateUSD({
        assetId: "MSTR.d_base",
        exchangeRateUSD: quote.price,
      })
    );

    return true;
  };

const getIAUPriceQuote = async (
    dispatch: Function
  ): Promise<boolean> => {
    const stock_id = "0196ea6d-b6e7-75b6-b40d-031ae7a715c2";
    
    const quote = await getQuote(stock_id);
    console.log("IAU.d_base quote", quote);
    console.log("IAU.d_base priceInUSD", quote.price);
    dispatch(
      updateExchangeRateUSD({
        assetId: "IAU.d_base",
        exchangeRateUSD: quote.price,
      })
    );

    return true;
  };

const getKOPriceQuote = async (
    dispatch: Function
  ): Promise<boolean> => {
    const stock_id = "0196ea6d-b6e0-7e7f-ac12-29baba2bb100";
    
    const quote = await getQuote(stock_id);
    console.log("KO.d_base quote", quote);
    console.log("KO.d_base priceInUSD", quote.price);
    dispatch(
      updateExchangeRateUSD({
        assetId: "KO.d_base",
        exchangeRateUSD: quote.price,
      })
    );

    return true;
  };

const getAMCPriceQuote = async (
    dispatch: Function
  ): Promise<boolean> => {
    const stock_id = "0196ea6d-b6e2-7e39-bf6a-b969c96d3c3b";
    
    const quote = await getQuote(stock_id);
    console.log("AMC.d_base quote", quote);
    console.log("AMC.d_base priceInUSD", quote.price);
    dispatch(
      updateExchangeRateUSD({
        assetId: "AMC.d_base",
        exchangeRateUSD: quote.price,
      })
    );

    return true;
  };

const getGMEPriceQuote = async (
    dispatch: Function
  ): Promise<boolean> => {
    const stock_id = "0196ea6d-b6e8-7a52-acf2-711dd3c900d4";
    
    const quote = await getQuote(stock_id);
    console.log("GME.d_base quote", quote);
    console.log("GME.d_base priceInUSD", quote.price);
    dispatch(
      updateExchangeRateUSD({
        assetId: "GME.d_base",
        exchangeRateUSD: quote.price,
      })
    );

    return true;
  };

const getQuote = async (stock_id: string) => {
    const response = await fetch(`https://api-enterprise.sbt.dinari.com/api/v2/market_data/stocks/${stock_id}/quote`, {
        headers: {
            'X-API-Key-Id': '01977031-17cd-76a0-a647-952d5fd47d7f',
            'X-API-Secret-Key': '4FTeMkk1gAADucBk1EYpgQlLELxnXrFsmMw9MdMoRoM',
            'accept': 'application/json'
        }
    });
    const quote = await response.json();
    return quote;
}

export { 
  getAAPLPriceQuote,
  getMSFTPriceQuote,
  getGOOGLPriceQuote,
  getNFLXPriceQuote,
  getAMZNPriceQuote,
  getSQPriceQuote,
  getDISPriceQuote,
  getTSLAPriceQuote,
  getAMDPriceQuote,
  getSPYPriceQuote,
  getMSTRPriceQuote,
  getIAUPriceQuote,
  getKOPriceQuote,
  getAMCPriceQuote,
  getGMEPriceQuote
};

/*
"APPL.d_base",
"MSFT.d_base",
"GOOGL.d_base",
"NFLX.d_base",
"AMZN.d_base",
"SQ.d_base",
"DIS.d_base",
"TSLA.d_base",
"AMD.d_base",
"SPY.d_base",
"MSTR.d_base",
"IAU.d_base",
"KO.d_base",
"AMC.d_base",
"GME.d_base",
*/