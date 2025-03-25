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
import BalanceTitle from "../../../../../../components/ui/balance-title/BalanceTitle";
import CTACarousel from "./cta-carousel/CTACarousel";
import { useEffect, useMemo } from "react";
import DepositModal from "@/components/app/modals/deposit-modal/DepositModal";
import WithdrawModal from "@/components/app/modals/withdraw-modal/WithdrawModal";
import SendModal from "@/components/app/modals/send-modal/SendModal";
import ReceiveModal from "@/components/app/modals/receive-modal/ReceiveModal";
import {
  setDepositModalOpen,
  setReceiveModalOpen,
  setSendModalOpen,
  setWithdrawModalOpen,
} from "@/redux/modalReducers";
import { useDispatch } from "react-redux";

const DashboardPanel = ({ cryptoBalanceInUSD, cashBalanceInUSD }) => {
  const dispatch = useDispatch();
  const totalBalance = useMemo(
    () => cryptoBalanceInUSD + cashBalanceInUSD,
    [cryptoBalanceInUSD, cashBalanceInUSD]
  );

  const pieChartData = useMemo(() => {
    const data = [];
    if (cashBalanceInUSD > 0) {
      const cashData = {
        id: "Cash",
        label: "Cash",
        value: cashBalanceInUSD,
        color: "var(--clr-pie-chart-1)",
      };
      data.push(cashData);
    }
    if (cryptoBalanceInUSD > 0) {
      const cryptoData = {
        id: "Crypto",
        label: "Crypto",
        value: cryptoBalanceInUSD,
        color: "var(--clr-pie-chart-2)",
      };
      data.push(cryptoData);
    }
    return data;
  });

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
      <section
        className="balance-container"
        css={css`
          margin-block-start: var(--size-150);
        `}
      >
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
            margin-block-start: var(--size-250);
          `}
        >
          <li>
            <Button
              size="small"
              icon={ArrowCircleUpIcon}
              onPress={() => {
                dispatch(setSendModalOpen(true));
              }}
            >
              Send
            </Button>
          </li>
          <li>
            <Button
              size="small"
              icon={ArrowCircleDownIcon}
              onPress={() => {
                dispatch(setReceiveModalOpen(true));
              }}
            >
              Receive
            </Button>
          </li>
          <li>
            <Button
              size="small"
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
              size="small"
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
      <section
        className="pie-chart-container"
        css={css`
          min-height: ${totalBalance === 0 ? "auto" : "20rem"};
          height: ${totalBalance === 0 ? "auto" : "20rem"};
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
            <PieChart data={pieChartData}></PieChart>
          </div>
        )}
      </section>
      <section className="cta-carousel-container" css={css``}>
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
