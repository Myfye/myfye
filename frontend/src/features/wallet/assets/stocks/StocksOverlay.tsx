/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import Overlay from "@/components/ui/overlay/Overlay";
import BalanceTitle from "@/components/ui/balance-title/BalanceTitle";
import useBalance from "@/hooks/useBalance";
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
import AssetCardList from "@/features/wallet/assets/cards/AssetCardList";
import { RootState } from "@/redux/store";
import LineChart from "@/components/ui/line-chart/LineChart";
import { useState } from "react";
import { Key, useSelect } from "react-aria";
import { selectAssetsByGroup, toggleGroupOverlay } from "../assetsSlice";

const lineChartData = [
  {
    id: "stocksData",
    color: "var(--clr-green-400)",
    data: [
      {
        x: "2024-01-15",
        y: 28,
      },
      {
        x: "2024-03-10",
        y: 76,
      },
      {
        x: "2024-06-25",
        y: 101,
      },
      {
        x: "2024-09-07",
        y: 213,
      },
      {
        x: "2024-11-22",
        y: 222,
      },
      {
        x: "2025-02-14",
        y: 161,
      },
      {
        x: "2025-05-05",
        y: 78,
      },
      {
        x: "2025-07-19",
        y: 245,
      },
      {
        x: "2025-08-30",
        y: 68,
      },
      {
        x: "2025-10-12",
        y: 77,
      },
      {
        x: "2025-12-03",
        y: 152,
      },
      {
        x: "2024-04-08",
        y: 29,
      },
    ],
  },
];

const StocksOverlay = () => {
  const { cryptoBalanceInUSD, solBalanceInUSD, btcBalanceInUSD } = useBalance();
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.assets.groups["stocks"].overlay.isOpen
  );

  const onOpenChange = (isOpen: boolean) => {
    dispatch(toggleGroupOverlay({ isOpen, groupId: "stocks" }));
  };

  const stocksAssets = useSelector((state: RootState) =>
    selectAssetsByGroup(state, "stocks")
  );

  const [selectedDateRange, setSelectedDateRange] = useState(
    new Set<Key>(["1D"])
  );

  return (
    <>
      <Overlay isOpen={isOpen} onOpenChange={onOpenChange} title="Stocks">
        {/* {solBalanceInUSD === 0 || btcBalanceInUSD === 0 ? (
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
        ) : ( */}
        <>
          <section
            className="balance-container"
            css={css`
              margin-block-start: var(--size-200);
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
          <section
            css={css`
              margin-block-start: var(--size-400);
            `}
          >
            <LineChart
              data={lineChartData}
              selectedDateRange={selectedDateRange}
              onDateRangeSelectionChange={(key) => setSelectedDateRange(key)}
            />
          </section>
          <section
            css={css`
              margin-block-start: var(--size-500);
              margin-inline: var(--size-250);
              margin-block-end: var(--size-250);
            `}
          >
            {/* <AssetCardList coins={stocks} showOptions={true} /> */}
          </section>
        </>
        {/* )} */}
      </Overlay>
    </>
  );
};

export default StocksOverlay;
