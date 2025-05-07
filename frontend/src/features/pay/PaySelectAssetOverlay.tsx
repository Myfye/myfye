import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleOverlay,
  updateAbstractedAssetId,
  updateAmount,
} from "./paySlice";
import { AbstractedAsset, AbstractedAssetSection } from "../assets/types";
import {
  selectAbstractedAssetsWithBalanceByDashboard,
  selectAbstractedAssetWithBalance,
} from "../assets/assetsSlice";
import SelectAssetOverlay from "../assets/SelectAssetOverlay";

const PaySelectAssetOverlay = ({ zIndex = 1000 }) => {
  const dispatch = useDispatch();

  const cashAssets = useSelector((state: RootState) =>
    selectAbstractedAssetsWithBalanceByDashboard(state, "cash")
  );

  const assetSections: AbstractedAssetSection[] = [
    { id: "cash", label: "Cash", abstractedAssets: cashAssets },
  ];

  const isOpen = useSelector(
    (state: RootState) => state.pay.overlays.selectAsset.isOpen
  );

  const selectedAbstractedAssetId = useSelector(
    (state: RootState) => state.pay.transaction.abstractedAssetId
  );

  const asset = useSelector((state: RootState) =>
    state.pay.transaction.abstractedAssetId
      ? selectAbstractedAssetWithBalance(
          state,
          state.pay.transaction.abstractedAssetId
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

  const handleAssetSelect = (abstractedAssetId: AbstractedAsset["id"]) => {
    dispatch(
      updateAbstractedAssetId({
        abstractedAssetId: abstractedAssetId,
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
        abstractedAssetSections={assetSections}
        selectedAbstractedAssetId={selectedAbstractedAssetId}
      ></SelectAssetOverlay>
    </>
  );
};

export default PaySelectAssetOverlay;
