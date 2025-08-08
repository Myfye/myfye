import { css } from "@emotion/react";
import { ReactNode } from "react";

interface IconWrapperProps {
  children?: ReactNode;
  width?: string;
  backgroundColor?: string;
}
const IconWrapper = ({
  children,
  width = "2.75rem",
  backgroundColor = "transparent",
}: IconWrapperProps) => {
  return (
    <div
      className="icon-wrapper"
      css={css`
        display: grid;
        place-items: center;
        background-color: ${backgroundColor};
        aspect-ratio: 1;
        overflow: hidden;
        width: ${width};
        border-radius: var(--border-radius-circle);
      `}
    >
      {children}
    </div>
  );
};
export default IconWrapper;
