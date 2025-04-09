import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// Define the initial state
const initialState = {
  transaction: {
    id: null,
    type: "send",
    status: "idle",
    amount: 0,
    formattedAmount: "",
    assetId: null,
    contact: null,
  },
  overlays: {
    selectContact: {
      isOpen: false,
    },
    confirm: {
      isOpen: false,
    },
  },
};

const paySlice = createSlice({
  name: "pay",
  initialState,
  reducers: {
    toggleOverlay: (
      state,
      action: PayloadAction<{
        type: "selectContact" | "confirm";
        isOpen: boolean;
      }>
    ) => {
      state.overlays[action.payload.type].isOpen = action.payload.isOpen;
    },
    updatePayTransactionType: (state, action) => {},
    unmount: () => initialState,
  },
});

export const { toggleSendOverlay, toggleRequestOverlay } = paySlice.actions;
export default paySlice.reducer;
