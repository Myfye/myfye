import { ButtonContext, useContextProps } from "react-aria-components";
import { useButton } from "react-aria";
import { motion } from "motion/react";

import { css } from "@emotion/react";
import { CaretDown, CaretUp, Icon, Minus } from "@phosphor-icons/react";
import { RefObject, useMemo } from "react";
import { formatBalance } from "../../../../features/assets/utils";
import { FiatCurrency } from "../../../../features/assets/types";

const WalletCard = ({
  title,
  balance,
  percentChange,
  currency = "usd",
  icon,
  ref,
  className = "",
  ...restProps
}: {
  title: string;
  balance: number;
  percentChange: number;
  icon: Icon;
  ref: RefObject<HTMLButtonElement>;
  className: string;
  currency: FiatCurrency;
}) => {
  const Icon = icon;

  const formattedBalance = useMemo(
    () => formatBalance(balance, currency),
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
        height: 100%;
        padding: var(--size-150);
        background-color: var(--clr-surface-raised);
        border-radius: var(--border-radius-medium);
      `}
      {...buttonProps}
      ref={ref}
      animate={{
        scale: isPressed ? 0.97 : 1,
      }}
    >
      <p
        className="heading-small"
        css={css`
          color: var(--clr-text);
        `}
      >
        {title}
      </p>
      <div
        className="icon-wrapper"
        css={css`
          width: 32cqw;
        `}
      >
        {Icon && <Icon size="100%" color="var(--clr-primary)" weight="light" />}
      </div>
      <div>
        <p
          className="balance | heading-x-large"
          css={css`
            color: var(--clr-text);
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
              gap: var(--size-025);
              font-size: var(--fs-x-small);
              margin-block-start: var(--size-050);
              color: ${percentChange > 0
                ? "var(--clr-text-success)"
                : percentChange === 0
                ? "var(--clr-text-weaker)"
                : "var(--clr-text-danger)"};
            `}
          >
            {percentChange > 0 ? (
              <CaretUp color="var(--clr-text-success)" weight="fill" />
            ) : percentChange === 0 ? null : (
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
