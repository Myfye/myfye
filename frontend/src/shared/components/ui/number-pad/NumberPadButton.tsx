import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import { ButtonContext, useContextProps } from "react-aria-components";
import { useButton } from "react-aria";
import { motion } from "motion/react";
import { ReactNode, Ref, useRef } from "react";

import { css } from "@emotion/react";
import { Icon } from "@phosphor-icons/react";

interface NumberPadButtonProps extends AriaButtonProps {
  ref?: Ref<HTMLButtonElement | null>;
  icon: Icon | string;
}
const NumberPadButton = ({ ref, icon, ...restProps }: NumberPadButtonProps) => {
  if (!ref) ref = useRef<HTMLButtonElement>(null!);
  const [restPropsButton, refButton] = useContextProps(
    restProps,
    ref,
    ButtonContext
  );

  const Icon = icon;

  let { buttonProps, isPressed } = useButton(restPropsButton, refButton);

  return (
    <button
      {...buttonProps}
      ref={ref}
      css={css`
        display: grid;
        place-items: center;
        user-select: none;
        width: 100%;
        height: 100%;
        line-height: var(--line-height-tight);
        font-weight: var(--fw-heading);
        color: var(--clr-text);
        font-family: var(--font-family);
        font-size: 22px;
      `}
      type="button"
    >
      <motion.span
        animate={{
          scale: isPressed ? 1.2 : 1,
        }}
      >
        {typeof icon !== "string" ? (
          <Icon size={24} weight="bold" />
        ) : (
          <span>{icon}</span>
        )}
      </motion.span>
    </button>
  );
};

export default NumberPadButton;
