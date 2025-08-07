import { css } from "@emotion/react";
import { ReactNode } from "react";
import { AriaRadioGroupProps, useRadioGroup, VisuallyHidden } from "react-aria";
import { useRadioGroupState } from "react-stately";
import { DepositRadioContext } from "./DepositRadioContext";

interface DepositRadioGroupProps extends AriaRadioGroupProps {
  children: ReactNode;
}

const DepositRadioGroup = ({
  label,
  children,
  ...restProps
}: DepositRadioGroupProps) => {
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
          grid-auto-columns: 1fr;
          grid-auto-flow: dense column;
          width: min(100%, 20rem);
          gap: var(--controls-gap-small);
          margin-inline: auto;
        `}
      >
        <DepositRadioContext value={state}>{children}</DepositRadioContext>
      </div>
    </div>
  );
};

export default DepositRadioGroup;
