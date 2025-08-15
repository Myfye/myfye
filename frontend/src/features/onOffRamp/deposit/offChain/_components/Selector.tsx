import { RefObject, useContext, useEffect, useRef } from "react";
import {
  AriaRadioProps,
  useFocusRing,
  useRadio,
  VisuallyHidden,
} from "react-aria";
import { motion } from "motion/react";
import { css } from "@emotion/react";
import { SelectContext } from "./SelectContext";
import { Check } from "@phosphor-icons/react";

interface SelectorProps extends AriaRadioProps {
  ref?: RefObject<HTMLInputElement>;
}

const Selector = ({ ref, children, ...restProps }: SelectorProps) => {
  const state = useContext(SelectContext);
  if (!state) throw new Error("Amount Selector Context not found");
  if (!ref) ref = useRef<HTMLInputElement>(null!);
  const { inputProps, isSelected, isDisabled, isPressed } = useRadio(
    { ...restProps, children },
    state,
    ref
  );

  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <motion.label
      css={css`
        display: flex;
        align-items: center;
        font-weight: ${isSelected ? "var(--fw-heading)" : "var(--fw-default)"};
        background-color: ${isSelected
          ? "var(--clr-surface-lowered)"
          : "var(--clr-surface)"};
        padding: var(--size-150);
        border-radius: var(--border-radius-medium);
      `}
      animate={{
        scale: isPressed ? 0.9 : 1,
      }}
    >
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      {children}
      {isSelected && (
        <Check
          color="var(--clr-primary)"
          width={20}
          height={20}
          css={css`
            margin-inline-start: auto;
          `}
        />
      )}
    </motion.label>
  );
};

export default Selector;
