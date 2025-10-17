import Overlay from "@/shared/components/ui/overlay/Overlay";
import { css } from "@emotion/react";
import { useId } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { togglePopup } from "../ctaCarouselSlice";
import { selectAssetsBalanceUSD } from "@/features/assets/assetsSlice";
import BenefitsList from "./BenefitsList";
import BenefitsListItem from "./BenefitsListItem";
import { toggleModal as toggleDepositModal } from "@/features/onOffRamp/deposit/depositSlice";
import { toggleModal as toggleSwapModal } from "@/features/swap/swapSlice";
import Button from "@/shared/components/ui/button/Button";
import {
  ArrowsLeftRightIcon,
  ChartLineUpIcon,
  ClockIcon,
} from "@phosphor-icons/react";
import InvestCarouselSlide from "./InvestCarouselSlide";
import InvestCarousel from "./InvestCarousel";

const InvestPopup = () => {
  const headingId = useId();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.ctaCarousel.popups.invest.isOpen
  );

  const totalBalance = useAppSelector(selectAssetsBalanceUSD);
  return (
    <Overlay
      zIndex={1000}
      isOpen={isOpen}
      onOpenChange={(isOpen) =>
        dispatch(togglePopup({ isOpen, type: "invest" }))
      }
      aria-labelledby={headingId}
      direction="vertical"
      color="var(--clr-surface-raised)"
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
            Build your retirement portfolio
          </h1>
          <p
            className="caption"
            css={css`
              color: var(--clr-text-weaker);
              margin-block-start: var(--size-150);
              text-align: center;
            `}
          >
            Invest in top NASDAQ stocks, including APPL, TLSA, AMZN, and more.
          </p>
        </section>
        <section
          css={css`
            margin-block-start: var(--size-600);
          `}
        >
          <InvestCarousel>
            <InvestCarouselSlide
              ticker="QQQ"
              price={93.1}
              percentChange={0.0061}
            />
            <InvestCarouselSlide
              ticker="SPY"
              price={6600.35}
              percentChange={-0.00097}
            />
            <InvestCarouselSlide
              ticker="APPL"
              price={238.99}
              percentChange={0.0035}
            />
            <InvestCarouselSlide
              ticker="GOOGL"
              price={249.53}
              percentChange={-0.0065}
            />
            <InvestCarouselSlide
              ticker="AMZN"
              price={231.62}
              percentChange={0.0104}
            />
            <InvestCarouselSlide
              ticker="MSFT"
              price={510.02}
              percentChange={0.0019}
            />
            <InvestCarouselSlide
              ticker="NVDA"
              price={170.29}
              percentChange={-0.0262}
            />
            <InvestCarouselSlide
              ticker="MSTR"
              price={329.71}
              percentChange={0.0161}
            />
            <InvestCarouselSlide
              ticker="PG"
              price={160.33}
              percentChange={0.0144}
            />
            <InvestCarouselSlide
              ticker="TSLA"
              price={425.86}
              percentChange={0.0101}
            />
          </InvestCarousel>
        </section>
        <section
          css={css`
            padding-block-start: var(--size-600);
            padding-inline: var(--size-400);
            padding-block-end: calc(6rem + var(--size-250));
          `}
        >
          <BenefitsList>
            <BenefitsListItem
              title="Start your investment journey"
              description="Invest in 50+ U.S. stocks—no broker required."
              icon={ChartLineUpIcon}
            />
            <BenefitsListItem
              title="24/7 access"
              description="Buy and sell shares 24/7 with instant access and trading options."
              icon={ClockIcon}
            />
            <BenefitsListItem
              title="Fast and easy exchanges"
              description="Trade between stocks and USD, Euro, crypto, and more, all from your wallet."
              icon={ArrowsLeftRightIcon}
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
                    buyAssetId: "SPY",
                  })
                )
              }
            >
              Invest
            </Button>
          )}
        </section>
      </div>
    </Overlay>
  );
};

export default InvestPopup;
