import { css } from "@emotion/react";
import { CheckCircle, Info, Spinner, XCircle } from "@phosphor-icons/react";
import { ReactNode, RefCallback, RefObject } from "react";
import {
  Renderable,
  Toast as ToastObj,
  ToastType,
  ValueOrFunction,
} from "react-hot-toast/headless";

const Toast = ({
  ref,
  offset,
  visible,
  type,
  message,
  duration,
  removeDelay,
  ...restProps
}: {
  ref: RefCallback<HTMLLIElement> | RefObject<HTMLLIElement>;
  offset: number;
  type: ToastType;
  visible: boolean;
  message: ValueOrFunction<Renderable, ToastObj>;
  duration?: number;
  removeDelay?: number;
}) => {
  const Icon = (() => {
    switch (type) {
      case "error": {
        return XCircle;
      }
      case "success": {
        return CheckCircle;
      }

      default: {
        return Info;
      }
    }
  })();

  const totalDuration = (duration ?? 0) + (removeDelay ?? 0);

  return (
    <li
      className="toast"
      ref={ref}
      data-type={type}
      css={css`
        opacity: ${visible ? 1 : 0};
        transform: translateY(${offset}px);
        overflow: hidden;
        &::before {
          content: "";
          display: ${totalDuration === 0 ? "none" : "block"};
          bottom: 0;
          left: 0;
          position: absolute;
          width: 100%;
          height: 3px;
          background-color: var(--_color-active);
          animation: toast-time ${totalDuration}ms linear;
        }
      `}
      {...restProps}
    >
      {Icon && <Icon size={28} weight="fill"></Icon>}
      {message as ReactNode}
    </li>
  );
};

export default Toast;
