import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  calculateExchangeRate,
  changeFormattedAmount,
  parseFormattedAmount,
} from "./utils";
import { UserWalletDataState } from "@/redux/userWalletData";

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

export interface Transaction {
  buy: {
    amount: number | null;
    formattedAmount: string;
    coinId: CoinId | null;
  };
  sell: {
    amount: number | null;
    formattedAmount: string;
    coinId: CoinId | null;
  };
  fee: number | null;
  exchangeRate: number | null;
  status: SwapTransactionStatus;
}

interface ModalState {
  isOpen: boolean;
}

type OverlayType = "selectCoin" | "confirmSwap" | "processingTransaction";

interface OverlayState {
  selectCoin: {
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
  transaction: Transaction;
}

// Define the initial state
const initialState: SwapState = {
  modal: {
    isOpen: false,
  },
  overlays: {
    selectCoin: { isOpen: false, transactionType: "sell" },
    confirmSwap: { isOpen: false },
    processingTransaction: { isOpen: false },
  },
  transaction: {
    buy: { amount: null, formattedAmount: "", coinId: null },
    sell: { amount: null, formattedAmount: "", coinId: null },
    exchangeRate: null,
    fee: null,
    status: "idle",
  },
};

const swapSlice = createSlice({
  name: "swap",
  initialState,
  reducers: {
    toggleModal(
      state,
      action: PayloadAction<{ isOpen: boolean; coinId?: CoinId }>
    ) {
      state.modal.isOpen = action.payload.isOpen;
      if (action.payload?.coinId)
        state.transaction.sell.coinId = action.payload.coinId;
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
    changeAmount(
      state,
      action: PayloadAction<{
        input: string | number;
        replace?: boolean;
      }>
    ) {
      // first, change the sell amount label
      state.transaction.sell.formattedAmount = changeFormattedAmount(
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

      state.transaction.buy.formattedAmount = changeFormattedAmount(
        state.transaction.buy.formattedAmount,
        state.transaction.buy.amount,
        true
      );
    },
    changeCoinId(
      state,
      action: PayloadAction<{
        transactionType: SwapTransactionType;
        coinId: CoinId | null;
      }>
    ) {
      state.transaction[action.payload.transactionType].coinId =
        action.payload.coinId;
    },
    changeExchangeRate(
      state,
      action: PayloadAction<{
        wallet: UserWalletDataState;
        buyCoinId: CoinId;
        sellCoinId: CoinId;
      }>
    ) {
      state.transaction.exchangeRate = calculateExchangeRate({
        wallet: action.payload.wallet,
        buyCoinId: action.payload.buyCoinId,
        sellCoinId: action.payload.sellCoinId,
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

      state.transaction.buy.formattedAmount = changeFormattedAmount(
        state.transaction.buy.formattedAmount,
        state.transaction.buy.amount,
        true
      );
    },
    updateStatus(state, action: PayloadAction<SwapTransactionStatus>) {
      state.transaction.status = action.payload;
    },
  },
});

export const {
  toggleModal,
  toggleOverlay,
  changeAmount,
  changeExchangeRate,
  changeCoinId,
  unmount,
  updateStatus,
} = swapSlice.actions;
export default swapSlice.reducer;
