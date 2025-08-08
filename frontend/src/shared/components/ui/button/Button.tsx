import { ButtonContext, useContextProps } from "react-aria-components";
import { useButton, useLink } from "react-aria";
import { motion, MotionProps } from "motion/react";
import { ButtonProps, LinkProps } from "./button.types";
import { getIconSize } from "./utils";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, useRef } from "react";
import RingLoader from "../loading/spinners/RingLoader";
import { css } from "@emotion/react";

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
  isLoading = false,
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

  const { buttonProps, isPressed } = useButton(restPropsButton, refButton);

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
      data-loading={isLoading}
      className={`button ${className ? className : ""} ${
        variant === "token-select" ? "token-select" : ""
      }`}
      ref={ref}
      animate={{
        scale: isPressed ? 0.9 : 1,
      }}
    >
      {isLoading && (
        <RingLoader
          width={iconSize}
          height={iconSize}
          fill="currentColor"
          css={css`
            margin-inline-end: var(--size-050);
          `}
        />
      )}
      {IconLeft && <IconLeft size={iconSize} />}
      {children}
      {IconRight && <IconRight size={iconSize} />}
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
  isLoading = false,
  children,
  ...restProps
}: LinkProps) => {
  const Icon = icon;
  const iconSize = getIconSize(size, iconOnly);

  if (!ref) ref = useRef<HTMLAnchorElement>(null!);

  const { linkProps, isPressed } = useLink({ ...restProps }, ref);

  return (
    // @ts-ignore
    <motion.a
      {...(linkProps as AnchorHTMLAttributes<HTMLAnchorElement> & MotionProps)}
      data-variant={variant}
      data-size={size}
      data-color={color}
      data-expand={expand}
      data-icon-only={iconOnly}
      data-border-radius={borderRadius}
      className={`button ${className ? className : ""} ${
        variant === "token-select" ? "token-select" : ""
      }`}
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

function isLinkProps(props: ButtonProps | LinkProps): props is LinkProps {
  return "href" in props && typeof props.href === "string";
}

const Button = (props: ButtonProps | LinkProps) => {
  return isLinkProps(props) ? (
    <_Link {...props} />
  ) : (
    <_Button {...props} isDisabled={props.isDisabled || props.isLoading} />
  );
};

export default Button;
