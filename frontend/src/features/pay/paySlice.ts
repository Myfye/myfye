import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AbstractedAsset } from "../assets/types";
import { parseFormattedAmount, updateFormattedAmount } from "./utils";
import {
  PayTransaction,
  PayTransactionType,
  PresetAmountOption,
} from "./types";
import { Contact } from "../contacts/types";

interface PayState {
  transaction: PayTransaction;
  overlays: {
    selectAsset: {
      isOpen: boolean;
    };
    selectUser: {
      isOpen: boolean;
    };
    confirmTransaction: {
      isOpen: boolean;
    };
    processingTransaction: {
      isOpen: boolean;
    };
  };
}

const initialState: PayState = {
  transaction: {
    id: null,
    type: "send",
    status: "idle",
    amount: 0,
    formattedAmount: "0",
    abstractedAssetId: "us_dollar",
    user: null,
    fiatCurrency: "usd",
    fee: 0,
    presetAmount: null,
  },
  overlays: {
    selectAsset: {
      isOpen: false,
    },
    selectUser: {
      isOpen: false,
    },
    confirmTransaction: {
      isOpen: false,
    },
    processingTransaction: {
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
        type:
          | "selectAsset"
          | "selectUser"
          | "confirmTransaction"
          | "processingTransaction";
        isOpen: boolean;
      }>
    ) => {
      state.overlays[action.payload.type].isOpen = action.payload.isOpen;
    },
    closeOverlays: (state, action) => {
      state.overlays = {
        selectAsset: {
          isOpen: false,
        },
        selectUser: {
          isOpen: false,
        },
        confirmTransaction: {
          isOpen: false,
        },
        processingTransaction: {
          isOpen: false,
        },
      };
    },
    updateTransactionType: (
      state,
      action: PayloadAction<PayTransactionType>
    ) => {
      state.transaction.type = action.payload;
    },
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
    updateUser(state, action: PayloadAction<Contact | null>) {
      state.transaction.user = action.payload;
    },
    unmount: () => ({ ...initialState }),
  },
});

export const {
  updateAbstractedAssetId,
  updateTransactionType,
  toggleOverlay,
  updateAmount,
  updatePresetAmount,
  updateUser,
  unmount,
  closeOverlays,
} = paySlice.actions;
export default paySlice.reducer;
