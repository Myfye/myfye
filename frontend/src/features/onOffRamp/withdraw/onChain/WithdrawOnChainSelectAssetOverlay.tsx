import store, { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { selectAsset } from "@/features/assets/assetsSlice";
import { toggleOverlay } from "./withdrawOnChainSlice";
import SelectAssetOverlay from "@/features/assets/SelectAssetOverlay";
import { OverlayProps } from "@/shared/components/ui/overlay/Overlay";
import { updateAmountDisplay } from "../thunks";

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

  const eurcAsset = useSelector((state: RootState) =>
    selectAsset(state, "eurc_sol")
  );
  const usdcAsset = useSelector((state: RootState) =>
    selectAsset(state, "usdc_sol")
  );

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
        onAssetSelect={(assetId) => {
          store.dispatch(updateAmountDisplay(assetId));
        }}
        // @ts-ignore
        selectedAbstractedAssetId={asset?.id}
        abstractedAssetSections={[
          // @ts-ignore
          { id: "cash", label: "", abstractedAssets: [usdcAsset, eurcAsset] },
        ]}
        assetCardListSelectOptions={{ showCurrencySymbol: false }}
        zIndex={2001}
      />
    </>
  );
};

export default WithdrawOnChainSelectAssetOverlay;
