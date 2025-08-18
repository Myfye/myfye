import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleOverlay,
  updateAssetId,
  updateAmount,
} from "./paySlice";
import { Asset, AssetSection } from "../assets/types";
import {
  selectAssetsWithBalanceByDashboard,
  selectAssetWithBalance,
} from "../assets/assetsSlice";
import SelectAssetOverlay from "../assets/SelectAssetOverlay";

const PaySelectAssetOverlay = ({ zIndex = 1000 }) => {
  const dispatch = useDispatch();

  const cashAssets = useSelector((state: RootState) =>
    selectAssetsWithBalanceByDashboard(state, "cash")
  );

  const assetSections: AssetSection[] = [
    { id: "cash", label: "Cash", assets: cashAssets },
  ];

  const isOpen = useSelector(
    (state: RootState) => state.pay.overlays.selectAsset.isOpen
  );

  const selectedAssetId = useSelector(
    (state: RootState) => state.pay.transaction.aAssetId
  );

  const asset = useSelector((state: RootState) =>
    state.pay.transaction.assetId
      ? selectAssetWithBalance(
          state,
          state.pay.transaction.assetId
        )
      : null
  );

  const transaction = useSelector((state: RootState) => state.pay.transaction);

  const handleOpen = (e: boolean) => {
    dispatch(
      toggleOverlay({
        isOpen: e,
        type: "selectAsset",
      })
    );
  };

  const handleAssetSelect = (assetId: Asset["id"]) => {
    dispatch(
      updateAssetId({
        assetId: assetId,
      })
    );
    // update this
    if (asset && transaction.presetAmount === "max") {
      dispatch(updateAmount({ input: asset.balanceUSD, replace: true }));
    }
    dispatch(
      toggleOverlay({
        type: "selectAsset",
        isOpen: false,
      })
    );
  };

  return (
    <>
      <SelectAssetOverlay
        isOpen={isOpen}
        onOpenChange={handleOpen}
        onAssetSelect={handleAssetSelect}
        assetSections={assetSections}
        selectedAssetId={selectedAssetId}
      />
    </>
  );
};

export default PaySelectAssetOverlay;
