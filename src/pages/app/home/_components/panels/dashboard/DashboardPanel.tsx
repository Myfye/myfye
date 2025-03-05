import Button from "@/components/ui/button/Button";
import {
  ArrowCircleDown as ArrowCircleDownIcon,
  ArrowCircleUp as ArrowCircleUpIcon,
  ArrowLineDown as ArrowLineDownIcon,
  ArrowLineUp as ArrowLineUpIcon,
} from "@phosphor-icons/react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PieChart from "./pie-chart/PieChart";
import BalanceTitle from "../../BalanceTitle";
import CTACarousel from "./cta-carousel/CTACarousel";
import { useEffect, useMemo } from "react";
import DepositModal from "@/pages/app/_components/modals/deposit-modal/DepositModal";
import WithdrawModal from "@/pages/app/_components/modals/withdraw-modal/WithdrawModal";
import SendModal from "@/pages/app/_components/modals/send-modal/SendModal";
import ReceiveModal from "@/pages/app/_components/modals/receive-modal/ReceiveModal";

const DashboardPanel = ({ cryptoBalanceInUSD, cashBalanceInUSD }) => {
  const totalBalance = useMemo(
    () => cryptoBalanceInUSD + cashBalanceInUSD,
    [cryptoBalanceInUSD, cashBalanceInUSD]
  );

  return (
    <div
      className="dashboard-panel"
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        min-height: fit-content;
        height: 100%;
        > * {
          width: 100%;
        }
        padding-bottom: var(--size-250);
      `}
    >
      <section className="balance-container">
        <BalanceTitle balance={totalBalance} />
        <menu
          className="no-scrollbar"
          css={css`
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: var(--controls-gap-small);
            overflow-x: auto;
            padding: 0 var(--size-250);
          `}
        >
          <li>
            <SendModal
              buttonProps={{ size: "small", icon: ArrowCircleUpIcon }}
              title="Send"
            />
          </li>
          <li>
            <ReceiveModal
              buttonProps={{ size: "small", icon: ArrowCircleDownIcon }}
              title="Receive"
            />
          </li>
          <li>
            <DepositModal
              buttonProps={{ size: "small", icon: ArrowLineDownIcon }}
              title="Deposit"
            />
          </li>
          <li>
            <WithdrawModal
              buttonProps={{ size: "small", icon: ArrowLineUpIcon }}
              title="Withdraw"
            />
          </li>
        </menu>
      </section>
      <section
        className="pie-chart-container"
        css={css`
          min-height: ${totalBalance === 0 ? "auto" : "22.75rem"};
          height: ${totalBalance === 0 ? "auto" : "22.75rem"};
          margin-block-start: var(--size-200);
          padding: 0 var(--size-250);
        `}
      >
        {totalBalance === 0 ? (
          <div
            css={css`
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              margin-block-start: var(--size-500);
            `}
          >
            <div
              css={css`
                display: block;
                width: 12rem;
                aspect-ratio: 1;
                background-color: var(--clr-surface);
                border: 1px solid var(--clr-border-neutral);
                border-radius: var(--border-radius-medium);
              `}
            />
            <h2
              className="heading-large"
              css={css`
                margin-block-start: var(--size-400);
              `}
            >
              Get started by depositing funds.
            </h2>
            <Button
              expand
              size="large"
              css={css`
                margin-block-start: var(--size-300);
              `}
            >
              Deposit funds
            </Button>
          </div>
        ) : (
          <div
            className="pie-chart-wrapper"
            css={css`
              width: 100%;
              height: 100%;
            `}
          >
            <PieChart
              data={[
                {
                  id: "Cash",
                  label: "Cash",
                  value: cashBalanceInUSD,
                  color: "var(--clr-green-300)",
                },
                {
                  id: "Crypto",
                  label: "Crypto",
                  value: cryptoBalanceInUSD,
                  color: "var(--clr-green-400)",
                },
              ]}
            ></PieChart>
          </div>
        )}
      </section>
      <section className="cta-carousel-container">
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
        ></CTACarousel>
      </section>
    </div>
  );
};

export default DashboardPanel;
