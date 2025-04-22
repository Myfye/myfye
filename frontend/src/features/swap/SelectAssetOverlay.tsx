import { css } from "@emotion/react";

import AssetCardList from "@/features/assets/cards/AssetCardList";
import Overlay from "@/components/ui/overlay/Overlay";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleOverlay,
  updateAbstractedAssetId,
  updateExchangeRate,
} from "./swapSlice";
import { useCallback } from "react";
import { AbstractedAsset, Asset } from "../assets/types";
import { selectAbstractedAssetsWithBalanceByDashboard } from "../assets/assetsSlice";
import AssetCardListSelect from "../assets/cards/AssetCardListSelect";

const SelectAssetOverlay = ({ zIndex = 1000 }) => {
  const dispatch = useDispatch();

  const cashAssets = useSelector((state: RootState) =>
    selectAbstractedAssetsWithBalanceByDashboard(state, "cash")
  );

  const cryptoAssets = useSelector((state: RootState) =>
    selectAbstractedAssetsWithBalanceByDashboard(state, "crypto")
  );

  const stocksAssets = useSelector((state: RootState) =>
    selectAbstractedAssetsWithBalanceByDashboard(state, "stocks")
  );

  const isOpen = useSelector(
    (state: RootState) => state.swap.overlays.selectAsset.isOpen
  );

  const assets = useSelector((state: RootState) => state.assets);

  const transactionType = useSelector(
    (state: RootState) => state.swap.overlays.selectAsset.transactionType
  );

  const transaction = useSelector((state: RootState) => state.swap.transaction);

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
    (abstractedAssetId: AbstractedAsset["id"]) => {
      console.log("Selecting asset:", abstractedAssetId);
      dispatch(
        updateAbstractedAssetId({
          transactionType: transactionType,
          abstractedAssetId: abstractedAssetId,
        })
      );
      dispatch(
        updateExchangeRate({
          buyAbstractedAssetId:
            transactionType === "buy"
              ? abstractedAssetId
              : transaction.buy.abstractedAssetId,
          sellAbstractedAssetId:
            transactionType === "sell"
              ? abstractedAssetId
              : transaction.sell.abstractedAssetId,
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
              color: var(--clr-text-weaker);
              margin-block-end: var(--size-250);
            `}
          >
            Cash
          </h2>
          <AssetCardListSelect
            assets={cashAssets}
            selectedAsset={
              transactionType === "sell"
                ? transaction.sell.abstractedAssetId
                : transaction.buy.abstractedAssetId
            }
            onAssetSelect={onAssetSelect}
            showBalance={transactionType === "sell"}
          ></AssetCardListSelect>
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
              color: var(--clr-text-weaker);
              margin-block-end: var(--size-250);
            `}
          >
            Crypto
          </h2>
          <AssetCardListSelect
            assets={cryptoAssets}
            selectedAsset={
              transactionType === "sell"
                ? transaction.sell.abstractedAssetId
                : transaction.buy.abstractedAssetId
            }
            onAssetSelect={onAssetSelect}
            showBalance={transactionType === "sell"}
          ></AssetCardListSelect>
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
              color: var(--clr-text-weaker);
              margin-block-end: var(--size-250);
            `}
          >
            Stocks
          </h2>
          <AssetCardListSelect
            assets={stocksAssets}
            selectedAsset={
              transactionType === "sell"
                ? transaction.sell.abstractedAssetId
                : transaction.buy.abstractedAssetId
            }
            onAssetSelect={onAssetSelect}
            showBalance={transactionType === "sell"}
          ></AssetCardListSelect>
        </section>
      </div>
    </Overlay>
  );
};

export default SelectAssetOverlay;
