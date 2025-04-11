import Button from "@/components/ui/button/Button";
import {
  ArrowCircleDown as ArrowCircleDownIcon,
  ArrowCircleUp as ArrowCircleUpIcon,
  ArrowLineDown as ArrowLineDownIcon,
  ArrowLineUp as ArrowLineUpIcon,
} from "@phosphor-icons/react";

import { css } from "@emotion/react";
import PieChart from "../../../../components/ui/pie-chart/PieChart";
import Balance from "../../../../components/ui/balance/Balance";
import CTACarousel from "./cta-carousel/CTACarousel";
import { useMemo } from "react";
import {
  setDepositModalOpen,
  setReceiveModalOpen,
  setSendModalOpen,
  setWithdrawModalOpen,
} from "@/redux/modalReducers";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAssetsBalanceUSD,
  selectAssetsBalanceUSDByGroup,
} from "@/features/wallet/assets/assetsSlice";
import { RootState } from "@/redux/store";
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
        align-items: center;
        min-height: fit-content;
        height: 100%;
        > * {
          width: 100%;
        }
        padding-bottom: var(--size-150);
      `}
    >
      <section
        className="balance-container"
        css={css`
          margin-block-start: var(--size-250);
        `}
      >
        <div
          className="balance-wrapper"
          css={css`
            padding: 0 var(--size-250);
          `}
        >
          <Balance balance={balanceUSD} />
        </div>
        <menu
          className="no-scrollbar"
          css={css`
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: var(--controls-gap-small);
            overflow-x: auto;
            padding: 0 var(--size-250);
            margin-block-start: var(--size-200);
            background-color: var(--clr-surface);
          `}
        >
          <li>
            <Button
              size="x-small"
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
              size="x-small"
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
      <section
        className="pie-chart-container"
        css={css`
          padding-inline: var(--size-250);
        `}
      >
        {balanceUSD === 0 ? (
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
          <PieChart data={pieChartData}></PieChart>
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
