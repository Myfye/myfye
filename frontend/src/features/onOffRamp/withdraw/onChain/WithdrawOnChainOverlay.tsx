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
import { toggleOverlay } from "./withdrawOnChainSlice";
import { ModalProps } from "@/shared/components/ui/modal/Modal";
import { getFiatCurrencySymbol } from "@/shared/utils/currencyUtils";
import AssetSelectButton from "@/features/assets/AssetSelectButton";
import WithdrawOnChainSelectAssetOverlay from "./WithdrawOnChainSelectAssetOverlay";
import WithdrawOnChainAddressEntry from "./WithdrawOnChainAddressEntryOverlay";
import WithdrawOnChainAddressEntryOverlay from "./WithdrawOnChainAddressEntryOverlay";

const WithdrawOnChainOverlay = ({
  ...restProps
}: Omit<ModalProps, "onOpenChange" | "isOpen" | "children">) => {
  const dispatch = useDispatch();

  // Redux selectors
  const transaction = useSelector(
    (state: RootState) => state.withdrawOnChain.transaction
  );
  const isOpen = useSelector(
    (state: RootState) => state.withdrawOnChain.overlays.withdrawOnChain.isOpen
  );
  const amount = useSelector(
    (state: RootState) => state.withdrawOnChain.transaction.amount
  );
  const formattedAmount = useSelector(
    (state: RootState) => state.withdrawOnChain.transaction.formattedAmount
  );
  const asset = useSelector((state: RootState) =>
    transaction.assetId ? selectAsset(state, transaction.assetId) : null
  );

  // Balances
  const eurcSolBalance = useSelector((state: RootState) =>
    selectAssetBalance(state, "eurc_sol")
  );
  const usdcSolBalance = useSelector((state: RootState) =>
    selectAssetBalance(state, "usdc_sol")
  );

  const currencySymbol = getFiatCurrencySymbol(
    transaction.id === "usdc_sol" || !transaction.id ? "usd" : "euro"
  );

  const isAddressEntryDisabled =
    amount === 0 || eurcSolBalance === 0 || usdcSolBalance === 0 || !amount;

  return (
    <>
      <Overlay
        {...restProps}
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(toggleOverlay({ type: "withdrawOnChain", isOpen }));
        }}
        title="Enter send amount"
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
              amount={formattedAmount}
              fiatCurrency={transaction.assetId === "usdc_sol" ? "usd" : "euro"}
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
              onChange={(amount) => {}}
            >
              <AmountSelector value="10">{currencySymbol + 10}</AmountSelector>
              <AmountSelector value="20">{currencySymbol + 20}</AmountSelector>
              <AmountSelector value="50">{currencySymbol + 50}</AmountSelector>
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
            <NumberPad onNumberPress={(val) => {}} />
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
      <WithdrawOnChainSelectAssetOverlay zIndex={3000} />
      <WithdrawOnChainAddressEntryOverlay zIndex={3000} />
    </>
  );
};

export default WithdrawOnChainOverlay;
