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
  selectAssetBalanceUSD,
  selectAssetsBalanceUSDByGroup,
  selectAssetsByGroup,
  toggleGroupOverlay,
} from "../assetsSlice";

const CryptoOverlay = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.assets.groups["earn"].overlay.isOpen
  );

  const onOpenChange = (isOpen: boolean) => {
    dispatch(toggleGroupOverlay({ isOpen, groupId: "crypto" }));
  };

  const cryptoAssets = useSelector((state: RootState) =>
    selectAssetsByGroup(state, "crypto")
  );

  const cryptoBalanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "crypto")
  );
  const btcBalanceUSD = useSelector((state: RootState) =>
    selectAssetBalanceUSD(state, "btc_sol")
  );

  const solBalanceUSD = useSelector((state: RootState) =>
    selectAssetBalanceUSD(state, "sol")
  );

  const pieChartData = useMemo(() => {
    const data = [];
    if (btcBalanceUSD > 0) {
      const btcData = {
        id: "Bitcoin",
        label: "Bitcoin",
        value: btcBalanceUSD,
        color: "var(--clr-pie-chart-btc)",
      };
      data.push(btcData);
    }
    if (solBalanceUSD > 0) {
      const solData = {
        id: "Solana",
        label: "Solana",
        value: solBalanceUSD,
        color: "var(--clr-pie-chart-sol)",
      };
      data.push(solData);
    }
    return data;
  }, [btcBalanceUSD, solBalanceUSD]);

  return (
    <>
      <Overlay isOpen={isOpen} onOpenChange={onOpenChange} title="Crypto">
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
            <BalanceTitle balance={cryptoBalanceUSD} />
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
          <AssetCardList assets={cryptoAssets} showOptions={true} />
        </section>
      </Overlay>
    </>
  );
};

export default CryptoOverlay;
