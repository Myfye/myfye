import { createSlice } from "@reduxjs/toolkit";

export const cashSlice = createSlice({
  name: "cash",
  initialState: { overlay: { isOpen: false } },
  reducers: {
    setOverlayOpen: (state, action) => {
      state.overlay.isOpen = action.payload;
    },
  },
});

export const { setOverlayOpen } = cashSlice.actions;

export default cashSlice.reducer;
