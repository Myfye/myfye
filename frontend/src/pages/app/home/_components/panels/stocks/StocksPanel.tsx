import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  selectAssetsWithBalanceByDashboard,
  selectAssetsBalanceUSDByDashboardId,
} from "@/features/assets/stores/assetsSlice";
import AssetPanel from "../../AssetPanel";
import { useAppSelector } from "@/redux/hooks";

const StocksPanel = () => {
  const assets = useAppSelector((state) =>
    selectAssetsWithBalanceByDashboard(state, "stocks")
  );
  const balanceUSD = useAppSelector((state) =>
    selectAssetsBalanceUSDByDashboardId(state, "stocks")
  );

  return <AssetPanel balance={balanceUSD} assets={assets} />;
};

export default StocksPanel;
