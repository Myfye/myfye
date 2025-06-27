import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface KYCState {
  modal: {
    isOpen: boolean;
    zIndex: number;
  };
}

// Define the initial state
const initialState: KYCState = {
  modal: {
    isOpen: false,
    zIndex: 9999,
  },
};

const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    toggleModal(
      state,
      action: PayloadAction<{
        isOpen: boolean;
      }>
    ) {
      state.modal.isOpen = action.payload.isOpen;
    },
    unmount: () => ({ ...initialState }),
  },
});

export const {
  toggleModal,
  unmount,
} = kycSlice.actions;

export default kycSlice.reducer;
