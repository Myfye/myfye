import type { AriaToggleButtonGroupProps, Key } from "react-aria";
import { useToggleGroupState } from "react-stately";
import { useToggleButtonGroup, useToggleButtonGroupItem } from "react-aria";
import { ReactNode, useContext, useRef } from "react";
import { motion } from "motion/react";
import { ToggleButtonGroupContext } from "react-aria-components";
import { css } from "@emotion/react";

interface ToggleButtonGroupProps extends AriaToggleButtonGroupProps {
  children: ReactNode;
}

function ToggleButtonGroup(props: ToggleButtonGroupProps) {
  const state = useToggleGroupState(props);
  const ref = useRef<HTMLDivElement | null>(null);
  const { groupProps } = useToggleButtonGroup(props, state, ref);

  return (
    <menu
      className="toggle-group"
      css={css`
        display: flex;
        justify-content: space-between;
      `}
      {...groupProps}
      ref={ref}
    >
      <ToggleButtonGroupContext.Provider value={state}>
        {props.children}
      </ToggleButtonGroupContext.Provider>
    </menu>
  );
}

function ToggleButton(props) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const state = useContext(ToggleButtonGroupContext)!;
  const { buttonProps, isPressed, isSelected } = useToggleButtonGroupItem(
    props,
    state,
    ref
  );

  return (
    <li>
      <motion.button
        {...buttonProps}
        ref={ref}
        data-variant={isSelected ? "primary" : "ghost"}
        data-size="xx-small"
        data-color="primary"
        data-border-radius="square"
        className={`button ${props?.className}`}
        animate={{
          scale: isPressed ? 0.9 : 1,
        }}
      >
        {props.children}
      </motion.button>
    </li>
  );
}

const DateSelect = ({
  selectedDateRange,
  onDateRangeSelectionChange,
}: {
  selectedDateRange?: Iterable<Key>;
  onDateRangeSelectionChange?: (keys: Set<Key>) => void;
}) => {
  return (
    <ToggleButtonGroup
      selectedKeys={selectedDateRange}
      onSelectionChange={onDateRangeSelectionChange}
    >
      <ToggleButton id="1D">1D</ToggleButton>
      <ToggleButton id="1W">1W</ToggleButton>
      <ToggleButton id="1M">1M</ToggleButton>
      <ToggleButton id="1Y">1Y</ToggleButton>
      <ToggleButton id="ALL">ALL</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default DateSelect;
