import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { Asset } from "@/features/assets/types";
import { parseFormattedAmount, updateFormattedAmount } from "../utils";
import {
  PresetAmountOption,
  WithdrawOnChainOverlay,
  WithdrawOnChainTransaction,
} from "./withdrawOnChain.types";

interface WithdrawOnChainState {
  transaction: WithdrawOnChainTransaction;
  overlays: {
    withdrawOnChain: {
      isOpen: boolean;
    };
    addressEntry: {
      isOpen: boolean;
    };
    processingTransaction: {
      isOpen: boolean;
    };
    selectAsset: {
      isOpen: boolean;
    };
    confirmTransaction: {
      isOpen: boolean;
    };
  };
}

const initialState: WithdrawOnChainState = {
  transaction: {
    id: null,
    status: "idle",
    amount: 0,
    formattedAmount: "0",
    assetId: "usdc_sol",
    solAddress: null,
    fiatCurrency: "usd",
    fee: 0,
    presetAmount: null,
  },
  overlays: {
    withdrawOnChain: {
      isOpen: false,
    },
    addressEntry: {
      isOpen: false,
    },
    processingTransaction: {
      isOpen: false,
    },
    selectAsset: {
      isOpen: false,
    },
    confirmTransaction: {
      isOpen: false,
    },
  },
};

const withdrawOnChainSlice = createSlice({
  name: "withdrawOnChain",
  initialState,
  reducers: {
    toggleOverlay: (
      state,
      action: PayloadAction<{
        type: WithdrawOnChainOverlay;
        isOpen: boolean;
      }>
    ) => {
      state.overlays = {
        ...state.overlays,
        [action.payload.type]: {
          ...state.overlays[action.payload.type],
          isOpen: action.payload.isOpen,
        },
      };
    },
    // toggleModal: (
    //   state,
    //   action: PayloadAction<{
    //     type: WithdrawOnChainModal;
    //     isOpen: boolean;
    //   }>
    // ) => {
    //   state.modals = {
    //     ...state.modals,
    //     [action.payload.type]: {
    //       ...state.modals[action.payload.type],
    //       isOpen: action.payload.isOpen,
    //     },
    //   };
    // },
    unmountOverlays: (state) => ({
      ...state,
      overlays: initialState.overlays,
    }),
    updateAmount(
      state,
      action: PayloadAction<{
        input: string | number;
        replace?: boolean;
      }>
    ) {
      state.transaction.formattedAmount = updateFormattedAmount(
        state.transaction.formattedAmount,
        action.payload.input,
        action.payload.replace
      );

      const parsedFormattedAmount = parseFormattedAmount(
        state.transaction.formattedAmount
      );

      isNaN(parsedFormattedAmount)
        ? (state.transaction.amount = null)
        : (state.transaction.amount = parsedFormattedAmount);
    },
    updatePresetAmount: (state, action: PayloadAction<PresetAmountOption>) => {
      state.transaction.presetAmount = action.payload;
    },
    updateAssetId(state, action: PayloadAction<Asset["id"] | null>) {
      state.transaction.assetId = action.payload;
    },
    updateSolAddress(state, action: PayloadAction<string | null>) {
      state.transaction.solAddress = action.payload;
    },
    unmount: () => ({ ...initialState }),
  },
});

export const {
  updateAssetId,
  toggleOverlay,
  // toggleModal,
  updatePresetAmount,
  updateAmount,
  unmount,
  unmountOverlays,
  updateSolAddress,
} = withdrawOnChainSlice.actions;

export default withdrawOnChainSlice.reducer;
