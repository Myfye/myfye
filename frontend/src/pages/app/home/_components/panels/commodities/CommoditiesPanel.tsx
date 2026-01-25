import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  selectAssetsWithBalanceByDashboard,
  selectAssetsBalanceUSDByDashboardId,
} from "@/features/assets/stores/assetsSlice";
import AssetPanel from "../../AssetPanel";

const CommoditiesPanel = ({}) => {
  const commoditiesAssets = useSelector((state: RootState) =>
    selectAssetsWithBalanceByDashboard(state, "commodities")
  );

  const balanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByDashboardId(state, "commodities")
  );

  return <AssetPanel balance={balanceUSD} assets={commoditiesAssets} />;
};

export default CommoditiesPanel;
