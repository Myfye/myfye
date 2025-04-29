import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleOverlay,
  updateAbstractedAssetId,
  updateAmount,
} from "./sendSlice";
import { AbstractedAsset, AbstractedAssetSection } from "../assets/types";
import {
  selectAbstractedAssetsWithBalanceByDashboard,
  selectAbstractedAssetWithBalance,
} from "../assets/assetsSlice";
import SelectAssetOverlay from "../assets/SelectAssetOverlay";

const SendSelectAssetOverlay = ({ zIndex = 1000 }) => {
  const dispatch = useDispatch();

  const cashAssets = useSelector((state: RootState) =>
    selectAbstractedAssetsWithBalanceByDashboard(state, "cash")
  );

  const abstractedAssetSections: AbstractedAssetSection[] = [
    {
      id: "cash",
      label: "Cash",
      abstractedAssets: cashAssets,
    },
  ];

  const isOpen = useSelector(
    (state: RootState) => state.send.overlays.selectAsset.isOpen
  );

  const selectedAbstractedAssetId = useSelector(
    (state: RootState) => state.send.transaction.abstractedAssetId
  );

  const asset = useSelector((state: RootState) =>
    selectedAbstractedAssetId
      ? selectAbstractedAssetWithBalance(state, selectedAbstractedAssetId)
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

  const handleAssetSelect = (abstractedAssetId: AbstractedAsset["id"]) => {
    dispatch(
      updateAbstractedAssetId({
        abstractedAssetId: abstractedAssetId,
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
        abstractedAssetSections={abstractedAssetSections}
        selectedAbstractedAssetId={selectedAbstractedAssetId}
      />
    </>
  );
};

export default SendSelectAssetOverlay;
