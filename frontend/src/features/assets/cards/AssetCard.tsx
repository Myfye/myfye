import { css } from "@emotion/react";
import AssetIcon from "../AssetIcon";
import { RefObject } from "react";

// import Button from "@/components/ui/button/Button";
// import Menu from "@/components/ui/menu/Menu";

import AssetCardController from "./AssetCardController";
import { formatBalance } from "../utils";
import { AbstractedAsset, Asset } from "../types";

import {
  MenuTrigger,
  Button as AriaButton,
  Popover,
  Menu,
  MenuItem,
  Button,
} from "react-aria-components";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  ArrowLineDown,
  Check,
  CheckCircle,
  DotsThreeVertical,
} from "@phosphor-icons/react";
import { useDispatch } from "react-redux";
import { toggleModal as toggleSwapModal } from "@/features/swap/swapSlice";
import { toggleModal as toggleSendModal } from "@/features/send/sendSlice";
import { toggleModal as toggleReceiveModal } from "@/features/receive/receiveSlice";

const AssetCard = ({
  id,
  title,
  fiatCurrency,
  symbol,
  balance,
  icon,
  ref,
  showOptions,
  showBalance,
  showCurrencySymbol = true,
  radio,
  isSelected,
  ...restProps
}: {
  id: AbstractedAsset["id"];
  title: AbstractedAsset["label"];
  fiatCurrency: Asset["fiatCurrency"];
  symbol: AbstractedAsset["symbol"];
  balance: number;
  ref: RefObject<HTMLButtonElement>;
  icon: AbstractedAsset["icon"];
  showOptions: boolean;
  showBalance: boolean;
  showCurrencySymbol?: boolean;
  radio?: boolean;
  isSelected?: boolean;
}) => {
  const formattedBalance = formatBalance(balance, fiatCurrency);

  const dispatch = useDispatch();

  return (
    <div
      className="asset-card"
      css={css`
        display: grid;
        grid-template-columns: ${showOptions
          ? "1fr auto"
          : radio
          ? "auto 1fr"
          : "1fr"};
        align-items: center;
        gap: ${showOptions ? "var(--size-200)" : radio ? "var(--size-150)" : 0};
        width: 100%;
        background-color: ${isSelected
          ? "var(--clr-green-100)"
          : "var(--clr-surface-raised)"};
        padding: var(--size-150);
        border-radius: var(--border-radius-medium);
        height: 4.25rem;
        position: relative;
        &::before {
          content: "";
          display: ${isSelected ? "block" : "none"};
          outline: 2px solid var(--clr-accent);
          outline-offset: -2px;
          position: absolute;
          inset: 0;
          margin: auto;
          width: 100%;
          height: 100%;
          border-radius: var(--border-radius-medium);
        }
      `}
    >
      {radio && (
        <div
          css={css`
            display: grid;
            place-items: center;
            width: var(--size-250);
            aspect-ratio: 1;
            border-radius: var(--border-radius-circle);
            border: 1px solid
              ${isSelected ? "var(--clr-accent)" : "var(--clr-neutral-300)"};
            background-color: ${isSelected
              ? "var(--clr-accent)"
              : "transparent"};
          `}
        >
          {isSelected && (
            <Check
              weight="bold"
              color="var(--clr-white)"
              size={12}
              css={css`
                position: absolute;
                z-index: 1;
              `}
            />
          )}
        </div>
      )}
      <div
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
            align-content: center;
            gap: var(--size-150);
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
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;
              `}
            >
              <p
                css={css`
                  font-weight: var(--fw-active);
                  font-size: var(--fs-medium);
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
                {symbol}
              </p>
            </div>
            {showBalance && (
              <p
                css={css`
                  font-weight: var(--fw-active);
                  font-size: var(--fs-medium);
                `}
              >
                {showCurrencySymbol ? formattedBalance : balance}
              </p>
            )}
          </div>
        </div>
      </div>
      {showOptions && (
        <MenuTrigger>
          <Button
            css={css`
              display: grid;
              place-items: center;
              width: 2rem;
              height: 2rem;
              border-radius: var(--border-radius-circle);
              border: 1px solid var(--clr-neutral-300);
            `}
          >
            <DotsThreeVertical size={20} />
          </Button>
          <Popover placement="bottom end">
            <Menu
              css={css`
                padding: var(--size-075);
                width: 12rem;
                border-radius: var(--border-radius-medium);
                background-color: var(--clr-surface-raised);
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
                onAction={() =>
                  dispatch(
                    toggleSendModal({ isOpen: true, abstractedAssetId: id })
                  )
                }
              >
                <ArrowCircleUp
                  size={16}
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
                onAction={() => dispatch(toggleReceiveModal(true))}
              >
                <ArrowCircleDown
                  size={16}
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
                onAction={() => {
                  dispatch(
                    toggleSwapModal({
                      isOpen: true,
                      abstractedAssetId: id,
                    })
                  );
                }}
              >
                <ArrowLineDown
                  size={16}
                  css={css`
                    margin-inline-end: var(--size-100);
                  `}
                />
                Swap
              </MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>
      )}
    </div>
  );
};

export default AssetCard;
