import { css } from "@emotion/react";
import { useRef } from "react";
import { AriaTabProps, useTab } from "react-aria";
import { Node, TabListState } from "react-stately";
import { motion } from "motion/react";

const HomeTab = ({
  item,
  state,
}: {
  item: Node<object>;
  state: TabListState<unknown>;
}) => {
  const { key, rendered } = item;
  const ref = useRef<HTMLDivElement>(null!);
  const { tabProps } = useTab({ key }, state, ref);

  return (
    <motion.div
      {...tabProps}
      animate={state.selectedKey === key ? "active" : "inactive"}
      variants={{
        active: {
          color: "var(--clr-primary)",
        },
        inactive: {
          color: "var(--clr-text-neutral-strong)",
        },
      }}
      transition={{
        type: "spring",
        bounce: 0,
        duration: 0.6,
      }}
      ref={ref}
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: var(--fs-medium);
        font-weight: var(--fw-active);
        height: 3rem;
        cursor: pointer;
        transition: color 200ms ease-out;
        color: var(--clr-text-neutral-strong);
      `}
    >
      <span
        css={css`
          display: inline-block;
          padding-block-start: 0.5rem;
        `}
      >
        {rendered}
      </span>
    </motion.div>
  );
};

export default HomeTab;
