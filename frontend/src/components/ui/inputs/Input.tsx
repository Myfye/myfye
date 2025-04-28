import { css } from "@emotion/react";
import { ReactNode } from "react";

const Input = ({
  label,
  id,
  hideLabel,
  ...restProps
}: {
  label: string;
  children: ReactNode;
  id: string;
  hideLabel: boolean;
}) => {
  return (
    <div className="wrapper">
      <label
        className={`${hideLabel ? "visually-hidden" : ""}`}
        css={css`
          font-size: var(--fs-small);
        `}
        htmlFor={id}
      >
        {label}
      </label>
      <div
        css={css`
          background-color: var(--clr-surface-raised);
          height: var(--clr-);
        `}
      >
        <input
          css={css`
            width: 100%;
            height: var(--control-size-medium);
            line-height: var(--line-height-form);
            padding: var(--size-150);
            border-radius: var(--border-radius-medium);
            &::placeholder {
              color: var(--clr-text-weaker);
            }
          `}
          {...restProps}
        />
      </div>
    </div>
  );
};

export default Input;
