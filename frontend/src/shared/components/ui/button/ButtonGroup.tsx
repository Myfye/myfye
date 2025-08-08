import { HTMLProps } from "react";
import { ButtonGroupContext } from "./ButtonGroupContext";

interface ButtonGroupProps extends Omit<HTMLProps<HTMLMenuElement>, "size"> {
  /** Button sizes */
  size?: "x-small" | "small" | "medium" | "large" | "x-large";
  /** Button directions */
  direction?: "horizontal" | "vertical";
  /** Expand buttons to fill space available */
  expand?: boolean;
  /** Enable scrolling */
  scroll?: boolean;
  /** Should buttons be equal size? */
  equalSize?: boolean;
}
const ButtonGroup = ({
  size = "medium",
  direction = "horizontal",
  expand = false,
  scroll = true,
  ...restProps
}: ButtonGroupProps) => {
  return (
    <ButtonGroupContext value={{ size, expand }}>
      <menu
        className="button-group no-scrollbar"
        data-size={size}
        data-direction={direction}
        data-scroll={scroll}
        data-expand={expand}
        {...restProps}
      />
    </ButtonGroupContext>
  );
};

export default ButtonGroup;
