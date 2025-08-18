import { useDispatch } from "react-redux";
import Overlay from "@/shared/components/ui/overlay/Overlay";
import { selectAssetWithBalance } from "@/features/assets/assetsSlice";
import {
  toggleOverlay,
  updateAmount,
  updatePresetAmount,
} from "./withdrawOffChainSlice";
import { PresetAmountOption } from "./withdrawOffChain.types";
import { useNumberPad } from "@/shared/components/ui/number-pad/useNumberPad";
import AmountSelectScreen from "@/shared/components/ui/amount-select-screen/AmountSelectScreen";
import { useAppSelector } from "@/redux/hooks";
import WithdrawOffChainSelectAssetOverlay from "./WithdrawOffChainSelectAssetOverlay";
import WithdrawOffChainBankInputOverlay from "./WithdrawOffChainBankInputOverlay";
import WithdrawOffChainBankPickerOverlay from "./WithdrawOffChainBankPickerOverlay";
import WithdrawOffChainSelectBankOverlay from "./WithdrawOffChainSelectBankOverlay";
import { useLazyCreatePayoutQuery } from "../withdrawApi";
import toast from "react-hot-toast/headless";
import {
  formatAmountWithCurrency,
  getFiatCurrencySymbol,
} from "@/shared/utils/currencyUtils";
import truncateBankAccountNumber from "@/shared/utils/bankUtils";
import WithdrawOffChainConfirmTransactionOverlay from "./WithdrawOffChainConfirmTransactionOverlay";
import { useEffect } from "react";

const WithdrawOffChainOverlay = () => {
  const dispatch = useDispatch();
  const isOpen = useAppSelector(
    (state) => state.withdrawOffChain.overlays.withdrawOffChain.isOpen
  );
  const transaction = useAppSelector(
    (state) => state.withdrawOffChain.transaction
  );

  const asset = useAppSelector((state) =>
    transaction.assetId
      ? selectAssetWithBalance(state, transaction.assetId)
      : null
  );

  const [triggerCreatePayout, { isLoading }] = useLazyCreatePayoutQuery();

  const handleWithdraw = async () => {
    if (!transaction.amount) return;
    if (!transaction.bankInfo.id) return;
    // const { data, isError } = await triggerCreatePayout({
    //   amount: Math.round(transaction.amount * 100),
    //   bankAccountId: transaction.bankInfo.id,
    // });

    // if (isError || !data)
    //   return toast.error("Error creating payout. Please try again.");

    dispatch(toggleOverlay({ type: "confirmTransaction", isOpen: true }));
  };

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
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(toggleOverlay({ type: "withdrawOffChain", isOpen }));
        }}
        title="Withdraw to bank account"
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
                title: formatAmountWithCurrency(asset?.balance),
                subtitle: "Available",
                titleWeight: "var(--fw-default)",
                textAlign: "end",
              },
              icon: asset?.icon.content ?? "",
            },
          }}
          secondaryAction={{
            action: () => {
              dispatch(toggleOverlay({ type: "selectBank", isOpen: true }));
            },
            props: {
              leftContent: {
                title: transaction.bankInfo.accountName ?? "Deposit to",
                subtitle: transaction.bankInfo.speiClabe
                  ? truncateBankAccountNumber(transaction.bankInfo.speiClabe)
                  : "Select your bank account",
              },
              icon: "bank",
            },
          }}
          onSubmit={async () => {
            handleWithdraw();
            dispatch(
              toggleOverlay({ type: "confirmTransaction", isOpen: true })
            );
          }}
          submitLabel="Preview"
          submitButtonProps={{
            isDisabled:
              transaction.amount === 0 ||
              (transaction.amount ?? 0) > (asset.balance ?? 0) ||
              !transaction.bankInfo.id ||
              isLoading,
          }}
        />
      </Overlay>
      <WithdrawOffChainSelectAssetOverlay />
      <WithdrawOffChainBankInputOverlay />
      <WithdrawOffChainBankPickerOverlay />
      <WithdrawOffChainSelectBankOverlay />
      <WithdrawOffChainConfirmTransactionOverlay />
    </>
  );
};

export default WithdrawOffChainOverlay;
