import { Icon } from "@phosphor-icons/react";
import { ReactNode, RefObject } from "react";
import { AriaButtonProps, AriaLinkOptions } from "react-aria";

export type IconSize = "x-small" | "small" | "medium" | "large";

export type ButtonSize =
  | "x-small"
  | "small"
  | "medium"
  | "large"
  | "x-large"
  | "xx-large";

// Todo: make icon unavailable if iconLeft or iconRight are defined
// Todo: make iconOnly available if icon is defined, neither icon left nor right can be defined

export interface SharedButtonAndLinkProps {
  variant?: string;
  color?: string;
  size?: ButtonSize;
  icon?: Icon;
  iconOnly?: boolean;
  iconLeft?: Icon;
  iconRight?: Icon;
  wrap?: boolean;
  expand?: boolean;
  borderRadius?: string;
  className?: string;
  isLoading?: boolean;
}

export interface ButtonProps extends AriaButtonProps, SharedButtonAndLinkProps {
  ref?: RefObject<HTMLButtonElement>;
}

export interface LinkProps extends AriaLinkOptions, SharedButtonAndLinkProps {
  ref?: RefObject<HTMLAnchorElement>;
  href: string;
  children?: ReactNode;
}
