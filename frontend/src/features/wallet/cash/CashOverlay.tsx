/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import Overlay from "@/components/ui/overlay/Overlay";
import BalanceTitle from "@/components/ui/balance-title/BalanceTitle";
import useBalance from "@/hooks/useBalance";
import PieChart from "@/components/ui/pie-chart/PieChart";
import { useMemo } from "react";
import Button from "@/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  setDepositModalOpen,
  setReceiveModalOpen,
  setSendModalOpen,
} from "@/redux/modalReducers";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  ArrowsLeftRight,
} from "@phosphor-icons/react";
import CoinCardList from "@/features/coins/coin-card/CoinCardList";
import { RootState } from "@/redux/store";
import { setOverlayOpen } from "./cashSlice";

const CashOverlay = () => {
  const isOpen = useSelector((state: RootState) => state.cash.overlay.isOpen);

  const onOpenChange = (isOpen: boolean) => {
    dispatch(setOverlayOpen(isOpen));
  };

  const { eurcBalanceInUSD } = useBalance();
  const usdtSolBalance = useSelector(
    (state: RootState) => state.userWalletData.usdtSolBalance
  );
  const eurcSolBalance = useSelector(
    (state: RootState) => state.userWalletData.eurcSolBalance
  );

  const balance = useMemo(
    () => usdtSolBalance + eurcBalanceInUSD,
    [usdtSolBalance, eurcBalanceInUSD]
  );
  const dispatch = useDispatch();

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
    ],
    [eurcSolBalance, usdtSolBalance]
  );

  const pieChartData = useMemo(() => {
    const data = [];
    if (usdtSolBalance > 0) {
      const usdtData = {
        id: "US Dollar",
        label: "USD",
        value: usdtSolBalance,
        color: "var(--clr-green-500)",
      };
      data.push(usdtData);
    }
    if (eurcSolBalance > 0) {
      const eurcData = {
        id: "Euro",
        label: "Euro",
        value: eurcSolBalance,
        color: "var(--clr-blue-500)",
      };
      data.push(eurcData);
    }
    return data;
  }, [usdtSolBalance, eurcSolBalance]);

  return (
    <>
      <Overlay isOpen={isOpen} onOpenChange={onOpenChange} title="Cash">
        {/* {usdtSolBalance === 0 || eurcSolBalance === 0 ? (
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
                <p className="heading-large">Deposit cash</p>
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
                Deposit Cash
              </Button>
            </section>
          </div>
        ) : ( */}
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
              <BalanceTitle balance={balance} />
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
        {/* )} */}
      </Overlay>
    </>
  );
};

export default CashOverlay;
