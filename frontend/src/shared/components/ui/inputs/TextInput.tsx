import { css } from "@emotion/react";
import { AriaTextFieldProps, useTextField } from "react-aria";
import { Input, Label, TextField } from "react-aria-components";
import Button from "../button/Button";
import { RefObject, useRef } from "react";

interface TextInputProps extends AriaTextFieldProps {
  label: string;
  id?: string;
  hideLabel?: boolean;
  paste?: boolean;
  onPaste?: (value: string) => void;
  ref?: RefObject<HTMLInputElement>;
}

const TextInput = ({
  label,
  hideLabel = false,
  onPaste,
  ref,
  ...restProps
}: TextInputProps) => {
  if (!ref) ref = useRef<HTMLInputElement>(null!);
  const {
    labelProps,
    inputProps,
    descriptionProps,
    errorMessageProps,
    isInvalid,
    validationErrors,
  } = useTextField({ label, ...restProps }, ref);
  return (
    <div>
      <label
        {...labelProps}
        className={`${hideLabel ? "visually-hidden" : ""} caption-small`}
        css={css`
          display: inline-block;
          margin-block-end: var(--size-075);
          font-weight: var(--fw-active);
        `}
      >
        {label}
      </label>
      <div
        className="input-wrapper"
        css={css`
          position: relative;
        `}
      >
        <input
          {...inputProps}
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
            padding-right: ${onPaste ? "var(--size-800)" : "var(--size-150)"};
          `}
        />
        {onPaste && (
          <div
            css={css`
              position: absolute;
              top: 50%;
              right: var(--size-075);
              transform: translateY(-50%);
            `}
          >
            <Button
              variant="ghost"
              color="neutral"
              size="x-small"
              onPress={async () => {
                const text = await navigator.clipboard.readText();
                onPaste && onPaste(text);
              }}
            >
              Paste
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextInput;
