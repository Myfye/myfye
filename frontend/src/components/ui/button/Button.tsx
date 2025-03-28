import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import { ButtonContext, useContextProps } from "react-aria-components";
import { useButton } from "react-aria";
import { motion } from "motion/react";
import { ReactNode, Ref, useCallback } from "react";

interface ButtonProps extends AriaButtonProps {
  ref: Ref<HTMLButtonElement | null>;
  variant: string;
  size: string;
  color: string;
  className: string;
  children: ReactNode;
  expand: boolean;
}
const Button = ({
  ref,
  variant = "primary",
  color = "accent",
  size = "medium",
  className = "",
  icon,
  iconOnly,
  iconLeft = icon,
  iconRight,
  expand = false,
  href,
  children,
  ...restProps
}: ButtonProps) => {
  const Icon = icon;

  const getIconSize = useCallback(
    (size: string, iconOnly: boolean) => {
      switch (size) {
        case "small": {
          return !iconOnly ? 16 : 20;
        }
        case "medium": {
          return !iconOnly ? 16 : 24;
        }
        case "large": {
          return !iconOnly ? 20 : 32;
        }
      }
    },
    [size]
  );

  const iconSize = getIconSize(size, iconOnly);

  const [restPropsButton, refButton] = useContextProps(
    restProps,
    ref,
    ButtonContext
  );

  let { buttonProps, isPressed } = useButton(restPropsButton, refButton);

  return href ? (
    <motion.a
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
      {Icon && <Icon size={iconSize} />}
      {children}
    </motion.a>
  ) : (
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
      {Icon && <Icon size={iconSize} />}
      {children}
    </motion.button>
  );
};

export default Button;
