import {
  MenuTrigger,
  Button as AriaButton,
  Popover,
  Menu,
  MenuItem,
} from "react-aria-components";
import CoinCard from "./CoinCard";

import { css } from "@emotion/react";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  ArrowLineDown,
  DotsThreeVertical,
} from "@phosphor-icons/react";
import { useDispatch } from "react-redux";
import { setReceiveModalOpen, setSendModalOpen } from "@/redux/modalReducers";
import { toggleModal as toggleSwapModal } from "@/features/swap/swapSlice";

const CoinCardList = ({
  coins,
  showOptions = false,
  onCoinSelect,
  showBalance = true,
}) => {
  const dispatch = useDispatch();
  return (
    <ul
      css={css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: var(--size-300);
      `}
    >
      {coins.map((coin, i) => (
        <li
          key={`coin-card-${i}`}
          className="coin-card-wrapper"
          css={css`
            display: grid;
            grid-template-columns: ${showOptions ? "1fr auto" : "1fr"};
            gap: ${showOptions ? "var(--size-200)" : "0"};
            width: 100%;
          `}
        >
          <CoinCard
            title={coin.title}
            type={coin.type}
            currency={coin.currency}
            balance={coin.balance}
            showOptions={showOptions}
            onPress={() => onCoinSelect && onCoinSelect(coin)}
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
                    onAction={() => dispatch(setSendModalOpen(true))}
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
                    onAction={() => dispatch(setReceiveModalOpen(true))}
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
                        toggleSwapModal({ isOpen: true, coin: coin.type })
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
  );
};

export default CoinCardList;
