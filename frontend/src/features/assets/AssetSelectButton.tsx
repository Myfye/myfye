import { AriaButtonProps } from "react-aria";
import { Button } from "react-aria-components";
import { AbstractedAsset, Asset } from "./types";
import { css } from "@emotion/react";
import AssetIcon from "./AssetIcon";
import { CaretRight } from "@phosphor-icons/react";

interface AssetSelectButtonProps extends AriaButtonProps {
  label?: string;
  icon?:
    | { content: string; type: "image" | "svg" }
    | { content: string; type: "text"; color: string; backgroundColor: string };
  balance?: number;
  fiatCurrency?: string;
  symbol?: string;
  balanceType?: "fiat" | "token";
}
const AssetSelectButton = ({
  label,
  icon,
  balance,
  fiatCurrency = "usd",
  balanceType = "fiat",
  symbol,
  ...restProps
}: AssetSelectButtonProps) => {
  const assetIsValid = !!icon && !!label && !isNaN(balance);
  return (
    <Button
      {...restProps}
      css={css`
        padding: var(--size-150);
        width: 100%;
        background-color: var(--clr-surface-raised);
        border-radius: var(--border-radius-medium);
        height: 4.25rem;
      `}
    >
      <div
        css={css`
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: var(--size-100);
          height: calc(4.25rem - var(--size-150) * 2);
        `}
      >
        <div
          css={css`
            display: grid;
            grid-template-columns: ${assetIsValid ? "auto 1fr" : "1fr"};
            align-content: center;
            gap: var(--size-150);
            height: calc(4.25rem - var(--size-150) * 2);
          `}
        >
          {assetIsValid ? (
            <>
              <div>
                <AssetIcon icon={icon} />
              </div>
              <div
                css={css`
                  display: flex;
                  justify-content: space-between;
                `}
              >
                <div
                  className="title"
                  css={css`
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: center;
                  `}
                >
                  <span
                    css={css`
                      font-weight: var(--fw-active);
                      font-size: var(--fs-${symbol ? "medium" : "large"});
                    `}
                  >
                    {label}
                  </span>
                  {symbol && (
                    <span
                      css={css`
                        font-size: var(--fs-small);
                        color: var(--clr-text-neutral);
                        text-transform: uppercase;
                        margin-block-start: var(--size-050);
                      `}
                    >
                      {symbol}
                    </span>
                  )}
                </div>
                <div
                  className="balance"
                  css={css`
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    justify-content: center;
                  `}
                >
                  <span
                    css={css`
                      font-weight: var(--fw-active);
                      font-size: var(--fs-medium);
                    `}
                  >
                    {balanceType === "fiat"
                      ? new Intl.NumberFormat("en-EN", {
                          style: "currency",
                          currency: fiatCurrency,
                        }).format(balance)
                      : balance}
                  </span>
                  <span
                    css={css`
                      font-size: var(--fs-small);
                      color: var(--clr-text-neutral);
                      margin-block-start: var(--size-050);
                    `}
                  >
                    Available
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div
              css={css`
                height: calc(4.25rem - var(--size-150) * 2);
                align-content: center;
              `}
            >
              <p
                css={css`
                  font-size: var(--fs-medium);
                  font-weight: var(--fw-active);
                  color: var(--clr-text);
                  margin-inline-start: var(--size-150);
                `}
              >
                Select asset
              </p>
            </div>
          )}
        </div>
        <div className="icon-wrapper">
          <CaretRight color="var(--clr-icon)" size={20} weight="bold" />
        </div>
      </div>
    </Button>
  );
};

export default AssetSelectButton;
