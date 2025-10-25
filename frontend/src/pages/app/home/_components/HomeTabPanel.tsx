import { css } from "@emotion/react";
import { useRef } from "react";
import { AriaTabPanelProps, useTabPanel } from "react-aria";
import { TabListState } from "react-stately";
import { AnimatePresence, motion, usePresenceData } from "motion/react";

const HomeTabPanel = ({
  state,
  ...props
}: AriaTabPanelProps & { state: TabListState<unknown> }) => {
  const ref = useRef(null);
  const { tabPanelProps } = useTabPanel(props, state, ref);
  const direction = usePresenceData();
  return (
    <motion.div
      {...tabPanelProps}
      initial={{ x: 20 * direction, opacity: 0, filter: "blur(2px)" }}
      animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
      exit={{ x: -20 * direction, opacity: 0, filter: "blur(2px)" }}
      transition={{
        duration: 0.3,
        type: "spring",
        bounce: 0,
      }}
      ref={ref}
      css={css`
        width: 100%;
        container: ${state.selectedKey}-panel / size;
        height: 100%;
      `}
    >
      {state.selectedItem?.props.children}
    </motion.div>
  );
};

export default HomeTabPanel;
