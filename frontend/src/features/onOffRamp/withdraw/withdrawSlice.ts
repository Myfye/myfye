import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface WithdrawState {
  modal: {
    isOpen: boolean;
  };
  overlays: {
    etherfuse: {
      isOpen: boolean;
    };
  };
  transaction: {
    amount: number;
    formattedAmount: string;
    payin: {
      currency: string;
    };
    fee: number;
  };
}

const initialState: WithdrawState = {
  modal: {
    isOpen: false,
  },
  overlays: {
    etherfuse: {
      isOpen: false,
    },
  },
  transaction: {
    amount: 0,
    formattedAmount: "0",
    payin: {
      currency: "mxn",
    },
    fee: 0,
  },
};

const withdrawSlice = createSlice({
  name: "withdraw",
  initialState,
  reducers: {
    toggleModal(state, action: PayloadAction<boolean>) {
      state.modal.isOpen = action.payload;
    },
    toggleOverlay(state, action: PayloadAction<{ type: "etherfuse"; isOpen: boolean }>) {
      if (action.payload.type === "etherfuse") {
        state.overlays.etherfuse.isOpen = action.payload.isOpen;
      }
    },
    updateAmount(state, action: PayloadAction<{ amount: number; formattedAmount: string }>) {
      state.transaction.amount = action.payload.amount;
      state.transaction.formattedAmount = action.payload.formattedAmount;
    },
    updatePresetAmount(state, action: PayloadAction<string>) {
      state.transaction.formattedAmount = action.payload;
      state.transaction.amount = parseFloat(action.payload) || 0;
    },
    unmount: () => ({ ...initialState }),
  },
});

export const { toggleModal, toggleOverlay, updateAmount, updatePresetAmount, unmount } = withdrawSlice.actions;
export default withdrawSlice.reducer;
