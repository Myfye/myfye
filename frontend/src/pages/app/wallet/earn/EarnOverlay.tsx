import AssetCardList from "@/features/assets/cards/AssetCardList";
import {
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
  ChartLineUpIcon,
  CurrencyBtcIcon,
  PiggyBankIcon,
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
import ondoIcon from "@/assets/icons/ondo_finance.svg";

const EarnOverlay = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(
    (state) => state.assets.groups["earn"].overlay?.isOpen
  );

  const assets = useAppSelector((state) =>
    selectAssetsWithBalanceByGroup(state, "earn")
  );

  const totalBalance = 20;

  const pieChartData = assets.map((asset) => ({
    name: asset.symbol,
    y: asset.balanceUSD,
    color: asset.color,
  }));

  const ctaCarouselSlides = [
    {
      title: "Invest in US Treasuries",
      caption: "Earn up to 7.0% APY with USDY, powered by Ondo Finance.",
      icon: ondoIcon,
      action: () =>
        dispatch(
          toggleSwapModal({
            isOpen: true,
            buyAssetId: "BTC",
            sellAssetId: "USD",
          })
        ),
    },
  ];

  return (
    <Overlay
      isOpen={isOpen}
      onOpenChange={(isOpen) =>
        dispatch(toggleGroupOverlay({ isOpen, groupId: "earn" }))
      }
      title="Earn"
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
            <PieChart3DCard data={pieChartData} name="Earn" />
          )}
          {totalBalance === 0 && (
            <ZeroBalanceCard
              image={{ src: ChartLineUpIcon, alt: "Chart Line Up" }}
              title={<>Store cash, earn money.</>}
              caption="Earn US Dollar and Mexican Peso yield with MyFye"
              action={() => {
                dispatch(
                  toggleSwapModal({
                    isOpen: true,
                    buyAssetId: "USDY",
                    sellAssetId: "USD",
                  })
                );
              }}
              cta="Earn yield"
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

export default EarnOverlay;
