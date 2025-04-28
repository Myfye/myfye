import Button from "@/components/ui/button/Button";
import { css } from "@emotion/react";
import { CheckCircle, Info, Spinner, X, XCircle } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { ReactNode, RefCallback, RefObject, useEffect } from "react";
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
  singleton,
  onDismiss,
  ...restProps
}: {
  ref: RefCallback<HTMLLIElement> | RefObject<HTMLLIElement>;
  offset: number;
  type: ToastType;
  visible: boolean;
  message: ValueOrFunction<Renderable, ToastObj>;
  duration?: number;
  removeDelay?: number;
  singleton: boolean;
  onDismiss: () => void;
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

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.li
            className="toast"
            ref={ref}
            data-type={type}
            initial={{ y: singleton ? -100 : 0, opacity: 0 }}
            animate={{ y: offset, opacity: 1 }}
            exit={{ opacity: 0 }}
            css={css`
              overflow: hidden;
              /* &::before {
              content: "";
              bottom: 0;
              left: 0;
              position: absolute;
              width: 100%;
              height: 3px;
              background-color: var(--_color-active);
            } */
            `}
            {...restProps}
          >
            {Icon && <Icon size={28} weight="fill"></Icon>}
            {message as ReactNode}
            <Button
              size="small"
              iconOnly
              icon={X}
              onPress={onDismiss}
              color="transparent"
            />
          </motion.li>
        )}
      </AnimatePresence>
    </>
  );
};

export default Toast;
