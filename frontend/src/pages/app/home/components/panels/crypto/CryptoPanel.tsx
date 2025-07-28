import { useSelector } from "react-redux";
import {
  selectAbstractedAssetsWithBalanceByDashboard,
  selectAssetsBalanceUSDByDashboardId,
} from "@/features/assets/assetsSlice";
import { RootState } from "@/redux/store";
import AssetPanel from "../../AssetPanel";

const CryptoPanel = ({}) => {
  const assets = useSelector((state: RootState) =>
    selectAbstractedAssetsWithBalanceByDashboard(state, "crypto")
  );
  const balanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByDashboardId(state, "crypto")
  );

  return <AssetPanel balance={balanceUSD} assets={assets} />;
};

export default CryptoPanel;
