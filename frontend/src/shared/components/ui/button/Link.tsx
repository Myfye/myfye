import type { LinkProps as AriaLinkProps } from "react-aria-components";
import { LinkContext, useContextProps } from "react-aria-components";
import { useLink } from "react-aria";
import { motion } from "motion/react";
import { ReactNode, Ref } from "react";

interface LinkProps extends AriaLinkProps {
  ref: Ref<HTMLAnchorElement | null>;
  variant: string;
  size: string;
  color: string;
  className: string;
  children: ReactNode;
  expand: boolean;
}
const Link = ({
  ref,
  variant = "primary",
  color = "primary",
  size = "medium",
  className = "",
  expand = false,
  children,
  ...restProps
}: LinkProps) => {
  // Merge the local props and ref with the ones provided via context.
  const [restPropsLink, refLink] = useContextProps(restProps, ref, LinkContext);

  let { linkProps, isPressed } = useLink(restPropsLink, refLink);

  return (
    <motion.a
      data-variant={variant}
      data-size={size}
      data-color={color}
      data-expand={expand}
      className={`button ${className}`}
      {...linkProps}
      ref={ref}
      animate={{
        scale: isPressed ? 0.9 : 1,
      }}
    >
      {children}
    </motion.a>
  );
};

export default Link;
