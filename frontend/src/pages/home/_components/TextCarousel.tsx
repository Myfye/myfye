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

interface TextCarouselProps {
  textArray: string[];
  color?: string;
  fontSize?: number;
  lineHeight?: number;
  fontWeight?: string;
}
const TextCarousel = ({
  textArray,
  color = "var(--clr-primary)",
  fontSize = 1.5,
  lineHeight = 1.4,
  fontWeight = "600",
}: TextCarouselProps) => {
  const keyframes = textArray.map((_, i) => i + 1);

  const [textRef, animate] = useAnimate();

  useEffect(() => {
    const textListEl = textRef.current;
    const sequence = async () => {
      await animate(textListEl, { y: 0 }, { duration: 0.001, ease: "linear" });
      for (const frame of keyframes) {
        await animate(
          textListEl,
          {
            y: `${fontSize * lineHeight * -1 * frame}rem`,
          },
          { duration: 0.625, delay: 1 }
        );
      }
      sequence();
    };
    const init = async () => {
      await animate(textListEl, { y: 0 }, { duration: 0.25 });
    };
    init();
    sequence();
  }, []);

  return (
    <span
      css={css`
        display: inline-block;
        overflow-y: hidden;
        height: ${fontSize * lineHeight}rem;
      `}
    >
      <motion.span
        ref={textRef}
        css={css`
          display: inline-flex;
          flex-direction: column;
          color: ${color};
          font-weight: ${fontWeight};
          font-size: ${fontSize}rem;
          line-height: ${fontSize * lineHeight}rem;
        `}
      >
        {[...textArray, ...textArray].map((text, i) => (
          <motion.span
            key={`text-${i}`}
            aria-hidden={i > textArray.length - 1 ? true : false}
            css={css`
              display: inline-block;
              height: ${fontSize * lineHeight}rem;
              line-height: ${fontSize * lineHeight}rem;
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
