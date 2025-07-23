import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  selectAbstractedAssetsWithBalanceByDashboard,
  selectAssetsBalanceUSDByDashboardId,
} from "@/features/assets/assetsSlice";
import AssetPanel from "../../AssetPanel";

const CashPanel = ({}) => {
  const cashAssets = useSelector((state: RootState) =>
    selectAbstractedAssetsWithBalanceByDashboard(state, "cash")
  );

  const balanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByDashboardId(state, "cash")
  );

  return <AssetPanel balance={balanceUSD} assets={cashAssets} />;
};

export default CashPanel;
