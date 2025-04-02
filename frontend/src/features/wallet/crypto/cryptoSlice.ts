import { createSlice } from "@reduxjs/toolkit";

export const cryptoSlice = createSlice({
  name: "crypto",
  initialState: { overlay: { isOpen: false } },
  reducers: {
    setOverlayOpen: (state, action) => {
      state.overlay.isOpen = action.payload;
    },
  },
});

export const { setOverlayOpen } = cryptoSlice.actions;

export default cryptoSlice.reducer;
