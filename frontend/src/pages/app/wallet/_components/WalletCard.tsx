import { ButtonContext, useContextProps } from "react-aria-components";
import { useButton } from "react-aria";
import { motion } from "motion/react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  CaretDown,
  CaretRight as CaretRightIcon,
  CaretUp,
} from "@phosphor-icons/react";
import { useMemo } from "react";

const WalletCard = ({
  title = "",
  balance,
  percentChange = 0,
  currency = "usd",
  icon = null,
  ref,
  className = "",
  ...restProps
}) => {
  const Icon = icon;

  const formattedBalance = useMemo(
    () =>
      new Intl.NumberFormat("en-EN", {
        style: "currency",
        currency: currency,
      }).format(balance),
    [balance, currency]
  );

  const formattedPercentChange = useMemo(
    () =>
      Math.abs(percentChange).toLocaleString("en", {
        style: "percent",
        minimumFractionDigits: 2,
      }),
    [percentChange]
  );

  const [restPropsButton, refButton] = useContextProps(
    restProps,
    ref,
    ButtonContext
  );

  let { buttonProps, isPressed } = useButton(restPropsButton, refButton);

  return (
    <motion.button
      className={`wallet-card ${className}`}
      css={css`
        display: flex;
        flex-direction: column;
        aspect-ratio: 1;
        width: 100%;
        padding: var(--size-200);
        box-shadow: var(--box-shadow-card);
        border-radius: var(--border-radius-medium);
      `}
      {...buttonProps}
      ref={ref}
      animate={{
        scale: isPressed ? 0.97 : 1,
      }}
    >
      <p
        className="heading-medium"
        css={css`
          margin-block-end: var(--size-150);
        `}
      >
        {title}
      </p>
      {Icon && <Icon size={"var(--size-600)"} color="var(--clr-accent)" />}
      {!isNaN(balance) ? (
        <>
          <p
            className="balance | heading-large"
            css={css`
              margin-block-start: var(--size-150);
            `}
          >
            {formattedBalance}
          </p>
          {!isNaN(percentChange) && (
            <p
              className="percent-change"
              css={css`
                display: inline-flex;
                align-items: center;
                gap: var(--size-050);
                margin-block-start: var(--size-100);
                font-size: var(--fs-small);
                font-weight: var(--fw-active);
                color: ${percentChange > 0
                  ? "var(--clr-text-success)"
                  : "var(--clr-text-danger)"};
              `}
            >
              {percentChange > 0 ? (
                <CaretUp color="var(--clr-text-success)" weight="fill" />
              ) : (
                <CaretDown color="var(--clr-text-danger)" weight="fill" />
              )}
              {formattedPercentChange}
            </p>
          )}
        </>
      ) : (
        <p
          className="caption-medium"
          css={css`
            display: inline-flex;
            align-items: center;
            justify-content: space-between;
            color: var(--clr-text-weak);
            margin-block-start: auto;
          `}
        >
          Show more
          <CaretRightIcon />
        </p>
      )}
    </motion.button>
  );
};

export default WalletCard;
