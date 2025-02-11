import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import { ButtonContext, useContextProps } from "react-aria-components";
import { useButton } from "react-aria";
import { motion } from "motion/react";
import { ReactNode, Ref } from "react";

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
  children,
  ...restProps
}: ButtonProps) => {
  const Icon = icon;
  // Merge the local props and ref with the ones provided via context.
  const [restPropsButton, refButton] = useContextProps(
    restProps,
    ref,
    ButtonContext
  );

  let { buttonProps, isPressed } = useButton(restPropsButton, refButton);

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

export default Button;
