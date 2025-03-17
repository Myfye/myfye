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
        height: 100cqh;
        overflow-y: auto;
      `}
    >
      <h1
        className="heading-x-large"
        css={css`
          margin-block-start: var(--size-150);
          padding-inline: var(--size-250);
        `}
      >
        Wallet
      </h1>
      <BalanceTitle balance={totalBalanceInUSD} currency="usd" />
      <menu
        css={css`
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: var(--controls-gap-small);
          padding: 0 var(--size-250);
        `}
      >
        <Button
          size="medium"
          onPress={() => dispatch(setDepositModalOpen(true))}
        >
          Add money
        </Button>
        <Button
          size="medium"
          onPress={() => dispatch(setWithdrawModalOpen(true))}
        >
          Withdraw
        </Button>
      </menu>
      <section>
        <h2
          className="heading-large"
          css={css`
            margin-inline: var(--size-250);
            margin-block-start: var(--size-600);
            margin-block-end: var(--size-300);
          `}
        >
          Portfolio
        </h2>
        <WalletCardList
          css={css`
            margin-inline: var(--size-250);
          `}
        />
      </section>
    </div>
  );
};

export default Wallet;
