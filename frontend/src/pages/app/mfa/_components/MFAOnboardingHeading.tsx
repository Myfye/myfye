import { css } from "@emotion/react";
import { CheckIcon, Icon, KeyIcon } from "@phosphor-icons/react";
import { cn } from "cn-utility";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface MFAOnboardingHeadingProps {
  isActive?: boolean;
  icon?: Icon;
  title?: string;
}

const MFAOnboardingHeading = ({
  isActive = false,
  icon = KeyIcon,
  title = "",
}: MFAOnboardingHeadingProps) => {
  const Icon = icon;
  const activeState = isActive ? "active" : "inactive";

  return (
    <motion.div
      transition={{ duration: 0.75, ease: "easeOut" }}
      animate={activeState}
      css={css`
        display: flex;
        align-items: center;
        gap: var(--size-100);
      `}
    >
      <motion.div
        variants={{
          active: {
            width: 28,
            height: 28,
            "--_color": "var(--clr-primary)",
          },
          inactive: {
            width: 20,
            height: 20,
            "--_color": "var(--clr-text-weaker)",
          },
        }}
      >
        <Icon color="var(--_color)" width="100%" height="100%" />
      </motion.div>
      <motion.h2
        variants={{
          active: {
            "--_color": "var(--clr-text)",
            fontSize: "var(--fs-xx-large)",
            fontWeight: "var(--fw-heading)",
          },
          inactive: {
            "--_color": "var(--clr-text-weaker)",
            fontSize: "var(--fs-large)",
            fontWeight: "var(--fw-active)",
          },
        }}
        css={css`
          color: var(--_color);
          line-height: var(--line-height-heading);
        `}
      >
        {title}
      </motion.h2>
    </motion.div>
  );
};

export default MFAOnboardingHeading;
