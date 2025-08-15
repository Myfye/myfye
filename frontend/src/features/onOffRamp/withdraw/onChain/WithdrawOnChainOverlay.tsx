import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import Overlay from "@/shared/components/ui/overlay/Overlay";
import { selectAsset, selectAssetBalance } from "@/features/assets/assetsSlice";
import Button from "@/shared/components/ui/button/Button";
import { RootState } from "@/redux/store";
import AmountSelectorGroup from "@/shared/components/ui/amount-selector/AmountSelectorGroup";
import AmountSelector from "@/shared/components/ui/amount-selector/AmountSelector";
import AmountDisplay from "@/shared/components/ui/amount-display/AmountDisplay";
import NumberPad from "@/shared/components/ui/number-pad/NumberPad";
import {
  toggleOverlay,
  updateAmount,
  updatePresetAmount,
} from "./withdrawOnChainSlice";
import { ModalProps } from "@/shared/components/ui/modal/Modal";
import {
  formatAmountWithCurrency,
  getFiatCurrencySymbol,
} from "@/shared/utils/currencyUtils";
import AssetSelectButton from "@/features/assets/AssetSelectButton";
import WithdrawOnChainSelectAssetOverlay from "./WithdrawOnChainSelectAssetOverlay";
import WithdrawOnChainAddressEntryOverlay from "./WithdrawOnChainAddressEntryOverlay";
import { PresetAmountOption } from "./withdrawOnChain.types";
import { useNumberPad } from "@/shared/components/ui/number-pad/useNumberPad";
import { useAppSelector } from "@/redux/hooks";
import WithdrawOnChainConfirmOverlay from "./WithdrawOnChainConfirmTransactionOverlay";
import WithdrawOnChainProcessingTransactionOverlay from "./WithdrawOnChainProcessingTransactionOverlay";
import AmountSelectScreen from "@/shared/components/ui/amount-select-screen/AmountSelectScreen";
import { truncateSolanaAddress } from "@/shared/utils/solanaUtils";

const WithdrawOnChainOverlay = ({
  ...restProps
}: Omit<ModalProps, "onOpenChange" | "isOpen" | "children">) => {
  const dispatch = useDispatch();

  const isOpen = useAppSelector(
    (state) => state.withdrawOnChain.overlays.withdrawOnChain.isOpen
  );
  const transaction = useAppSelector(
    (state) => state.withdrawOnChain.transaction
  );

  const asset = useAppSelector((state) =>
    transaction.assetId ? selectAsset(state, transaction.assetId) : null
  );

  const numberPadProps = useNumberPad({
    onStartDelete: (input) => {
      dispatch(updateAmount({ input }));
    },
    onUpdateAmount: (input) => {
      dispatch(updateAmount({ input }));
    },
    onUpdatePresetAmount: (presetAmount) => {
      dispatch(updatePresetAmount(presetAmount));
    },
    formattedAmount: transaction.formattedAmount,
  });

  return (
    <>
      <Overlay
        {...restProps}
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(toggleOverlay({ type: "withdrawOnChain", isOpen }));
        }}
        title="Withdraw crypto amount"
        hideTitle
        zIndex={2000}
      >
        <AmountSelectScreen
          amountDisplayProps={{
            amount: transaction.formattedAmount,
            fee: transaction.fee,
            fiatCurrency: asset?.fiatCurrency,
          }}
          numberPadProps={numberPadProps}
          amountSelectorGroupProps={{
            label: "Select preset amount",
            onChange: (amount) => {
              dispatch(updatePresetAmount(amount as PresetAmountOption));
              dispatch(
                updateAmount({
                  input:
                    asset && amount === "max"
                      ? asset.balance
                      : (amount as string),
                  replace: true,
                })
              );
            },
            value: transaction.presetAmount,
          }}
          amountSelectors={[
            {
              id: "1",
              label: getFiatCurrencySymbol(asset?.fiatCurrency) + "10",
              value: "10",
            },
            {
              id: "2",
              label: getFiatCurrencySymbol(asset?.fiatCurrency) + "50",
              value: "50",
            },
            {
              id: "3",
              label: getFiatCurrencySymbol(asset?.fiatCurrency) + "100",
              value: "100",
            },
            {
              id: "4",
              label: "MAX",
              value: "max",
            },
          ]}
          primaryAction={{
            action: () => {
              dispatch(toggleOverlay({ type: "selectAsset", isOpen: true }));
            },
            props: {
              leftContent: {
                title: "Withdraw",
                subtitle: asset?.label,
                titleSize: "medium",
              },
              rightContent: {
                title: formatAmountWithCurrency(
                  asset?.balance,
                  asset.fiatCurrency
                ),
                subtitle: "Available",
                titleWeight: "var(--fw-default)",
                textAlign: "end",
              },
              icon: asset?.icon.content ?? "",
            },
          }}
          secondaryAction={{
            action: () => {
              dispatch(toggleOverlay({ type: "addressEntry", isOpen: true }));
            },
            props: {
              leftContent: {
                title: "Deposit to",
                subtitle: transaction.solAddress
                  ? truncateSolanaAddress(transaction.solAddress)
                  : "Enter a wallet address",
              },
              icon: "wallet",
            },
          }}
          onSubmit={() => {
            dispatch(
              toggleOverlay({ type: "confirmTransaction", isOpen: true })
            );
          }}
          submitLabel="Preview"
          submitButtonProps={{
            isDisabled:
              transaction.amount === 0 ||
              (transaction.amount ?? 0) > (asset?.balance ?? 0) ||
              !transaction.solAddress,
          }}
        />
      </Overlay>
      <WithdrawOnChainSelectAssetOverlay />
      <WithdrawOnChainAddressEntryOverlay />
      <WithdrawOnChainConfirmOverlay />
      <WithdrawOnChainProcessingTransactionOverlay />
    </>
  );
};

export default WithdrawOnChainOverlay;
