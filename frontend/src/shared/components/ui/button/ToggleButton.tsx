import { ButtonContext, useContextProps } from "react-aria-components";
import { useToggleButton } from "react-aria";
import { motion, MotionProps } from "motion/react";
import { ButtonHTMLAttributes, useRef } from "react";
import { useToggleState } from "react-stately";
import { ButtonProps } from "./button.types";
import { getIconSize } from "./utils";

const ToggleButton = ({
  ref,
  variant = "primary",
  color = "primary",
  size = "medium",
  className = "",
  icon,
  iconOnly,
  borderRadius,
  iconLeft = icon,
  iconRight,
  wrap = false,
  expand = false,
  children,
  ...restProps
}: ButtonProps) => {
  const IconRight = iconRight;
  const IconLeft = iconLeft;
  const iconSize = getIconSize(size, iconOnly);

  if (!ref) ref = useRef<HTMLButtonElement>(null!);

  const [restPropsButton, refButton] = useContextProps(
    { ...restProps, children },
    ref,
    ButtonContext
  );

  const state = useToggleState(restPropsButton);

  const { buttonProps, isPressed } = useToggleButton(
    restPropsButton,
    state,
    refButton
  );

  return (
    <motion.button
      {...(buttonProps as ButtonHTMLAttributes<HTMLButtonElement> &
        MotionProps)}
      data-variant={variant}
      data-size={size}
      data-color={color}
      data-expand={expand}
      data-icon-only={iconOnly}
      data-border-radius={borderRadius}
      className={`button ${buttonProps.className} ${
        variant === "token-select" ? "token-select" : ""
      }`}
      ref={ref}
      animate={{
        scale: isPressed ? 0.9 : 1,
      }}
    >
      {IconLeft && <IconLeft size={iconSize} />}
      {children}
      {IconRight && <IconRight size={iconSize} />}
    </motion.button>
  );
};

export default ToggleButton;
