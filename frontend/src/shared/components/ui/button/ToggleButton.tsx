import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import { ButtonContext, useContextProps } from "react-aria-components";
import { useToggleButton } from "react-aria";
import { motion } from "motion/react";
import { ReactNode, Ref } from "react";
import { useToggleState } from "react-stately";

interface ButtonProps extends AriaButtonProps {
  ref: Ref<HTMLButtonElement | null>;
  variant: string;
  size: string;
  color: string;
  className: string;
  children: ReactNode;
  expand: boolean;
}
const ToggleButton = ({
  ref,
  variant = "primary",
  color = "primary",
  size = "medium",
  className = "",
  icon,
  iconOnly,
  iconLeft = icon,
  iconRight,
  expand = false,
  children,
  ...restProps
}: ButtonProps) => {
  const Icon = icon;

  const [restPropsButton, refButton] = useContextProps(
    restProps,
    ref,
    ButtonContext
  );

  const state = useToggleState(restPropsButton);

  const { buttonProps, isPressed } = useToggleButton(
    restPropsButton,
    state,
    refButton
  );

  console.log(restPropsButton);

  return (
    <motion.button
      data-variant={variant}
      data-size={size}
      data-color={color}
      data-expand={expand}
      data-icon-only={iconOnly}
      className={`button ${className}`}
      {...buttonProps}
      ref={ref}
      animate={{
        scale: isPressed ? 0.9 : 1,
      }}
    >
      {Icon && <Icon size={"var(--_icon-size)"} />}
      {children}
    </motion.button>
  );
};

export default ToggleButton;
