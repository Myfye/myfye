import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { Asset } from "@/features/assets/types";
import { parseFormattedAmount, updateFormattedAmount } from "../utils";
import {
  WithdrawOffChainOverlay,
  WithdrawOffChainTransaction,
} from "./withdrawOffChain.types";

interface WithdrawOffChainState {
  transaction: WithdrawOffChainTransaction;
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
  };
}

const initialState: WithdrawOffChainState = {
  transaction: {
    id: null,
    status: "idle",
    amount: 0,
    formattedAmount: "0",
    assetId: "usdc_sol",
    solAddress: null,
    fiatCurrency: "usd",
    fee: 0,
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
  },
};

const withdrawOffChainSlice = createSlice({
  name: "withdrawOffChain",
  initialState,
  reducers: {
    toggleOverlay: (
      state,
      action: PayloadAction<{
        type: WithdrawOffChainOverlay;
        isOpen: boolean;
      }>
    ) => {
      const newOverlays = {
        ...state.overlays,
        [action.payload.type]: {
          ...state.overlays,
          isOpen: action.payload.isOpen,
        },
      };
      state.overlays = newOverlays;
    },
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
        assetId: Asset["id"] | null;
      }>
    ) {
      state.transaction.assetId = action.payload.assetId;
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
  updateAmount,
  unmount,
  unmountOverlays,
  updateSolAddress,
} = withdrawOffChainSlice.actions;

export default withdrawOffChainSlice.reducer;
