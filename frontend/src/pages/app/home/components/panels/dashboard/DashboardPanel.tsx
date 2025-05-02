import Button from "@/shared/components/ui/button/Button";
import {
  ArrowCircleDown as ArrowCircleDownIcon,
  ArrowCircleUp as ArrowCircleUpIcon,
  ArrowLineDown as ArrowLineDownIcon,
  ArrowLineUp as ArrowLineUpIcon,
} from "@phosphor-icons/react";

import { css } from "@emotion/react";
import CTACarousel from "./cta-carousel/CTACarousel";
import { useMemo } from "react";
import {
  setDepositModalOpen,
  setWithdrawModalOpen,
} from "@/redux/modalReducers";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAssetsBalanceUSD,
  selectAssetsBalanceUSDByGroup,
} from "@/features/assets/assetsSlice";
import { RootState } from "@/redux/store";
import { toggleModal as toggleSwapModal } from "@/features/swap/swapSlice";
import { toggleModal as toggleSendModal } from "@/features/send/sendSlice";
import { toggleModal as toggleReceiveModal } from "@/features/receive/receiveSlice";
import BalanceCard from "@/shared/components/ui/balance/BalanceCard";
import PieChartCard from "@/shared/components/ui/pie-chart/PieChartCard";
import Section from "@/shared/components/ui/section/Section";
const DashboardPanel = ({}) => {
  const dispatch = useDispatch();

  const balanceUSD = useSelector(selectAssetsBalanceUSD);

  const cashBalanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "cash")
  );
  const earnBalanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "earn")
  );
  const cryptoBalanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "crypto")
  );
  const stocksBalanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "stocks")
  );

  const pieChartData = useMemo(() => {
    const data = [];
    if (cashBalanceUSD > 0 || earnBalanceUSD > 0) {
      const cashData = {
        id: "Cash",
        label: "Cash",
        value: cashBalanceUSD + earnBalanceUSD,
        color: "var(--clr-pie-chart-usdt)",
      };
      data.push(cashData);
    }
    if (cryptoBalanceUSD > 0) {
      const cryptoData = {
        id: "Crypto",
        label: "Crypto",
        value: cryptoBalanceUSD,
        color: "var(--clr-pie-chart-btc)",
      };
      data.push(cryptoData);
    }
    if (stocksBalanceUSD > 0) {
      const stocksData = {
        id: "Stocks",
        label: "Stocks",
        value: stocksBalanceUSD,
        color: "var(--clr-pie-chart-btc)",
      };
      data.push(stocksData);
    }
    return data;
  }, [cashBalanceUSD, earnBalanceUSD, cryptoBalanceUSD, stocksBalanceUSD]);

  return (
    <div
      className="dashboard-panel"
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100cqh;
        padding-block-start: var(--size-200);
        padding-block-end: var(--size-100);
        gap: var(--size-200);
        overflow: hidden;
      `}
    >
      <section
        css={css`
          display: flex;
          flex-direction: column;
        `}
      >
        <section
          css={css`
            padding-inline: var(--size-250);
          `}
        >
          <BalanceCard balance={balanceUSD} />
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
                icon={ArrowCircleUpIcon}
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
              margin-block-start: var(--size-300);
              padding-inline: var(--size-250);
            `}
          >
            <div
              css={css`
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin-block-start: var(--size-200);
              `}
            >
              <div
                css={css`
                  display: block;
                  width: 6rem;
                  aspect-ratio: 1;
                  background-color: var(--clr-surface);
                  border: 1px solid var(--clr-border-neutral);
                  border-radius: var(--border-radius-medium);
                `}
              />
              <h2
                className="heading-large"
                css={css`
                  margin-block-start: var(--size-300);
                `}
              >
                Get started by depositing funds.
              </h2>
              <div
                css={css`
                  width: 100%;
                  margin-block-start: var(--size-200);
                `}
              >
                <Button expand>Deposit funds</Button>
              </div>
            </div>
          </section>
        ) : (
          <Section
            title="Portfolio Summary"
            css={css`
              margin-block-start: var(--size-300);
              padding-inline: var(--size-250);
            `}
          >
            <PieChartCard data={pieChartData} />
          </Section>
        )}
      </section>
      <section>
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
