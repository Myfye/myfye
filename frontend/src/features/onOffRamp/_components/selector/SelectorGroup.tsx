import { css } from "@emotion/react";
import { ReactNode } from "react";
import { AriaRadioGroupProps, useRadioGroup, VisuallyHidden } from "react-aria";
import { useRadioGroupState } from "react-stately";
import { SelectContext } from "./SelectContext";

export interface SelectorGroupProps extends AriaRadioGroupProps {
  children: ReactNode;
}

const SelectorGroup = ({
  label,
  children,
  ...restProps
}: SelectorGroupProps) => {
  const state = useRadioGroupState({ label, ...restProps });
  const { radioGroupProps, labelProps } = useRadioGroup(
    { label, ...restProps },
    state
  );

  return (
    <div {...radioGroupProps}>
      <VisuallyHidden>
        <span {...labelProps}>{label}</span>
      </VisuallyHidden>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: var(--controls-gap-medium);
          margin-inline: auto;
        `}
      >
        <SelectContext value={state}>{children}</SelectContext>
      </div>
    </div>
  );
};

export default SelectorGroup;
