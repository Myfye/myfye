import { css } from "@emotion/react";
import { AriaTextFieldProps } from "react-aria";
import { Input, Label, TextField } from "react-aria-components";

interface TextInputProps extends AriaTextFieldProps {
  label: string;
  id?: string;
  hideLabel?: boolean;
}

const TextInput = ({
  label,
  hideLabel = false,
  ...restProps
}: TextInputProps) => {
  return (
    <TextField {...restProps}>
      <Label
        className={`${hideLabel ? "visually-hidden" : ""} caption-small`}
        css={css`
          display: inline-block;
          margin-block-end: var(--size-075);
          font-weight: var(--fw-active);
        `}
      >
        {label}
      </Label>
      <Input
        css={css`
          background-color: var(--clr-surface-raised);
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
    </TextField>
  );
};

export default TextInput;
