import { css } from "@emotion/react";
import PieChart from "@/components/ui/pie-chart/PieChart";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import AssetCardList from "@/features/wallet/assets/cards/AssetCardList";
import { RootState } from "@/redux/store";
import {
  selectAssetsBalanceUSDByGroup,
  selectAssetsBalanceUSDByType,
  selectAssetsByGroup,
  toggleGroupOverlay,
} from "../assetsSlice";
import WalletOverlay from "../../WalletOverlay";

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
      <WalletOverlay
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Cash"
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
          <AssetCardList assets={cashAssets} showOptions={true} />
        </section>
      </WalletOverlay>
    </>
  );
};

export default CashOverlay;
