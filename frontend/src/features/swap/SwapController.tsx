import { ArrowsDownUp, CaretRight } from "@phosphor-icons/react";

import { css } from "@emotion/react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  updateFormattedGhostAmount,
  formatUsdAmount,
  getUsdAmount,
} from "./utils";
import { switchCurrencies, toggleOverlay, updateAmount, updateExchangeRate } from "./swapSlice";
import Button from "@/shared/components/ui/button/Button";
import TextFit from "@/shared/components/ui/TextFit";
import { AbstractedAsset } from "../assets/types";
import {
  selectAbstractedAsset,
  selectAbstractedAssetWithBalance,
} from "../assets/assetsSlice";
import { SwapTransactionType } from "./types";

const AssetSelectButton = ({
  abstractedAssetId,
  ...restProps
}: {
  abstractedAssetId: AbstractedAsset["id"] | null;
}) => {
  const asset = useSelector((state: RootState) =>
    abstractedAssetId ? selectAbstractedAsset(state, abstractedAssetId) : null
  );

  return (
    <Button size="small" color="neutral" {...restProps}>
      {asset && (
        <div
          className="wrapper"
          css={css`
            align-content: center;
            text-align: center;
            width: 24px;
            aspect-ratio: 1;
            border-radius: var(--border-radius-circle);
            overflow: hidden;
          `}
        >
          {asset.icon.type !== "text" ? (
            <img
              src={asset.icon.content}
              alt=""
              css={css`
                width: 100%;
                height: 100%;
                object-fit: cover;
              `}
            />
          ) : (
            <div
              css={css`
                align-content: center;
                width: 100%;
                height: 100%;
                background-color: ${asset.icon.backgroundColor};
                color: ${asset.icon.color};
              `}
            >
              <p
                css={css`
                  font-size: 8px;
                  font-weight: var(--fw-active);
                `}
              >
                {asset.icon.content}
              </p>
            </div>
          )}
        </div>
      )}
      <span
        css={css`
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: ${abstractedAssetId ? "8ch" : "auto"};
        `}
      >
        {asset ? asset.label : "Select coin"}
      </span>
      <CaretRight color="var(--clr-icon)" size={16} weight="bold" />
    </Button>
  );
};

const MaxAmountButton = ({
  abstractedAssetId,
}: {
  abstractedAssetId: AbstractedAsset["id"] | null;
}) => {
  const dispatch = useDispatch();

  const asset = useSelector((state: RootState) =>
    abstractedAssetId
      ? selectAbstractedAssetWithBalance(state, abstractedAssetId)
      : null
  );

  return (
    <>
      <Button
        isDisabled={abstractedAssetId === null}
        size="x-small"
        color="neutral"
        onPress={() => {
          if (!asset) return;

          if (asset.id == "sol") {
            // We have to keep 0.0015 Sol for transaction fees
            const solFee = 0.0025;
            if (asset.balance - solFee > 0.00001) {
              const formattedAmount = (asset.balance - solFee).toFixed(10);
              dispatch(
                updateAmount({
                  input: formattedAmount,
                  replace: true,
                })
              );
            } else {
              dispatch(
                updateAmount({
                  input: 0,
                  replace: true,
                })
              );
            }
          } else {
            dispatch(
              updateAmount({
                input: asset.balance,
                replace: true,
              })
            );
          }

          console.log("Max pressed for", asset);
        }}
      >
        MAX
      </Button>
    </>
  );
};

const SwapControl = ({
  transactionType,
  onSelectAsset,
  formattedAmount,
  abstractedAssetId,
}: {
  transactionType: SwapTransactionType;
  onSelectAsset: () => void;
  formattedAmount: string;
  abstractedAssetId: AbstractedAsset["id"] | null;
}) => {
  // Formatted Amount
  const formattedAmountArr = formattedAmount.split("");

  // Ghost amount
  const ghostValue = updateFormattedGhostAmount(formattedAmount);
  const ghostValueArr = ghostValue.split("");

  const amount = useSelector(
    (state: RootState) => state.swap.transaction[transactionType].amount
  );

  const assets = useSelector((state: RootState) => state.assets);

  const usdAmount = getUsdAmount(abstractedAssetId, assets, amount);

  const formattedUsdAmount = formatUsdAmount(usdAmount);

  return (
    <div
      className="swap-control"
      css={css`
        position: relative;
        padding: var(--size-200);
        background-color: var(--clr-surface-raised);
        border-radius: var(--border-radius-medium);
        container: swap-control / inline-size;
      `}
    >
      <div className="select-value">
        <p
          css={css`
            font-size: var(--fs-small);
            color: var(--clr-text-weaker);
            line-height: var(--line-height-tight);
          `}
        >
          {transactionType === "buy" ? "Buy" : "Sell"}
        </p>
        <div
          className="value-wrapper"
          css={css`
            margin-block-start: var(--size-050);
            position: relative;
            isolation: isolate;
            color: var(--clr-text);
            line-height: var(--line-height-tight);
            font-weight: var(--fw-active);
            letter-spacing: 0.01em;
            overflow: hidden;
            > * {
              display: flex;
              align-items: center;
              width: calc(50cqi + var(--size-100));
              height: calc(28px * var(--line-height-tight));
            }
          `}
        >
          <p
            aria-hidden="true"
            css={css`
              position: absolute;
              z-index: 1;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              color: var(--clr-text-weakest);
            `}
          >
            <TextFit maxFontSize="28px">
              {ghostValueArr.map((val, i) => {
                return <span key={`ghost-value-${i}`}>{val}</span>;
              })}
            </TextFit>
          </p>
          <p
            css={css`
              position: relative;
              z-index: 2;
              min-height: 1em;
            `}
          >
            <TextFit maxFontSize="28px">
              {formattedAmountArr.map((val, i) => {
                return <span key={`value-${i}`}>{val}</span>;
              })}
            </TextFit>
          </p>
        </div>
        <p
          css={css`
            margin-block-start: var(--size-050);
            font-size: var(--fs-x-small);
            color: var(--clr-text-weaker);
            line-height: var(--line-height-tight);
          `}
        >
          {formattedUsdAmount}
        </p>
      </div>
      <menu
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-end;
          gap: var(--control-gap-small);
          position: absolute;
          inset: 0;
          left: auto;
          right: var(--size-200);
          margin: auto;
        `}
      >
        <li>
          <AssetSelectButton
            abstractedAssetId={abstractedAssetId}
            onPress={onSelectAsset}
          />
        </li>
        <li>
          {transactionType === "sell" && (
            <MaxAmountButton abstractedAssetId={abstractedAssetId} />
          )}
        </li>
      </menu>
    </div>
  );
};

const SwapController = () => {
  const dispatch = useDispatch();

  const transaction = useSelector((state: RootState) => state.swap.transaction);
  const assets = useSelector((state: RootState) => state.assets);

  return (
    <div
      className="swap-controller"
      css={css`
        display: flex;
        flex-direction: column;
        gap: var(--size-075);
        position: relative;
      `}
    >
      <SwapControl
        transactionType="sell"
        abstractedAssetId={transaction.sell.abstractedAssetId}
        formattedAmount={transaction.sell.formattedAmount}
        onSelectAsset={() => {
          dispatch(
            toggleOverlay({
              type: "selectAsset",
              isOpen: true,
              transactionType: "sell",
            })
          );
        }}
      />
      <div
        onClick={() => {
          dispatch(switchCurrencies(null));
          // After switching currencies, update the exchange rate with the new buy/sell pair
          dispatch(
            updateExchangeRate({
              buyAbstractedAssetId: transaction.sell.abstractedAssetId, // After switch, current sell becomes buy
              sellAbstractedAssetId: transaction.buy.abstractedAssetId, // After switch, current buy becomes sell
              assets: assets,
            })
          );
        }}
        className="icon-wrapper"
        css={css`
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          background-color: var(--clr-surface-raised);
          border-radius: var(--border-radius-medium);
          padding: var(--size-075);
          box-shadow: var(--box-shadow);
          border: 1px solid var(--clr-border-neutral);
        `}
      >
        <ArrowsDownUp size={20} color="var(--clr-icon)" />
      </div>
      <SwapControl
        transactionType="buy"
        abstractedAssetId={transaction.buy.abstractedAssetId}
        formattedAmount={transaction.buy.formattedAmount}
        onSelectAsset={() => {
          dispatch(
            toggleOverlay({
              type: "selectAsset",
              isOpen: true,
              transactionType: "buy",
            })
          );
        }}
      />
    </div>
  );
};

export default SwapController;
