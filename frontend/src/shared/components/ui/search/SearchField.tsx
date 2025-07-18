import { X as XIcon } from "@phosphor-icons/react";
import Button from "../button/Button";
import { useSearchFieldState } from "react-stately";
import { RefObject, useRef } from "react";
import { AriaSearchFieldProps, useSearchField } from "react-aria";

import { css } from "@emotion/react";

interface SearchFieldProps extends AriaSearchFieldProps {
  ref?: RefObject<HTMLInputElement>;
}

const SearchField = ({ ref, ...restProps }: SearchFieldProps) => {
  const { label } = restProps;
  const state = useSearchFieldState(restProps);
  if (!ref) ref = useRef<HTMLInputElement>(null!);
  const { labelProps, inputProps, clearButtonProps } = useSearchField(
    restProps,
    state,
    ref
  );

  return (
    <div className="search-field">
      <label {...labelProps} className="visually-hidden">
        {label}
      </label>
      <div
        css={css`
          display: grid;
          font-size: 16px;
          background-color: var(--clr-surface-raised);
          grid-template-columns: 1fr auto;
          align-items: center;
          width: 100%;
          border-radius: var(--border-radius-medium);
          height: var(--control-size-medium);
          max-height: var(--control-size-medium);
          input::placeholder {
            color: var(--clr-text-weakest);
          }
          padding-inline: var(--size-150);
        `}
      >
        <input
          {...inputProps}
          placeholder="Search contact or address"
          ref={ref}
          css={css`
            font-size: 16px;
          `}
        />
        {state.value !== "" && (
          <Button
            {...clearButtonProps}
            size="small"
            iconOnly
            variant="transparent"
          >
            <XIcon />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchField;
