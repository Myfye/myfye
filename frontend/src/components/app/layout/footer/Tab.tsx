/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import type { Icon } from "@phosphor-icons/react";
import { motion } from "motion/react";

import type { ButtonProps } from "react-aria-components";
import { ButtonContext, useContextProps } from "react-aria-components";
import { useButton } from "react-aria";
import { Ref } from "react";

type TabProps = {
  icon: Icon;
  active: boolean;
  title: string;
  ref: Ref<HTMLButtonElement | null>;
  restProps: ButtonProps;
};

const Tab = ({ icon, active, title, ref, ...restProps }: TabProps) => {
  const Icon = icon;

  const [restPropsButton, refButton] = useContextProps(
    restProps,
    ref,
    ButtonContext
  );

  let { buttonProps, isPressed } = useButton(restPropsButton, refButton);

  return (
    <li>
      <motion.button
        animate={{
          scale: isPressed ? 0.9 : 1,
        }}
        className="aspect-ratio-square"
        css={css`
          display: block;
          align-content: center;
          width: var(--size-700);
        `}
        {...buttonProps}
      >
        <Icon
          css={css`
            margin: 0 auto;
          `}
          color={
            active ? "var(--clr-accent)" : "var(--clr-text-neutral-strong)"
          }
          weight={active ? "fill" : "regular"}
          size={"var(--size-400)"}
        />
        <p
          css={css`
            margin-top: var(--size-025);
            font-weight: var(--fw-active);
            font-size: var(--fs-small);
            text-align: center;
            color: ${active ? "green" : "black"};
          `}
        >
          {title}
        </p>
      </motion.button>
    </li>
  );
};

export default Tab;
