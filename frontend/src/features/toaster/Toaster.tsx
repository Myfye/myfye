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
        z-index: 99999;
        inset: 0;
        top: 100px;
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
          gutter: 8,
        });
        const ref = (el: HTMLLIElement) => {
          if (el && typeof toast.height !== "number") {
            const height = el.getBoundingClientRect().height;
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
            >
              {toast.message}
            </Toast>
          </>
        );
      })}
    </ul>
  );
};

export default Toaster;
