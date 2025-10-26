import { PolymorphicProps } from "@/shared/types/react.types";
import { css } from "@emotion/react";
import { CSSProperties, ElementType } from "react";

const defaultElement = "div";

type Props<E extends ElementType> = {
  gap?: "small" | "medium" | "large" | "none";
  alignBlock?: CSSProperties["alignItems"];
  alignInline?: CSSProperties["alignItems"];
  spread?: CSSProperties["justifyContent"];
  height?: CSSProperties["height"];
  isolate?: "first" | "last" | "none";
  isolateMargin?:
    | CSSProperties["paddingBlockStart"]
    | CSSProperties["paddingBlockEnd"];
  minHeight?: CSSProperties["minHeight"];
} & PolymorphicProps<E>;

const calcGap = (gap?: "small" | "medium" | "large" | "none") => {
  switch (gap) {
    case "small":
      return "var(--size-100)";
    case "medium":
      return "var(--size-200)";
    case "large":
      return "var(--size-300)";
    case "none":
      return "var(--size-0)";
    default:
      throw new Error("Invalid gap");
  }
};

const Stack = <E extends ElementType = typeof defaultElement>({
  gap = "medium",
  as,
  children,
  alignInline = "center",
  alignBlock = "center",
  spread = "center",
  height = "auto",
  minHeight,
  isolate = "none",
  isolateMargin,
}: Props<E>) => {
  const Component = as ?? defaultElement;

  const _gap = calcGap(gap);

  return (
    <Component
      className="stack"
      css={css`
        display: flex;
        flex-direction: column;
        gap: ${_gap};
        align-items: ${alignInline};
        align-content: ${alignBlock};
        justify-content: ${spread};
        height: ${height};
        min-height: ${minHeight};
        > :last-child {
          margin-block-start: ${isolate === "last" ? "auto" : undefined};
          padding-block-start: ${isolate === "last"
            ? isolateMargin
            : undefined};
          margin-block-end: ${isolate === "first" ? "auto" : undefined};
          padding-block-end: ${isolate === "first" ? isolateMargin : undefined};
        }
      `}
    >
      {children}
    </Component>
  );
};

export default Stack;
