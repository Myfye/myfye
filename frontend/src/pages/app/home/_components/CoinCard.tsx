/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import CoinIcon from "./CoinIcon";
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
import Button from "@/components/ui/button/Button";
// import Menu from "@/components/ui/menu/Menu";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  ArrowLineDown,
  ArrowLineUp,
  DotsThree,
  DotsThreeVertical,
} from "@phosphor-icons/react";

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

  const [buttonProps, buttonRef] = useContextProps(
    {
      icon: DotsThreeVertical,
      iconOnly: true,
      size: "small",
      variant: "transparent",
    },
    ref,
    ButtonContext
  );

  return (
    <div
      ref={ref}
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
          display: grid;
          grid-template-columns: 1fr auto;
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
        <MenuTrigger>
          {/* <Button {...buttonProps} ref={buttonRef}></Button> */}
          <AriaButton>
            <DotsThreeVertical size="1.25rem" />
          </AriaButton>
          <Popover placement="bottom end">
            <Menu
              css={css`
                padding: var(--size-075);
                width: 12rem;
                border-radius: var(--border-radius-medium);
                background-color: var(--clr-surface);
                box-shadow: var(--box-shadow-popout);
                overflow: auto;
                font-size: var(--fs-medium);
                user-select: none;
              `}
            >
              <MenuItem
                css={css`
                  display: flex;
                  align-items: center;
                  border-radius: var(--border-radius-medium);
                  padding: var(--size-150) var(--size-150);
                  width: 100%;
                  &[data-hovered="true"] {
                    background-color: var(--clr-surface-raised);
                  }
                `}
                onAction={() => alert("Deposit")}
              >
                <ArrowCircleUp
                  size="1rem"
                  css={css`
                    margin-inline-end: var(--size-100);
                  `}
                />
                Send
              </MenuItem>
              <MenuItem
                css={css`
                  display: flex;
                  align-items: center;
                  border-radius: var(--border-radius-medium);
                  padding: var(--size-150) var(--size-150);
                  width: 100%;
                  &[data-hovered="true"] {
                    background-color: var(--clr-surface-raised);
                  }
                `}
                onAction={() => alert("Withdraw")}
              >
                <ArrowCircleDown
                  size="1rem"
                  css={css`
                    margin-inline-end: var(--size-100);
                  `}
                />
                Receive
              </MenuItem>
              <MenuItem
                css={css`
                  display: flex;
                  align-items: center;
                  border-radius: var(--border-radius-medium);
                  padding: var(--size-150) var(--size-150);
                  width: 100%;
                  &[data-hovered="true"] {
                    background-color: var(--clr-surface-raised);
                  }
                `}
                onAction={() => alert("Send")}
              >
                <ArrowLineDown
                  size="1rem"
                  css={css`
                    margin-inline-end: var(--size-100);
                  `}
                />
                Deposit
              </MenuItem>
              <MenuItem
                css={css`
                  display: flex;
                  align-items: center;
                  border-radius: var(--border-radius-medium);
                  padding: var(--size-150) var(--size-150);
                  width: 100%;
                  &[data-hovered="true"] {
                    background-color: var(--clr-surface-raised);
                  }
                `}
                onAction={() => alert("Receive")}
              >
                <ArrowLineUp
                  size="1rem"
                  css={css`
                    margin-inline-end: var(--size-100);
                  `}
                />
                Withdraw
              </MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>
      </div>
    </div>
  );
};

export default CoinCard;
