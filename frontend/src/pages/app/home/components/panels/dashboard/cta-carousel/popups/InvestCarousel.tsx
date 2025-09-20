import { css } from "@emotion/react";
import React, { Children, ReactNode } from "react";
import { motion } from "motion/react";

interface InvestCarouselProps {
  children?: ReactNode;
}
const InvestCarousel = ({ children }: InvestCarouselProps) => {
  const gap = "var(--size-200)";
  const columnSize = "10rem";
  const duration = 20;
  const delay = 0.2;
  return (
    <div className="carousel-wrapper">
      <div
        className="carousel"
        css={css`
          display: flex;
          overflow: hidden;
          gap: ${gap};
          padding-inline: var(--size-400);
        `}
      >
        <motion.ul
          css={css`
            display: grid;
            grid-auto-columns: ${columnSize};
            grid-auto-flow: dense column;
            gap: ${gap};
            width: max-content;
          `}
          initial={{ x: 0 }}
          animate={{
            x: `-100%`,
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
            delay,
          }}
        >
          {children}
        </motion.ul>
        <motion.ul
          aria-hidden="true"
          css={css`
            display: grid;
            grid-auto-columns: ${columnSize};
            grid-auto-flow: dense column;
            gap: ${gap};
            width: max-content;
          `}
          initial={{ x: 0 }}
          animate={{
            x: `-100%`,
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
            delay,
          }}
        >
          {Children.map(children, (child) => React.cloneElement(child))}
        </motion.ul>
      </div>
    </div>
  );
};

export default InvestCarousel;
