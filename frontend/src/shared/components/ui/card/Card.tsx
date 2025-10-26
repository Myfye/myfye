import { css } from "@emotion/react";
import { CSSProperties, ReactNode } from "react";

export type CardProps = {
  size?: "medium" | "large" | "x-large";
  children?: ReactNode;
  width?: "fullWidth" | number | string;
  marginTop?: CSSProperties["marginBlockStart"];
  marginBottom?: CSSProperties["marginBlockEnd"];
  height?: CSSProperties["height"];
};

const calcPadding = (size: "medium" | "large" | "x-large") => {
  switch (size) {
    case "medium":
      return "var(--size-150)";
    case "large":
      return "var(--size-200)";
    case "x-large":
      return "var(--size-250)";
    default:
      throw new Error("Invalid size");
  }
};

const Card = ({
  size = "medium",
  children,
  width,
  marginTop,
  marginBottom,
  height,
}: CardProps) => {
  const padding = calcPadding(size);
  return (
    <div
      css={css`
        width: ${width === "fullWidth"
          ? "100%"
          : typeof width === "number"
          ? width + "px"
          : width};
        padding: ${padding};
        border-radius: var(--border-radius-medium);
        background-color: var(--clr-surface-raised);
        margin-block-start: ${marginTop};
        margin-block-end: ${marginBottom};
        height: ${height};
        overflow: hidden;
      `}
    >
      {children}
    </div>
  );
};

export default Card;
