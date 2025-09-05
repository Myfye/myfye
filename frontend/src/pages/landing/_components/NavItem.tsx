import { css } from "@emotion/react";
import { ReactNode } from "react";

interface NavItemProps {
  href: string;
  children: ReactNode;
}

const NavItem = ({ href, children }: NavItemProps) => {
  return (
    <li>
      <a
        href={href}
        css={css`
          font-weight: var(--fw-active);
          font-size: var(--fs-medium);
          line-height: var(--line-height-tight);
          color: var(--clr-text-weaker);
          &:hover {
            color: var(--clr-text);
          }
          transition: 0.2s color linear;
        `}
      >
        {children}
      </a>
    </li>
  );
};

export default NavItem;
