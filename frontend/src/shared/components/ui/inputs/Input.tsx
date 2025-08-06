import { css } from "@emotion/react";
import { HTMLProps, InputHTMLAttributes, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id?: string;
  hideLabel?: boolean;
}

const Input = ({
  label,
  id = useId(),
  hideLabel = false,
  ...restProps
}: InputProps) => {
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
          {...restProps}
          id={id}
          css={css`
            width: 100%;
            height: var(--control-size-medium);
            line-height: var(--line-height-form);
            padding: var(--size-150);
            border-radius: var(--border-radius-medium);
            &::placeholder {
              color: var(--clr-text-weaker);
            }
            font-size: 16px;
          `}
        />
      </div>
    </div>
  );
};

export default Input;
