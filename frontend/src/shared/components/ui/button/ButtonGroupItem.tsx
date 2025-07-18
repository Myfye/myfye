import { useContext } from "react";
import Button from "./Button";
import { ButtonProps } from "./button.types";
import { ButtonGroupContext } from "./ButtonGroupContext";

interface ButtonGroupItemProps extends ButtonProps {}

const ButtonGroupItem = ({ ...restProps }: ButtonGroupItemProps) => {
  const { size, expand } = useContext(ButtonGroupContext);
  return (
    <li className="button-group-item">
      <Button size={size} expand={expand} {...restProps} />
    </li>
  );
};

export default ButtonGroupItem;
