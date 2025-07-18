import Button from "./Button";
import { ButtonProps } from "./button.types";

interface ButtonGroupItemProps extends ButtonProps {}

const ButtonGroupItem = ({ ...restProps }: ButtonGroupItemProps) => {
  return (
    <li className="button-group-item">
      <Button {...restProps} />
    </li>
  );
};

export default ButtonGroupItem;
