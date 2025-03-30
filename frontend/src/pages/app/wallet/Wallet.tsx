import BalanceTitle from "@/components/ui/balance-title/BalanceTitle";
import Button from "@/components/ui/button/Button";
import WalletCardList from "./_components/WalletCardList.tsx";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import useBalance from "@/hooks/useBalance.ts";
import { useDispatch } from "react-redux";
import {
  setDepositModalOpen,
  setWithdrawModalOpen,
} from "@/redux/modalReducers.tsx";
import NumberPad from "@/components/ui/number-pad/NumberPad.tsx";

const Wallet = () => {
  const dispatch = useDispatch();
  const { totalBalanceInUSD } = useBalance();
  return (
    <div
      className="wallet"
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100cqh;
        overflow-y: auto;
        background-color: var(--clr-surface);
      `}
    >
      <section>
        <h1
          className="heading-large"
          css={css`
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            padding-inline: var(--size-250);
            height: var(--size-600);
          `}
        >
          Wallet
        </h1>
      </section>
      <section
        css={css`
          padding-inline: var(--size-250);
          margin-block-start: var(--size-300);
          margin-block-end: auto;
        `}
      >
        <WalletCardList />
      </section>
      <section
        css={css`
          margin-block-start: var(--size-400);
          margin-block-end: var(--size-300);
          margin-inline: var(--size-250);
        `}
      >
        <menu
          css={css`
            display: grid;
            grid-template-columns: 1fr 1fr;
            justify-content: center;
            gap: var(--controls-gap-small);
          `}
        >
          <Button
            size="medium"
            expand
            onPress={() => dispatch(setDepositModalOpen(true))}
          >
            Add money
          </Button>
          <Button
            size="medium"
            expand
            onPress={() => dispatch(setWithdrawModalOpen(true))}
          >
            Withdraw
          </Button>
        </menu>
      </section>
    </div>
  );
};

export default Wallet;
