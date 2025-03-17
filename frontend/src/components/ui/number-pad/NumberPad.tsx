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
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import NumberPadButton from "./NumberPadButton";

const NumberPad = ({ value, onChange, decimal }) => {
  const buttons = [
    { icon: NumberOne },
    { icon: NumberTwo },
    { icon: NumberThree },
    { icon: NumberFour },
    { icon: NumberFive },
    { icon: NumberSix },
    { icon: NumberSeven },
    { icon: NumberEight },
    { icon: NumberNine },
    { icon: Dot },
    { icon: NumberZero },
    { icon: Backspace },
  ];

  return (
    <div
      className="number-pad-container"
      css={css`
        background-color: var(--clr-surface);
      `}
    >
      <ul
        className="number-pad"
        css={css`
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: var(--size-800);
        `}
      >
        {buttons.map((button) => (
          <li
            className="number-pad-button-wrapper"
            css={css`
              display: grid;
              place-items: center;
            `}
          >
            <NumberPadButton icon={button.icon} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NumberPad;
