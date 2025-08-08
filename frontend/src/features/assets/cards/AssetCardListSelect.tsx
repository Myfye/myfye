import { css } from "@emotion/react";
import { useContext, createContext, useRef, RefObject, ReactNode } from "react";
import {
  AriaRadioProps,
  useFocusRing,
  useRadio,
  useRadioGroup,
  VisuallyHidden,
} from "react-aria";
import {
  RadioGroupProps,
  RadioGroupState,
  useRadioGroupState,
} from "react-stately";
import { AbstractedAsset } from "../types";
import AssetCard from "./AssetCard";
import { motion } from "motion/react";

const RadioContext = createContext<RadioGroupState>(null!);

interface AssetCardListRadioProps extends RadioGroupProps {
  children: ReactNode;
}
const AssetCardListRadio = ({
  children,
  ...restProps
}: AssetCardListRadioProps) => {
  const { label, description } = restProps;
  const state = useRadioGroupState(restProps);
  const { radioGroupProps, labelProps } = useRadioGroup(restProps, state);

  return (
    <div className="asset-card-list-wrapper">
      <VisuallyHidden>
        <p {...labelProps}>{label}</p>
      </VisuallyHidden>
      <ul
        {...radioGroupProps}
        className="asset-card-list"
        css={css`
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: var(--size-150);
        `}
      >
        <RadioContext.Provider value={state}>{children}</RadioContext.Provider>
      </ul>
    </div>
  );
};

interface AssetCardRadioProps extends AriaRadioProps {
  ref?: RefObject<HTMLInputElement>;
}
const AssetCardRadio = ({
  ref,
  children,
  ...restProps
}: AssetCardRadioProps) => {
  const state = useContext(RadioContext);
  if (!ref) ref = useRef<HTMLInputElement>(null!);
  const { inputProps, isSelected, isPressed } = useRadio(
    { children, ...restProps },
    state,
    ref
  );
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <li
      className="asset-card-wrapper"
      css={css`
        width: 100%;
      `}
    >
      <motion.label
        css={css`
          --_outline-opacity: 0;
          display: grid;
          width: 100%;
          height: 100%;
          display: inline-block;
          position: relative;
          isolation: isolate;
        `}
        animate={{
          scale: isPressed ? 0.9 : 1,
          "--_outline-opacity": isSelected ? 1 : 0,
          "--_background-color": isSelected
            ? "var(--clr-green-100)"
            : "var(--clr-surface-raised)",
        }}
      >
        <VisuallyHidden>
          <input {...inputProps} {...focusProps} ref={ref} />
        </VisuallyHidden>
        {children}
      </motion.label>
    </li>
  );
};

const AssetCardListSelect = ({
  assets,
  selectedAsset,
  onAssetSelect,
  showBalance = true,
  showBalanceUSD = true,
  showCurrencySymbol = true,
}: {
  assets: AbstractedAsset[];
  selectedAsset?: AbstractedAsset["id"] | null;
  showOptions?: boolean;
  onAssetSelect?: (abstractedAssetId: AbstractedAsset["id"]) => void;
  showBalance?: boolean;
  showBalanceUSD?: boolean;
  showCurrencySymbol?: boolean;
  radioGroup?: boolean;
}) => {
  return (
    <AssetCardListRadio
      label="Select an asset"
      value={selectedAsset}
      onChange={onAssetSelect}
    >
      {assets.map((asset: AbstractedAsset, i: number) => (
        <AssetCardRadio key={`asset-card-${i}`} value={asset.id}>
          <AssetCard
            id={asset.id}
            title={asset.label}
            symbol={asset.symbol}
            fiatCurrency={asset.fiatCurrency}
            // @ts-ignore Need to update assets to fix this
            balance={
              asset?.balanceUSD
                ? showBalanceUSD
                  ? asset.balanceUSD
                  : asset.balance
                : asset.balance
            }
            showCurrencySymbol={showCurrencySymbol}
            icon={asset.icon}
            showBalance={showBalance}
            radio
            isSelected={asset.id === selectedAsset}
          />
        </AssetCardRadio>
      ))}
    </AssetCardListRadio>
  );
};

export default AssetCardListSelect;
