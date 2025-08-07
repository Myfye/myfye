import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { parseFormattedAmount, updateFormattedAmount } from "../utils";
import {
  PresetAmountOption,
  WithdrawOffChainOverlay,
  WithdrawOffChainTransaction,
} from "./withdrawOffChain.types";
import { Asset } from "@/features/assets/types";

interface WithdrawOffChainState {
  transaction: WithdrawOffChainTransaction;
  overlays: {
    withdrawOffChain: {
      isOpen: boolean;
      zIndex: number;
    };
    bankPicker: {
      isOpen: boolean;
      zIndex: number;
    };
    bankInput: {
      isOpen: boolean;
      zIndex: number;
    };
    selectAsset: {
      isOpen: boolean;
      zIndex: number;
    };
    selectAmount: {
      isOpen: boolean;
      zIndex: number;
    };
    confirmTransaction: {
      isOpen: boolean;
      zIndex: number;
    };
    processingTransaction: {
      isOpen: boolean;
      zIndex: number;
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
    presetAmount: null,
    bankInfo: {
      id: null,
      code: null,
      speiClabe: null,
      accountName: null,
      beneficiaryName: null,
    },
  },
  overlays: {
    withdrawOffChain: {
      isOpen: false,
      zIndex: 2000,
    },
    bankPicker: {
      isOpen: false,
      zIndex: 2001,
    },
    bankInput: {
      isOpen: false,
      zIndex: 2002,
    },
    selectAmount: {
      isOpen: false,
      zIndex: 2003,
    },
    selectAsset: {
      isOpen: false,
      zIndex: 2003,
    },
    confirmTransaction: {
      isOpen: false,
      zIndex: 2004,
    },
    processingTransaction: {
      isOpen: false,
      zIndex: 2005,
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
      state.overlays = {
        ...state.overlays,
        [action.payload.type]: {
          ...state.overlays[action.payload.type],
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

      isNaN(parsedFormattedAmount)
        ? (state.transaction.amount = null)
        : (state.transaction.amount = parsedFormattedAmount);
    },
    updatePresetAmount: (state, action: PayloadAction<PresetAmountOption>) => {
      state.transaction.presetAmount = action.payload;
    },
    updateBankInfo(
      state,
      action: PayloadAction<{
        id?: string | null;
        code?: string | null;
        speiClabe?: string | null;
        accountName?: string | null;
        beneficiaryName?: string | null;
      }>
    ) {
      state.transaction.bankInfo = {
        ...state.transaction.bankInfo,
        ...action.payload,
      };
    },
    updateAssetId(state, action: PayloadAction<Asset["id"] | null>) {
      state.transaction.assetId = action.payload;
    },
    unmount: () => ({ ...initialState }),
  },
});

export const {
  updateAssetId,
  updatePresetAmount,
  updateBankInfo,
  toggleOverlay,
  updateAmount,
  unmount,
  unmountOverlays,
} = withdrawOffChainSlice.actions;

export default withdrawOffChainSlice.reducer;
