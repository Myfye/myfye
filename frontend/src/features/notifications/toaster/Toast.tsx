import { css } from "@emotion/react";
import { ReactNode, RefObject } from "react";
const Toast = ({
  ref,
  offset,
  visible,
  children,
  ...restProps
}: {
  ref: RefObject<HTMLLIElement>;
  offset: number;
  visible: boolean;
  children: ReactNode;
}) => {
  return (
    <li
      ref={ref}
      css={css`
        position: absolute;
        inset: 0;
        margin: auto;
        width: 15rem;
        height: 4rem;
        display: grid;
        place-items: center;
        backgroundcolor: var(--clr-surface-raised);
        box-shadow: var(--box-shadow-popout);
        transition: all 0.5s ease-out;
        opacity: ${visible ? 1 : 0};
        transform: translateY(${offset}px);
      `}
      {...restProps}
    >
      {children}
    </li>
  );
};

export default Toast;
