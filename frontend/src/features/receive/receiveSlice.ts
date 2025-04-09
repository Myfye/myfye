import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { WalletType } from "./types";

interface ReceiveState {
  modal: {
    isOpen: boolean;
    wallet: {
      type: WalletType;
      address: string;
    };
  };
}

// Define the initial state
const initialState: ReceiveState = {
  modal: {
    isOpen: false,
    wallet: {
      type: "sol",
      address: "",
    },
  },
};

const receiveSlice = createSlice({
  name: "receive",
  initialState,
  reducers: {
    toggleModal(state, action: PayloadAction<boolean>) {
      state.modal.isOpen = action.payload;
    },
    toggleWallet(
      state,
      action: PayloadAction<{ type: WalletType; address: string }>
    ) {
      state.modal.wallet = action.payload;
    },
  },
});

export const { toggleModal, toggleWallet } = sendSlice.actions;
export default sendSlice.reducer;
