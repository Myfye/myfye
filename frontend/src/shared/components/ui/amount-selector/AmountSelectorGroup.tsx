import { css } from "@emotion/react";
import { ReactNode } from "react";
import { AriaRadioGroupProps, useRadioGroup, VisuallyHidden } from "react-aria";
import { useRadioGroupState } from "react-stately";
import { AmountSelectContext } from "./AmountSelectContext";

interface AmountSelectorGroupProps extends AriaRadioGroupProps {
  children: ReactNode;
}

const AmountSelectorGroup = ({
  label,
  children,
  ...restProps
}: AmountSelectorGroupProps) => {
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
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          width: min(100%, 20rem);
          gap: var(--controls-gap-small);
          margin-inline: auto;
        `}
      >
        <AmountSelectContext value={state}>{children}</AmountSelectContext>
      </div>
    </div>
  );
};

export default AmountSelectorGroup;
