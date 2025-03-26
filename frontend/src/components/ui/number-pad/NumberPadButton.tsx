import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import { ButtonContext, useContextProps } from "react-aria-components";
import { useButton } from "react-aria";
import { motion } from "motion/react";
import { ReactNode, Ref } from "react";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

interface ButtonProps extends AriaButtonProps {
  ref: Ref<HTMLButtonElement | null>;
  variant: string;
  size: string;
  color: string;
  className: string;
  children: ReactNode;
  expand: boolean;
}
const NumberPadButton = ({ ref, icon, ...restProps }: ButtonProps) => {
  const [restPropsButton, refButton] = useContextProps(
    restProps,
    ref,
    ButtonContext
  );

  const Icon = icon;

  let { buttonProps, isPressed } = useButton(restPropsButton, refButton);

  return (
    <motion.button
      {...buttonProps}
      ref={ref}
      animate={{
        scale: isPressed ? 0.9 : 1,
      }}
      css={css`
        display: grid;
        place-items: center;
        user-select: none;
        width: 100%;
        height: 100%;
        line-height: var(--line-height-tight);
        font-weight: var(--fw-active);
        color: var(--clr-text);
        font-size: 24px;
      `}
      type="button"
    >
      {typeof icon !== "string" ? (
        <Icon size={24} weight="bold" />
      ) : (
        <span>icon</span>
      )}
    </motion.button>
  );
};

export default NumberPadButton;
