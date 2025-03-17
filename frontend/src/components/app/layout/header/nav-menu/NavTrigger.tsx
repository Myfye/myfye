import Button from "@/components/ui/button/Button";
import { List as ListIcon } from "@phosphor-icons/react";

const NavTrigger = ({ ...restProps }) => {
  return (
    <Button
      iconOnly
      icon={ListIcon}
      color="transparent"
      size="large"
      {...restProps}
    ></Button>
  );
};

export default NavTrigger;
