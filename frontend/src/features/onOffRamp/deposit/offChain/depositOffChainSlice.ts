import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  BankAccountTransaction,
  DepositOffChainOverlay,
  PresetAmountOption,
  Transaction,
} from "./depositOffChain.types";
import { parseFormattedAmount, updateFormattedAmount } from "../utils";

type TransactionKey = "bankAccountTransaction" | "privyTransaction";

interface DepositOffChainState {
  bankAccountTransaction: BankAccountTransaction;
  privyTransaction: Transaction;
  overlays: {
    bankAccount: {
      isOpen: boolean;
    };
    bankAccountInstructions: {
      isOpen: boolean;
    };
    privy: {
      isOpen: boolean;
    };
  };
  modals: {
    selectCurrency: {
      isOpen: boolean;
    };
  };
}

const initialState: DepositOffChainState = {
  bankAccountTransaction: {
    id: null,
    amount: 0,
    formattedAmount: "0",
    fee: 0,
    presetAmount: null,
    payin: {
      currency: "mxn",
      achRoutingNumber: null,
      achAccountNumber: null,
      senderAmount: null,
      clabeAddress: null,
      pixAddress: null,
      beneficiary: {
        name: null,
        addressLine1: null,
        addressLine2: null,
      },
    },
  },
  privyTransaction: {
    id: null,
    amount: 0,
    formattedAmount: "0",
    fee: 0,
    presetAmount: null,
  },
  overlays: {
    bankAccount: {
      isOpen: false,
    },
    bankAccountInstructions: {
      isOpen: false,
    },
    privy: {
      isOpen: false,
    },
  },
  modals: {
    selectCurrency: {
      isOpen: false,
    },
  },
};

const depositOffChainSlice = createSlice({
  name: "depositOffChain",
  initialState,
  reducers: {
    toggleOverlay: (
      state,
      action: PayloadAction<{
        type: DepositOffChainOverlay;
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
    toggleModal: (
      state,
      action: PayloadAction<{
        type: "selectCurrency";
        isOpen: boolean;
      }>
    ) => {
      state.modals = {
        ...state.modals,
        [action.payload.type]: {
          ...state.modals[action.payload.type],
          isOpen: action.payload.isOpen,
        },
      };
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
        transactionType: "bankAccount" | "privy";
      }>
    ) {
      const transactionKey = (action.payload.transactionType +
        "Transaction") as TransactionKey;
      state[transactionKey].formattedAmount = updateFormattedAmount(
        state[transactionKey].formattedAmount,
        action.payload.input,
        action.payload.replace
      );

      const parsedFormattedAmount = parseFormattedAmount(
        state[transactionKey].formattedAmount
      );

      if (isNaN(parsedFormattedAmount)) {
        state[transactionKey].amount = null;
      } else {
        state[transactionKey].amount = parsedFormattedAmount;
        if (action.payload.transactionType === "bankAccount") {
          state[transactionKey].fee = parsedFormattedAmount * 0.01;
        }
      }
    },
    updatePresetAmount: (
      state,
      action: PayloadAction<{
        presetAmount: PresetAmountOption;
        transactionType: "bankAccount" | "privy";
      }>
    ) => {
      const transactionKey = (action.payload.transactionType +
        "Transaction") as TransactionKey;
      state[transactionKey].presetAmount = action.payload.presetAmount;
    },
    updatePayin(
      state,
      action: PayloadAction<{
        currency?: /*"usd" |*/ "brl" | "mxn";
        achRoutingNumber?: string | null;
        achAccountNumber?: string | null;
        senderAmount?: number | null;
        clabeAddress?: string | null;
        pixAddress?: string | null;
        beneficiary?: {
          name: string | null;
          addressLine1: string | null;
          addressLine2: string | null;
        };
      }>
    ) {
      state.bankAccountTransaction.payin = {
        ...state.bankAccountTransaction.payin,
        ...action.payload,
      };
    },
    unmount: () => ({ ...initialState }),
  },
});

export const {
  updatePayin,
  updatePresetAmount,
  toggleOverlay,
  updateAmount,
  toggleModal,
  unmount,
  unmountOverlays,
} = depositOffChainSlice.actions;

export default depositOffChainSlice.reducer;
