import { ArrowDown, CaretRight } from "@phosphor-icons/react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useMemo, useState } from "react";
import { ButtonContext, useContextProps } from "react-aria-components";
import { useButton } from "react-aria";
import { motion } from "motion/react";

import btcIcon from "@/assets/svgs/coins/btc-coin.svg";
import { SwapState } from "./SwapModal";

import { z } from "zod";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type Coin = {
  id: string;
  label: string;
  currency: "sol" | "btc" | "usdt" | "usdy" | "eurc";
  balance: number;
  usdBalance: number;
  iconSrc: string;
};

const CoinSelectButton = ({ ref, coin, ...restProps }) => {
  const [restPropsButton, refButton] = useContextProps(
    restProps,
    ref,
    ButtonContext
  );

  let { buttonProps, isPressed } = useButton(restPropsButton, refButton);

  const colorScheme = useMemo(() => {
    switch (coin) {
      case "btc": {
        return {
          color: "var(--clr-green-500)",
          iconColor: "var(--clr-green-500)",
          backgroundColor: "var(--clr-green-100)",
          borderColor: "var(--clr-green-200)",
        };
      }

      default: {
        return {
          color: "var(--clr-text)",
          iconColor: "var(--clr-icon)",
          backgroundColor: "var(--clr-neutral-100)",
          borderColor: "var(--clr-neutral-200)",
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
        position: absolute;
        inset: 0;
        left: auto;
        right: var(--size-200);
        margin: auto;
        background-color: ${colorScheme.backgroundColor};
        border: 1px solid ${colorScheme.borderColor};
        color: ${colorScheme.color};
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
      {coin ? (
        <>
          <img
            src={btcIcon}
            alt=""
            css={css`
              width: var(--size-400);
              aspect-ratio: 1;
              border-radius: var(--border-radius-circle);
            `}
          ></img>
          <span>Bitcoin</span>
        </>
      ) : (
        <span>Select coin</span>
      )}
      <CaretRight color={colorScheme.iconColor} size={16} weight="bold" />
    </motion.button>
  );
};

const SwapControl = ({
  inputRef,
  activeControl,
  coin,
  onInputClick,
  inputProps,
  value,
  ghostValue,
}: {
  activeControl: "buy" | "sell";
  coin: string;
}) => {
  return (
    <div
      className="swap-control"
      css={css`
        position: relative;
        padding: var(--size-200);
        background-color: var(--clr-surface);
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
          {swapState === "buy" ? "Buy" : "Sell"}
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
            ref={inputRef}
            type="text"
            {...inputProps}
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
      <menu>
        <li></li>
        {activeControl && <MaxButton></MaxButton>}
        <li></li>
      </menu>
      <CoinSelectButton coin={coin}></CoinSelectButton>
    </div>
  );
};

const SwapController = () => {
  const buyAmount = useSelector((state: RootState) => state.swap.buy.amount);
  const sellAmount = useSelector((state: RootState) => state.swap.sell.amount);
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
        swapState="buy"
        coin="btc"
        value={buyValue}
        ghostValue={buyGhostValue}
        onInputClick={() => void onFocusedSwapControlChange("buy")}
      />
      <div
        className="icon-wrapper"
        css={css`
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          background-color: var(--clr-surface);
          border-radius: var(--border-radius-medium);
          padding: var(--size-100);
          box-shadow: var(--box-shadow-card);
        `}
      >
        <ArrowDown size={24} color="var(--clr-icon)" />
      </div>
      <SwapControl
        swapState="sell"
        value={sellValue}
        ghostValue={sellGhostValue}
        onInputClick={() => void onFocusedSwapControlChange("sell")}
      />
    </div>
  );
};

export default SwapController;
