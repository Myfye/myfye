import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  selectAssetsWithBalanceByDashboard,
  selectAssetsBalanceUSDByDashboardId,
} from "@/features/assets/assetsSlice";
import AssetPanel from "../../AssetPanel";

const StocksPanel = ({}) => {
  const assets = useSelector((state: RootState) =>
    selectAssetsWithBalanceByDashboard(state, "stocks")
  );
  const balanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByDashboardId(state, "stocks")
  );

  return <AssetPanel balance={balanceUSD} assets={assets} />;
};

export default StocksPanel;
