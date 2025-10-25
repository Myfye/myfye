import AssetCardList from "@/features/assets/cards/AssetCardList";
import {
  selectAssetBalanceUSD,
  selectAssetsWithBalanceByGroup,
  toggleGroupOverlay,
} from "@/features/assets/stores/assetsSlice";
import Stack from "@/shared/components/ui/primitives/stack/Stack";
import Overlay from "@/shared/components/ui/overlay/Overlay";
import BalanceCard from "@/shared/components/ui/card/BalanceCard";
import ButtonGroup from "@/shared/components/ui/button/ButtonGroup";
import ButtonGroupItem from "@/shared/components/ui/button/ButtonGroupItem";
import {
  ArrowCircleDownIcon,
  ArrowCircleUpIcon,
  ArrowsLeftRightIcon,
  CurrencyBtcIcon,
} from "@phosphor-icons/react";
import { toggleModal as toggleSwapModal } from "@/features/swap/stores/swapSlice";
import { toggleModal as toggleSendModal } from "@/features/send/stores/sendSlice";
import { toggleModal as toggleReceiveModal } from "@/features/receive/stores/receiveSlice";
import Section from "@/shared/components/layout/section/Section";
import PieChart3DCard from "@/shared/components/ui/charts/pie/PieChart3DCard";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Inline from "@/shared/components/ui/primitives/inline/Inline";
import Heading from "@/shared/components/ui/text/Heading";
import CTACarousel from "@/shared/components/ui/cta-carousel/CTACarousel";
import ZeroBalanceCard from "@/shared/components/ui/card/ZeroBalanceCard";
import btcIcon from "@/assets/icons/assets/crypto/Bitcoin.svg";
import solIcon from "@/assets/icons/assets/crypto/Solana.svg";

const CryptoOverlay = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(
    (state) => state.assets.groups["crypto"].overlay?.isOpen
  );

  const assets = useAppSelector((state) =>
    selectAssetsWithBalanceByGroup(state, "crypto")
  );

  const totalBalance = assets.reduce(
    (acc, current) => acc + current.balanceUSD,
    0
  );

  const pieChartData = assets.map((asset) => ({
    name: asset.symbol,
    y: asset.balanceUSD,
    color: asset.color,
  }));

  const ctaCarouselSlides = [
    {
      title: "Buy Bitcoin",
      caption: "Buy Bitcoin with Myfye",
      icon: btcIcon,
      action: () =>
        dispatch(
          toggleSwapModal({
            isOpen: true,
            buyAssetId: "BTC",
            sellAssetId: "USD",
          })
        ),
    },
    {
      title: "Buy Solana",
      caption: "Buy Solana with Myfye",
      icon: solIcon,
      action: () =>
        dispatch(
          toggleSwapModal({
            isOpen: true,
            buyAssetId: "SOL",
            sellAssetId: "USD",
          })
        ),
    },
  ];

  return (
    <Overlay
      isOpen={isOpen}
      onOpenChange={(isOpen) =>
        dispatch(toggleGroupOverlay({ isOpen, groupId: "crypto" }))
      }
      title="Crypto"
    >
      <Stack
        gap="none"
        alignInline="start"
        isolate="last"
        isolateMargin="var(--size-600)"
        minHeight="100cqh"
      >
        <Section as="section">
          <BalanceCard
            balance={totalBalance}
            marginTop="var(--size-100)"
            marginBottom="var(--size-200)"
          />
          <ButtonGroup size="x-small">
            <ButtonGroupItem
              icon={ArrowsLeftRightIcon}
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
              Swap
            </ButtonGroupItem>
            <ButtonGroupItem
              icon={ArrowCircleUpIcon}
              onPress={() =>
                dispatch(
                  toggleSendModal({
                    isOpen: true,
                  })
                )
              }
            >
              Send
            </ButtonGroupItem>
            <ButtonGroupItem
              icon={ArrowCircleDownIcon}
              onPress={() => dispatch(toggleReceiveModal(true))}
            >
              Receive
            </ButtonGroupItem>
          </ButtonGroup>
        </Section>
        <Section marginTop="var(--size-300)">
          {totalBalance > 0 && (
            <PieChart3DCard data={pieChartData} name="Crypto" />
          )}
          {totalBalance === 0 && (
            <ZeroBalanceCard
              image={{ src: CurrencyBtcIcon, alt: "Bitcoin" }}
              title={
                <>
                  Store crypto. <br />
                  No complex tools required.
                </>
              }
              caption="Swap between Bitcoin, Euro, DOGE, and more."
              action={() => {
                dispatch(toggleSwapModal({ isOpen: true }));
              }}
              cta="Swap crypto"
            />
          )}
        </Section>
        <Section marginTop="var(--size-400)">
          <Inline spread="space-between" marginBottom="var(--size-200)">
            <Heading size="medium">Assets</Heading>
          </Inline>
          <AssetCardList assets={assets} showOptions={true} />
        </Section>
        <Section marginBottom="var(--size-100)" padding="none">
          <CTACarousel slides={ctaCarouselSlides} />
        </Section>
      </Stack>
    </Overlay>
  );
};

export default CryptoOverlay;
