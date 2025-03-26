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
    { icon: "1" },
    { icon: "2" },
    { icon: "3" },
    { icon: "4" },
    { icon: "5" },
    { icon: "6" },
    { icon: "7" },
    { icon: "8" },
    { icon: "9" },
    { icon: "." },
    { icon: "0" },
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
