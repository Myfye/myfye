import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { formatAmountLabel } from "./utils";

interface Transaction {
  amount: number;
  amountLabel: string;
  coin: string | null;
}

interface ModalState {
  isOpen: boolean;
}

type OverlayType = "selectCoin" | "confirmSwap" | "processingTransaction";

type OverlayMap = {
  [key in OverlayType]: { isOpen: boolean };
};

interface OverlayState extends OverlayMap {
  extraProperty?: string; // Add any additional properties here
}

export interface SwapState {
  modal: ModalState;
  overlays: OverlayState;
  buy: Transaction;
  sell: Transaction;
  activeControl: "buy" | "sell";
}

// Define the initial state
const initialState: SwapState = {
  modal: {
    isOpen: false,
  },
  overlays: {
    selectCoin: { isOpen: false },
    confirmSwap: { isOpen: false },
    processingTransaction: { isOpen: false },
  },
  activeControl: "sell",
  buy: { amount: 0, amountLabel: "0", coin: null },
  sell: { amount: 0, amountLabel: "0", coin: null },
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
      action: PayloadAction<{ type: OverlayType; isOpen: boolean }>
    ) {
      state.overlays[action.payload.type].isOpen = action.payload.isOpen;
    },
    unmount(state) {
      state = initialState;
    },
    changeAmountLabel(
      state,
      action: PayloadAction<{
        type: "buy" | "sell";
        input: string;
        replace?: true;
      }>
    ) {
      state[action.payload.type].amountLabel = action.payload.replace
        ? action.payload.input
        : formatAmountLabel(
            state[action.payload.type].amountLabel,
            action.payload.input
          );
    },
    changeAmount(
      state,
      action: PayloadAction<{
        type: "buy" | "sell";
        amount: number;
      }>
    ) {
      state[action.payload.type].amount = action.payload.amount;
    },
    setCoin(
      state,
      action: PayloadAction<{ type: "buy" | "sell"; coin: string | null }>
    ) {
      state[action.payload.type].coin = action.payload.coin;
    },
    setActiveControl(state, action: PayloadAction<"buy" | "sell">) {
      state.activeControl = action.payload;
    },
  },
});

export const {
  toggleModal,
  toggleOverlay,
  changeAmount,
  setCoin,
  unmount,
  setActiveControl,
  changeAmountLabel,
} = swapSlice.actions;
export default swapSlice.reducer;
