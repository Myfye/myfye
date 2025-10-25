import Overlay from "@/shared/components/ui/overlay/Overlay";
import { css } from "@emotion/react";
import { useId } from "react";
import ondoUsdy from "@/assets/ondo_usdy.png";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { togglePopup } from "../ctaCarouselSlice";
import ColumnChart from "./ColumnChart";
import Button from "@/shared/components/ui/button/Button";
import { selectAssetsBalanceUSD } from "@/features/assets/stores/assetsSlice";
import { toggleModal as toggleDepositModal } from "@/features/onOffRamp/deposit/depositSlice";
import { toggleModal as toggleSwapModal } from "@/features/swap/stores/swapSlice";
import BenefitsList from "./BenefitsList";
import BenefitsListItem from "./BenefitsListItem";
import {
  ArrowsLeftRightIcon,
  MoneyIcon,
  PiggyBankIcon,
} from "@phosphor-icons/react";

const EarnPopup = () => {
  const headingId = useId();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.ctaCarousel.popups.earn.isOpen
  );

  const totalBalance = useAppSelector(selectAssetsBalanceUSD);

  return (
    <Overlay
      zIndex={1000}
      isOpen={isOpen}
      onOpenChange={(isOpen) => dispatch(togglePopup({ isOpen, type: "earn" }))}
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
            Create your US Savings Account
          </h1>
          <p
            className="caption"
            css={css`
              display: flex;
              justify-content: center;
              align-items: center;
              color: var(--clr-text-weaker);
              margin-block-start: var(--size-150);
            `}
          >
            Powered by&nbsp;
            <span
              css={css`
                display: inline-flex;
                align-items: center;
                gap: var(--size-050);
                font-weight: var(--fw-active);
              `}
            >
              <span
                css={css`
                  display: inline-block;
                  width: 18px;
                  aspect-ratio: 1;
                  border-radius: var(--border-radius-circle);
                `}
              >
                <img src={ondoUsdy} alt="" />
              </span>
              <span
                css={css`
                  font-weight: var(--fw-active);
                  color: var(--clr-text);
                `}
              >
                Ondo US Dollar Yield
              </span>
            </span>
          </p>
        </section>
        <section
          css={css`
            padding-inline: var(--size-400);
            margin-block-start: var(--size-600);
          `}
        >
          <div
            css={css`
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-block-end: var(--size-300);
            `}
          >
            <span
              css={css`
                font-size: var(--fs-medium);
                line-height: var(--line-height-tight);
                color: var(--clr-text);
                font-weight: var(--fw-heading);
              `}
            >
              You save today
            </span>
            <span
              css={css`
                font-size: var(--fs-medium);
                line-height: var(--line-height-tight);
                color: var(--clr-text);
                font-weight: var(--fw-active);
              `}
            >
              $1,000
            </span>
          </div>
          <ColumnChart />
        </section>
        <section
          css={css`
            padding-inline: var(--size-400);
            padding-block-start: var(--size-600);
            padding-block-end: calc(6rem + var(--size-250));
          `}
        >
          <BenefitsList>
            <BenefitsListItem
              title="Save US Dollars"
              description="Earn USD with US treasury bonds, fully backed by the US Dollar."
              icon={PiggyBankIcon}
            />
            <BenefitsListItem
              title="Earn daily"
              description="Earn up to 4.1% APY and receive interest daily."
              icon={MoneyIcon}
            />
            <BenefitsListItem
              title="Fast and easy exchanges"
              description="Swap between treasury bonds and USD, Euro, and more without a bank account."
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
                    buyAssetId: "USDY",
                  })
                )
              }
            >
              Earn
            </Button>
          )}
        </section>
      </div>
    </Overlay>
  );
};

export default EarnPopup;
