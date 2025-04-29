import { AriaButtonProps, useButton } from "react-aria";
import { ButtonContext, useContextProps } from "react-aria-components";
import { motion } from "motion/react";

import { css } from "@emotion/react";
import { ReactNode, RefObject } from "react";

const UserCardController = ({
  children,
  ref,
  ...restProps
}: {
  children: ReactNode;
  ref: RefObject<HTMLButtonElement>;
  restProps: unknown;
}) => {
  const [buttonContextProps, buttonContextRef] = useContextProps(
    restProps,
    ref,
    ButtonContext
  );

  let { buttonProps, isPressed } = useButton(
    buttonContextProps,
    buttonContextRef
  );
  return (
    <motion.button
      {...buttonProps}
      className="user-card-controller"
      css={css`
        width: 100%;
      `}
      ref={ref}
      animate={{
        scale: isPressed ? 0.97 : 1,
      }}
    >
      {children}
    </motion.button>
  );
};

export default UserCardController;
