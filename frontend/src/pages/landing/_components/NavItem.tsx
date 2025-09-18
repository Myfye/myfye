import { css } from "@emotion/react";
import { ReactNode } from "react";

interface NavItemProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
}

const NavItem = ({ href, onClick, children }: NavItemProps) => {
  if (onClick) {
    return (
      <li>
        <button
          onClick={onClick}
          css={css`
            font-weight: var(--fw-active);
            font-size: var(--fs-medium);
            line-height: var(--line-height-tight);
            color: var(--clr-text-weaker);
            background: none;
            border: none;
            cursor: pointer;
            &:hover {
              color: var(--clr-text);
            }
            transition: 0.2s color linear;
          `}
        >
          {children}
        </button>
      </li>
    );
  }

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
