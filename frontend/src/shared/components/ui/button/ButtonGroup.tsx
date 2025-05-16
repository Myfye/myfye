import { ReactNode } from "react";

const ButtonGroup = ({
  size = "medium",
  direction = "horizontal",
  expand = "false",
  scroll = true,
  children,
  ...restProps
}: {
  size: "small" | "medium" | "large";
  direction: "horizontal" | "vertical";
  scroll?: boolean;
  children: ReactNode;
  expand?: boolean;
}) => {
  return (
    <menu
      className="button-group no-scrollbar"
      data-size={size}
      data-direction={direction}
      data-scroll={scroll}
      data-expand={expand}
      {...restProps}
    >
      {children}
    </menu>
  );
};

export default ButtonGroup;
