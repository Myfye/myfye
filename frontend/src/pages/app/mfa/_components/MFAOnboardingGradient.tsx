import { css } from "@emotion/react";
import { motion, useAnimate } from "motion/react";
import logo from "@/assets/logo/myfye_logo_white.svg";
import Ring180Loader from "@/shared/components/ui/loading/spinners/180RingLoader";
import { RefObject, useEffect, useRef } from "react";
const MFAOnboardingGradient = ({
  ref,
}: {
  ref?: RefObject<HTMLDivElement>;
}) => {
  return (
    <div
      className="mfa-onboarding-gradient"
      css={css`
        position: absolute;
        top: 0;
        width: 100%;
        height: 100cqh;
        overflow: hidden;
        z-index: 0;
        isolation: isolate;
      `}
    >
      <div
        className="gradients"
        aria-hidden="true"
        css={css`
          @property --_inner-circle-position-x {
            syntax: "<percentage>";
            inherits: false;
            initial-value: 50%;
          }
          @property --_inner-circle-position-y {
            syntax: "<percentage>";
            inherits: false;
            initial-value: 50%;
          }
          @property --_inner-circle-inner-color {
            syntax: "<color>";
            inherits: false;
            initial-value: #117e3b;
          }
          @property --_inner-circle-outer-color {
            syntax: "<color>";
            inherits: false;
            initial-value: #117e3b;
          }

          @property --_outer-circle-position-x {
            syntax: "<percentage>";
            inherits: false;
            initial-value: 50%;
          }
          @property --_outer-circle-position-y {
            syntax: "<percentage>";
            inherits: false;
            initial-value: 50%;
          }
          @property --_outer-circle-inner-color {
            syntax: "<color>";
            inherits: false;
            initial-value: #117e3b;
          }
          @property --_outer-circle-outer-color {
            syntax: "<color>";
            inherits: false;
            initial-value: #117e3b;
          }

          @property --_mask-color {
            syntax: "<color>";
            inherits: false;
            initial-value: rgb(0 0 0 / 1);
          }

          --_background-color: rgba(5, 81, 34, 1);

          position: relative;
          display: grid;
          place-items: center;
          width: 100svh;
          height: 100cqh;
          transform: translate(-50%, 0);
          top: 0;
          left: 50%;
          background: radial-gradient(
              50svh 30svh at var(--_inner-circle-position-x)
                var(--_inner-circle-position-y),
              var(--_inner-circle-inner-color) 0%,
              var(--_inner-circle-outer-color) 100%
            ),
            radial-gradient(
              100svh 40svh at var(--_outer-circle-position-x)
                var(--_outer-circle-position-y),
              var(--_outer-circle-inner-color) 0%,
              var(--_outer-circle-outer-color) 100%
            ),
            var(--_background-color);
          &::before {
            content: "";
            display: block;
            position: absolute;
            z-index: 1;
            width: 100%;
            height: 100%;
            backdrop-filter: blur(20px);
          }
        `}
      >
        <div
          className="loading-screen"
          css={css`
            position: relative;
            z-index: 3;
          `}
        >
          <section
            css={css`
              display: grid;
              place-items: center;
            `}
          >
            <img
              src={logo}
              alt="MyFye"
              css={css`
                width: 8rem;
                height: auto;
              `}
            />
            <div
              className="loader-wrapper"
              css={css`
                opacity: 0;
                margin-block-start: var(--size-200);
              `}
            >
              <Ring180Loader
                width={20}
                height={20}
                fill="var(--clr-white)"
                dur="0"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MFAOnboardingGradient;
