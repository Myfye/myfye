import Button from "@/components/ui/button/Button";
import {
  ArrowCircleDown as ArrowCircleDownIcon,
  ArrowCircleUp as ArrowCircleUpIcon,
  ArrowLineDown as ArrowLineDownIcon,
  ArrowLineUp as ArrowLineUpIcon,
} from "@phosphor-icons/react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PieChart from "../../../../../../components/ui/pie-chart/PieChart";
import BalanceTitle from "../../../../../../components/ui/balance-title/BalanceTitle";
import CTACarousel from "./cta-carousel/CTACarousel";
import { useMemo } from "react";
import {
  setDepositModalOpen,
  setReceiveModalOpen,
  setSendModalOpen,
  setWithdrawModalOpen,
} from "@/redux/modalReducers";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
const DashboardPanel = ({}) => {
  const dispatch = useDispatch();

    // Blockchain Data
    const usdcSolBalance = useSelector((state: any) => state.userWalletData.usdcSolBalance);
    const usdtSolBalance = useSelector((state: any) => state.userWalletData.usdtSolBalance);
    const eurcSolBalance = useSelector((state: any) => state.userWalletData.eurcSolBalance);
    const usdySolBalance = useSelector((state: any) => state.userWalletData.usdySolBalance);
    const btcSolBalance = useSelector((state: any) => state.userWalletData.btcSolBalance);
    const priceOfUSDYinUSDC = useSelector((state: any) => state.userWalletData.priceOfUSDYinUSDC);
    const priceOfBTCinUSDC = useSelector((state: any) => state.userWalletData.priceOfBTCinUSDC);
    const priceOfEURCinUSDC = useSelector((state: any) => state.userWalletData.priceOfEURCinUSDC);
  
    const cashBalanceInUSD = usdtSolBalance + usdcSolBalance;

    const cryptoBalanceInUSD = (btcSolBalance * priceOfBTCinUSDC) // TO DO add solana
  
    const totalBalance = useMemo(
      () => cashBalanceInUSD + 
        (eurcSolBalance * priceOfEURCinUSDC) + 
        (usdySolBalance * priceOfUSDYinUSDC) + 
        (btcSolBalance * priceOfBTCinUSDC)
    );

  const pieChartData = useMemo(() => {
    const data = [];
    if (cashBalanceInUSD > 0) {
      const cashData = {
        id: "Cash",
        label: "Cash",
        value: cashBalanceInUSD,
        color: "var(--clr-pie-chart-usdt)",
      };
      data.push(cashData);
    }
    if (cryptoBalanceInUSD > 0) {
      const cryptoData = {
        id: "Crypto",
        label: "Crypto",
        value: cryptoBalanceInUSD,
        color: "var(--clr-pie-chart-btc)",
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
          <BalanceTitle balance={totalBalance} />
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
        {totalBalance === 0 ? (
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
