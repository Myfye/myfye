import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Transaction {
  amount: number;
  coin: string | null;
}

interface ModalState {
  isOpen: boolean;
}

type OverlayType = "selectCoin" | "confirmSwap" | "processingTransaction";

type OverlayMap = {
  [key in OverlayType]: { isOpen: boolean; buyCoin?: null; sellCoin?: null };
};

interface OverlayState extends OverlayMap {
  extraProperty?: string; // Add any additional properties here
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
    selectCoin: { isOpen: false },
    confirmSwap: { isOpen: false, buyCoin: null, sellCoin: null },
    processingTransaction: { isOpen: false },
  },
  buy: { amount: 0, coin: "btc" },
  sell: { amount: 0, coin: null },
};

const swapSlice = createSlice({
  name: "swap",
  initialState,
  reducers: {
    toggleModal(state, action: PayloadAction<boolean>) {
      state.modal.isOpen = action.payload;
    },
    toggleOverlay(
      state,
      action: PayloadAction<{ type: OverlayType; isOpen: boolean }>
    ) {
      state.overlays[action.payload.type].isOpen = action.payload.isOpen;
    },
    unmount(state) {
      state.modal.isOpen = false;
      state.overlays = {
        selectCoin: { isOpen: false },
        confirmSwap: { isOpen: false, buyCoin: null, sellCoin: null },
        processingTransaction: { isOpen: false },
      };
    },
    changeAmount(
      state,
      action: PayloadAction<{ type: "buy" | "sell"; amount: number }>
    ) {
      state[action.payload.type].amount = action.payload.amount;
    },
    setCoin(
      state,
      action: PayloadAction<{ type: "buy" | "sell"; coin: string | null }>
    ) {
      state[action.payload.type].coin = action.payload.coin;
    },
  },
});

export const { toggleModal, toggleOverlay, changeAmount, setCoin, unmount } =
  swapSlice.actions;
export default swapSlice.reducer;
