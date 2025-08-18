import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Asset } from "../assets/types";
import { parseFormattedAmount, updateFormattedAmount } from "./utils";
import {
  PayTransaction,
  PayTransactionType,
  PresetAmountOption,
} from "./pay.types";
import { User } from "../users/users.types";

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
    assetId: "us_dollar",
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
      const newOverlays = {
        ...state.overlays,
        [action.payload.type]: {
          ...state.overlays[action.payload.type],
          isOpen: action.payload.isOpen,
        },
      };
      state.overlays = newOverlays;
    },
    unmountOverlays: (state) => {
      state.overlays = { ...initialState.overlays };
      state = { ...state, overlays: { ...initialState.overlays } };
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
    updateAssetId(
      state,
      action: PayloadAction<{
        assetId: asset["id"] | null;
      }>
    ) {
      state.transaction.assetId = action.payload.assetId;
    },
    updateUser(state, action: PayloadAction<User | null>) {
      state.transaction.user = action.payload;
    },
    unmount: () => ({ ...initialState }),
  },
});

export const {
  updateAssetId,
  updateTransactionType,
  toggleOverlay,
  updateAmount,
  updatePresetAmount,
  updateUser,
  unmount,
  unmountOverlays,
} = paySlice.actions;
export default paySlice.reducer;
