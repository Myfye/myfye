const ButtonGroup = ({
  size = "medium",
  direction = "horizontal",
  scroll = true,
  children,
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
