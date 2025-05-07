import { css } from "@emotion/react";
import {
  motion,
  useAnimate,
  useAnimationControls,
  useMotionValue,
  useTransform,
  Variant,
} from "motion/react";
import { useEffect, useRef } from "react";

const TextCarousel = ({ textArray }: { textArray: string[] }) => {
  const y = useMotionValue(0);

  const keyframes = textArray.map((_, i) => i + 1);

  const [textRef, animate] = useAnimate();

  useEffect(() => {
    const textListEl = textRef.current;
    const sequence = async () => {
      await animate(textListEl, { y: 0 }, { duration: 0.01 });
      for (const frame of keyframes) {
        await animate(
          textListEl,
          {
            y: `${1.625 * -1 * frame}rem`,
          },
          { duration: 0.625, delay: 1 }
        );
      }
      sequence();
    };
    sequence();
  }, []);

  return (
    <span
      css={css`
        display: inline-block;
        overflow-y: hidden;
        height: 1.625rem;
      `}
    >
      <motion.span
        ref={textRef}
        css={css`
          display: inline-flex;
          flex-direction: column;
          color: var(--clr-green-300);
          font-weight: 600;
        `}
      >
        {[...textArray, ...textArray].map((text, i) => (
          <motion.span
            key={`text-${i}`}
            aria-hidden={i > textArray.length - 1 ? true : false}
            css={css`
              display: inline-block;
              height: 1.625rem;
              line-height: 1.625rem;
            `}
          >
            {text}
          </motion.span>
        ))}
      </motion.span>
    </span>
  );
};
export default TextCarousel;
