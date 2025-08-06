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

  const handleSelectAmountChange = (presetAmount: string) => {
    dispatch(updatePresetAmount(presetAmount));
    dispatch(
      updateAmount({
        input:
          asset && presetAmount === "max"
            ? asset.balanceUSD
            : (presetAmount as string),
        replace: true,
      })
    );
  };

  // Formatted Amount
  const formattedAmountArr = formattedAmount.split("");

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
        <div
          css={css`
            display: grid;
            place-items: center;
            height: 100%;
            isolation: isolate;
            position: relative;
          `}
        >
          <p
            css={css`
              color: var(--clr-text);
              line-height: var(--line-height-tight);
              font-size: 3rem;
              font-weight: var(--fw-heading);
            `}
          >
            <span>$</span>
            {formattedAmountArr.map((val, i) => {
              return <span key={`value-${i}`}>{val}</span>;
            })}
          </p>
        </div>
      </section>
      <section>
        <AmountSelectorGroup
          label="Select preset amount"
          value={transaction.presetAmount}
          onChange={handleSelectAmountChange}
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
