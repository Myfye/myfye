import { ReactNode } from "react";

const ButtonGroup = ({
  size = "medium",
  direction = "horizontal",
  scroll = true,
  children,
}: {
  size: "small" | "medium" | "large";
  direction: "horizontal" | "vertical";
  scroll?: boolean;
  children: ReactNode;
}) => {
  return (
    <menu
      className="button-group no-scrollbar"
      data-size={size}
      data-direction={direction}
      data-scroll={scroll}
    >
      {children}
    </menu>
  );
};

export default ButtonGroup;
