/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import AssetCardList from "@/features/wallet/assets/cards/AssetCardList";
import Balance from "@/components/ui/balance/Balance";
import { useSelector } from "react-redux";
import {
  selectAssetsBalanceUSDByGroup,
  selectAssetsByGroup,
} from "@/features/wallet/assets/assetsSlice";
import { RootState } from "@/redux/store";
import AssetPanel from "../../PanelInner";

const CryptoPanel = ({}) => {
  const cryptoAssets = useSelector((state: RootState) =>
    selectAssetsByGroup(state, "cash")
  );
  const balanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "cash")
  );

  return <AssetPanel balance={balanceUSD} assets={cryptoAssets} />;
};

export default CryptoPanel;
