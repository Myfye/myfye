import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  selectAbstractedAssetsWithBalanceByDashboard,
  selectAssetsBalanceUSDByDashboardId,
} from "@/features/assets/assetsSlice";
import AssetPanel from "../PanelInner";

const StocksPanel = ({}) => {
  const assets = useSelector((state: RootState) =>
    selectAbstractedAssetsWithBalanceByDashboard(state, "stocks")
  );
  const balanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByDashboardId(state, "stocks")
  );

  return <AssetPanel balance={balanceUSD} assets={assets} />;
};

export default StocksPanel;
