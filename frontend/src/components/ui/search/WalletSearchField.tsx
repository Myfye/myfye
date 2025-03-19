import { Scan as ScanIcon, X as XIcon } from "@phosphor-icons/react";
import Button from "../button/Button";
import { useSearchFieldState } from "react-stately";
import { useRef, useState } from "react";
import { useSearchField } from "react-aria";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const WalletSearchField = ({ ...restProps }) => {
  const [text, setText] = useState("");
  const state = useSearchFieldState({
    ...restProps,
    onChange(e) {
      setText(e);
    },
  });
  const inputRef = useRef(null);
  const { labelProps, inputProps, clearButtonProps } = useSearchField(
    restProps,
    state,
    inputRef
  );

  return (
    <div className="search-field">
      <label {...labelProps} className="visually-hidden">
        Search wallet address
      </label>
      <div
        css={css`
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          width: 100%;
          border-radius: var(--border-radius-medium);
          height: var(--control-size-medium);
          max-height: var(--control-size-medium);
          border: 1px solid var(--clr-border-neutral);
          input::placeholder {
            color: var(--clr-text-weakest);
          }
          padding-inline: var(--size-150);
        `}
      >
        <input
          {...inputProps}
          placeholder="Search contact or address"
          ref={inputRef}
        />
        {state.value !== "" ? (
          <Button
            {...clearButtonProps}
            size="small"
            iconOnly
            variant="transparent"
          >
            <XIcon />
          </Button>
        ) : (
          <menu
            css={css`
              display: flex;
              align-items: center;
              gap: var(--size-050);
            `}
          >
            <li>
              <Button
                variant="transparent"
                size="small"
                onPress={async () => {
                  if (!inputRef.current) return;
                  try {
                    const text = await navigator.clipboard.readText();
                    setText(text);
                    console.log("Text pasted.");
                  } catch (error) {
                    console.log("Failed to read clipboard");
                  }
                }}
              >
                Paste
              </Button>
            </li>
            <li>
              <Button
                variant="transparent"
                size="small"
                iconOnly
                icon={ScanIcon}
              ></Button>
            </li>
          </menu>
        )}
      </div>
    </div>
  );
};

export default WalletSearchField;
