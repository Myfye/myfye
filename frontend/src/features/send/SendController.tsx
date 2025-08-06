import { RootState } from "@/redux/store";
import { css } from "@emotion/react";
import { CaretRight } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import AssetIcon from "../assets/AssetIcon";
import { toggleOverlay, updateAmount, updatePresetAmount } from "./sendSlice";
import { selectAbstractedAssetWithBalance } from "../assets/assetsSlice";
import { AbstractedAsset } from "../assets/types";
import {
  useFocusRing,
  useRadio,
  useRadioGroup,
  VisuallyHidden,
} from "react-aria";
import { useRadioGroupState } from "react-stately";
import { useContext, useRef, createContext } from "react";
import { motion } from "motion/react";
import { PresetAmountOption } from "./types";
import AmountSelector from "@/shared/components/ui/amount-selector/AmountSelector";
import AmountSelectorGroup from "@/shared/components/ui/amount-selector/AmountSelectorGroup";
import AmountDisplay from "@/shared/components/ui/amount-display/AmountDisplay";

const AssetSelectButton = ({
  abstractedAssetId,
  ...restProps
}: {
  abstractedAssetId: AbstractedAsset["id"] | null;
}) => {
  const dispatch = useDispatch();
  const asset = useSelector((state: RootState) =>
    abstractedAssetId
      ? selectAbstractedAssetWithBalance(state, abstractedAssetId)
      : null
  );

  return (
    <button
      onClick={() =>
        dispatch(toggleOverlay({ type: "selectAsset", isOpen: true }))
      }
      css={css`
        padding: var(--size-150);
        width: 100%;
        background-color: var(--clr-surface-raised);
        border-radius: var(--border-radius-medium);
        height: 4.25rem;
      `}
    >
      <div
        css={css`
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: var(--size-100);
          height: calc(4.25rem - var(--size-150) * 2);
        `}
      >
        <div
          css={css`
            display: grid;
            grid-template-columns: ${asset ? "auto 1fr" : "1fr"};
            align-content: center;
            gap: var(--size-150);
            align-content: center;
            height: calc(4.25rem - var(--size-150) * 2);
          `}
        >
          {asset ? (
            <>
              <div>
                <AssetIcon icon={asset.icon} />
              </div>
              <div
                css={css`
                  display: flex;
                  justify-content: space-between;
                `}
              >
                <div
                  className="title"
                  css={css`
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: center;
                  `}
                >
                  <p
                    css={css`
                      font-weight: var(--fw-active);
                      font-size: var(--fs-medium);
                    `}
                  >
                    {asset.label}
                  </p>
                  <p
                    css={css`
                      font-size: var(--fs-small);
                      color: var(--clr-text-neutral);
                      text-transform: uppercase;
                      margin-block-start: var(--size-050);
                    `}
                  >
                    {asset.symbol}
                  </p>
                </div>
                <div
                  className="balance"
                  css={css`
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    justify-content: center;
                  `}
                >
                  <p
                    css={css`
                      font-weight: var(--fw-active);
                      font-size: var(--fs-medium);
                    `}
                  >
                    {new Intl.NumberFormat("en-EN", {
                      style: "currency",
                      currency: "usd",
                    }).format(asset.balanceUSD)}
                  </p>
                  <p
                    css={css`
                      font-size: var(--fs-small);
                      color: var(--clr-text-neutral);
                      margin-block-start: var(--size-050);
                    `}
                  >
                    Available
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div
              css={css`
                height: calc(4.25rem - var(--size-150) * 2);
                align-content: center;
              `}
            >
              <p
                css={css`
                  font-size: var(--fs-medium);
                  font-weight: var(--fw-active);
                  color: var(--clr-text);
                  margin-inline-start: var(--size-150);
                `}
              >
                Select asset
              </p>
            </div>
          )}
        </div>
        <div className="icon-wrapper">
          <CaretRight color="var(--clr-icon)" size={20} weight="bold" />
        </div>
      </div>
    </button>
  );
};

const SendController = () => {
  const dispatch = useDispatch();

  const formattedAmount = useSelector(
    (state: RootState) => state.send.transaction.formattedAmount
  );

  const formattedAmountArr = formattedAmount.split("");
  const abstractedAssetId = useSelector(
    (state: RootState) => state.send.transaction.abstractedAssetId
  );

  const asset = useSelector((state: RootState) =>
    abstractedAssetId
      ? selectAbstractedAssetWithBalance(state, abstractedAssetId)
      : null
  );

  const transaction = useSelector((state: RootState) => state.send.transaction);

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
  return (
    <div
      className="send-controller"
      css={css`
        display: grid;
        grid-template-rows: 1fr auto auto;
        gap: var(--size-200);
        height: 100%;
      `}
    >
      <section
        css={css`
          padding-inline: var(--size-250);
          width: 100%;
        `}
      >
        <AmountDisplay amount={formattedAmountArr} />
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
        <AssetSelectButton abstractedAssetId={abstractedAssetId} />
      </section>
    </div>
  );
};

export default SendController;
