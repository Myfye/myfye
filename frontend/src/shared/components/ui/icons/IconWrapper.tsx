import { css } from "@emotion/react";
import { createContext, ReactNode } from "react";
import { getIconWrapperSize, IconSize } from "./utils";

interface IconWrapperProps {
  children?: ReactNode;
  width?: string;
  backgroundColor?: string;
  border?: string;
  height?: string;
  size?: IconSize;
}

const IconContext = createContext<{
  size: IconSize;
} | null>(null);

const IconWrapper = ({
  children,
  backgroundColor = "transparent",
  border = "none",
  size = "medium",
}: IconWrapperProps) => {
  const iconWrapperSize = getIconWrapperSize(size);
  return (
    <IconContext value={{ size }}>
      <div
        className="icon-wrapper"
        css={css`
          display: grid;
          place-items: center;
          background-color: ${backgroundColor};
          overflow: hidden;
          width: ${iconWrapperSize};
          aspect-ratio: 1;
          border-radius: var(--border-radius-circle);
          border: ${border};
        `}
      >
        {children}
      </div>
    </IconContext>
  );
};
export default IconWrapper;
