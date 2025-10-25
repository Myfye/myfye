import { css } from "@emotion/react";
import MyfyeQRCode from "./MyfyeQRCode";
import { createPortal } from "react-dom";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  Variants,
} from "motion/react";
import { RefObject, useEffect } from "react";

const toggleMyfyeText: Variants = {
  hideMyfye: {
    width: "7.5rem",
  },
  showMyfye: {
    width: "15rem",
  },
};

const toggleMyfyeOpacity: Variants = {
  hideMyfye: {
    opacity: 0,
  },
  showMyfye: {
    opacity: 1,
  },
};

const QRCodePopupVariants: Variants = {
  initial: {
    y: 20,
  },
  animate: {
    y: 0,
  },
};

interface QRCodePopupProps {
  intersectRef: RefObject<HTMLElement>;
}

const QRCodePopup = ({ intersectRef }: QRCodePopupProps) => {
  const color = useMotionValue("#f8fbfc");
  const backgroundColor = useMotionValue("#02302C");

  const isInView = useInView(intersectRef, { amount: 0.31 });
  useEffect(() => {
    if (isInView) {
      animate(color, "#02302C", { duration: 0.2, ease: "linear" });
      animate(backgroundColor, "#dcfd8f", { duration: 0.2, ease: "linear" });
    } else {
      animate(color, "#f8fbfc", { duration: 0.2, ease: "linear" });
      animate(backgroundColor, "#02302C", { duration: 0.2, ease: "linear" });
    }
  }, [isInView]);

  return createPortal(
    <motion.div
      initial={["hideMyfye", "initial"]}
      whileHover="showMyfye"
      animate={["hideMyfye", "animate"]}
      variants={QRCodePopupVariants}
      transition={{ type: "spring", delay: 0.5 }}
      className="qr-code-popup"
      css={css`
        position: fixed;
        inset-inline-end: var(--size-400);
        inset-block-end: var(--size-400);
        isolation: isolate;
      `}
    >
      <motion.div
        style={{ backgroundColor }}
        css={css`
          display: grid;
          place-items: center;
          position: relative;
          z-index: 1;
          width: 7.5rem;
          aspect-ratio: 1;
          border-radius: var(--border-radius-medium);
        `}
      >
        <MyfyeQRCode
          width={112}
          height={112}
          color={color}
          backgroundColor={backgroundColor}
        />
      </motion.div>
      <motion.div
        variants={toggleMyfyeText}
        transition={{ duration: 0.6, ease: "circOut" }}
        style={{ backgroundColor }}
        css={css`
          position: absolute;
          z-index: 0;
          inset-block-start: 0;
          inset-inline-end: 0;
          height: 7.5rem;
          border-radius: var(--border-radius-medium);
          align-content: center;
          padding-inline-start: var(--size-100);
        `}
      >
        <motion.span
          variants={toggleMyfyeOpacity}
          transition={{ duration: 0.6, ease: "linear" }}
          css={css`
            display: grid;
            place-items: center;
            width: 7.5rem;
          `}
        >
          <motion.span
            style={{ color }}
            css={css`
              font-size: 1.5rem;
              line-height: var(--line-height-heading);
              font-weight: 700;
            `}
          >
            Get <br />
            Myfye
          </motion.span>
        </motion.span>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default QRCodePopup;
