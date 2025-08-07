import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import Overlay from "@/shared/components/ui/overlay/Overlay";
import {
  selectAbstractedAsset,
  selectAsset,
  selectAssetBalance,
} from "@/features/assets/assetsSlice";
import Button from "@/shared/components/ui/button/Button";
import AmountSelectorGroup from "@/shared/components/ui/amount-selector/AmountSelectorGroup";
import AmountSelector from "@/shared/components/ui/amount-selector/AmountSelector";
import NumberPad from "@/shared/components/ui/number-pad/NumberPad";
import { RootState } from "@/redux/store";
import {
  toggleOverlay,
  updateAmount,
  updatePresetAmount,
} from "./withdrawOffChainSlice";
import { getFiatCurrencySymbol } from "@/shared/utils/currencyUtils";
import { PresetAmountOption } from "./withdrawOffChain.types";
import AssetSelectButton from "@/features/assets/AssetSelectButton";
import AmountDisplay from "@/shared/components/ui/amount-display/AmountDisplay";
import { useNumberPad } from "@/shared/components/ui/number-pad/useNumberPad";

const WthdrawOffChainSelectAmountOverlay = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state: RootState) => state.withdrawOffChain.overlays.selectAmount.isOpen
  );
  const transaction = useSelector(
    (state: RootState) => state.withdrawOffChain.transaction
  );
  const amount = useSelector(
    (state: RootState) => state.withdrawOffChain.transaction.amount
  );

  const asset = useSelector((state: RootState) =>
    transaction.assetId
      ? selectAbstractedAsset(state, transaction.assetId)
      : null
  );

  // const handleNextPressed = async () => {
  //   const amount = parseFormattedAmount(formattedAmount);

  //   console.log("selectedBankAccount:", selectedBankAccount);
  //   try {
  //     // Call backend to get payout quote
  //     const response = await fetch(`${MYFYE_BACKEND}/payout_quote`, {
  //       method: "POST",
  //       mode: "cors",
  //       credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "x-api-key": MYFYE_BACKEND_KEY,
  //       },
  //       body: JSON.stringify({
  //         bank_account_id: selectedBankAccount.id,
  //         currency_type: "sender",
  //         cover_fees: false,
  //         request_amount: Math.round(amount * 100),
  //       }),
  //     });
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || "Failed to get payout quote");
  //     }
  //     const quote = await response.json();
  //   } catch (error) {
  //     console.log("error:", error);
  //   } finally {
  //   }
  // };

  // const amount = parseFormattedAmount(formattedAmount);
  // const isSendDisabled = !amount || amount > currentBalance || amount < 0.01;

  // Balances
  const eurcSolBalance = useSelector((state: RootState) =>
    selectAssetBalance(state, "eurc_sol")
  );
  const usdcSolBalance = useSelector((state: RootState) =>
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

  const currencySymbol =
    getFiatCurrencySymbol(
      transaction.id === "usdc_sol" || !transaction.id ? "usd" : "euro"
    ) ?? "$";

  const isAddressEntryDisabled =
    amount === 0 || eurcSolBalance === 0 || usdcSolBalance === 0 || !amount;

  return (
    <>
      <Overlay
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(toggleOverlay({ type: "selectAmount", isOpen }));
        }}
        title="Withdraw amount"
        zIndex={9999}
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
              <AmountSelector value="10">{10}</AmountSelector>
              <AmountSelector value="50">{50}</AmountSelector>
              <AmountSelector value="100">{100}</AmountSelector>
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
                dispatch(
                  toggleOverlay({ type: "confirmTransaction", isOpen: true })
                );
              }}
            >
              Next
            </Button>
          </section>
        </div>
      </Overlay>
      {/* {showWithdrawConfirm && payoutQuote && (
        <WithdrawConfirmOverlay
          isOpen={showWithdrawConfirm}
          onOpenChange={(open) => {
            setShowWithdrawConfirm(open);
            if (!open) {
              setShowWithdrawConfirm(false);
            }
          }}
          onBack={() => setShowWithdrawConfirm(false)}
          payoutQuote={payoutQuote}
          selectedToken={selectedToken}
          amount={formattedAmount}
          selectedBankAccount={selectedBankAccount}
        />
      )} */}
    </>
  );
};

export default WthdrawOffChainSelectAmountOverlay;
