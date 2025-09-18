import { css } from "@emotion/react";
import TextCarousel from "./TextCarousel";
import Button from "@/shared/components/ui/button/Button";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { useContext } from "react";
import { QRCodeModalContext } from "../QRCodeModalContext";

const Hero = () => {
  const { setModalOpen } = useContext(QRCodeModalContext);
  return (
    <section className="hero | content-grid">
      <div
        className="full-width"
        css={css`
          width: 100%;
          height: calc(100svh - 1.5rem);
          background-color: #dcfd8f;
          border-bottom-left-radius: 1.5rem;
          border-bottom-right-radius: 1.5rem;
        `}
      >
        <div
          css={css`
            margin-block-start: 14rem;
          `}
        >
          <h1
            className="heading-6x-large"
            css={css`
              text-align: center;
              color: #02302c;
            `}
          >
            Global markets in your pocket. <br /> No bank account needed.
          </h1>
          <p
            css={css`
              display: flex;
              justify-content: center;
              align-items: center;
              margin-block-start: var(--size-300);
              font-size: 1.25rem;
              text-align: center;
              line-height: var(--line-height-caption);
              color: #0d1525;
            `}
          >
            <span>Hold, swap and send&nbsp;</span>
            <span
              css={css`
                position: relative;
                display: grid;
                place-items: center;
              `}
            >
              <TextCarousel
                lineHeight={1.4}
                fontSize={1.25}
                textArray={[
                  "stocks",
                  "currencies",
                  "treasuries",
                  "commodities",
                  "crypto",
                ]}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 129 17"
                fill="none"
                css={css`
                  position: absolute;
                  top: calc(100% + 1px);
                  width: 9ch;
                `}
              >
                <path
                  d="M2 7.5013C36.2715 5.39063 70.5431 3.27997 92.006 2.44739C113.469 1.61482 121.085 2.12429 124.614 2.5323C128.144 2.94032 127.356 3.23145 124.849 3.70894C122.342 4.18643 118.14 4.84146 105.602 5.9795C93.0645 7.11754 72.3177 8.71873 58.9053 10.1622C45.493 11.6057 40.0437 12.843 37.0723 13.5532C34.101 14.2634 33.7727 14.4089 33.4394 14.4839C33.1062 14.5589 32.7779 14.5589 43.7372 14.5953C54.6965 14.6317 76.9533 14.7045 88.222 14.7783C99.4906 14.8522 99.0967 14.925 98.6908 15"
                  stroke="#02302c"
                  stroke-width="4"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <span>&nbsp;directly from your phone.</span>
          </p>
          <div
            css={css`
              margin-inline: auto;
              margin-block-start: var(--size-600);
              width: 14rem;
            `}
          >
            <Button
              size="large"
              expand
              iconRight={ArrowRightIcon}
              onPress={() => setModalOpen(true)}
            >
              Start now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
