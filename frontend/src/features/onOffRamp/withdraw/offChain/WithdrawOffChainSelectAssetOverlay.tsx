import store, { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAbstractedAsset,
  selectAsset,
} from "@/features/assets/assetsSlice";
import SelectAssetOverlay from "@/features/assets/SelectAssetOverlay";
import { OverlayProps } from "@/shared/components/ui/overlay/Overlay";
import { updateAmountDisplay } from "./withdrawOffChainThunks";
import { toggleOverlay } from "./withdrawOffChainSlice";

const WithdrawOffChainSelectAssetOverlay = ({ ...restProps }: OverlayProps) => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.withdrawOffChain.overlays.selectAsset.isOpen
  );

  const asset = useSelector((state: RootState) =>
    state.withdrawOnChain.transaction.assetId
      ? selectAbstractedAsset(state, state.withdrawOffChain.transaction.assetId)
      : null
  );

  const euroAsset = useSelector((state: RootState) =>
    selectAbstractedAsset(state, "euro")
  );
  const usDollarAsset = useSelector((state: RootState) =>
    selectAbstractedAsset(state, "us_dollar")
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
          {
            id: "cash",
            label: "",
            abstractedAssets: [euroAsset, usDollarAsset],
          },
        ]}
        assetCardListSelectOptions={{ showCurrencySymbol: true }}
      />
    </>
  );
};

export default WithdrawOffChainSelectAssetOverlay;
