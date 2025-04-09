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
  selectAbstractedAssetBalanceUSD,
  selectAbstractedAssetsWithBalanceByGroup,
  selectAssetsBalanceUSDByGroup,
  toggleGroupOverlay,
} from "../assetsSlice";
import WalletOverlay from "../../WalletOverlay";

const CryptoOverlay = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.assets.groups["crypto"].overlay.isOpen
  );

  const handleOpen = (isOpen: boolean) => {
    dispatch(toggleGroupOverlay({ isOpen, groupId: "crypto" }));
  };

  const assets = useSelector((state: RootState) =>
    selectAbstractedAssetsWithBalanceByGroup(state, "crypto")
  );

  const balanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "crypto")
  );
  const btcBalanceUSD = useSelector((state: RootState) =>
    selectAbstractedAssetBalanceUSD(state, "btc")
  );

  const solBalanceUSD = useSelector((state: RootState) =>
    selectAbstractedAssetBalanceUSD(state, "sol")
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
        color: "var(--clr-purple-400)",
      };
      data.push(solData);
    }
    return data;
  }, [btcBalanceUSD, solBalanceUSD]);

  return (
    <>
      <WalletOverlay
        isOpen={isOpen}
        onOpenChange={handleOpen}
        title="Crypto"
        balance={balanceUSD}
        groupId="crypto"
      >
        {pieChartData.length > 0 && (
          <section className="pie-chart-container">
            <PieChart data={pieChartData}></PieChart>
          </section>
        )}
        {pieChartData.length === 0 && (
          <section
            css={css`
              display: grid;
              place-items: center;
              width: 100%;
              height: 16rem;
            `}
          >
            <div
              css={css`
                display: flex;
                flex-direction: column;
                align-items: center;
              `}
            >
              <p className="heading-medium">Lorem ipsum</p>
              <p
                className="caption"
                css={css`
                  color: var(--clr-text-weaker);
                  margin-block-start: var(--size-050);
                `}
              >
                Lorem ispum dolor, lorum ipsum dolor
              </p>
              <div
                css={css`
                  margin-block-start: var(--size-200);
                `}
              >
                <Button>Deposit crypto</Button>
              </div>
            </div>
          </section>
        )}
        <section
          css={css`
            margin-block-start: var(--size-500);
            margin-inline: var(--size-250);
            margin-block-end: var(--size-250);
          `}
        >
          <AssetCardList assets={assets} showOptions={true} />
        </section>
      </WalletOverlay>
    </>
  );
};

export default CryptoOverlay;
