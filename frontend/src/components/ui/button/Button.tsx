import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import { ButtonContext, useContextProps } from "react-aria-components";
import { useButton } from "react-aria";
import { motion } from "motion/react";
import { ReactNode, Ref, useCallback } from "react";

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
  wrap,
  expand = false,
  href,
  children,
  ...restProps
}) => {
  const Icon = icon;

  const getIconSize = useCallback(
    (size: string, iconOnly: boolean) => {
      switch (size) {
        case "x-small": {
          return !iconOnly ? 18 : 20;
        }
        case "small": {
          return !iconOnly ? 18 : 20;
        }
        case "medium": {
          return !iconOnly ? 18 : 24;
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
      {...buttonProps}
      data-variant={variant}
      data-size={size}
      data-color={color}
      data-expand={expand}
      data-icon-only={iconOnly}
      data-wrap={wrap}
      className={`button ${className}`}
      ref={ref}
      href={href}
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
