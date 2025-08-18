import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleOverlay,
  updateAssetId,
  updateAmount,
} from "./sendSlice";
import { Asset, AssetSection } from "../assets/types";
import {
  selectAssetsWithBalanceByDashboard,
  selectAssetWithBalance,
} from "../assets/assetsSlice";
import SelectAssetOverlay from "../assets/SelectAssetOverlay";

const SendSelectAssetOverlay = ({ zIndex = 1000 }) => {
  const dispatch = useDispatch();

  const cashAssets = useSelector((state: RootState) =>
    selectAssetsWithBalanceByDashboard(state, "cash")
  );

  const assetSections: assetSection[] = [
    {
      id: "cash",
      label: "Cash",
      assets: cashAssets,
    },
  ];

  const isOpen = useSelector(
    (state: RootState) => state.send.overlays.selectAsset.isOpen
  );

  const selectedAssetId = useSelector(
    (state: RootState) => state.send.transaction.assetId
  );

  const asset = useSelector((state: RootState) =>
    selectedAssetId
      ? selectAssetWithBalance(state, selectedAssetId)
      : null
  );

  const transaction = useSelector((state: RootState) => state.send.transaction);

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
    if (asset && transaction.presetAmount === "max") {
      console.log(asset);
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
        zIndex={zIndex}
        isOpen={isOpen}
        onOpenChange={handleOpen}
        onAssetSelect={handleAssetSelect}
        assetSections={assetSections}
        selectedAssetId={selectedAssetId}
      />
    </>
  );
};

export default SendSelectAssetOverlay;
