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
import { getFiatCurrencySymbol } from "@/shared/utils/currencyUtils";
import AssetSelectButton from "@/features/assets/AssetSelectButton";
import WithdrawOnChainSelectAssetOverlay from "./WithdrawOnChainSelectAssetOverlay";
import WithdrawOnChainAddressEntryOverlay from "./WithdrawOnChainAddressEntryOverlay";
import { PresetAmountOption } from "./withdrawOnChain.types";
import { useNumberPad } from "@/shared/components/ui/number-pad/useNumberPad";
import { useAppSelector } from "@/redux/hooks";
import WithdrawOnChainConfirmOverlay from "./WithdrawOnChainConfirmTransactionOverlay";

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

  // Balances
  const eurcSolBalance = useAppSelector((state) =>
    selectAssetBalance(state, "eurc_sol")
  );
  const usdcSolBalance = useAppSelector((state) =>
    selectAssetBalance(state, "usdc_sol")
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
        title="Enter send amount"
        zIndex={2000}
      >
        <div
          css={css`
            display: grid;
            grid-template-rows: 1fr auto auto auto;
            gap: var(--size-200);
            height: 100%;
          `}
        >
          <section
            css={css`
              display: grid;
              place-items: center;
              padding-inline: var(--size-200);
            `}
          >
            <AmountDisplay
              amount={transaction.formattedAmount}
              fiatCurrency={null}
            />
          </section>
          <section
            css={css`
              display: grid;
              place-items: center;
              padding-inline: var(--size-200);
              width: min(100%, 24rem);
              margin-inline: auto;
            `}
          >
            <AmountSelectorGroup
              label="Select preset amount"
              onChange={(amount) => {
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
              }}
              value={transaction.presetAmount}
            >
              <AmountSelector value="10">10</AmountSelector>
              <AmountSelector value="50">50</AmountSelector>
              <AmountSelector value="100">100</AmountSelector>
              <AmountSelector value="max">MAX</AmountSelector>
            </AmountSelectorGroup>
          </section>
          <section
            css={css`
              padding-inline: var(--size-250);
            `}
          >
            <AssetSelectButton
              balance={asset?.balance}
              label={asset?.label}
              icon={asset?.icon}
              balanceType="token"
              onPress={() => {
                dispatch(toggleOverlay({ type: "selectAsset", isOpen: true }));
              }}
            />
          </section>
          <section
            css={css`
              padding-inline: var(--size-250);
            `}
          >
            <NumberPad {...numberPadProps} />
          </section>
          <section
            css={css`
              padding-inline: var(--size-200);
              padding-block-end: var(--size-200);
            `}
          >
            <Button
              expand
              onPress={() => {
                dispatch(toggleOverlay({ type: "addressEntry", isOpen: true }));
              }}
              // isDisabled={isAddressEntryDisabled}
            >
              Next
            </Button>
          </section>
        </div>
      </Overlay>
      <WithdrawOnChainSelectAssetOverlay />
      <WithdrawOnChainAddressEntryOverlay />
      <WithdrawOnChainConfirmOverlay />
    </>
  );
};

export default WithdrawOnChainOverlay;
