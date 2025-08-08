import { RefObject, useContext, useRef } from "react";
import {
  AriaRadioProps,
  useFocusRing,
  useRadio,
  VisuallyHidden,
} from "react-aria";
import { DepositRadioContext } from "./DepositRadioContext";
import { motion } from "motion/react";
import { css } from "@emotion/react";

interface DepositRadioProps extends AriaRadioProps {
  ref?: RefObject<HTMLInputElement>;
}

const DepositRadio = ({ ref, children, ...restProps }: DepositRadioProps) => {
  const state = useContext(DepositRadioContext);
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
      className="button"
      data-size="small"
      data-color="neutral"
      data-variant="primary"
      data-expand="true"
      css={css`
        --_outline-opacity: 0;
        display: inline-block;
        position: relative;
        isolation: isolate;
        user-select: none;
        &::before {
          content: "";
          display: block;
          position: absolute;
          inset: 0;
          margin: auto;
          outline: 2px solid var(--clr-primary);
          outline-offset: -1px;
          z-index: 1;
          user-select: none;
          pointer-events: none;
          opacity: var(--_outline-opacity);
          border-radius: var(--border-radius-pill);
        }
      `}
      animate={{
        scale: isPressed ? 0.9 : 1,
      }}
    >
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      {children}
    </motion.label>
  );
};

export default DepositRadio;
