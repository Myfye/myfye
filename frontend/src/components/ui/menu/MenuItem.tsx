import { MenuItemProps, MenuItem as AriaMenuItem } from "react-aria-components";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const MenuItem = (props: MenuItemProps) => {
  let textValue =
    props.textValue ||
    (typeof props.children === "string" ? props.children : undefined);
  return (
    <AriaMenuItem
      {...props}
      textValue={textValue}
      className={({ isFocused, isSelected, isOpen }) =>
        `my-item ${isFocused ? "focused" : ""} ${isOpen ? "open" : ""}`
      }
      css={css`
        display: flex;
        align-items: center;
        border-radius: var(--border-radius-medium);
        padding: var(--size-100) var(--size-100);
        width: 100%;
      `}
    >
      {({ hasSubmenu }) => (
        <>
          {props.children}
          {hasSubmenu && (
            <svg className="chevron" viewBox="0 0 24 24">
              <path d="m9 18 6-6-6-6" />
            </svg>
          )}
        </>
      )}
    </AriaMenuItem>
  );
};

export default MenuItem;
