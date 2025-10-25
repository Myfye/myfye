import Overlay, { OverlayProps } from "@/shared/components/ui/overlay/Overlay";
import { css } from "@emotion/react";
import { useId } from "react";
import bitcoinHand from "@/assets/bitcoin-hand.png";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { togglePopup } from "../ctaCarouselSlice";
import BenefitsList from "./BenefitsList";
import {
  ChartLineUpIcon,
  ClockIcon,
  CurrencyBtcIcon,
  MoneyIcon,
} from "@phosphor-icons/react";
import BenefitsListItem from "./BenefitsListItem";
import Button from "@/shared/components/ui/button/Button";
import { selectAssetsBalanceUSD } from "@/features/assets/stores/assetsSlice";
import { toggleModal as toggleDepositModal } from "@/features/onOffRamp/deposit/depositSlice";
import { toggleModal as toggleSwapModal } from "@/features/swap/stores/swapSlice";

const BitcoinPopup = () => {
  const headingId = useId();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.ctaCarousel.popups.bitcoin.isOpen
  );

  const totalBalance = useAppSelector(selectAssetsBalanceUSD);
  return (
    <Overlay
      zIndex={1000}
      isOpen={isOpen}
      onOpenChange={(isOpen) =>
        dispatch(togglePopup({ isOpen, type: "bitcoin" }))
      }
      aria-labelledby={headingId}
      direction="vertical"
      color="var(--clr-white)"
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          height: 100cqh;
        `}
      >
        <section
          css={css`
            padding-inline: var(--size-400);
            padding-block-start: var(--size-200);
          `}
        >
          <h1
            className="heading-x-large"
            id={headingId}
            css={css`
              text-align: center;
              color: var(--clr-text);
            `}
          >
            Buy Bitcoin instantly
          </h1>
          <p
            className="caption"
            css={css`
              color: var(--clr-text-weaker);
              margin-block-start: var(--size-150);
              text-align: center;
            `}
          >
            Buy, sell, and swap Bitcoin. All from your phone.
          </p>
        </section>
        <section
          css={css`
            padding-inline: var(--size-400);
            padding-block-start: var(--size-600);
          `}
        >
          <img
            src={bitcoinHand}
            alt="Cartoonized hand holding Bitcoin"
            css={css`
              width: 80%;
              height: auto;
              object-fit: cover;
              margin-inline: auto;
            `}
          />
        </section>
        <section
          css={css`
            padding-block-start: var(--size-800);
            padding-inline: var(--size-400);
            padding-block-end: calc(6rem + var(--size-250));
          `}
        >
          <BenefitsList>
            <BenefitsListItem
              title="Start your crypto portfolio"
              description="Buy Bitcoin with flexible funding options."
              icon={MoneyIcon}
            />
            <BenefitsListItem
              title="Keep your funds secure"
              description="Your Bitcoin is secured by Passkeys, protecting your assets."
              icon={ClockIcon}
            />
            <BenefitsListItem
              title="Quick, easy exchanges"
              description="Swap between Bitcoin and USD, Euro, stocks, and more, all from your wallet."
              icon={ChartLineUpIcon}
            />
          </BenefitsList>
        </section>
        <section
          css={css`
            padding-inline: var(--size-400);
            margin-block-start: auto;
            padding-block-end: var(--size-250);
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
          `}
        >
          {totalBalance > 0 ? (
            <Button expand onPress={() => dispatch(toggleDepositModal(true))}>
              Deposit
            </Button>
          ) : (
            <Button
              expand
              onPress={() =>
                dispatch(
                  toggleSwapModal({
                    isOpen: true,
                    sellAssetId: "USD",
                    buyAssetId: "BTC",
                  })
                )
              }
            >
              Buy
            </Button>
          )}
        </section>
      </div>
    </Overlay>
  );
};

export default BitcoinPopup;
