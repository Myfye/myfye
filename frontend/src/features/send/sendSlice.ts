import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { updateFormattedAmount, parseFormattedAmount } from "./utils";
import { AbstractedAsset } from "@/features/assets/types";
import { PresetAmountOption, SendTransaction } from "./types";

interface SendState {
  modal: {
    isOpen: boolean;
  };
  overlays: {
    selectAsset: {
      isOpen: boolean;
    };
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
    selectAsset: { isOpen: false },
  },
  transaction: {
    id: null,
    contact: null,
    amount: null,
    formattedAmount: "",
    abstractedAssetId: null,
    fee: null,
    status: "idle",
    presetAmount: null,
    fiatCurrency: "usd",
  },
};

const sendSlice = createSlice({
  name: "send",
  initialState,
  reducers: {
    toggleModal(
      state,
      action: PayloadAction<{
        isOpen: boolean;
        abstractedAssetId?: AbstractedAsset["id"];
      }>
    ) {
      state.modal.isOpen = action.payload.isOpen;
      if (action.payload?.abstractedAssetId)
        state.transaction.abstractedAssetId = action.payload.abstractedAssetId;
    },
    toggleOverlay(
      state,
      action: PayloadAction<{
        type:
          | "selectContact"
          | "confirmSend"
          | "processingTransaction"
          | "selectAsset";
        isOpen: boolean;
      }>
    ) {
      state.overlays[action.payload.type].isOpen = action.payload.isOpen;
    },
    unmount: () => initialState,
    updatePresetAmount: (state, action: PayloadAction<PresetAmountOption>) => {
      state.transaction.presetAmount = action.payload;
    },
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
    updateAbstractedAssetId(
      state,
      action: PayloadAction<{
        abstractedAssetId: AbstractedAsset["id"] | null;
      }>
    ) {
      state.transaction.abstractedAssetId = action.payload.abstractedAssetId;
    },
  },
});

export const {
  toggleModal,
  toggleOverlay,
  updateAmount,
  unmount,
  updateAbstractedAssetId,
  updatePresetAmount,
} = sendSlice.actions;
export default sendSlice.reducer;
