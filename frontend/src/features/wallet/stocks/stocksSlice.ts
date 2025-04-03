import { createSlice } from "@reduxjs/toolkit";

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
