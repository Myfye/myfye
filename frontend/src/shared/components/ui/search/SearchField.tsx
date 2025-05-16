import { X as XIcon } from "@phosphor-icons/react";
import Button from "../button/Button";
import { useSearchFieldState } from "react-stately";
import { useRef } from "react";
import { useSearchField } from "react-aria";

import { css } from "@emotion/react";

const SearchField = (props) => {
  const { label } = props;
  let state = useSearchFieldState(props);
  let ref = useRef(null);
  let { labelProps, inputProps, clearButtonProps } = useSearchField(
    props,
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
