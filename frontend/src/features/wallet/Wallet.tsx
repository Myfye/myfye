import BalanceTitle from "@/components/ui/balance-title/BalanceTitle";
import Button from "@/components/ui/button/Button";
import WalletCardList from "./WalletCardList.tsx";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useDispatch } from "react-redux";
import {
  setDepositModalOpen,
  setWithdrawModalOpen,
} from "@/redux/modalReducers.tsx";
import EarnOverlay from "./assets/earn/EarnOverlay.tsx";
import CryptoOverlay from "./assets/crypto/CryptoOverlay.tsx";
import CashOverlay from "./assets/cash/CashOverlay.tsx";
import StocksOverlay from "./assets/stocks/StocksOverlay.tsx";

const Wallet = () => {
  const dispatch = useDispatch();
  return (
    <>
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
        {/* <section>
        <a
          href="/"
          css={css`
            display: flex;
            align-items: center;
            gap: var(--control-gap-medium);
            text-align: center;
            font-size: var(--fs-small);
            line-height: var(--line-height-tight);
            color: var(--clr-text-weaker);
            margin-inline: auto;
            width: fit-content;
            font-weight: var(--fw-active);
          `}
        >
          Show wallet info <ArrowSquareOut size={18} />
        </a>
      </section> */}
        <section
          css={css`
            margin-block-start: var(--size-400);
            margin-block-end: var(--size-250);
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
              onPress={() => void dispatch(setDepositModalOpen(true))}
            >
              Add money
            </Button>
            <Button
              size="medium"
              expand
              onPress={() => void dispatch(setWithdrawModalOpen(true))}
            >
              Withdraw
            </Button>
          </menu>
        </section>
      </div>
      <EarnOverlay />
      <CryptoOverlay />
      <CashOverlay />
      <StocksOverlay />
    </>
  );
};

export default Wallet;
