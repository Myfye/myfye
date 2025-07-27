import Button from "@/shared/components/ui/button/Button";
import WalletCardList from "./_components/WalletCardList.tsx";

import { css } from "@emotion/react";
import { useDispatch } from "react-redux";
import {
  setDepositModalOpen,
  setWithdrawModalOpen,
} from "@/redux/modalReducers.tsx";
import EarnOverlay from "./earn/EarnOverlay.tsx";
import CryptoOverlay from "./crypto/CryptoOverlay.tsx";
import CashOverlay from "./cash/CashOverlay.tsx";
import StocksOverlay from "./stocks/StocksOverlay.tsx";
import { ArrowSquareOut } from "@phosphor-icons/react";
import ButtonGroup from "@/shared/components/ui/button/ButtonGroup.tsx";
import ButtonGroupItem from "@/shared/components/ui/button/ButtonGroupItem.tsx";

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
          padding-block-end: var(--size-200);
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
              height: 2.25rem;
            `}
          >
            Wallet
          </h1>
        </section>
        <section
          css={css`
            padding-inline: var(--size-250);
            margin-block-start: var(--size-200);
          `}
        >
          <WalletCardList />
        </section>
        <section>
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
              margin-block-start: var(--size-250);
            `}
          >
            Show wallet info <ArrowSquareOut size={16} />
          </a>
        </section>
        <section
          css={css`
            margin-block-start: auto;
            margin-inline: var(--size-250);
          `}
        >
          <ButtonGroup size="medium" expand>
            <ButtonGroupItem
              onPress={() => void dispatch(setDepositModalOpen(true))}
            >
              Add money
            </ButtonGroupItem>
            <ButtonGroupItem
              onPress={() => void dispatch(setWithdrawModalOpen(true))}
            >
              Withdraw
            </ButtonGroupItem>
          </ButtonGroup>
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
