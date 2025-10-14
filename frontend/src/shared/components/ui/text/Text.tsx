import { PolymorphicProps } from "@/shared/types/react.types";
import { css } from "@emotion/react";
import { CSSProperties, ElementType } from "react";

const defaultElement = "p";

export type TextProps<E extends ElementType = typeof defaultElement> = {
  className?: string;
  align?: CSSProperties["textAlign"];
  weight?: CSSProperties["fontWeight"];
  color?: CSSProperties["color"];
  size?:
    | "xx-small"
    | "small"
    | "medium"
    | "large"
    | "x-large"
    | "xx-large"
    | "3x-large";
  marginTop?: CSSProperties["marginBlockStart"];
  marginBottom?: CSSProperties["marginBlockEnd"];
  leading?: CSSProperties["lineHeight"];
} & PolymorphicProps<E>;

const Text = <E extends ElementType = typeof defaultElement>({
  color = "var(--clr-text)",
  align = "start",
  marginTop,
  marginBottom,
  as,
  weight,
  className,
  children,
  size,
  leading,
}: TextProps<E>) => {
  const Component = as ?? defaultElement;
  const fontSize = size && `var(--fs-${size})`;
  return (
    <Component
      className={className}
      css={css`
        color: ${color};
        text-align: ${align};
        font-weight: ${weight};
        margin-block-start: ${marginTop};
        margin-block-end: ${marginBottom};
        line-height: ${leading};
      `}
      style={{ fontSize }}
    >
      {children}
    </Component>
  );
};

export default Text;
