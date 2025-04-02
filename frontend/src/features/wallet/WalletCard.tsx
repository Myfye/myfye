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

  const { buttonProps, isPressed } = useButton(restPropsButton, refButton);

  return (
    <motion.button
      className={`wallet-card ${className}`}
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        container: wallet-card / size;
        width: 100%;
        aspect-ratio: 1;
        padding: var(--size-200);
        background-color: var(--clr-surface-raised);
        box-shadow: var(--box-shadow-card);
        border-radius: var(--border-radius-medium);
      `}
      {...buttonProps}
      ref={ref}
      animate={{
        scale: isPressed ? 0.97 : 1,
      }}
    >
      <p className="heading-small">{title}</p>
      <div
        className="icon-wrapper"
        css={css`
          width: 32cqw;
        `}
      >
        {Icon && <Icon size="100%" color="var(--clr-accent)" weight="light" />}
      </div>
      <div>
        <p className="balance | heading-medium">{formattedBalance}</p>
        {!isNaN(percentChange) && (
          <p
            className="percent-change"
            css={css`
              display: inline-flex;
              align-items: center;
              gap: var(--size-050);
              font-size: var(--fs-small);
              margin-block-start: var(--size-050);
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
      </div>
    </motion.button>
  );
};

export default WalletCard;
