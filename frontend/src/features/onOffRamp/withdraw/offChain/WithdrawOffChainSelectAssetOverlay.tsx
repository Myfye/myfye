import store, { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAsset,
  selectAssetsWithBalanceByGroup,
  selectAsset,
} from "@/features/assets/stores/assetsSlice";
import SelectAssetOverlay from "@/features/assets/components/SelectAssetOverlay";
import { OverlayProps } from "@/shared/components/ui/overlay/Overlay";
import { updateAmountDisplay } from "./withdrawOffChainThunks";
import { toggleOverlay } from "./withdrawOffChainSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const WithdrawOffChainSelectAssetOverlay = ({ ...restProps }: OverlayProps) => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(
    (state) => state.withdrawOffChain.overlays.selectAsset.isOpen
  );

  const asset = useAppSelector((state) =>
    state.withdrawOffChain.transaction.assetId
      ? selectAsset(state, state.withdrawOffChain.transaction.assetId)
      : null
  );

  const cashAssets = useAppSelector((state) =>
    selectAssetsWithBalanceByGroup(state, "cash")
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
        selectedAssetId={asset?.id}
        assetSections={[
          // @ts-ignore
          {
            id: "cash",
            label: "",
            assets: cashAssets,
          },
        ]}
        assetCardListSelectOptions={{ showCurrencySymbol: true }}
      />
    </>
  );
};

export default WithdrawOffChainSelectAssetOverlay;
