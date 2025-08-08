import { css } from "@emotion/react";
import NumberPad, { NumberPadProps } from "../number-pad/NumberPad";

interface AmountSelectScreenProps {
  numberPadProps: NumberPadProps;
}
const AmountSelectScreen = ({ numberPadProps }: AmountSelectScreenProps) => {
  return (
    <div
      css={css`
        height: 100cqh;
      `}
    >
      <section>
        <NumberPad {...numberPadProps} />
      </section>
      <section></section>
    </div>
  );
};

export default AmountSelectScreen;
