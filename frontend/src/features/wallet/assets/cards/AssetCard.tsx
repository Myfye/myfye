/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import AssetIcon from "./AssetIcon";
import { RefObject, useMemo } from "react";

// import Button from "@/components/ui/button/Button";
// import Menu from "@/components/ui/menu/Menu";

import AssetCardController from "./AssetCardController";
import { formatBalance } from "../utils";
import { Asset } from "../types";

const AssetCard = ({
  title,
  fiatCurrency,
  symbol,
  balance,
  icon,
  ref,
  showOptions,
  showBalance,
  showCurrencySymbol = true,
  ...restProps
}: {
  title: Asset["label"];
  fiatCurrency: Asset["fiatCurrency"];
  symbol: Asset["symbol"];
  balance: Asset["balance"];
  ref: RefObject<HTMLButtonElement>;
  icon: Asset["icon"];
  showOptions: boolean;
  showBalance: boolean;
  showCurrencySymbol?: boolean;
}) => {
  const formattedBalance = useMemo(
    () => formatBalance(balance, fiatCurrency),
    [balance, fiatCurrency]
  );

  return (
    <AssetCardController {...restProps} ref={ref}>
      <div
        className="coin-card"
        css={css`
          display: grid;
          grid-template-columns: auto 1fr;
          column-gap: var(--size-150);
          line-height: var(--line-height-tight);
          width: 100%;
          user-select: none;
        `}
      >
        <AssetIcon icon={icon} />
        <div
          className="content"
          css={css`
            align-items: center;
            gap: var(--size-200);
          `}
        >
          <div
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
                  margin-block-start: var(--size-075);
                `}
              >
                {symbol}
              </p>
            </div>
            {showBalance && (
              <p
                css={css`
                  font-weight: var(--fw-active);
                `}
              >
                {showCurrencySymbol ? formattedBalance : balance}
              </p>
            )}
          </div>
        </div>
      </div>
    </AssetCardController>
  );
};

export default AssetCard;
