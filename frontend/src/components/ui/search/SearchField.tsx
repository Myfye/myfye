import { X as XIcon } from "@phosphor-icons/react";
import Button from "../button/Button";
import { useSearchFieldState } from "react-stately";
import { useRef } from "react";
import { useSearchField } from "react-aria";

const SearchField = ({ label, ...restProps }) => {
  let state = useSearchFieldState(restProps);
  let ref = useRef(null);
  let { labelProps, inputProps, clearButtonProps } = useSearchField(
    restProps,
    state,
    ref
  );

  return (
    <div className="search-field">
      <label {...labelProps}>{label}</label>
      <div>
        <input {...inputProps} ref={ref} />
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
