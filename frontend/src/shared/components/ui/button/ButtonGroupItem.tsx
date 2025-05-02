import Button from "./Button";

const ButtonGroupItem = ({ expand = false, ...restProps }) => {
  return (
    <li className="item">
      <Button expand={expand} {...restProps}></Button>
    </li>
  );
};

export default ButtonGroupItem;
