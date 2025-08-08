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
import { motion } from "motion/react";
import { Collection } from "react-aria-components";
import { BankInfo } from "../withdrawOffChain.types";
import BankCard from "./BankCard";

const RadioContext = createContext<RadioGroupState>(null!);

interface AssetCardListRadioProps {
  label: string;
  children: ReactNode;
}
const BankCardList = ({
  label,
  children,
  ...restProps
}: AssetCardListRadioProps) => {
  return (
    <div className="bank-card-list-wrapper">
      <VisuallyHidden>
        <p>{label}</p>
      </VisuallyHidden>
      <ul
        className="bank-card-list"
        css={css`
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%;
          gap: var(--size-150);
        `}
      >
        {children}
      </ul>
    </div>
  );
};

interface AssetCardRadioProps extends AriaRadioProps {
  ref?: RefObject<HTMLInputElement>;
}
const BankCardRadio = ({
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

const BankCardListSelect = ({
  banks,
  onBankSelect,
}: {
  banks: BankInfo[];
  selectedBank?: string | null;
  onBankSelect?: (bankCode: string) => void;
}) => {
  return (
    <BankCardList label="Select an asset">
      <Collection items={banks}>
        {(bank) => (
          <BankCard
            icon={bank.icon}
            name={bank.label}
            onPress={() => onBankSelect && onBankSelect(bank.code)}
          />
        )}
      </Collection>
    </BankCardList>
  );
};

export default BankCardListSelect;
