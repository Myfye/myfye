import { css } from "@emotion/react";

import Overlay from "@/components/ui/overlay/Overlay";
import BalanceTitle from "@/components/ui/balance-title/BalanceTitle";
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
import AssetCardList from "@/features/wallet/assets/cards/AssetCardList";
import { RootState } from "@/redux/store";
import {
  selectAssetsBalanceUSDByGroup,
  selectAssetsBalanceUSDByType,
  selectAssetsByGroup,
  toggleGroupOverlay,
} from "../assetsSlice";

const CashOverlay = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.assets.groups["earn"].overlay.isOpen
  );

  const onOpenChange = (isOpen: boolean) => {
    dispatch(toggleGroupOverlay({ isOpen, groupId: "cash" }));
  };

  const cashAssets = useSelector((state: RootState) =>
    selectAssetsByGroup(state, "cash")
  );

  const usdBalance = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByType(state, "usd")
  );
  const euroBalance = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByType(state, "euro")
  );

  const balanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "cash")
  );

  const pieChartData = useMemo(() => {
    const data = [];
    if (usdBalance > 0) {
      const usdData = {
        id: "US Dollar",
        label: "USD",
        value: usdBalance,
        color: "var(--clr-green-500)",
      };
      data.push(usdData);
    }
    if (euroBalance > 0) {
      const euroData = {
        id: "Euro",
        label: "Euro",
        value: euroBalance,
        color: "var(--clr-blue-500)",
      };
      data.push(euroData);
    }
    return data;
  }, [usdBalance, euroBalance]);

  return (
    <>
      <Overlay isOpen={isOpen} onOpenChange={onOpenChange} title="Cash">
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
            <BalanceTitle balance={balanceUSD} />
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
          <AssetCardList assets={cashAssets} showOptions={true} />
        </section>
      </Overlay>
    </>
  );
};

export default CashOverlay;
