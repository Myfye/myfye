import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { selectAsset } from "@/features/assets/assetsSlice";
import {
  toggleOverlay,
  updateAmount,
  updateAssetId,
} from "./withdrawOnChainSlice";
import { Asset } from "@/features/assets/types";
import SelectAssetOverlay from "@/features/assets/SelectAssetOverlay";
import { OverlayProps } from "@/shared/components/ui/overlay/Overlay";

const WithdrawOnChainSelectAssetOverlay = ({ ...restProps }: OverlayProps) => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.withdrawOnChain.overlays.selectAsset.isOpen
  );

  const asset = useSelector((state: RootState) =>
    state.withdrawOnChain.transaction.assetId
      ? selectAsset(state, state.withdrawOnChain.transaction.assetId)
      : null
  );

  const transaction = useSelector(
    (state: RootState) => state.withdrawOnChain.transaction
  );

  const eurcAsset = useSelector((state: RootState) =>
    selectAsset(state, "eurc_sol")
  );

  const usdcAsset = useSelector((state: RootState) =>
    selectAsset(state, "usdc_sol")
  );

  const handleAssetSelect = (assetId: Asset["id"]) => {
    dispatch(updateAssetId(assetId));
    // update this
    if (asset && transaction.presetAmount === "max") {
      dispatch(updateAmount({ input: asset.balance, replace: true }));
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
        {...restProps}
        disableSearch={true}
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(
            toggleOverlay({
              isOpen,
              type: "selectAsset",
            })
          );
        }}
        onAssetSelect={handleAssetSelect}
        selectedAbstractedAssetId={asset?.id}
        abstractedAssetSections={[
          { id: "cash", label: "", abstractedAssets: [usdcAsset, eurcAsset] },
        ]}
        assetCardListSelectOptions={{ showCurrencySymbol: false }}
      />
    </>
  );
};

export default WithdrawOnChainSelectAssetOverlay;
