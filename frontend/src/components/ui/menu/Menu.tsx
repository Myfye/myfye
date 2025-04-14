import { MenuTrigger, Popover, Menu as AriaMenu } from "react-aria-components";

import { css } from "@emotion/react";
import Button from "../button/Button";

const Menu = ({ label, children, buttonProps, ...restProps }) => {
  return (
    <MenuTrigger {...restProps}>
      <Button {...buttonProps}>{label}</Button>
      <Popover>
        <AriaMenu {...restProps}>{children}</AriaMenu>
      </Popover>
    </MenuTrigger>
  );
};

export default Menu;
