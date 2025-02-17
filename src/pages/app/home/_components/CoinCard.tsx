/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import CoinIcon from "./CoinIcon";
import { useMemo } from "react";
import { ButtonContext, useContextProps } from "react-aria-components";
import { useButton } from "react-aria";
import { motion } from "motion/react";

const CoinCard = ({ title, currency, balance, img, ref, ...restProps }) => {
  const formattedBalance = useMemo(
    () =>
      new Intl.NumberFormat("en-EN", {
        style: "currency",
        currency: `${
          currency === "sol" || currency === "btc" ? "usd" : currency
        }`,
      }).format(balance),
    [balance]
  );

  const [restPropsButton, refButton] = useContextProps(
    restProps,
    ref,
    ButtonContext
  );

  let { buttonProps, isPressed } = useButton(restPropsButton, refButton);

  return (
    <motion.button
      {...buttonProps}
      ref={ref}
      animate={{
        scale: isPressed ? 0.98 : 1,
      }}
      className="coin-card"
      css={css`
        display: grid;
        grid-template-columns: auto 1fr;
        column-gap: var(--size-150);
        line-height: var(--line-height-tight);
        width: 100%;
      `}
    >
      <CoinIcon src={img} />
      <div
        className="content"
        css={css`
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          align-self: center;
        `}
      >
        <div
          className="title"
          css={css`
            display: flex;
            align-items: flex-start;
            justify-content: flex-start;
            flex-direction: column;
          `}
        >
          <p
            css={css`
              font-weight: var(--fw-active);
            `}
          >
            {title}
          </p>
          <p
            css={css`
              font-size: var(--fs-small);
              color: var(--clr-text-neutral);
              text-transform: uppercase;
              margin-block-start: var(--size-050);
            `}
          >
            {currency}
          </p>
        </div>
        <p
          css={css`
            font-weight: var(--fw-active);
          `}
        >
          {formattedBalance}
        </p>
      </div>
    </motion.button>
  );
};

export default CoinCard;
