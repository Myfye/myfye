import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import { useEffect, useId, useMemo, useState } from "react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import QrReader from "./QRReader";
import Button from "@/components/ui/button/Button";
import {
  CaretLeft as CaretLeftIcon,
  Copy,
  QuestionMark as QuestionMarkIcon,
  Scan as ScanIcon,
  X as XIcon,
} from "@phosphor-icons/react";
import QRCode from "./QRCode";
import { useSelector } from "react-redux";
import CoinCardList from "./coin-card/CoinCardList";

import usDollarCoinIcon from "@/assets/svgs/coins/usd-coin.svg";
import euroCoinIcon from "@/assets/svgs/coins/eur-coin.svg";
import usdyCoinIcon from "@/assets/svgs/coins/usdy-coin.svg";
import RecepientOverlay from "./recepient-overlay/RecepientOverlay";

// Wrap React Aria modal components so they support motion values.
const MotionModal = motion(Modal);
const MotionModalOverlay = motion(ModalOverlay);

const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

const FiatOverlay = ({ isOpen, onOpenChange, onOpen, onClose }) => {
  let w = window.innerWidth;
  let x = useMotionValue(w);

  const id = useId();

  const [step, setStep] = useState(1);

  /* Crypto */

  // BTC
  const btcSolBalance = useSelector(
    (state: any) => state.userWalletData.btcSolBalance
  );
  const priceOfBTCinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfBTCinUSDC
  );
  const btcBalanceInUSD = useMemo(
    () => btcSolBalance * priceOfBTCinUSDC,
    [btcSolBalance, priceOfBTCinUSDC]
  );

  // SOL
  const solBalance = useSelector(
    (state: any) => state.userWalletData.solBalance
  );
  const priceOfSolinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfSolinUSDC
  );
  const solBalanceInUSD = useMemo(
    () => solBalance * /*priceOfSolinUSDC*/ 1,
    [solBalance, priceOfSolinUSDC]
  );

  const cryptoBalance = useMemo(
    () => btcBalanceInUSD + solBalanceInUSD,
    [btcBalanceInUSD, solBalanceInUSD]
  );

  /* Cash */

  // USDT
  const usdtSolBalance = useSelector(
    (state: any) => state.userWalletData.usdtSolBalance
  );

  // EURC
  const eurcSolBalance = useSelector(
    (state: any) => state.userWalletData.eurcSolBalance
  );
  const priceOfEURCinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfEURCinUSDC
  );
  const eurcBalanceInUSD = useMemo(
    () => eurcSolBalance * priceOfEURCinUSDC,
    [eurcSolBalance, priceOfEURCinUSDC]
  );

  // USDY
  const usdySolBalance = useSelector(
    (state: any) => state.userWalletData.usdySolBalance
  );
  const priceOfUSDYinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfUSDYinUSDC
  );
  const usdyBalanceInUSD = useMemo(
    () => usdySolBalance * priceOfUSDYinUSDC,
    [eurcSolBalance, priceOfUSDYinUSDC]
  );

  const cashBalance = useMemo(
    () => usdtSolBalance + eurcBalanceInUSD + usdyBalanceInUSD,
    [btcBalanceInUSD, solBalanceInUSD]
  );

  const coins = useMemo(
    () => [
      {
        title: "US Dollar",
        currency: "usd",
        type: "usd",
        balance: usdtSolBalance,
        img: usDollarCoinIcon,
      },
      {
        title: "Euro",
        currency: "eur",
        type: "eur",
        balance: eurcBalanceInUSD,
        img: euroCoinIcon,
      },
      {
        title: "US Treasury Bonds",
        currency: "usd",
        type: "usdy",
        balance: usdyBalanceInUSD,
        img: usdyCoinIcon,
      },
    ],
    [usdtSolBalance, usdyBalanceInUSD, eurcBalanceInUSD]
  );

  const [currentCoin, setCurrentCoin] = useState(coins[0]);

  const onCoinSelect = (coin) => {
    setRecepientOverlayOpen(true);
    setCurrentCoin(coin);
  };

  const [isRecepientOverlayOpen, setRecepientOverlayOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <MotionModalOverlay
            isOpen
            onOpenChange={onOpenChange}
            css={css`
              position: fixed;
              inset: 0;
              z-index: 2000;
              max-width: 420px;
              margin-inline: auto;
              isolation: isolate;
            `}
          >
            <MotionModal
              css={css`
                background-color: var(--clr-surface);
                position: absolute;
                bottom: 0;
                width: 100%;
                will-change: transform;
                height: 100dvh;
                z-index: 1;
              `}
              initial={{ x: w }}
              animate={{ x: 0 }}
              exit={{ x: w }}
              transition={staticTransition}
              style={{
                x,
                left: 0,
                // Extra padding at the right to account for rubber band scrolling.
                paddingRight: window.screen.width,
              }}
            >
              <Dialog
                css={css`
                  display: grid;
                  grid-template-rows: 4rem 1fr;
                  height: 100dvh;
                  width: var(--app-max-width);
                `}
                aria-labelledby={id}
              >
                <header
                  css={css`
                    width: 100%;
                    align-content: center;
                  `}
                >
                  <div
                    css={css`
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      padding-inline: var(--size-250);
                      position: relative;
                    `}
                  >
                    <Button
                      iconOnly
                      icon={CaretLeftIcon}
                      onPress={onClose}
                      variant="transparent"
                      css={css`
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        margin-block: auto;
                        left: var(--size-100);
                      `}
                    ></Button>
                    <h1 className="heading-medium">Select Coin</h1>
                  </div>
                </header>
                <div
                  className="content"
                  css={css`
                    margin-block-start: var(--size-500);
                    padding: 0 var(--size-250);
                    padding-bottom: var(--size-250);
                  `}
                >
                  <section className="coins-container">
                    <CoinCardList coins={coins} onCoinSelect={onCoinSelect} />
                  </section>
                </div>
              </Dialog>
            </MotionModal>
          </MotionModalOverlay>
        )}
      </AnimatePresence>
      <RecepientOverlay
        coin={currentCoin}
        isOpen={isRecepientOverlayOpen}
        onOpenChange={(e) => setRecepientOverlayOpen(e)}
        onClose={() => setRecepientOverlayOpen(false)}
      />
    </>
  );
};

export default FiatOverlay;
