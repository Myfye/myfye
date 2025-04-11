import { useButton } from "react-aria";
import { ButtonContext, useContextProps } from "react-aria-components";
import { motion } from "motion/react";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const AssetCardController = ({
  showOptions = false,
  children,
  ref,
  ...restProps
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
      className="coin-card-controller"
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

export default AssetCardController;
