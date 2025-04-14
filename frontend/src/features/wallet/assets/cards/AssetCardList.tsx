import {
  MenuTrigger,
  Button as AriaButton,
  Popover,
  Menu,
  MenuItem,
} from "react-aria-components";
import AssetCard from "./AssetCard";

import { css } from "@emotion/react";
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
import { AbstractedAsset, Asset } from "../types";

const AssetCardList = ({
  assets,
  showOptions = false,
  onAssetSelect,
  showBalance = true,
  showBalanceUSD = true,
  showCurrencySymbol = true,
}: {
  assets: any;
  showOptions?: boolean;
  onAssetSelect?: (asset: Asset) => void;
  showBalance?: boolean;
  showBalanceUSD?: boolean;
  showCurrencySymbol?: boolean;
}) => {
  const dispatch = useDispatch();
  return (
    <div>
      <ul
        css={css`
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: var(--size-300);
        `}
      >
        {assets.map((asset: AbstractedAsset, i) => (
          <li
            key={`asset-card-${i}`}
            className="coin-card-wrapper"
            css={css`
              display: grid;
              grid-template-columns: ${showOptions ? "1fr auto" : "1fr"};
              gap: ${showOptions ? "var(--size-200)" : "0"};
              width: 100%;
            `}
          >
            <AssetCard
              title={asset.label}
              symbol={asset.symbol}
              fiatCurrency={asset.fiatCurrency}
              balance={showBalanceUSD ? asset.balanceUSD : asset.balance}
              showCurrencySymbol={showCurrencySymbol}
              icon={asset.icon}
              showOptions={showOptions}
              onPress={() => onAssetSelect && onAssetSelect(asset)}
              showBalance={showBalance}
            />
            {showOptions && (
              <MenuTrigger>
                <AriaButton>
                  <DotsThreeVertical size={24} />
                </AriaButton>
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
                        dispatch(toggleSendModal({ isOpen: true }))
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
                            abstractedAssetId: asset.id,
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssetCardList;
