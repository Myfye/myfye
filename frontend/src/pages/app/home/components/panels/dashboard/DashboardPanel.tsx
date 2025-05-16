import Button from "@/shared/components/ui/button/Button";
import {
  ArrowCircleDown as ArrowCircleDownIcon,
  ArrowCircleUp as ArrowCircleUpIcon,
  ArrowLineDown as ArrowLineDownIcon,
  ArrowLineUp as ArrowLineUpIcon,
  ArrowsDownUp,
} from "@phosphor-icons/react";
import { css } from "@emotion/react";
import CTACarousel from "./cta-carousel/CTACarousel";
import {
  setDepositModalOpen,
  setWithdrawModalOpen,
} from "@/redux/modalReducers";
import { useDispatch, useSelector } from "react-redux";
import { selectAssetsBalanceUSD } from "@/features/assets/assetsSlice";
import { toggleModal as toggleSendModal } from "@/features/send/sendSlice";
import { toggleModal as toggleReceiveModal } from "@/features/receive/receiveSlice";
import { toggleModal as toggleSwapModal } from "@/features/swap/swapSlice";
import BalanceCard from "@/shared/components/ui/balance/BalanceCard";
import ChartTabs from "./chart_tabs/ChartTabs";
const DashboardPanel = ({}) => {
  const dispatch = useDispatch();

  const balanceUSD = useSelector(selectAssetsBalanceUSD);

  return (
    <div
      className="dashboard-panel"
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        height: 100%;
        > * {
          width: 100%;
        }
        padding-bottom: var(--size-100);
      `}
    >
      <section
        css={css`
          margin-block-start: var(--size-200);
          padding-inline: var(--size-250);
        `}
      >
        <BalanceCard balance={balanceUSD}></BalanceCard>
      </section>
      <section
        css={css`
          margin-block-start: var(--size-200);
        `}
      >
        <menu
          className="no-scrollbar"
          css={css`
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: var(--controls-gap-small);
            overflow-x: auto;
            padding-inline: var(--size-250);
          `}
        >
          <li>
            <Button
              size="x-small"
              icon={ArrowsDownUp}
              onPress={() => {
                dispatch(toggleSwapModal({ isOpen: true }));
              }}
            >
              Swap
            </Button>
          </li>
          <li>
            <Button
              size="x-small"
              icon={ArrowCircleUpIcon}
              onPress={() => {
                dispatch(toggleSendModal({ isOpen: true }));
              }}
            >
              Send
            </Button>
          </li>
          <li>
            <Button
              size="x-small"
              icon={ArrowCircleDownIcon}
              onPress={() => {
                dispatch(toggleReceiveModal(true));
              }}
            >
              Receive
            </Button>
          </li>
          <li>
            <Button
              size="x-small"
              icon={ArrowLineUpIcon}
              onPress={() => {
                dispatch(setDepositModalOpen(true));
              }}
            >
              Deposit
            </Button>
          </li>
          <li>
            <Button
              size="x-small"
              icon={ArrowLineDownIcon}
              onPress={() => {
                dispatch(setWithdrawModalOpen(true));
              }}
            >
              Withdraw
            </Button>
          </li>
        </menu>
      </section>
      {balanceUSD === 0 ? (
        <section
          css={css`
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            padding-inline: var(--size-250);
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            `}
          >
            <h2 className="heading-large">Get started by depositing funds.</h2>
            <Button
              expand
              onPress={() => {}}
              css={css`
                margin-block-start: var(--size-300);
              `}
            >
              Deposit funds
            </Button>
          </div>
        </section>
      ) : (
        <section
          css={css`
            margin-block-start: max(var(--size-200), 4vh);
          `}
        >
          <ChartTabs />
        </section>
      )}
      {/* <section
        className="cta-carousel-container"
        css={css`
          margin-block-start: auto;
        `}
      >
        <CTACarousel
          slides={[
            {
              title: "Earn up to 4.6% APY with USDY",
              subtitle: "Invest with ONDO US Dollar Yield (USDY)",
              icon: "test",
            },
            { title: "Test", subtitle: "test", icon: "test" },
            { title: "Test", subtitle: "test", icon: "test" },
            { title: "Test", subtitle: "test", icon: "test" },
          ]}
        />
      </section> */}
    </div>
  );
};

export default DashboardPanel;
