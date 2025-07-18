import { HTMLProps } from "react";

interface ButtonGroupProps extends Omit<HTMLProps<HTMLMenuElement>, "size"> {
  size?: "x-small" | "small" | "medium" | "large" | "x-large";
  direction?: "horizontal" | "vertical";
  expand?: boolean;
  scroll?: boolean;
}
const ButtonGroup = ({
  size = "medium",
  direction = "horizontal",
  expand = false,
  scroll = true,
  ...restProps
}: ButtonGroupProps) => {
  return (
    <menu
      className="button-group no-scrollbar"
      data-size={size}
      data-direction={direction}
      data-scroll={scroll}
      data-expand={expand}
      {...restProps}
    />
  );
};

export default ButtonGroup;
