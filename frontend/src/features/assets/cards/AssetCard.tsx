import { css } from "@emotion/react";
import AssetIcon from "../AssetIcon";
import { HTMLAttributes, RefObject, useState } from "react";

import { formatBalance } from "../utils";
import { AbstractedAsset, Asset } from "../types";
import { useSelector } from "react-redux";

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
  DotsThreeVertical,
} from "@phosphor-icons/react";
import { useDispatch } from "react-redux";
import { toggleModal as toggleSwapModal } from "@/features/swap/swapSlice";
import { toggleModal as toggleSendModal } from "@/features/send/sendSlice";
import { toggleModal as toggleReceiveModal } from "@/features/receive/receiveSlice";
import { toggleModal as toggleKYCModal } from "@/features/compliance/kycSlice";
import { RootState } from "@/redux/store";

interface AssetCardProps extends HTMLAttributes<HTMLDivElement> {
  id: AbstractedAsset["id"];
  title: AbstractedAsset["label"];
  fiatCurrency: Asset["fiatCurrency"];
  symbol: AbstractedAsset["symbol"];
  groupId?: AbstractedAsset["groupId"];
  balance: number;
  ref?: RefObject<HTMLButtonElement>;
  icon: AbstractedAsset["icon"];
  showOptions?: boolean;
  showBalance?: boolean;
  showCurrencySymbol?: boolean;
  radio?: boolean;
  isSelected?: boolean;
}

const AssetCard = ({
  id,
  title,
  fiatCurrency,
  symbol,
  groupId,
  balance,
  icon,
  ref,
  showOptions,
  showBalance,
  showCurrencySymbol = true,
  radio,
  isSelected,
  ...restProps
}: AssetCardProps) => {
  const [showKYCOverlay, setShowKYCOverlay] = useState(false);
  const formattedBalance = formatBalance(balance, fiatCurrency);

  const dispatch = useDispatch();
  const currentUserKYCVerified = useSelector(
    (state: RootState) => state.userWalletData.currentUserKYCVerified
  );

  const handleSwapClick = () => {
    /*
    if (!currentUserKYCVerified) {
      console.log("opening KYC modal");
      dispatch(toggleKYCModal({ isOpen: true }));
    } else {
      console.log("opening swap modal");
      dispatch(
        toggleSwapModal({
          isOpen: true,
          abstractedAssetId: id,
        })
      );
    }
      */

    console.log("opening swap modal");
    dispatch(
      toggleSwapModal({
        isOpen: true,
        abstractedAssetId: id,
      })
    );
  };

  const handleReceiveClick = () => {
    if (!currentUserKYCVerified) {
      console.log("opening KYC modal");
      dispatch(toggleKYCModal({ isOpen: true }));
    } else {
      console.log("opening receive modal");
      dispatch(toggleReceiveModal(true));
    }
  };

  return (
    <div
      className="asset-card"
      css={css`
        display: grid;
        grid-template-columns: ${showOptions ? "1fr auto" : "1fr"};
        align-items: center;
        gap: ${showOptions ? "var(--size-200)" : 0};
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
          outline: 2px solid var(--clr-primary);
          outline-offset: -2px;
          position: absolute;
          inset: 0;
          margin: auto;
          width: 100%;
          height: 100%;
          border-radius: var(--border-radius-medium);
        }
      `}
      {...restProps}
    >
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
              {groupId !== "crypto" && groupId !== "stocks" && (
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
              )}
              {groupId !== "crypto" && groupId !== "stocks" && (
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
                  onAction={handleReceiveClick}
                >
                  <ArrowCircleDown
                    size={16}
                    css={css`
                      margin-inline-end: var(--size-100);
                    `}
                  />
                  Receive
                </MenuItem>
              )}
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
                onAction={handleSwapClick}
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
