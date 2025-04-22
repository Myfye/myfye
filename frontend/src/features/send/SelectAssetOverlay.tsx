import { css } from "@emotion/react";

import Overlay from "@/components/ui/overlay/Overlay";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleOverlay,
  updateAbstractedAssetId,
  updateAmount,
} from "./sendSlice";
import { AbstractedAsset } from "../assets/types";
import {
  selectAbstractedAssetsWithBalanceByDashboard,
  selectAbstractedAssetWithBalance,
} from "../assets/assetsSlice";
import AssetCardListSelect from "../assets/cards/AssetCardListSelect";

const SelectAssetOverlay = ({ zIndex = 1000 }) => {
  const dispatch = useDispatch();

  const cashAssets = useSelector((state: RootState) =>
    selectAbstractedAssetsWithBalanceByDashboard(state, "cash")
  );

  const isOpen = useSelector(
    (state: RootState) => state.send.overlays.selectAsset.isOpen
  );

  const selectedAbstractedAssetId = useSelector(
    (state: RootState) => state.send.transaction.abstractedAssetId
  );

  const asset = useSelector((state: RootState) =>
    selectedAbstractedAssetId
      ? selectAbstractedAssetWithBalance(state, selectedAbstractedAssetId)
      : null
  );

  const transaction = useSelector((state: RootState) => state.send.transaction);

  const handleOpen = (e: boolean) => {
    dispatch(
      toggleOverlay({
        isOpen: e,
        type: "selectAsset",
      })
    );
  };

  const onAssetSelect = (abstractedAssetId: AbstractedAsset["id"]) => {
    dispatch(
      updateAbstractedAssetId({
        abstractedAssetId: abstractedAssetId,
      })
    );
    if (asset && transaction.presetAmount === "max") {
      console.log(asset);
      dispatch(updateAmount({ input: asset.balanceUSD, replace: true }));
    }
    dispatch(
      toggleOverlay({
        type: "selectAsset",
        isOpen: false,
      })
    );
  };

  return (
    <Overlay
      title="Select coin"
      isOpen={isOpen}
      onOpenChange={handleOpen}
      zIndex={zIndex}
    >
      <div
        css={css`
          margin-inline: var(--size-250);
          padding-block-end: var(--size-250);
        `}
      >
        <section
          className="cash"
          css={css`
            margin-block-start: var(--size-400);
          `}
        >
          <h2
            className="heading-small"
            css={css`
              color: var(--clr-text);
              margin-block-end: var(--size-200);
            `}
          >
            Cash
          </h2>
          <AssetCardListSelect
            assets={cashAssets}
            onAssetSelect={onAssetSelect}
            selectedAsset={selectedAbstractedAssetId}
          ></AssetCardListSelect>
        </section>
      </div>
    </Overlay>
  );
};

export default SelectAssetOverlay;
