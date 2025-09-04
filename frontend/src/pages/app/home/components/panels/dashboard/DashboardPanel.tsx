import Button from "@/shared/components/ui/button/Button";
import {
  ArrowCircleDownIcon,
  ArrowCircleUpIcon,
  ArrowLineDownIcon,
  ArrowLineUpIcon,
  ArrowsDownUpIcon,
} from "@phosphor-icons/react";
import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { selectAssetsBalanceUSD } from "@/features/assets/assetsSlice";
import { toggleModal as toggleSendModal } from "@/features/send/sendSlice";
import { toggleModal as toggleReceiveModal } from "@/features/receive/receiveSlice";
import { toggleModal as toggleSwapModal } from "@/features/swap/swapSlice";
import { toggleModal as toggleDepositModal } from "@/features/onOffRamp/deposit/depositSlice";
import { toggleModal as toggleWithdrawModal } from "@/features/onOffRamp/withdraw/withdrawSlice";
import BalanceCard from "@/shared/components/ui/balance/BalanceCard";
import ChartTabs from "./chart_tabs/ChartTabs";
import PortfolioTab from "./chart_tabs/Portfolio";
import Portfolio from "./chart_tabs/Portfolio";
import CTACarousel from "./cta-carousel/CTACarousel";

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
              icon={ArrowsDownUpIcon}
              onPress={() => {
                console.log("opening swap modal");
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
                dispatch(toggleDepositModal(true));
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
                dispatch(toggleWithdrawModal(true));
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
              padding-inline: var(--size-200);
              padding-block: var(--size-400);
              border-radius: var(--border-radius-medium);
              background-color: var(--clr-surface-raised);
              width: 100%;
            `}
          >
            <h2
              className="heading-large"
              css={css`
                text-align: center;
              `}
            >
              Get started by depositing funds
            </h2>
            <Button
              expand
              onPress={() => {
                dispatch(toggleDepositModal(true));
              }}
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
            margin-block-start: var(--size-300);
          `}
        >
          <Portfolio />
        </section>
      )}
      <section
        className="cta-carousel-container"
        css={css`
          margin-block-start: auto;
        `}
      >
        <CTACarousel
          slides={[
            {
              title: "Create a savings account",
              subtitle: "Earn 4.1% APY with US Treasury Bonds",
              icon: "test",
              action: () => {},
            },
            {
              title: "Open a retirement account",
              subtitle:
                "Instantly invest in the top 100 listed companies on the NASDAQ",
              icon: "test",
              action: () => {},
            },
            {
              title: "Buy Bitcoin",
              subtitle: "Crypto made easy. Buy bitcoin instantly",
              icon: "test",
              action: () => {},
            },
          ]}
        />
      </section>
    </div>
  );
};

export default DashboardPanel;
