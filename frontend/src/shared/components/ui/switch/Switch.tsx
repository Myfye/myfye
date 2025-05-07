import { useToggleState } from "react-stately";
import { useFocusRing, useSwitch, VisuallyHidden } from "react-aria";
import { useRef } from "react";
import { css } from "@emotion/react";

const Switch = (props) => {
  let state = useToggleState(props);
  let ref = useRef(null);
  let { inputProps } = useSwitch(props, state, ref);
  let { isFocusVisible, focusProps } = useFocusRing();

  return (
    <div
      css={css`
        display: flex;
        gap: var(--size-200);
      `}
    >
      <label
        css={css`
          display: flex;
          align-items: center;
          font-size: var(--fs-medium);
          gap: var(--size-150);
        `}
      >
        <VisuallyHidden>
          <input {...inputProps} {...focusProps} ref={ref} />
        </VisuallyHidden>
        {props.children}
        <div
          aria-hidden="true"
          css={css`
            display: flex;
            height: 24px;
            width: 42px;
            flex-shrink: 0;
            border-radius: 13px;
            padding: 3px;
            transition: 100ms ease-in-out all;
            background-color: ${state.isSelected
              ? "var(--clr-primary)"
              : "var(--clr-neutral-300)"};
          `}
        >
          <div
            css={css`
              height: 18px;
              aspect-ratio: 1;
              transition: 100ms ease-in-out all;
              border-radius: var(--border-radius-circle);
              background-color: var(--clr-white);
              transform: translateX(${state.isSelected ? "100%" : 0});
            `}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default Switch;
