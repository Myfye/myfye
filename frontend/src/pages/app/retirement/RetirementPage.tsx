import {
  selectAssetBalanceUSD,
  selectAssetsWithBalanceByGroup,
  selectAssetsWithBalanceUSDByArray,
} from "@/features/assets/stores/assetsSlice";
import AssetCardList from "@/features/assets/cards/AssetCardList";
import { toggleModal } from "@/features/onOffRamp/deposit/depositSlice";
import PullToRefreshIndicator from "@/features/pull-to-refresh/components/PullToRefreshIndicator";
import PullToRefreshScrollContainer from "@/features/pull-to-refresh/components/PullToRefreshScrollContainer";
import { usePullToRefresh } from "@/features/pull-to-refresh/hooks/usePullToRefresh";
import { toggleModal as toggleReceiveModal } from "@/features/receive/stores/receiveSlice";
import { toggleModal as toggleSwapModal } from "@/features/swap/stores/swapSlice";
import { toggleModal as toggleSendModal } from "@/features/send/stores/sendSlice";
import getSolanaBalances from "@/functions/GetSolanaBalances";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import AppPage from "@/shared/components/layout/page/AppPage";
import Section from "@/shared/components/layout/section/Section";
import ButtonGroup from "@/shared/components/ui/button/ButtonGroup";
import ButtonGroupItem from "@/shared/components/ui/button/ButtonGroupItem";
import BalanceCard from "@/shared/components/ui/card/BalanceCard";
import ZeroBalanceCard from "@/shared/components/ui/card/ZeroBalanceCard";
import PieChart3DCard from "@/shared/components/ui/charts/pie/PieChart3DCard";
import CTACarousel, {
  CTASlide,
} from "@/shared/components/ui/cta-carousel/CTACarousel";
import Inline from "@/shared/components/ui/primitives/inline/Inline";
import Stack from "@/shared/components/ui/primitives/stack/Stack";
import Switch from "@/shared/components/ui/switch/Switch";
import AppPageHeading from "@/shared/components/ui/text/AppPageHeading";
import Heading from "@/shared/components/ui/text/Heading";
import Text from "@/shared/components/ui/text/Text";
import {
  ArrowCircleDownIcon,
  ArrowsLeftRightIcon,
  ChartLineUpIcon,
  ChartPieIcon,
} from "@phosphor-icons/react";
import { useSolanaWallets } from "@privy-io/react-auth";
import { useRef, useState } from "react";

const RetirementPage = () => {
  const dispatch = useAppDispatch();

  const assets = useAppSelector((state) =>
    selectAssetsWithBalanceByGroup(state, "retirement")
  );

  const totalBalance = assets.reduce(
    (acc, current) => acc + current.balanceUSD,
    0
  );

  const pieChartData = assets.map((asset) => ({
    name: asset.symbol,
    color: asset.color,
    y: asset.balanceUSD,
  }));

  const ctaCarouselSlides = [
    {
      title: "Hold ETFs like a pro",
      caption: "Deposit money to invest in SPDR, SPY, and QQQ.",
      icon: ChartPieIcon,
      action: () => dispatch(toggleModal(true)),
    },
  ] satisfies CTASlide[];

  const [selected, setSelected] = useState(false);

  const { wallets } = useSolanaWallets();
  const solanaAddress = wallets[0].address;
  const ref = useRef<HTMLDivElement>(null!);

  const { spinnerParams, pullMargin } = usePullToRefresh({
    onRefresh: async () => {
      await getSolanaBalances(solanaAddress, dispatch);
    },
    container: ref,
  });

  return (
    <AppPage>
      <PullToRefreshIndicator style={spinnerParams} />
      <PullToRefreshScrollContainer ref={ref} pullMargin={pullMargin}>
        <Stack
          gap="none"
          alignInline="start"
          isolate="last"
          isolateMargin="var(--size-600)"
          minHeight="100cqh"
        >
          <Section as="section">
            <AppPageHeading>Retirement</AppPageHeading>
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
                      buyAssetId: "QQQ",
                    })
                  )
                }
              >
                Swap
              </ButtonGroupItem>
              <ButtonGroupItem
                icon={ArrowCircleDownIcon}
                onPress={() =>
                  dispatch(
                    toggleSendModal({
                      isOpen: true,
                      assetId: "QQQ",
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
              <PieChart3DCard data={pieChartData} name="Retirement" />
            )}
            {totalBalance === 0 && (
              <ZeroBalanceCard
                image={{ src: ChartLineUpIcon, alt: "Chart line up" }}
                title="Build your retirement portfolio today"
                caption="Invest in Gold Shares, S&P 500, and Nasdaq"
                action={() => {
                  dispatch(
                    toggleSwapModal({
                      isOpen: true,
                      sellAssetId: "USD",
                      buyAssetId: "QQQ",
                    })
                  );
                }}
                cta="Add stocks"
              />
            )}
          </Section>
          <Section marginTop="var(--size-400)">
            <Inline spread="space-between" marginBottom="var(--size-200)">
              <Heading size="medium">Assets</Heading>
              <Switch isSelected={selected} onChange={(e) => setSelected(e)}>
                <Text
                  as="span"
                  weight="var(--fw-default)"
                  leading="var(--line-height-tight)"
                  color="var(--clr-text-weaker)"
                >
                  Show shares?
                </Text>
              </Switch>
            </Inline>
            <AssetCardList
              assets={assets}
              showOptions={true}
              showBalanceUSD={selected ? false : true}
              showCurrencySymbol={selected ? false : true}
            />
          </Section>
          <Section marginBottom="var(--size-100)" padding="none">
            <CTACarousel slides={ctaCarouselSlides} />
          </Section>
        </Stack>
      </PullToRefreshScrollContainer>
    </AppPage>
  );
};

export default RetirementPage;
