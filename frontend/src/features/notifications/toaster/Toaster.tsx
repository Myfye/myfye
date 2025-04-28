import { useToaster } from "react-hot-toast/headless";
import { css } from "@emotion/react";
import Toast from "./Toast";

const Toaster = () => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause, calculateOffset, updateHeight } = handlers;

  return (
    <ul
      className="toaster"
      css={css`
        position: fixed;
        z-index: 999999;
        inset: 0;
        top: var(--size-500);
        bottom: auto;
        margin: auto;
        isolation: isolate;
      `}
      onMouseEnter={startPause}
      onMouseLeave={endPause}
    >
      {toasts.map((toast) => {
        const offset = calculateOffset(toast, {
          reverseOrder: false,
          gutter: 6,
        });
        const ref = (node: HTMLLIElement) => {
          if (node && typeof toast.height !== "number") {
            const height = node.getBoundingClientRect().height;
            updateHeight(toast.id, height);
          }
        };
        return (
          <>
            <Toast
              ref={ref}
              {...toast.ariaProps}
              visible={toast.visible}
              offset={offset}
              type={toast.type}
              message={toast.message}
              duration={toast.duration}
              removeDelay={toast.removeDelay}
            />
          </>
        );
      })}
    </ul>
  );
};

export default Toaster;
