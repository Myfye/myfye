import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  calculateExchangeRate,
  updateFormattedAmount,
  parseFormattedAmount,
} from "./utils";
import { AbstractedAsset, Asset, AssetsState } from "../assets/types";
import {
  SwapTransaction,
  SwapTransactionStatus,
  SwapTransactionType,
} from "./types";

export interface SwapState {
  modal: {
    isOpen: boolean;
    zIndex: number;
  };
  overlays: {
    selectAsset: {
      isOpen: boolean;
      transactionType: SwapTransactionType;
    };
    confirmSwap: {
      isOpen: boolean;
      transactionType?: SwapTransactionType;
    };
    processingTransaction: {
      isOpen: boolean;
      transactionType?: SwapTransactionType;
    };
  };
  transaction: SwapTransaction;
}

// Define the initial state
const initialState: SwapState = {
  modal: {
    isOpen: false,
    zIndex: 9999,
  },
  overlays: {
    selectAsset: { isOpen: false, transactionType: "sell" },
    confirmSwap: { isOpen: false },
    processingTransaction: { isOpen: false },
  },
  transaction: {
    buy: { amount: null, formattedAmount: "", abstractedAssetId: null },
    sell: { amount: null, formattedAmount: "", abstractedAssetId: null },
    exchangeRate: null,
    fee: null,
    status: "idle",
    id: null,
    user_id: null,
    solanaPubKey: null,
  },
};

const swapSlice = createSlice({
  name: "swap",
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
        state.transaction.sell.abstractedAssetId =
          action.payload.abstractedAssetId;
    },
    toggleOverlay(
      state,
      action: PayloadAction<{
        type: "selectAsset" | "confirmSwap" | "processingTransaction";
        isOpen: boolean;
        transactionType?: SwapTransactionType;
      }>
    ) {
      state.overlays[action.payload.type].isOpen = action.payload.isOpen;
      if (state.overlays[action.payload.type]?.transactionType) {
        state.overlays[action.payload.type].transactionType =
          action.payload.transactionType;
      }
    },
    unmount: () => ({ ...initialState }),
    updateAmount(
      state,
      action: PayloadAction<{
        input: string | number;
        replace?: boolean;
      }>
    ) {
      state.transaction.sell.formattedAmount = updateFormattedAmount(
        state.transaction.sell.formattedAmount,
        action.payload.input,
        action.payload.replace || false
      );

      const parsedFormattedSellAmount = parseFormattedAmount(
        state.transaction.sell.formattedAmount
      );

      state.transaction.sell.amount = isNaN(parsedFormattedSellAmount)
        ? null
        : parsedFormattedSellAmount;

      if (!state.transaction.sell.amount || !state.transaction.exchangeRate) {
        state.transaction.buy.amount = null;
        state.transaction.buy.formattedAmount = "";
        return state;
      }

      state.transaction.buy.amount =
        Math.round((state.transaction.sell.amount * state.transaction.exchangeRate) * 1000000) / 1000000;

      state.transaction.buy.formattedAmount = updateFormattedAmount(
        state.transaction.buy.formattedAmount,
        state.transaction.buy.amount,
        true
      );
    },
    updateAbstractedAssetId(
      state,
      action: PayloadAction<{
        transactionType: SwapTransactionType;
        abstractedAssetId: AbstractedAsset["id"] | null;
      }>
    ) {
      state.transaction[action.payload.transactionType].abstractedAssetId =
        action.payload.abstractedAssetId;
    },
    updateExchangeRate(
      state,
      action: PayloadAction<{
        assets: AssetsState;
        buyAbstractedAssetId: Asset["id"] | null;
        sellAbstractedAssetId: Asset["id"] | null;
      }>
    ) {
      state.transaction.exchangeRate = calculateExchangeRate({
        assets: action.payload.assets,
        buyAbstractedAssetId: action.payload.buyAbstractedAssetId,
        sellAbstractedAssetId: action.payload.sellAbstractedAssetId,
      });

      if (!state.transaction.sell.amount || !state.transaction.exchangeRate) {
        state.transaction.buy.amount = null;
        state.transaction.buy.formattedAmount = "";
        return state;
      }

      state.transaction.buy.amount =
        Math.round((state.transaction.sell.amount * state.transaction.exchangeRate) * 1000000) / 1000000;

      state.transaction.buy.formattedAmount = updateFormattedAmount(
        state.transaction.buy.formattedAmount,
        state.transaction.buy.amount,
        true
      );
    },
    updateStatus(state, action: PayloadAction<SwapTransactionStatus>) {
      state.transaction.status = action.payload;
    },
    updateId(state, action: PayloadAction<string>) {
      state.transaction.id = action.payload;
    },
    updateUserId(state, action: PayloadAction<string>) {
      state.transaction.user_id = action.payload;
    },
    updateSolanaPubKey(state, action: PayloadAction<string>) {
      state.transaction.solanaPubKey = action.payload;
    },
    updateZIndex(state, action: PayloadAction<number>) {
      state.modal.zIndex = action.payload;
    },
    switchCurrencies(state, _: PayloadAction<void | unknown>) {
      const buyClone = { ...state.transaction.buy };
      const sellClone = { ...state.transaction.sell };
      state.transaction.buy = sellClone;
      state.transaction.sell = buyClone;

      if (state.transaction.buy.amount === 0) {
        state.transaction.buy.amount = null;
        state.transaction.buy.formattedAmount = "";
      }
    },
  },
});

export const {
  toggleModal,
  toggleOverlay,
  updateAmount,
  updateExchangeRate,
  updateAbstractedAssetId,
  unmount,
  updateStatus,
  updateId,
  updateUserId,
  updateSolanaPubKey,
  switchCurrencies,
} = swapSlice.actions;
export default swapSlice.reducer;
