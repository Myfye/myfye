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
    };
    bankPicker: {
      isOpen: boolean;
    };
    bankInput: {
      isOpen: boolean;
    };
    selectAsset: {
      isOpen: boolean;
    };
    selectBank: {
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

const initialState: WithdrawOffChainState = {
  transaction: {
    id: null,
    status: "idle",
    amount: 0,
    formattedAmount: "0",
    assetId: "us_dollar",
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
    payout: {
      id: null,
      blindPayQuotation: null,
      commercialQuotation: null,
      contract: {
        abi: [{}],
        address: null,
        amount: null,
        blindpayContractAddress: null,
        functionName: "approve",
        network: {
          chainId: null,
          name: null,
        },
      },
      description: null,
      expiresAt: null,
      flatFee: null,
      partnerFeeAmount: null,
      receiverAmount: null,
      receiverLocalAmount: null,
      senderAmount: null,
    },
  },
  overlays: {
    withdrawOffChain: {
      isOpen: false,
    },
    bankPicker: {
      isOpen: false,
    },
    bankInput: {
      isOpen: false,
    },
    selectBank: {
      isOpen: false,
    },
    selectAsset: {
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
