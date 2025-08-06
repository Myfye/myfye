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
import { useRef } from "react";
import { usePullToRefresh } from "@/features/pull-to-refresh/usePullToRefresh.ts";
import PullToRefreshIndicator from "@/features/pull-to-refresh/PullToRefreshIndicator.tsx";
import getSolanaBalances from "@/functions/GetSolanaBalances.tsx";
import { useSolanaWallets } from "@privy-io/react-auth";
import { motion } from "motion/react";

const Wallet = () => {
  const ref = useRef<HTMLDivElement>(null!);
  const { wallets } = useSolanaWallets();
  const dispatch = useDispatch();
  const solanaAddress = wallets[0].address;

  const { spinnerParams, pullMargin } = usePullToRefresh({
    onRefresh: async () => {
      await getSolanaBalances(solanaAddress, dispatch);
    },
    container: ref,
  });

  return (
    <>
      <div
        className="wallet"
        css={css`
          display: grid;
          position: relative;
          height: 100cqh;
          background-color: var(--clr-surface);
          position: relative;
        `}
      >
        <PullToRefreshIndicator style={spinnerParams} />
        <motion.div
          className="no-scrollbar"
          ref={ref}
          style={{ marginTop: pullMargin }}
          css={css`
            z-index: 1;
            grid-row: 1 / -1;
            grid-column: 1 / -1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow-y: auto;
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
                margin-block-end: var(--size-200);
              `}
            >
              Show wallet info <ArrowSquareOut size={16} />
            </a>
          </section>
          <section
            css={css`
              margin-block-start: auto;
              margin-inline: var(--size-250);
              padding-block-end: var(--size-200);
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
        </motion.div>
      </div>
      <EarnOverlay />
      <CryptoOverlay />
      <CashOverlay />
      <StocksOverlay />
    </>
  );
};

export default Wallet;
