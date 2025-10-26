import { PolymorphicProps } from "@/shared/types/react.types";
import { css } from "@emotion/react";
import { CSSProperties, ElementType } from "react";
import Text, { TextProps } from "./Text";

type Props<E extends ElementType> = {
  size?:
    | "x-small"
    | "small"
    | "medium"
    | "large"
    | "x-large"
    | "xx-large"
    | "3x-large"
    | "4x-large";
} & Omit<TextProps<E>, "className" | "size">;

const Caption = <E extends ElementType>({
  size = "medium",
  ...restProps
}: Props<E>) => {
  const className = `caption-${size}`;
  return <Text {...restProps} className={className} />;
};

export default Caption;
