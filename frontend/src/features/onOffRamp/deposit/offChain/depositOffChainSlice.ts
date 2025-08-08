import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  DepositOffChainOverlay,
  DepositOffChainTransaction,
  PresetAmountOption,
} from "./depositOffChain.types";
import { parseFormattedAmount, updateFormattedAmount } from "../utils";

interface DepositOffChainState {
  transaction: DepositOffChainTransaction;
  overlays: {
    depositOffChain: {
      isOpen: boolean;
    };
    instructions: {
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
  transaction: {
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
  overlays: {
    depositOffChain: {
      isOpen: false,
    },
    instructions: {
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

      if (isNaN(parsedFormattedAmount)) {
        state.transaction.amount = null;
      } else {
        console.log(state.transaction.fee);
        state.transaction.amount = parsedFormattedAmount;
        state.transaction.fee = parsedFormattedAmount * 0.01;
      }
    },
    updatePresetAmount: (state, action: PayloadAction<PresetAmountOption>) => {
      state.transaction.presetAmount = action.payload;
    },
    updatePayin(
      state,
      action: PayloadAction<{
        currency?: /*"usd" |*/ "brl" | "mxn";
        achRoutingNumber?: string | null;
        achAccountNumber?: string | null;
        senderAmount?: string | null;
        clabeAddress?: string | null;
        pixAddress?: string | null;
        beneficiary: {
          name: string | null;
          address1: string | null;
          address2: string | null;
        };
      }>
    ) {
      state.transaction.payin = {
        ...state.transaction.payin,
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
