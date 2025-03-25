import {
  MenuTrigger,
  Button as AriaButton,
  Popover,
  Menu,
  MenuItem,
} from "react-aria-components";
import CoinCard from "./CoinCard";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
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
import { addCurrentCoin } from "@/redux/coinReducer";

const CoinCardList = ({ coins, showOptions = false, onCoinSelect }) => {
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
          className="coin-card-wrapper"
          css={css`
            display: grid;
            grid-template-columns: ${showOptions ? "1fr auto" : "1fr"};
            gap: ${showOptions ? "var(--size-200)" : "0"};
            width: 100%;
          `}
          key={`coin-card-${i}`}
        >
          <CoinCard
            title={coin.title}
            type={coin.type}
            currency={coin.currency}
            balance={coin.balance}
            showOptions={showOptions}
            onPress={() => onCoinSelect && onCoinSelect(coin)}
          />
          {showOptions && (
            <MenuTrigger>
              {/* <Button {...buttonProps} ref={buttonRef}></Button> */}
              <AriaButton>
                <DotsThreeVertical size={24} />
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
                      dispatch(addCurrentCoin(coin));
                      dispatch(setDepositModalOpen(true));
                    }}
                  >
                    <ArrowLineDown
                      size={16}
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
                    onAction={() => {
                      dispatch(addCurrentCoin(coin));
                      dispatch(setWithdrawModalOpen(true));
                    }}
                  >
                    <ArrowLineUp
                      size={16}
                      css={css`
                        margin-inline-end: var(--size-100);
                      `}
                    />
                    Withdraw
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
