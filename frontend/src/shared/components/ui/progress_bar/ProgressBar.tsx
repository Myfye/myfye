import { css } from "@emotion/react";
import { motion } from "motion/react";
import { VisuallyHidden } from "react-aria";
import {
  ProgressBar as AriaProgressBar,
  Label,
  ProgressBarProps,
} from "react-aria-components";

interface MyProgressBarProps extends ProgressBarProps {
  label?: string;
}

const ProgressBar = ({ label, ...props }: MyProgressBarProps) => {
  return (
    <AriaProgressBar {...props}>
      {({ percentage, valueText }) => (
        <>
          <VisuallyHidden>
            <Label>{label}</Label>
            <span className="value">{valueText}</span>
          </VisuallyHidden>
          <div
            className="bar"
            css={css`
              top: 50%;
              transform: translateY(-50%);
              height: var(--size-100);
              width: 100%;
              border-radius: var(--border-radius-pill);
              background-color: var(--clr-neutral-300);
            `}
          >
            <motion.div
              className="fill"
              css={css`
                position: absolute;
                height: var(--size-100);
                top: 50%;
                transform: translateY(-50%);
                border-radius: var(--border-radius-pill);
                background-color: var(--clr-primary);
              `}
              initial={false}
              animate={{ width: percentage + "%" }}
            />
          </div>
        </>
      )}
    </AriaProgressBar>
  );
};

export default ProgressBar;
