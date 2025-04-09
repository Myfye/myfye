import { css } from "@emotion/react";

import Overlay from "@/components/ui/overlay/Overlay";
import Balance from "@/components/ui/balance/Balance";
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
import WalletOverlay from "../../WalletOverlay";

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

  const balanceUSD = useSelector((state: RootState) =>
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
      <WalletOverlay
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Crypto"
        balance={balanceUSD}
      >
        <section className="pie-chart-container">
          <PieChart data={pieChartData}></PieChart>
        </section>
        <section
          css={css`
            margin-block-start: var(--size-500);
            margin-inline: var(--size-250);
            margin-block-end: var(--size-250);
          `}
        >
          <AssetCardList assets={cryptoAssets} showOptions={true} />
        </section>
      </WalletOverlay>
    </>
  );
};

export default CryptoOverlay;
