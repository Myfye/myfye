import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { formatAmountLabel } from "./utils";

export type TransactionType = "buy" | "sell";

interface Transaction {
  amount: number;
  amountLabel: string;
  coin: string | null;
}

interface ModalState {
  isOpen: boolean;
}

type OverlayType = "selectCoin" | "confirmSwap" | "processingTransaction";

interface OverlayState {
  selectCoin: {
    isOpen: boolean;
    transactionType: TransactionType;
  };
  confirmSwap: {
    isOpen: boolean;
    transactionType?: TransactionType;
  };
  processingTransaction: {
    isOpen: boolean;
    transactionType?: TransactionType;
  };
}

export interface SwapState {
  modal: ModalState;
  overlays: OverlayState;
  buy: Transaction;
  sell: Transaction;
}

// Define the initial state
const initialState: SwapState = {
  modal: {
    isOpen: false,
  },
  overlays: {
    selectCoin: { isOpen: false, transactionType: "sell" },
    confirmSwap: { isOpen: false },
    processingTransaction: { isOpen: false },
  },
  buy: { amount: 0, amountLabel: "", coin: null },
  sell: { amount: 0, amountLabel: "", coin: null },
};

const swapSlice = createSlice({
  name: "swap",
  initialState,
  reducers: {
    toggleModal(
      state,
      action: PayloadAction<{ isOpen: boolean; coin?: string }>
    ) {
      state.modal.isOpen = action.payload.isOpen;
      if (action.payload?.coin) state.sell.coin = action.payload.coin;
    },
    toggleOverlay(
      state,
      action: PayloadAction<{
        type: OverlayType;
        isOpen: boolean;
        transactionType?: TransactionType;
      }>
    ) {
      state.overlays[action.payload.type].isOpen = action.payload.isOpen;
      if (state.overlays[action.payload.type]?.transactionType) {
        state.overlays[action.payload.type].transactionType =
          action.payload.transactionType;
      }
    },
    unmount: () => {
      return initialState;
    },
    changeAmountLabel(
      state,
      action: PayloadAction<{
        transactionType: TransactionType;
        input: string;
        replace?: true;
      }>
    ) {
      state[action.payload.transactionType].amountLabel = action.payload.replace
        ? action.payload.input
        : formatAmountLabel(
            state[action.payload.transactionType].amountLabel,
            action.payload.input
          );
    },
    changeAmount(
      state,
      action: PayloadAction<{
        transactionType: TransactionType;
        amount: number;
      }>
    ) {
      state[action.payload.transactionType].amount = action.payload.amount;
    },
    setCoin(
      state,
      action: PayloadAction<{
        transactionType: TransactionType;
        coin: string | null;
      }>
    ) {
      state[action.payload.transactionType].coin = action.payload.coin;
    },
  },
});

export const {
  toggleModal,
  toggleOverlay,
  changeAmount,
  setCoin,
  unmount,
  changeAmountLabel,
} = swapSlice.actions;
export default swapSlice.reducer;
