import { RootState } from "@/redux/store";
import { css } from "@emotion/react";
import { CaretRight } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import AssetIcon from "../assets/AssetIcon";
import { toggleOverlay, updateAmount, updatePresetAmount } from "./paySlice";
import { selectAbstractedAssetWithBalance } from "../assets/assetsSlice";
import { AbstractedAsset } from "../assets/types";
import { PresetAmountOption } from "./pay.types";
import { updateFormattedGhostAmount } from "./utils";
import AmountSelectorGroup from "@/shared/components/ui/amount-selector/AmountSelectorGroup";
import AmountSelector from "@/shared/components/ui/amount-selector/AmountSelector";
import AssetSelectButton from "../assets/AssetSelectButton";
import { useEffect } from "react";
import AmountDisplay from "@/shared/components/ui/amount-display/AmountDisplay";

const PayController = () => {
  const dispatch = useDispatch();

  const formattedAmount = useSelector(
    (state: RootState) => state.pay.transaction.formattedAmount
  );

  const abstractedAssetId = useSelector(
    (state: RootState) => state.pay.transaction.abstractedAssetId
  );

  const asset = useSelector((state: RootState) =>
    abstractedAssetId
      ? selectAbstractedAssetWithBalance(state, abstractedAssetId)
      : null
  );

  const transaction = useSelector((state: RootState) => state.pay.transaction);

  return (
    <div
      className="pay-controller"
      css={css`
        display: grid;
        grid-template-rows: 1fr auto auto;
        height: 100%;
        gap: var(--size-200);
      `}
    >
      <section
        css={css`
          display: grid;
          place-items: center;
          width: 100%;
          height: 100%;
          position: relative;
          isolation: isolate;
        `}
      >
        <AmountDisplay amount={formattedAmount} fiatCurrency="usd" />
      </section>
      <section>
        <AmountSelectorGroup
          label="Select preset amount"
          value={transaction.presetAmount}
          onChange={(amount) => {
            dispatch(updatePresetAmount(amount as PresetAmountOption));
            dispatch(
              updateAmount({
                input:
                  asset && amount === "max"
                    ? asset.balanceUSD
                    : (amount as string),
                replace: true,
              })
            );
          }}
        >
          <AmountSelector value="10">$10</AmountSelector>
          <AmountSelector value="50">$50</AmountSelector>
          <AmountSelector value="100">$100</AmountSelector>
          <AmountSelector value="max">MAX</AmountSelector>
        </AmountSelectorGroup>
      </section>
      <section
        css={css`
          padding-inline: var(--size-250);
        `}
      >
        <AssetSelectButton
          balance={asset?.balanceUSD}
          label={asset?.label}
          icon={asset?.icon}
          symbol={asset?.symbol}
          onPress={() => {
            dispatch(toggleOverlay({ type: "selectAsset", isOpen: true }));
          }}
        />
      </section>
    </div>
  );
};

export default PayController;
