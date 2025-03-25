import { createSlice } from "@reduxjs/toolkit";

export const currentCoinSlice = createSlice({
  name: "currentCoin",
  initialState: { coin: null },
  reducers: {
    addCurrentCoin: (state, action) => {
      state.coin = action.payload;
    },
    removeCurrentCoin: (state) => {
      state.coin = null;
    },
  },
});

export const currentCoinReducer = currentCoinSlice.reducer;
export const { addCurrentCoin, removeCurrentCoin } = currentCoinSlice.actions;
