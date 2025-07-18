import { css } from "@emotion/react";
import { HTMLAttributes, ReactNode } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
}

const Section = ({
  title = "",
  action,
  children,
  ...restProps
}: SectionProps) => {
  return (
    <section {...restProps}>
      <hgroup
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-block-end: var(--size-150);
        `}
      >
        <h2
          className="heading-medium"
          css={css`
            color: var(--clr-text);
          `}
        >
          {title}
        </h2>
        {action}
      </hgroup>
      {children}
    </section>
  );
};

export default Section;
