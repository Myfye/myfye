import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  selectAssetsBalanceUSDByGroup,
  selectAssetsByGroup,
} from "@/features/wallet/assets/assetsSlice";
import AssetPanel from "../../PanelInner";

const CashPanel = ({}) => {
  const cashAssets = useSelector((state: RootState) =>
    selectAssetsByGroup(state, "cash")
  );
  const cashBalanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "cash")
  );

  const earnAssets = useSelector((state: RootState) =>
    selectAssetsByGroup(state, "earn")
  );
  const earnBalanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "earn")
  );

  const combinedCashAndEarnAssets = useMemo(
    () => cashAssets.concat(earnAssets),
    [cashAssets, earnAssets]
  );

  const balanceUSD = useMemo(
    () => cashBalanceUSD + earnBalanceUSD,
    [cashBalanceUSD, earnBalanceUSD]
  );

  return <AssetPanel balance={balanceUSD} assets={combinedCashAndEarnAssets} />;
};

export default CashPanel;
