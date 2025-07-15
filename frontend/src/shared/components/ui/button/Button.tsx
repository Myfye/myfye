// @ts-nocheck
import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import {
  LinkContext,
  ButtonContext,
  useContextProps,
} from "react-aria-components";
import { AriaLinkOptions, useButton, useLink } from "react-aria";
import { motion } from "motion/react";
import { ReactNode, Ref, RefObject, useCallback, useMemo } from "react";
import { Icon } from "@phosphor-icons/react";

type IconSize = "x-small" | "small" | "medium" | "large";

interface SharedButtonAndLinkProps {
  variant?: string;
  color?: string;
  size?: string;
  icon?: Icon;
  iconOnly?: boolean;
  iconLeft?: Icon;
  iconRight?: Icon;
  wrap?: boolean;
  expand?: boolean;
  borderRadius?: string;
}

interface ButtonProps extends AriaButtonProps, SharedButtonAndLinkProps {
  ref: RefObject<HTMLButtonElement>;
}

interface LinkProps extends AriaLinkOptions, SharedButtonAndLinkProps {
  ref: RefObject<HTMLAnchorElement>;
  href?: string;
}

const getIconSize = (size: IconSize, iconOnly?: boolean) => {
  switch (size) {
    case "x-small": {
      return !iconOnly ? 16 : 16;
    }
    case "small": {
      return !iconOnly ? 16 : 18;
    }
    case "medium": {
      return !iconOnly ? 18 : 20;
    }
    case "large": {
      return !iconOnly ? 20 : 24;
    }
  }
};

const _Button = ({
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
  iconProps,
  children,
  ...restProps
}: ButtonProps) => {
  const IconRight = iconRight;
  const IconLeft = iconLeft || icon;

  const iconSize = getIconSize(size, iconOnly);

  const [restPropsButton, refButton] = useContextProps(
    { ...restProps, children, className },
    ref,
    ButtonContext
  );

  const { buttonProps, isPressed } = useButton(restPropsButton, refButton);

  return (
    // @ts-ignore
    <motion.button
      {...buttonProps}
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
      {IconLeft && <IconLeft size={iconSize} {...iconProps} />}
      {children}
      {IconRight && <IconRight size={iconSize} {...iconProps} />}
    </motion.button>
  );
};

const _Link = ({
  ref,
  variant = "primary",
  color = "primary",
  size = "medium",
  className,
  borderRadius,
  icon,
  iconOnly = false,
  iconLeft = icon,
  iconRight,
  wrap = false,
  expand = false,
  children,
  iconProps,
  ...restProps
}: LinkProps) => {
  const Icon = icon;

  const iconSize = getIconSize(size, iconOnly);

  const { linkProps, isPressed } = useLink(
    { ...restProps, children, className },
    ref
  );

  return (
    // @ts-ignore
    <motion.a
      {...linkProps}
      data-variant={variant}
      data-size={size}
      data-color={color}
      data-expand={expand}
      data-icon-only={iconOnly}
      data-border-radius={borderRadius}
      className={`button ${linkProps.className} ${
        variant === "token-select" ? "token-select" : ""
      }`}
      ref={ref}
      animate={{
        scale: isPressed ? 0.9 : 1,
      }}
    >
      {Icon && <Icon size={iconSize} {...iconProps} />}
      {children}
    </motion.a>
  );
};

const Button = (props: ButtonProps | LinkProps) => {
  if ("href" in props && props.href !== undefined) {
    return <_Link {...props} />;
  }
  return <_Button {...props} />;
};

export default Button;
