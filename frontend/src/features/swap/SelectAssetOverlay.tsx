/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import AssetCardList from "@/features/wallet/assets/cards/AssetCardList";
import Overlay from "@/components/ui/overlay/Overlay";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { toggleOverlay, updateAssetId, updateExchangeRate } from "./swapSlice";
import { useCallback, useMemo } from "react";
import { Asset } from "../wallet/assets/types";
import { selectAssetsByGroup } from "../wallet/assets/assetsSlice";

const SelectAssetOverlay = ({ zIndex = 1000 }) => {
  const dispatch = useDispatch();

  const cashAssets = useSelector((state: RootState) =>
    selectAssetsByGroup(state, "cash")
  );

  const cryptoAssets = useSelector((state: RootState) =>
    selectAssetsByGroup(state, "crypto")
  );

  const earnAssets = useSelector((state: RootState) =>
    selectAssetsByGroup(state, "earn")
  );

  const stocksAssets = useSelector((state: RootState) =>
    selectAssetsByGroup(state, "stocks")
  );

  const isOpen = useSelector(
    (state: RootState) => state.swap.overlays.selectAsset.isOpen
  );

  const assets = useSelector((state: RootState) => state.assets);

  const transactionType = useSelector(
    (state: RootState) => state.swap.overlays.selectAsset.transactionType
  );

  const buyAssetId = useSelector(
    (state: RootState) => state.swap.transaction.buy.assetId
  );

  const sellAssetId = useSelector(
    (state: RootState) => state.swap.transaction.sell.assetId
  );

  const handleOpen = (e: boolean) => {
    dispatch(
      toggleOverlay({
        type: "selectAsset",
        isOpen: e,
        transactionType: transactionType,
      })
    );
  };

  const onAssetSelect = useCallback(
    (asset: Asset) => {
      console.log("Selecting asset:", asset.label, "with ID:", asset.id);
      dispatch(
        updateAssetId({
          transactionType: transactionType,
          assetId: asset.id,
        })
      );
      dispatch(
        updateExchangeRate({
          buyAssetId: transactionType === "buy" ? asset.id : buyAssetId,
          sellAssetId: transactionType === "sell" ? asset.id : sellAssetId,
          assets: assets,
        })
      );
      dispatch(
        toggleOverlay({
          type: "selectAsset",
          isOpen: false,
          transactionType: transactionType,
        })
      );
    },
    [transactionType]
  );

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
              color: var(--clr-text-weak);
              margin-block-end: var(--size-300);
            `}
          >
            Cash
          </h2>
          <AssetCardList
            assets={cashAssets}
            onAssetSelect={onAssetSelect}
            showBalance={transactionType === "sell"}
          ></AssetCardList>
        </section>
        <section
          className="crypto"
          css={css`
            margin-block-start: var(--size-400);
          `}
        >
          <h2
            className="heading-small"
            css={css`
              color: var(--clr-text-weak);
              margin-block-end: var(--size-300);
            `}
          >
            Crypto
          </h2>
          <AssetCardList
            assets={cryptoAssets}
            onAssetSelect={onAssetSelect}
            showBalance={transactionType === "sell"}
          ></AssetCardList>
        </section>
      </div>
    </Overlay>
  );
};

export default SelectAssetOverlay;
