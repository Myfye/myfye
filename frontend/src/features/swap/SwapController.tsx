import { ArrowDown, CaretRight } from "@phosphor-icons/react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useMemo } from "react";
import {
  Button as AriaButton,
  ButtonContext,
  useContextProps,
} from "react-aria-components";
import { useButton } from "react-aria";
import { motion } from "motion/react";

import btcIcon from "@/assets/svgs/coins/btc-coin.svg";
import solIcon from "@/assets/svgs/coins/sol-coin.svg";
import eurcCoin from "@/assets/svgs/coins/eur-coin.svg";
import usdCoin from "@/assets/svgs/coins/usd-coin.svg";
import usdyCoin from "@/assets/svgs/coins/usdy-coin.svg";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { formatGhostAmountLabel } from "./utils";
import {
  changeAmountLabel,
  setActiveControl,
  toggleOverlay,
} from "./swapSlice";
import Button from "@/components/ui/button/Button";

type Coin = {
  id: string;
  label: string;
  currency: "sol" | "btc" | "usdt" | "usdy" | "eurc";
  balance: number;
  usdBalance: number;
  iconSrc: string;
};

const CoinSelectButton = ({ coin, ref, ...restProps }) => {
  const [restPropsButton, refButton] = useContextProps(
    restProps,
    ref,
    ButtonContext
  );

  let { buttonProps, isPressed } = useButton(restPropsButton, refButton);

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
    <motion.button
      className="coin-select-button"
      css={css`
        display: inline-flex;
        align-items: center;
        height: 3rem;
        min-height: 3rem;
        gap: var(--control-gap-medium);
        background-color: ${currentCoin.backgroundColor};
        border: 1px solid ${currentCoin.borderColor};
        color: ${currentCoin.color};
        font-weight: var(--fw-active);
        border-radius: var(--border-radius-medium);
        padding: var(--size-100);
      `}
      {...buttonProps}
      ref={ref}
      animate={{
        scale: isPressed ? 0.95 : 1,
      }}
    >
      {coin && (
        <img
          src={currentCoin.img}
          alt=""
          css={css`
            width: var(--size-300);
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
      <CaretRight color={currentCoin.iconColor} size={16} weight="bold" />
    </motion.button>
  );
};

const SwapControl = ({
  control,
  onInputClick,
  onSelectCoinClick,
  value,
  coin,
}) => {
  const dispatch = useDispatch();
  const ghostValue = useMemo(() => formatGhostAmountLabel(value), [value]);
  return (
    <div
      className="swap-control"
      css={css`
        position: relative;
        padding: var(--size-200);
        background-color: var(--clr-surface-raised);
        box-shadow: var(--box-shadow-card);
        border-radius: var(--border-radius-medium);
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
          className="input-wrapper"
          css={css`
            margin-block-start: var(--size-050);
            position: relative;
            isolation: isolate;
            color: var(--clr-text);
            font-size: var(--fs-x-large);
            line-height: var(--line-height-tight);
            font-weight: var(--fw-active);
            font-family: var(--font-family-mono);
          `}
        >
          <span
            aria-hidden="true"
            css={css`
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              color: var(--clr-text-weakest);
            `}
          >
            {ghostValue}
          </span>
          <input
            css={css`
              position: relative;
              width: 100%;
              z-index: 1;
            `}
            onClick={onInputClick}
            readOnly
            value={value}
            type="text"
          />
        </div>
        <p
          css={css`
            margin-block-start: var(--size-050);
            font-size: var(--fs-x-small);
            color: var(--clr-text-weaker);
            line-height: var(--line-height-tight);
          `}
        >
          $0
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
            onPress={onSelectCoinClick}
          ></CoinSelectButton>
        </li>
        <li>
          {control === "sell" && (
            <Button
              size="small"
              color="neutral"
              onPress={() => {
                dispatch(
                  changeAmountLabel({
                    type: "sell",
                    input: "999",
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
        onInputClick={() => void dispatch(setActiveControl("sell"))}
        onSelectCoinClick={() => {
          dispatch(setActiveControl("sell"));
          dispatch(toggleOverlay({ type: "selectCoin", isOpen: true }));
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
        onInputClick={() => void dispatch(setActiveControl("buy"))}
        onSelectCoinClick={() => {
          dispatch(setActiveControl("buy"));
          dispatch(toggleOverlay({ type: "selectCoin", isOpen: true }));
        }}
      />
    </div>
  );
};

export default SwapController;
