import { Scan as ScanIcon, X as XIcon } from "@phosphor-icons/react";
import Button from "@/shared/components/ui/button/Button";
import { useSearchFieldState } from "react-stately";
import { RefObject, useRef } from "react";
import { AriaSearchFieldProps, useSearchField } from "react-aria";

import { css } from "@emotion/react";

interface UserSearchFieldProps extends AriaSearchFieldProps {
  label: string;
  ref?: RefObject<HTMLInputElement>;
  onScanTogglerPress?: () => void;
}
const UserSearchField = ({
  label,
  onScanTogglerPress,
  ref,
  ...restProps
}: UserSearchFieldProps) => {
  const state = useSearchFieldState({
    label,
    ...restProps,
  });
  if (!ref) ref = useRef<HTMLInputElement>(null!);
  const { labelProps, inputProps, clearButtonProps } = useSearchField(
    { label, ...restProps },
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
          placeholder="Name, phone number, email"
          ref={ref}
          css={css`
            font-size: 16px;
          `}
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
                color="transparent"
                size="small"
                onPress={async () => {
                  if (!ref.current) return;
                  try {
                    const text = await navigator.clipboard.readText();
                    state.setValue(text);
                  } catch (err) {
                    console.log("Failed to read clipboard");
                  }
                }}
              >
                Paste
              </Button>
            </li>
            <li>
              <Button
                color="transparent"
                size="small"
                iconOnly
                icon={ScanIcon}
                onPress={onScanTogglerPress}
              />
            </li>
          </menu>
        )}
      </div>
    </div>
  );
};

export default UserSearchField;
