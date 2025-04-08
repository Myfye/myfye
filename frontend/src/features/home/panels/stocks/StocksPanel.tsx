import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  selectAssetsBalanceUSDByGroup,
  selectAssetsByGroup,
} from "@/features/wallet/assets/assetsSlice";
import AssetPanel from "../../PanelInner";

const StocksPanel = ({}) => {
  const dispatch = useDispatch();

  const stocksAssets = useSelector((state: RootState) =>
    selectAssetsByGroup(state, "stocks")
  );
  const balanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "stocks")
  );

  return <AssetPanel balance={balanceUSD} assets={stocksAssets} />;
};

export default StocksPanel;
