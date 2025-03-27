import { ArrowDown, CaretRight } from "@phosphor-icons/react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useRef, useState } from "react";

const SwapControl = ({ type }) => {
  const [value, setValue] = useState(0);
  return (
    <div
      className="swap-control"
      css={css`
        position: relative;
        padding: var(--size-200);
        background-color: var(--clr-surface);
        box-shadow: var(--box-shadow-card);
        border-radius: var(--border-radius-medium);
      `}
    >
      <div className="select-value">
        <p
          css={css`
            font-size: var(--fs-small);
            color: var(--clr-text-weak);
            line-height: var(--line-height-tight);
          `}
        >
          {type === "buy" ? "Buy" : "Sell"}
        </p>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          css={css`
            margin-block-start: var(--size-050);
            font-size: var(--fs-x-large);
            line-height: var(--line-height-tight);
            font-weight: var(--fw-active);
          `}
        />
        <p
          css={css`
            margin-block-start: var(--size-050);
            font-size: var(--fs-x-small);
            color: var(--clr-text-weaker);
            line-height: var(--line-height-tight);
          `}
        >
          $0
        </p>
      </div>
      <button
        className="select-coin"
        css={css`
          display: inline-flex;
          width: fit-content;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: var(--size-200);
        `}
      >
        <span>Bitcoin</span>
        <CaretRight />
      </button>
    </div>
  );
};

const SwapController = () => {
  return (
    <div
      className="swap-controller"
      css={css`
        display: flex;
        flex-direction: column;
        gap: var(--size-075);
        position: relative;
      `}
    >
      <SwapControl type="buy" />
      <div
        className="icon-wrapper"
        css={css`
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          background-color: var(--clr-surface);
          border-radius: var(--border-radius-medium);
          padding: var(--size-100);
          box-shadow: var(--box-shadow-card);
        `}
      >
        <ArrowDown size={24} color="var(--clr-icon)" />
      </div>
      <SwapControl type="sell" />
    </div>
  );
};

export default SwapController;
