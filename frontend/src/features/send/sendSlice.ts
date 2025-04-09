import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { updateFormattedAmount, parseFormattedAmount } from "../utils";
import { Asset } from "@/features/wallet/assets/types";
import { SendTransaction, SendTransactionStatus } from "./types";

interface SendState {
  modal: {
    isOpen: boolean;
  };
  overlays: {
    selectContact: {
      isOpen: boolean;
    };
    confirmSend: {
      isOpen: boolean;
    };
    processingTransaction: {
      isOpen: boolean;
    };
  };
  transaction: SendTransaction;
}

// Define the initial state
const initialState: SendState = {
  modal: {
    isOpen: false,
  },
  overlays: {
    selectContact: { isOpen: false },
    confirmSend: { isOpen: false },
    processingTransaction: { isOpen: false },
  },
  transaction: {
    id: null,
    contact: null,
    amount: null,
    formattedAmount: "",
    assetId: null,
    fee: null,
    status: "idle",
  },
};

const sendSlice = createSlice({
  name: "send",
  initialState,
  reducers: {
    toggleModal(
      state,
      action: PayloadAction<{ isOpen: boolean; assetId?: Asset["id"] }>
    ) {
      state.modal.isOpen = action.payload.isOpen;
      if (action.payload?.assetId)
        state.transaction.assetId = action.payload.assetId;
    },
    toggleOverlay(
      state,
      action: PayloadAction<{
        type: "selectContact" | "confirmSend" | "processingTransaction";
        isOpen: boolean;
      }>
    ) {
      state.overlays[action.payload.type].isOpen = action.payload.isOpen;
    },
    unmount: () => initialState,
    updateAmount(
      state,
      action: PayloadAction<{
        input: string | number;
        replace?: boolean;
      }>
    ) {
      // first, change the sell amount label
      state.transaction.formattedAmount = updateFormattedAmount(
        state.transaction.formattedAmount,
        action.payload.input,
        action.payload.replace
      );

      // next, change the sell amount
      const parsedFormattedSellAmount = parseFormattedAmount(
        state.transaction.formattedAmount
      );

      isNaN(parsedFormattedSellAmount)
        ? (state.transaction.amount = null)
        : (state.transaction.amount = parsedFormattedSellAmount);
    },
    updateAssetId(state, action: PayloadAction<Asset["id"] | null>) {
      state.transaction.assetId = action.payload;
    },
    updateStatus(state, action: PayloadAction<SendTransactionStatus>) {
      state.transaction.status = action.payload;
    },
    updateId(state, action: PayloadAction<string>) {
      state.transaction.id = action.payload;
    },
  },
});

export const {
  toggleModal,
  toggleOverlay,
  updateAmount,
  updateAssetId,
  unmount,
  updateStatus,
  updateId,
} = sendSlice.actions;
export default sendSlice.reducer;
