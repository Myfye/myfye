/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Coin from "./Coin";
import { useMemo } from "react";
import {
  MenuTrigger,
  Popover,
  MenuItem,
  Menu,
  useContextProps,
  ButtonContext,
  Button as AriaButton,
} from "react-aria-components";
// import Button from "@/components/ui/button/Button";
// import Menu from "@/components/ui/menu/Menu";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  ArrowLineDown,
  ArrowLineUp,
  DotsThreeVertical,
} from "@phosphor-icons/react";
import { useDispatch } from "react-redux";
import {
  setDepositModalOpen,
  setReceiveModalOpen,
  setSendModalOpen,
  setWithdrawModalOpen,
} from "@/redux/modalReducers";
import CoinCardController from "./CoinCardController";

const CoinCard = ({
  title,
  currency,
  type,
  balance,
  ref,
  showOptions,
  ...restProps
}) => {
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

  return (
    <CoinCardController {...restProps} ref={ref}>
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
        <Coin type={type} />
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
        </div>
      </div>
    </CoinCardController>
  );
};

export default CoinCard;
