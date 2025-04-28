import { css } from "@emotion/react";

const Section = ({ title = "", action, children, ...restProps }) => {
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
