import store, { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAbstractedAsset,
  selectAbstractedAssetsWithBalanceByGroup,
  selectAsset,
} from "@/features/assets/assetsSlice";
import SelectAssetOverlay from "@/features/assets/SelectAssetOverlay";
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
    state.withdrawOffChain.transaction.abstractedAssetId
      ? selectAbstractedAsset(
          state,
          state.withdrawOffChain.transaction.abstractedAssetId
        )
      : null
  );

  const cashAssets = useAppSelector((state) =>
    selectAbstractedAssetsWithBalanceByGroup(state, "cash")
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
            abstractedAssets: cashAssets,
          },
        ]}
        assetCardListSelectOptions={{ showCurrencySymbol: true }}
      />
    </>
  );
};

export default WithdrawOffChainSelectAssetOverlay;
