import { ElementType } from "react";
import Text, { TextProps } from "./Text";

const defaultElement = "p";

type Props<E extends ElementType> = {
  size?: "small" | "medium" | "large";
} & Omit<TextProps<E>, "className" | "as" | "size">;

const Heading = <E extends ElementType = typeof defaultElement>({
  size = "medium",
  ...restProps
}: Props<E>) => {
  const className = `body-${size}`;
  return <Text {...restProps} className={className} as={defaultElement} />;
};

export default Heading;
