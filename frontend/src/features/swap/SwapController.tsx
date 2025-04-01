import { ArrowDown, CaretRight } from "@phosphor-icons/react";

import { css } from "@emotion/react";
import { useCallback, useMemo } from "react";

import btcIcon from "@/assets/svgs/coins/btc-coin.svg";
import solIcon from "@/assets/svgs/coins/sol-coin.svg";
import eurcCoin from "@/assets/svgs/coins/eur-coin.svg";
import usdCoin from "@/assets/svgs/coins/usd-coin.svg";
import usdyCoin from "@/assets/svgs/coins/usdy-coin.svg";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  formatAmountLabel,
  formatGhostAmountLabel,
  parseAmountLabel,
} from "./utils";
import { changeAmountLabel, toggleOverlay } from "./swapSlice";
import Button from "@/components/ui/button/Button";
import TextFit from "@/shared/components/TextFit";

type Coin = {
  id: string;
  label: string;
  currency: "sol" | "btc" | "usdt" | "usdy" | "eurc";
  balance: number;
  usdBalance: number;
  iconSrc: string;
};

const CoinSelectButton = ({ coin, ref, ...restProps }) => {
  const currentCoin = useMemo(() => {
    switch (coin) {
      case "btc": {
        return {
          name: "Bitcoin",
          color: "var(--clr-yellow-500)",
          iconColor: "var(--clr-yellow-500)",
          backgroundColor: "var(--clr-yellow-100)",
          borderColor: "var(--clr-yellow-200)",
          img: btcIcon,
        };
      }
      case "sol": {
        return {
          name: "Solana",
          color: "var(--clr-purple-500)",
          iconColor: "var(--clr-purple-500)",
          backgroundColor: "var(--clr-purple-100)",
          borderColor: "var(--clr-purple-200)",
          img: solIcon,
        };
      }
      case "usdt": {
        return {
          name: "US Dollar",
          color: "var(--clr-green-500)",
          iconColor: "var(--clr-green-500)",
          backgroundColor: "var(--clr-green-100)",
          borderColor: "var(--clr-green-200)",
          img: usdCoin,
        };
      }
      case "usdy": {
        return {
          name: "US Treasury Bonds",
          color: "var(--clr-purple-500)",
          iconColor: "var(--clr-purple-500)",
          backgroundColor: "var(--clr-purple-100)",
          borderColor: "var(--clr-purple-200)",
          img: usdyCoin,
        };
      }
      case "eurc": {
        return {
          name: "Euro",
          color: "var(--clr-blue-500)",
          iconColor: "var(--clr-blue-500)",
          backgroundColor: "var(--clr-blue-100)",
          borderColor: "var(--clr-blue-200)",
          img: eurcCoin,
        };
      }
      default: {
        return {
          name: "Select coin",
          color: "var(--clr-text)",
          iconColor: "var(--clr-icon)",
          backgroundColor: "var(--clr-surface-raised)",
          borderColor: "var(--clr-border-neutral)",
        };
      }
    }
  }, [coin]);

  return (
    <Button size="small" color="neutral" {...restProps}>
      {coin && (
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
          max-width: ${coin ? "8ch" : "auto"};
        `}
      >
        {currentCoin.name}
      </span>
      <CaretRight color="var(--clr-icon)" size={16} weight="bold" />
    </Button>
  );
};

const SwapControl = ({ control, onSelectCoin, value, coin }) => {
  const dispatch = useDispatch();
  const ghostValue = useMemo(() => formatGhostAmountLabel(value), [value]);
  const valueArr = useMemo(() => value.split(""), [value]);
  const ghostValueArr = useMemo(() => ghostValue.split(""), [ghostValue]);

  const walletData = useSelector((state: RootState) => state.userWalletData);

  const numAmount = parseAmountLabel(value);

  const getCoinAmount = () => {
    switch (coin) {
      case "btc": {
        return walletData.btcSolBalance;
      }
      case "sol": {
        return walletData.solBalance;
      }
      case "usdt": {
        return walletData.usdtSolBalance;
      }
      case "usdy": {
        return walletData.usdySolBalance;
      }
      case "eurc": {
        return walletData.eurcSolBalance;
      }
      default: {
        return 0;
      }
    }
  };
  const amount = getCoinAmount();

  const valueInUSD = () => {
    if (value === "") return 0;
    switch (coin) {
      case "btc": {
        return numAmount * walletData.priceOfBTCinUSDC;
      }
      case "sol": {
        return numAmount * 1;
      }
      case "usdt": {
        return numAmount;
      }
      case "usdy": {
        return numAmount * walletData.priceOfUSDYinUSDC;
      }
      case "eurc": {
        return numAmount * walletData.priceOfEURCinUSDC;
      }
      default: {
        return 0;
      }
    }
  };

  const _valueInUSD = valueInUSD();

  const usdAmount = new Intl.NumberFormat("en-EN", {
    currency: "usd",
    style: "currency",
    maximumFractionDigits: _valueInUSD > Math.floor(_valueInUSD) ? 2 : 0,
  }).format(_valueInUSD);

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
          {control === "buy" ? "Buy" : "Sell"}
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
              {valueArr.map((val, i) => {
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
          {usdAmount}
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
          <CoinSelectButton
            coin={coin}
            onPress={onSelectCoin}
          ></CoinSelectButton>
        </li>
        <li>
          {control === "sell" && (
            <Button
              size="x-small"
              color="neutral"
              onPress={() => {
                dispatch(
                  changeAmountLabel({
                    input: `${amount}`,
                    replace: true,
                  })
                );
              }}
            >
              MAX
            </Button>
          )}
        </li>
      </menu>
    </div>
  );
};

const SwapController = () => {
  const dispatch = useDispatch();

  const buyAmountLabel = useSelector(
    (state: RootState) => state.swap.buy.amountLabel
  );
  const sellAmountLabel = useSelector(
    (state: RootState) => state.swap.sell.amountLabel
  );

  const buyCoin = useSelector((state: RootState) => state.swap.buy.coin);
  const sellCoin = useSelector((state: RootState) => state.swap.sell.coin);

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
        control="sell"
        coin={sellCoin}
        value={sellAmountLabel}
        onSelectCoin={() => {
          dispatch(
            toggleOverlay({
              type: "selectCoin",
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
        control="buy"
        coin={buyCoin}
        value={buyAmountLabel}
        onSelectCoin={() => {
          dispatch(
            toggleOverlay({
              type: "selectCoin",
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
