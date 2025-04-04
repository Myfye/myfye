import { createSlice } from "@reduxjs/toolkit";

type Stock = {
  id: string;
  label: string;
  balance: number;
  priceInUSD: number;
  exchangeRateUSD: number;
  logo: string | null;
  isOverlayOpen: boolean;
};

const initialState = {
  ids: [
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
  ],
  stocks: {
    "APPL.d_base": {
      id: "APPL.d_base",
      label: "Apple, Inc.",
      balance: 0,
      priceInUSD: 0,
      exchangeRateUSD: 0,
      logo: null,
      isOverlayOpen: false,
    },
    "MSFT.d_base": {
      id: "MSFT.d_base",
      label: "Microsoft Corporation",
      balance: 0,
      priceInUSD: 0,
      exchangeRateUSD: 0,
      logo: null,
      isOverlayOpen: false,
    },
    "GOOGL.d_base": {
      id: "GOOGL.d_base",
      label: "Alphabet, inc.",
      balance: 0,
      priceInUSD: 0,
      exchangeRateUSD: 0,
      logo: null,
      isOverlayOpen: false,
    },
    "NFLX.d_base": {
      id: "NFLX.d_base",
      label: "Netflix, Inc.",
      balance: 0,
      priceInUSD: 0,
      exchangeRateUSD: 0,
      logo: null,
      isOverlayOpen: false,
    },
    "AMZN.d_base": {
      id: "AMZN.d_base",
      label: "Amazon.com, Inc.",
      balance: 0,
      priceInUSD: 0,
      exchangeRateUSD: 0,
      logo: null,
      isOverlayOpen: false,
    },
    "SQ.d_base": {
      id: "SQ.d_base",
      label: "Block, Inc.",
      balance: 0,
      priceInUSD: 0,
      exchangeRateUSD: 0,
      logo: null,
      isOverlayOpen: false,
    },
    "DIS.d_base": {
      id: "DIS.d_base",
      label: "Walt Disney Company",
      balance: 0,
      priceInUSD: 0,
      exchangeRateUSD: 0,
      logo: null,
      isOverlayOpen: false,
    },
    "TSLA.d_base": {
      id: "TSLA.d_base",
      label: "Tesla, Inc.",
      balance: 0,
      priceInUSD: 0,
      exchangeRateUSD: 0,
      logo: null,
      isOverlayOpen: false,
    },
    "AMD.d_base": {
      id: "AMD.d_base",
      label: "Advanced Micro Devices",
      balance: 0,
      priceInUSD: 0,
      exchangeRateUSD: 0,
      logo: null,
      isOverlayOpen: false,
    },
    "SPY.d_base": {
      id: "SPY.d_base",
      label: "SPDR S&P 500 ETF Trust",
      balance: 0,
      priceInUSD: 0,
      exchangeRateUSD: 0,
      logo: null,
      isOverlayOpen: false,
    },
    "MSTR.d_base": {
      id: "MSTR.d_base",
      label: "MicroStrategy, Inc.",
      balance: 0,
      priceInUSD: 0,
      exchangeRateUSD: 0,
      logo: null,
      isOverlayOpen: false,
    },
    "IAU.d_base": {
      id: "IAU.d_base",
      label: "iShares Gold Trust",
      balance: 0,
      priceInUSD: 0,
      exchangeRateUSD: 0,
      logo: null,
      isOverlayOpen: false,
    },
    "KO.d_base": {
      id: "KO.d_base",
      label: "Coca-Cola Company",
      balance: 0,
      priceInUSD: 0,
      exchangeRateUSD: 0,
      logo: null,
      isOverlayOpen: false,
    },
    "AMC.d_base": {
      id: "AMC.d_base",
      label: "AMC Entertainment Holdings, Inc.",
      balance: 0,
      priceInUSD: 0,
      exchangeRateUSD: 0,
      logo: null,
      isOverlayOpen: false,
    },
    "GME.d_base": {
      id: "GME.d_base",
      label: "GameStop Corp. Class A, Inc.",
      balance: 0,
      priceInUSD: 0,
      exchangeRateUSD: 0,
      logo: null,
      isOverlayOpen: false,
    },
  },
  overlay: {
    isOpen: false,
  },
};

export const stocksSlice = createSlice({
  name: "stocks",
  initialState: initialState,
  reducers: {
    setOverlayOpen: (state, action) => {
      state.overlay.isOpen = action.payload;
    },
  },
});

export const { setOverlayOpen } = stocksSlice.actions;

export default stocksSlice.reducer;
