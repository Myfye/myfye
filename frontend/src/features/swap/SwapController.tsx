import { ArrowDown, CaretRight } from "@phosphor-icons/react";

import { css } from "@emotion/react";
import { useMemo } from "react";

import btcIcon from "@/assets/svgs/coins/btc-coin.svg";
import solIcon from "@/assets/svgs/coins/sol-coin.svg";
import eurcCoin from "@/assets/svgs/coins/eur-coin.svg";
import usdCoin from "@/assets/svgs/coins/usd-coin.svg";
import usdyCoin from "@/assets/svgs/coins/usdy-coin.svg";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  updateFormattedGhostAmount,
  formatUsdAmount,
  getUsdAmount,
} from "./utils";
import { toggleOverlay, updateAmount, SwapTransactionType } from "./swapSlice";
import Button from "@/components/ui/button/Button";
import TextFit from "@/shared/components/TextFit";
import { Asset } from "../wallet/assets/types";
import { selectAsset } from "../wallet/assets/assetsSlice";

const AssetSelectButton = ({
  assetId,
  ...restProps
}: {
  assetId: Asset["id"] | null;
}) => {
  const currentCoin = useMemo(() => {
    switch (assetId) {
      case "btc_sol": {
        return {
          name: "Bitcoin",
          img: btcIcon,
        };
      }
      case "sol": {
        return {
          name: "Solana",
          img: solIcon,
        };
      }
      case "usdc_sol": {
        return {
          name: "US Dollar",
          img: usdCoin,
        };
      }
      case "usdt_sol": {
        return {
          name: "US Dollar",
          img: usdCoin,
        };
      }
      case "usdy_sol": {
        return {
          name: "US Treasury Bonds",
          img: usdyCoin,
        };
      }
      case "eurc_sol": {
        return {
          name: "Euro",
          img: eurcCoin,
        };
      }
      default: {
        return {
          name: "Select coin",
        };
      }
    }
  }, [assetId]);

  return (
    <Button size="small" color="neutral" {...restProps}>
      {assetId && (
        <img
          src={currentCoin.img}
          alt=""
          css={css`
            width: 24px;
            aspect-ratio: 1;
            border-radius: var(--border-radius-circle);
          `}
        ></img>
      )}
      <span
        css={css`
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: ${assetId ? "8ch" : "auto"};
        `}
      >
        {currentCoin.name}
      </span>
      <CaretRight color="var(--clr-icon)" size={16} weight="bold" />
    </Button>
  );
};

const MaxAmountButton = ({ assetId }: { assetId: Asset["id"] }) => {
  const dispatch = useDispatch();

  const asset = useSelector((state: RootState) => selectAsset(state, assetId));

  return (
    <>
      <Button
        size="x-small"
        color="neutral"
        onPress={() => {
          dispatch(
            updateAmount({
              input: asset.balance,
              replace: true,
            })
          );
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
  assetId,
}: {
  transactionType: SwapTransactionType;
  onSelectAsset: () => void;
  formattedAmount: string;
  assetId: Asset["id"] | null;
}) => {
  // Formatted Amount
  const formattedAmountArr = useMemo(
    () => formattedAmount.split(""),
    [formattedAmount]
  );

  // Ghost amount
  const ghostValue = useMemo(
    () => updateFormattedGhostAmount(formattedAmount),
    [formattedAmount]
  );
  const ghostValueArr = useMemo(() => ghostValue.split(""), [ghostValue]);

  const amount = useSelector(
    (state: RootState) => state.swap.transaction[transactionType].amount
  );

  const assets = useSelector((state: RootState) => state.assets);

  const usdAmount = useMemo(
    () => getUsdAmount(assetId, assets, amount),
    [amount]
  );

  const formattedUsdAmount = useMemo(
    () => formatUsdAmount(usdAmount),
    [usdAmount]
  );
  return (
    <div
      className="swap-control"
      css={css`
        position: relative;
        padding: var(--size-200);
        background-color: var(--clr-surface-raised);
        box-shadow: var(--box-shadow-card);
        border-radius: var(--border-radius-medium);
        container: swap-control / inline-size;
      `}
    >
      <div className="select-value">
        <p
          css={css`
            font-size: var(--fs-small);
            color: var(--clr-text-weak);
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
          <AssetSelectButton assetId={assetId} onPress={onSelectAsset} />
        </li>
        <li>
          {transactionType === "sell" && assetId && (
            <MaxAmountButton assetId={assetId} />
          )}
        </li>
      </menu>
    </div>
  );
};

const SwapController = () => {
  const dispatch = useDispatch();

  const formattedBuyAmount = useSelector(
    (state: RootState) => state.swap.transaction.buy.formattedAmount
  );
  const formattedSellAmount = useSelector(
    (state: RootState) => state.swap.transaction.sell.formattedAmount
  );

  const buyAssetId = useSelector(
    (state: RootState) => state.swap.transaction.buy.assetId
  );
  const sellAssetId = useSelector(
    (state: RootState) => state.swap.transaction.sell.assetId
  );

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
        assetId={sellAssetId}
        formattedAmount={formattedSellAmount}
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
        className="icon-wrapper"
        css={css`
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          background-color: var(--clr-surface-raised);
          border-radius: var(--border-radius-medium);
          padding: var(--size-100);
          box-shadow: var(--box-shadow-card);
        `}
      >
        <ArrowDown size={24} color="var(--clr-icon)" />
      </div>
      <SwapControl
        transactionType="buy"
        assetId={buyAssetId}
        formattedAmount={formattedBuyAmount}
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
