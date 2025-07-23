import {
  Backspace,
  Dot,
  NumberEight,
  NumberFive,
  NumberFour,
  NumberNine,
  NumberOne,
  NumberSeven,
  NumberSix,
  NumberThree,
  NumberTwo,
  NumberZero,
} from "@phosphor-icons/react";

import { css } from "@emotion/react";
import NumberPadButton from "./NumberPadButton";

interface NumberPadProps {
  onNumberPress?: (e: string) => void;
  onNumberPressStart?: (e: string) => void;
  onNumberPressEnd?: (e: string) => void;
}
const NumberPad = ({
  onNumberPress,
  onNumberPressStart,
  onNumberPressEnd,
}: NumberPadProps) => {
  const buttons = [
    { id: "1", icon: "1", value: "1" },
    { id: "2", icon: "2", value: "2" },
    { id: "3", icon: "3", value: "3" },
    { id: "4", icon: "4", value: "4" },
    { id: "5", icon: "5", value: "5" },
    { id: "6", icon: "6", value: "6" },
    { id: "7", icon: "7", value: "7" },
    { id: "8", icon: "8", value: "8" },
    { id: "9", icon: "9", value: "9" },
    { id: ".", icon: ".", value: "." },
    { id: "0", icon: "0", value: "0" },
    { id: "backspace", icon: Backspace, value: "delete" },
  ];

  return (
    <div
      className="number-pad-container"
      css={css`
        border-radius: var(--border-radius-medium);

        background-color: var(--clr-surface-raised);
      `}
    >
      <ul
        className="number-pad"
        css={css`
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 3.5rem;
        `}
      >
        {buttons.map((button) => (
          <li
            key={button.id}
            className="number-pad-button-wrapper"
            css={css`
              display: grid;
              place-items: center;
            `}
          >
            <NumberPadButton
              icon={button.icon}
              onPress={() => onNumberPress && onNumberPress(button.value)}
              onPressStart={() =>
                onNumberPressStart && onNumberPressStart(button.value)
              }
              onPressEnd={() =>
                onNumberPressEnd && onNumberPressEnd(button.value)
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NumberPad;
