// @ts-nocheck
import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import {
  LinkContext,
  ButtonContext,
  useContextProps,
} from "react-aria-components";
import { useButton, useLink } from "react-aria";
import { motion } from "motion/react";
import { ReactNode, Ref, RefObject, useCallback, useMemo } from "react";
import { Icon } from "@phosphor-icons/react";

interface ButtonProps {
  ref: RefObject<HTMLButtonElement>;
  variant: string;
  color: string;
  size: string;
  className: string;
  icon: Icon;
  iconOnly: boolean;
  iconLeft: Icon;
  iconRight: Icon;
  wrap: boolean;
  expand: boolean;
  children: ReactNode;
}

interface LinkProps {
  ref: RefObject<HTMLAnchorElement>;
  variant: string;
  color: string;
  size: string;
  className: string;
  icon: Icon;
  iconOnly: boolean;
  iconLeft: Icon;
  iconRight: Icon;
  wrap: boolean;
  expand: boolean;
  href: string | undefined;
  children: ReactNode;
}

const _Button = ({
  ref,
  variant = "primary",
  color = "accent",
  size = "medium",
  className = "",
  icon,
  iconOnly,
  iconLeft = icon,
  iconRight,
  wrap = false,
  expand = false,
  children,
  ...restProps
}: ButtonProps) => {
  const Icon = icon;

  const iconSize = useMemo(() => {
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
  }, [size]);

  const [restPropsButton, refButton] = useContextProps(
    restProps,
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
      className={`button ${className}`}
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

const _Link = ({
  ref,
  variant = "primary",
  color = "accent",
  size = "medium",
  className = "",
  icon,
  iconOnly,
  iconLeft = icon,
  iconRight,
  wrap = false,
  expand = false,
  children,
  ...restProps
}: LinkProps) => {
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

  const { linkProps, isPressed } = useLink(restProps, ref);

  return (
    // @ts-ignore
    <motion.a
      {...linkProps}
      data-variant={variant}
      data-size={size}
      data-color={color}
      data-expand={expand}
      data-icon-only={iconOnly}
      className={`button ${className}`}
      ref={ref}
      animate={{
        scale: isPressed ? 0.9 : 1,
      }}
    >
      {Icon && <Icon size={iconSize} />}
      {children}
    </motion.a>
  );
};

const Button = ({
  href,
  children,
  ...restProps
}: {
  href: string | undefined;
  children: ReactNode;
  restProps: LinkProps | ButtonProps;
}) => {
  return href ? (
    // @ts-ignore
    <_Link href={href} {...restProps}>
      {children}
    </_Link>
  ) : (
    // @ts-ignore
    <_Button {...restProps}>{children}</_Button>
  );
};

export default Button;
