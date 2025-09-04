import { css } from "@emotion/react";

import mockup from "@/assets/mockups/mockup.png";
import MockupNotification from "./MockupNotification";
import {
  ArrowLineDownIcon,
  ArrowsLeftRight,
  ArrowsLeftRightIcon,
  MoneyIcon,
  PaperPlaneRightIcon,
} from "@phosphor-icons/react";

const Mockup = () => {
  return (
    <section
      className="mockup | content-grid"
      css={css`
        background-color: var(--clr-white);
        position: relative;
      `}
    >
      <div
        className="full-width"
        css={css`
          margin-block-start: -19rem;
        `}
      >
        <div
          className="mockup-container"
          css={css`
            position: relative;
            width: 21rem;
            margin-inline: auto;
          `}
        >
          <img
            src={mockup}
            alt=""
            css={css`
              margin-inline: auto;
              width: 100%
              height: auto;
            `}
          />
          <MockupNotification
            icon={PaperPlaneRightIcon}
            title="You sent"
            subtitle="€30 EUR"
            inset="5rem -9rem auto auto"
          />
          <MockupNotification
            icon={ArrowLineDownIcon}
            title="You deposited"
            subtitle="+$329.20"
            inset="0 auto 7rem -70%"
          />
          <MockupNotification
            icon={MoneyIcon}
            title="You received"
            subtitle="+$50"
            inset="10rem -14rem 0 auto"
          />
          <MockupNotification
            icon={ArrowsLeftRightIcon}
            title="You swapped"
            subtitle="$75 USD → 0.3565 SOL"
            inset="auto auto 3rem -50%"
          />
        </div>
      </div>
    </section>
  );
};

export default Mockup;
