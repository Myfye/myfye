import { createSlice } from "@reduxjs/toolkit";

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
      balance: 0,
      priceInUSD: 0,
      isOverlayOpen: false,
    },
    "MSFT.d_base": {
      id: "MSFT.d_base",
      balance: 0,
      priceInUSD: 0,
      isOverlayOpen: false,
    },
    "GOOGL.d_base": {
      id: "GOOGL.d_base",
      balance: 0,
      priceInUSD: 0,
      isOverlayOpen: false,
    },
    "NFLX.d_base": {
      id: "NFLX.d_base",
      balance: 0,
      priceInUSD: 0,
      isOverlayOpen: false,
    },
    "AMZN.d_base": {
      id: "AMZN.d_base",
      balance: 0,
      priceInUSD: 0,
      isOverlayOpen: false,
    },
    "SQ.d_base": {
      id: "SQ.d_base",
      balance: 0,
      priceInUSD: 0,
      isOverlayOpen: false,
    },
    "DIS.d_base": {
      id: "DIS.d_base",
      balance: 0,
      priceInUSD: 0,
      isOverlayOpen: false,
    },
    "TSLA.d_base": {
      id: "TSLA.d_base",
      balance: 0,
      priceInUSD: 0,
      isOverlayOpen: false,
    },
    "AMD.d_base": {
      id: "AMD.d_base",
      balance: 0,
      priceInUSD: 0,
      isOverlayOpen: false,
    },
    "SPY.d_base": {
      id: "SPY.d_base",
      balance: 0,
      priceInUSD: 0,
      isOverlayOpen: false,
    },
    "MSTR.d_base": {
      id: "MSTR.d_base",
      balance: 0,
      priceInUSD: 0,
      isOverlayOpen: false,
    },
    "IAU.d_base": {
      id: "IAU.d_base",
      balance: 0,
      priceInUSD: 0,
      isOverlayOpen: false,
    },
    "KO.d_base": {
      id: "KO.d_base",
      balance: 0,
      priceInUSD: 0,
      isOverlayOpen: false,
    },
    "AMC.d_base": {
      id: "AMC.d_base",
      balance: 0,
      priceInUSD: 0,
      isOverlayOpen: false,
    },
    "GME.d_base": {
      id: "GME.d_base",
      balance: 0,
      priceInUSD: 0,
      isOverlayOpen: false,
    },
  },
  overlay: {
    isOpen: false,
  },
};

export const stocksSlice = createSlice({
  name: "stocks",
  initialState: { overlay: { isOpen: false } },
  reducers: {
    setOverlayOpen: (state, action) => {
      state.overlay.isOpen = action.payload;
    },
  },
});

export const { setOverlayOpen } = stocksSlice.actions;

export default stocksSlice.reducer;
