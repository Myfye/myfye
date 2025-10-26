import WalletCardList from "./_components/WalletCardList.tsx";

import { css } from "@emotion/react";
import EarnOverlay from "./earn/EarnOverlay.tsx";
import CryptoOverlay from "./crypto/CryptoOverlay.tsx";
import CashOverlay from "./cash/CashOverlay.tsx";
import StocksOverlay from "./stocks/StocksOverlay.tsx";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import ButtonGroup from "@/shared/components/ui/button/ButtonGroup.tsx";
import ButtonGroupItem from "@/shared/components/ui/button/ButtonGroupItem.tsx";
import { useRef } from "react";
import { usePullToRefresh } from "@/features/pull-to-refresh/usePullToRefresh.ts";
import PullToRefreshIndicator from "@/features/pull-to-refresh/PullToRefreshIndicator.tsx";
import getSolanaBalances from "@/functions/GetSolanaBalances.tsx";
import { useSolanaWallets } from "@privy-io/react-auth";
import { toggleModal as toggleDepositModal } from "@/features/onOffRamp/deposit/depositSlice.ts";
import { toggleModal as toggleWithdrawModal } from "@/features/onOffRamp/withdraw/withdrawSlice.ts";
import AppPage from "@/shared/components/layout/page/AppPage.tsx";
import PullToRefreshScrollContainer from "@/features/pull-to-refresh/PullToRefreshScrollContainer.tsx";
import Section from "@/shared/components/layout/section/Section.tsx";
import AppPageHeading from "@/shared/components/ui/text/AppPageHeading.tsx";
import Stack from "@/shared/components/ui/primitives/stack/Stack.tsx";
import { useAppDispatch } from "@/redux/hooks.tsx";

const Wallet = () => {
  const ref = useRef<HTMLDivElement>(null!);
  const dispatch = useAppDispatch();
  const { wallets } = useSolanaWallets();
  const solanaAddress = wallets[0].address;

  const { spinnerParams, pullMargin } = usePullToRefresh({
    onRefresh: async () => {
      await getSolanaBalances(solanaAddress, dispatch);
    },
    container: ref,
  });

  return (
    <>
      <AppPage>
        <PullToRefreshIndicator style={spinnerParams} />
        <PullToRefreshScrollContainer ref={ref} pullMargin={pullMargin}>
          <Stack
            gap="none"
            alignInline="start"
            isolate="last"
            isolateMargin="var(--size-200)"
            minHeight="100cqh"
          >
            <Section as="section">
              <AppPageHeading>Wallet</AppPageHeading>
              <div
                css={css`
                  margin-block-start: var(--size-100);
                `}
              >
                <WalletCardList />
              </div>
              <a
                href={`https://solscan.io/account/${solanaAddress}`}
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
                  margin-block-start: var(--size-300);
                  margin-block-end: var(--size-200);
                `}
              >
                Show wallet info <ArrowSquareOutIcon size={16} />
              </a>
            </Section>
            <Section marginBottom="var(--size-200)">
              <ButtonGroup expand>
                <ButtonGroupItem
                  onPress={() => dispatch(toggleDepositModal(true))}
                >
                  Add money
                </ButtonGroupItem>
                <ButtonGroupItem
                  onPress={() => dispatch(toggleWithdrawModal(true))}
                >
                  Withdraw
                </ButtonGroupItem>
              </ButtonGroup>
            </Section>
          </Stack>
        </PullToRefreshScrollContainer>
      </AppPage>
      <EarnOverlay />
      <CryptoOverlay />
      <CashOverlay />
      <StocksOverlay />
    </>
  );
};

export default Wallet;
