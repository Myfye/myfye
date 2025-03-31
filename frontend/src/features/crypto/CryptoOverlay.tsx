/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import Overlay from "@/components/ui/overlay/Overlay";
import BalanceTitle from "@/components/ui/balance-title/BalanceTitle";
import useBalance from "@/hooks/useBalance";
import PieChart from "@/components/ui/pie-chart/PieChart";
import { useEffect, useMemo } from "react";
import Button from "@/components/ui/button/Button";
import { useDispatch } from "react-redux";
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

const CryptoOverlay = ({ isOpen, onOpenChange }) => {
  const { cryptoBalanceInUSD, solBalanceInUSD, btcBalanceInUSD } = useBalance();
  const dispatch = useDispatch();

  const coins = useMemo(
    () => [
      {
        title: "Bitcoin",
        currency: "usd",
        type: "btc",
        balance: btcBalanceInUSD,
      },
      {
        title: "Solana",
        currency: "usd",
        type: "sol",
        balance: solBalanceInUSD,
      },
    ],
    [btcBalanceInUSD, solBalanceInUSD]
  );

  const pieChartData = useMemo(() => {
    const data = [];
    if (btcBalanceInUSD > 0) {
      const btcData = {
        id: "Bitcoin",
        label: "Bitcoin",
        value: btcBalanceInUSD,
        color: "var(--clr-pie-chart-btc)",
      };
      data.push(btcData);
    }
    if (solBalanceInUSD > 0) {
      const solData = {
        id: "Solana",
        label: "Solana",
        value: solBalanceInUSD,
        color: "var(--clr-pie-chart-sol)",
      };
      data.push(solData);
    }
    return data;
  }, [solBalanceInUSD, btcBalanceInUSD]);

  return (
    <>
      <Overlay isOpen={isOpen} onOpenChange={onOpenChange} title="Crypto">
        {solBalanceInUSD === 0 || btcBalanceInUSD === 0 ? (
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
                  margin-block-end: var(--size-400);
                `}
              >
                <p className="heading-large">Deposit crypto</p>
                <p
                  className="caption-medium"
                  css={css`
                    margin-block-start: var(--size-100);
                    color: var(--clr-text-weak);
                  `}
                >
                  Lorem ipsum dolor
                </p>
              </hgroup>
              <Button
                onPress={() => {
                  dispatch(setDepositModalOpen(true));
                }}
              >
                Deposit Crypto
              </Button>
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
                <BalanceTitle balance={cryptoBalanceInUSD} />
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
                    size="small"
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
                    size="small"
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
                    size="small"
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
              <PieChart data={pieChartData}></PieChart>
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

export default CryptoOverlay;
