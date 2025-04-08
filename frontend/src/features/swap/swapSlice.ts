import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  calculateExchangeRate,
  updateFormattedAmount,
  parseFormattedAmount,
} from "./utils";
import { UserWalletDataState } from "@/redux/userWalletData";
import { Asset, AssetsState } from "../wallet/assets/types";

export type CryptoCoinId = "btcSol" | "sol";
export type CashCoinId = "usdcSol" | "usdtSol" | "eurcSol";
export type EarnCoinId = "usdySol";
export type CoinId = CryptoCoinId | CashCoinId | EarnCoinId;

export interface Coin {
  id: CoinId;
  label: string;
  symbol: string;
  type: "crypto" | "cash" | "earn" | "stock";
  fiatEquivalent: string | null;
  currentExchangeRate: number;
  iconUrl: string;
  decimals: number;
}

export type SwapTransactionType = "buy" | "sell";

export type SwapTransactionStatus = "idle" | "signed" | "success" | "fail";

export interface SwapTransaction {
  buy: {
    amount: number | null;
    formattedAmount: string;
    assetId: Asset["id"] | null;
  };
  sell: {
    amount: number | null;
    formattedAmount: string;
    assetId: Asset["id"] | null;
  };
  fee: number | null;
  exchangeRate: number | null;
  status: SwapTransactionStatus;
  id: string | null;
}

interface ModalState {
  isOpen: boolean;
}

type OverlayType = "selectAsset" | "confirmSwap" | "processingTransaction";

interface OverlayState {
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
}

export interface SwapState {
  modal: ModalState;
  overlays: OverlayState;
  transaction: SwapTransaction;
}

// Define the initial state
const initialState: SwapState = {
  modal: {
    isOpen: false,
  },
  overlays: {
    selectAsset: { isOpen: false, transactionType: "sell" },
    confirmSwap: { isOpen: false },
    processingTransaction: { isOpen: false },
  },
  transaction: {
    buy: { amount: null, formattedAmount: "", assetId: null },
    sell: { amount: null, formattedAmount: "", assetId: null },
    exchangeRate: null,
    fee: null,
    status: "idle",
    id: null,
  },
};

const swapSlice = createSlice({
  name: "swap",
  initialState,
  reducers: {
    toggleModal(
      state,
      action: PayloadAction<{ isOpen: boolean; assetId?: CoinId }>
    ) {
      state.modal.isOpen = action.payload.isOpen;
      if (action.payload?.assetId)
        state.transaction.sell.assetId = action.payload.assetId;
    },
    toggleOverlay(
      state,
      action: PayloadAction<{
        type: OverlayType;
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
    unmount: () => initialState,
    updateAmount(
      state,
      action: PayloadAction<{
        input: string | number;
        replace?: boolean;
      }>
    ) {
      // first, change the sell amount label
      state.transaction.sell.formattedAmount = updateFormattedAmount(
        state.transaction.sell.formattedAmount,
        action.payload.input,
        action.payload.replace
      );

      // next, change the sell amount
      const parsedFormattedSellAmount = parseFormattedAmount(
        state.transaction.sell.formattedAmount
      );

      isNaN(parsedFormattedSellAmount)
        ? (state.transaction.sell.amount = null)
        : (state.transaction.sell.amount = parsedFormattedSellAmount);

      // once that's done, get the exchange rate and multiply that buy the amount

      // if no exchange rate or sell amount, don't bother calculating the buy amounts and reset them
      if (!state.transaction.sell.amount || !state.transaction.exchangeRate) {
        state.transaction.buy.amount = null;
        state.transaction.buy.formattedAmount = "";
        return state;
      }

      state.transaction.buy.amount =
        state.transaction.sell.amount * state.transaction.exchangeRate;

      state.transaction.buy.formattedAmount = updateFormattedAmount(
        state.transaction.buy.formattedAmount,
        state.transaction.buy.amount,
        true
      );
    },
    updateAssetId(
      state,
      action: PayloadAction<{
        transactionType: SwapTransactionType;
        assetId: Asset["id"] | null;
      }>
    ) {
      state.transaction[action.payload.transactionType].assetId =
        action.payload.assetId;
    },
    updateExchangeRate(
      state,
      action: PayloadAction<{
        assets: AssetsState;
        buyAssetId: Asset["id"] | null;
        sellAssetId: Asset["id"] | null;
      }>
    ) {
      state.transaction.exchangeRate = calculateExchangeRate({
        assets: action.payload.assets,
        buyAssetId: action.payload.buyAssetId,
        sellAssetId: action.payload.sellAssetId,
      });

      // if no exchange rate or sell amount, don't bother calculating the buy amounts and reset them
      if (!state.transaction.sell.amount || !state.transaction.exchangeRate) {
        state.transaction.buy.amount = null;
        state.transaction.buy.formattedAmount = "";
        return state;
      }

      // then just update the buyAmount
      state.transaction.buy.amount =
        state.transaction.sell.amount * state.transaction.exchangeRate;

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
  },
});

export const {
  toggleModal,
  toggleOverlay,
  updateAmount,
  updateExchangeRate,
  updateAssetId,
  unmount,
  updateStatus,
  updateId,
} = swapSlice.actions;
export default swapSlice.reducer;
