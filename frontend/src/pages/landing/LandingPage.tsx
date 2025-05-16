import Button from "@/shared/components/ui/button/Button";
import { ArrowRight, DeviceMobile } from "@phosphor-icons/react";
import { css } from "@emotion/react";
import Header from "./_components/Header";
import Main from "./_components/Main";

import phoneImg from "@/assets/test_landing.webp";
import TextCarousel from "./_components/TextCarousel";

import myfyeLogo from "@/assets/logo/myfye_logo_white.svg";
import { useEffect, useState } from "react";
import QRCodeModal from "./_components/QRCodeModal";
import { useNavigate } from "react-router-dom";
import { checkIfMobileOrTablet } from "@/shared/utils/mobileUtils";
import { motion, Transition } from "motion/react";

const textArray = [
  "US Dollars",
  "Euros",
  "Apple",
  "Microsoft",
  "SPY",
  "Bitcoin",
];

const phoneTransition: Transition = {
  type: "spring",
  delay: 0.25,
  duration: 1,
  bounce: 0.4,
};

const LandingPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const openQRCodeModal = () => {
    setModalOpen(true);
  };

  const navigate = useNavigate();
  useEffect(() => {
    const checkScreenSize = () => {
      const isSmallScreen = window.innerWidth <= 1080;
      if (!isSmallScreen && !checkIfMobileOrTablet()) {
        console.log("Large screen");
        navigate("/");
      } else {
        console.log("Mobile/tablet screen");
        navigate("/app");
      }
    };

    // Check on initial render
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [navigate]);

  return (
    <>
      <div
        className="landing-page"
        css={css`
          display: grid;
          grid-template-rows: auto 1fr;
          height: 100dvh;
          background-color: var(--clr-teal-900);
          isolation: isolate;
          position: relative;
          overflow: hidden;
          &::before {
            content: "";
            position: absolute;
            width: max(60%, 60rem);
            aspect-ratio: 1;
            border-radius: var(--border-radius-circle);
            background-color: var(--clr-green-400);
            right: 0;
            bottom: 0;
            transform: translate(50%, 40%);
            @media (width >= 1200px) {
              transform: translate(40%, 40%);
            }
            @media (width >= 1400px) {
              transform: translate(33%, 40%);
            }
            @media (width >= 1530px) {
              transform: translate(20%, 40%);
           }
            @media (width >= 1560px) {
              transform: translate(30%, 40%);
            }
            @media (width >= 1600px) {
              transform: translate(20%, 40%);
            }
        `}
      >
        <Header>
          <div
            css={css`
              display: flex;
              height: 5rem;
              align-content: center;
            `}
          >
            <h1
              css={css`
                align-content: center;
              `}
            >
              <img
                src={myfyeLogo}
                alt=""
                css={css`
                  width: 6rem;
                  height: auto;
                `}
              />
            </h1>
            <nav
              css={css`
                align-content: center;
                margin-inline-start: auto;
              `}
            >
              <ul
                css={css`
                  display: flex;
                  align-items: center;
                  gap: var(--size-400);
                  font-weight: var(--fw-active);
                  color: var(--clr-neutral-300);
                  font-size: var(--fs-medium);
                `}
              >
                <li>
                  <a
                    href=""
                    css={css`
                      &:hover {
                        color: var(--clr-white);
                      }
                    `}
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    css={css`
                      &:hover {
                        color: var(--clr-white);
                      }
                    `}
                  >
                    Support
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    css={css`
                      &:hover {
                        color: var(--clr-white);
                      }
                    `}
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
            <div
              css={css`
                align-content: center;
                margin-inline-start: var(--size-400);
              `}
            >
              <Button
                iconRight={DeviceMobile}
                color="primary-light"
                onPress={openQRCodeModal}
              >
                Download the app
              </Button>
            </div>
          </div>
        </Header>
        <Main>
          <div
            css={css`
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 100%;
              align-content: center;
              position: relative;
            `}
          >
            <div>
              <hgroup>
                <h1
                  className="heading-5x-large"
                  css={css`
                    color: var(--clr-green-300);
                    transform: translateX(-0.125rem);
                  `}
                >
                  Global markets in your pocket
                </h1>
                <p
                  className="caption-xx-large"
                  css={css`
                    margin-block-start: var(--size-200);
                    color: var(--clr-neutral-200);
                    line-height: 1.625rem;
                  `}
                >
                  <span
                    css={css`
                      display: inline-flex;
                      align-items: center;
                    `}
                  >
                    <span>Hold, swap, and send</span>
                    <span>&nbsp;</span>
                    <span
                      css={css`
                        display: inline-block;
                        line-height: 1.625rem;
                        height: 1.625rem;
                      `}
                    >
                      <TextCarousel textArray={textArray} />
                    </span>
                  </span>{" "}
                  <br />
                  directly from your phone. <br />
                </p>
                <p
                  className="caption-xx-large"
                  css={css`
                    margin-block-start: 1em;
                    color: var(--clr-neutral-200);
                    line-height: 1.625rem;
                  `}
                >
                  No bank account needed.
                </p>
              </hgroup>
              <div
                css={css`
                  margin-block-start: var(--size-400);
                  transform: translateX(-0.125rem);
                `}
              >
                <Button
                  size="large"
                  iconRight={ArrowRight}
                  color="primary-light"
                  onPress={openQRCodeModal}
                >
                  Get started
                </Button>
              </div>
            </div>
            <div
              css={css`
                position: absolute;
                right: 2%;
              `}
            >
              <motion.img
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={phoneTransition}
                src={phoneImg}
                alt=""
                css={css`
                  position: relative;
                  z-index: 1;
                  width: min(26rem, 28vw);
                  margin-inline-end: auto;
                `}
              />
            </div>
          </div>
        </Main>
      </div>
      <QRCodeModal
        isOpen={isModalOpen}
        onOpenChange={(isOpen) => setModalOpen(isOpen)}
      />
    </>
  );
};

export default LandingPage;
