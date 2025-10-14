import { PolymorphicProps } from "@/shared/types/react.types";
import { css } from "@emotion/react";
import { CSSProperties, ElementType } from "react";

const defaultElement = "div";

type Props<E extends ElementType> = {
  gap?: "small" | "medium" | "large";
  alignInline?: CSSProperties["alignContent"];
  alignBlock?: CSSProperties["alignItems"];
  spread?: CSSProperties["justifyContent"];
  wrap?: CSSProperties["flexWrap"];
  marginBottom?: CSSProperties["marginBlockEnd"];
  marginTop?: CSSProperties["marginBlockStart"];
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

const Inline = <E extends ElementType = typeof defaultElement>({
  gap = "medium",
  as,
  children,
  alignInline = "center",
  alignBlock = "center",
  spread = "center",
  marginBottom,
  marginTop,
  wrap,
}: Props<E>) => {
  const Component = as ?? defaultElement;

  const _gap = calcGap(gap);

  return (
    <Component
      className="stack"
      css={css`
        display: flex;
        flex-direction: row;
        gap: ${_gap};
        align-items: ${alignBlock};
        align-content: ${alignInline};
        justify-content: ${spread};
        flex-wrap: ${wrap};
        margin-block-start: ${marginTop};
        margin-block-end: ${marginBottom};
      `}
    >
      {children}
    </Component>
  );
};

export default Inline;
