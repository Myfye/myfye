import { createSlice } from "@reduxjs/toolkit";

export const earnSlice = createSlice({
  name: "earn",
  initialState: { overlay: { isOpen: false } },
  reducers: {
    setOverlayOpen: (state, action) => {
      state.overlay.isOpen = action.payload;
    },
  },
});

export const { setOverlayOpen } = earnSlice.actions;

export default earnSlice.reducer;
