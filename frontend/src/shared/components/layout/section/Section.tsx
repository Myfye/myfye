import { PolymorphicProps } from "@/shared/types/react.types";
import { css } from "@emotion/react";
import { CSSProperties, ElementType, ReactNode } from "react";

const defaultElement = "div";

type Props<E extends ElementType = typeof defaultElement> = {
  padding?: "small" | "medium" | "large" | "none";
  marginTop?: CSSProperties["marginBlockStart"];
  marginBottom?: CSSProperties["marginBlockEnd"];
} & PolymorphicProps<E>;

const calcPadding = (padding: "small" | "medium" | "large" | "none") => {
  switch (padding) {
    case "small":
      return "var(--size-200)";
    case "medium":
      return "var(--size-250)";
    case "large":
      return "var(--size-400)";
    case "none":
      return "var(--size-0)";
    default:
      throw new Error("Invalid padding");
  }
};

const Section = <E extends ElementType = typeof defaultElement>({
  padding = "medium",
  children,
  as,
  marginTop,
  marginBottom,
}: Props<E>) => {
  const Component = as ?? defaultElement;
  const _padding = calcPadding(padding);
  return (
    <Component
      css={css`
        width: 100%;
        padding-inline: ${_padding};
        margin-top: ${marginTop};
        margin-bottom: ${marginBottom};
      `}
    >
      {children}
    </Component>
  );
};

export default Section;
