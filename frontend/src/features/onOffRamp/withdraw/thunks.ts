import { Action, ThunkAction } from "@reduxjs/toolkit";
import {
  toggleOverlay,
  updateAmount,
  updateAssetId,
} from "./onChain/withdrawOnChainSlice";
import { RootState } from "@/redux/store";

export const updateAmountDisplay = (
  assetId: string
): ThunkAction<void, RootState, unknown, Action<string>> => {
  return (dispatch, getState) => {
    dispatch(updateAssetId(assetId));

    const state = getState();
    const newAsset = state.assets.assets[assetId];

    if (newAsset && state.withdrawOnChain.transaction.presetAmount === "max") {
      dispatch(updateAmount({ input: newAsset.balance, replace: true }));
    }

    dispatch(
      toggleOverlay({
        type: "selectAsset",
        isOpen: false,
      })
    );
  };
};
