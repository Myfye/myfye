/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import Overlay from "@/components/ui/overlay/Overlay";
import BalanceTitle from "@/components/ui/balance-title/BalanceTitle";
import useBalance from "@/hooks/useBalance";
import PieChart from "@/components/ui/pie-chart/PieChart";
import { useEffect, useMemo } from "react";
import Button from "@/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  setDepositModalOpen,
  setReceiveModalOpen,
  setSendModalOpen,
  setWithdrawModalOpen,
} from "@/redux/modalReducers";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  ArrowLineDown,
  ArrowLineUp,
  ArrowsLeftRight,
} from "@phosphor-icons/react";
import CoinCardList from "@/components/ui/coin-card/CoinCardList";

const EarnSummaryOverlay = ({ isOpen, onOpenChange }) => {
  const { cashBalanceInUSD, usdyBalanceInUSD, eurcBalanceInUSD } = useBalance();

  const dispatch = useDispatch();

  // USDT
  const usdtSolBalance = useSelector(
    (state: any) => state.userWalletData.usdtSolBalance
  );

  // EURC
  const eurcSolBalance = useSelector(
    (state: any) => state.userWalletData.eurcSolBalance
  );

  const coins = useMemo(
    () => [
      {
        title: "US Dollar",
        currency: "usd",
        type: "usdt",
        balance: usdtSolBalance,
      },
      {
        title: "Euro",
        currency: "eur",
        type: "eurc",
        balance: eurcSolBalance,
      },
      {
        title: "US Treasury Bonds",
        currency: "usd",
        type: "usdy",
        balance: usdyBalanceInUSD,
      },
    ],
    [usdtSolBalance, usdyBalanceInUSD, eurcSolBalance]
  );

  const pieChartData = useMemo(() => {
    const data = [];
    if (usdtSolBalance > 0) {
      const usdtData = {
        id: "USD",
        label: "USD",
        value: usdtSolBalance,
        color: "var(--clr-pie-chart-usdt)",
      };
      data.push(usdtData);
    }
    if (eurcBalanceInUSD > 0) {
      const eurcData = {
        id: "Euros",
        label: "Euros",
        value: eurcBalanceInUSD,
        color: "var(--clr-pie-chart-eurc)",
      };
      data.push(eurcData);
    }
    if (usdyBalanceInUSD > 0) {
      const usdyData = {
        id: "US Treasury Bonds",
        label: "US Treasury Bonds",
        value: usdyBalanceInUSD,
        color: "var(--clr-pie-chart-usdy)",
      };
      data.push(usdyData);
    }
    return data;
  }, [usdyBalanceInUSD, eurcBalanceInUSD, usdtSolBalance]);

  return (
    <>
      <Overlay isOpen={isOpen} onOpenChange={onOpenChange} title="Earn">
        {usdyBalanceInUSD === 0 &&
        eurcBalanceInUSD === 0 &&
        usdtSolBalance === 0 ? (
          <div
            css={css`
              display: grid;
              place-items: center;
              height: 100%;
            `}
          >
            <section>
              <hgroup
                css={css`
                  text-align: center;
                `}
              >
                <p className="heading-large">Deposit cash</p>
                <p className="caption-medium">Lorem ipsum dolor</p>
              </hgroup>
              <Button>Deposit cash</Button>
            </section>
          </div>
        ) : (
          <>
            <section
              className="balance-container"
              css={css`
                margin-block-start: var(--size-150);
              `}
            >
              <div
                className="balance-wrapper"
                css={css`
                  padding: 0 var(--size-250);
                `}
              >
                <BalanceTitle balance={cashBalanceInUSD} />
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
                  margin-block-start: var(--size-250);
                  background-color: var(--clr-surface);
                `}
              >
                <li>
                  <Button
                    size="x-small"
                    icon={ArrowCircleUp}
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
                    icon={ArrowCircleDown}
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
                    icon={ArrowsLeftRight}
                    onPress={() => {
                      dispatch(setDepositModalOpen(true));
                    }}
                  >
                    Swap
                  </Button>
                </li>
              </menu>
            </section>
            <section className="pie-chart-container">
              <PieChart data={pieChartData} type="earn"></PieChart>
            </section>
            <section
              css={css`
                margin-inline: var(--size-250);
              `}
            >
              <CoinCardList coins={coins} showOptions={true} />
            </section>
          </>
        )}
      </Overlay>
    </>
  );
};

export default EarnSummaryOverlay;
