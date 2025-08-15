import { Action, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import {
  toggleOverlay,
  updateAbstractedAssetId,
  updateAmount,
} from "./withdrawOffChainSlice";

export const updateAmountDisplay = (
  assetId: string
): ThunkAction<void, RootState, unknown, Action<string>> => {
  return (dispatch, getState) => {
    dispatch(updateAbstractedAssetId(assetId));

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
