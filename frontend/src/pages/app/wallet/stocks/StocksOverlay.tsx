import { useDispatch } from "react-redux";
import AssetCardList from "@/features/assets/cards/AssetCardList";
import { useState } from "react";
import {
  selectAssetsWithBalanceByGroup,
  selectAssetsBalanceUSDByGroup,
  toggleGroupOverlay,
} from "../../../../features/assets/stores/assetsSlice";
import Switch from "@/shared/components/ui/switch/Switch";

import { useAppSelector } from "@/redux/hooks";
import Overlay from "@/shared/components/ui/overlay/Overlay";
import Stack from "@/shared/components/ui/primitives/stack/Stack";
import Section from "@/shared/components/layout/section/Section";
import BalanceCard from "@/shared/components/ui/card/BalanceCard";
import ButtonGroup from "@/shared/components/ui/button/ButtonGroup";
import ButtonGroupItem from "@/shared/components/ui/button/ButtonGroupItem";
import {
  ArrowCircleDownIcon,
  ArrowCircleUpIcon,
  ArrowsLeftRightIcon,
  ChartLineUpIcon,
} from "@phosphor-icons/react";
import { toggleModal as toggleSwapModal } from "@/features/swap/stores/swapSlice";
import { toggleModal as toggleReceiveModal } from "@/features/receive/stores/receiveSlice";
import { toggleModal as toggleSendModal } from "@/features/send/stores/sendSlice";
import ZeroBalanceCard from "@/shared/components/ui/card/ZeroBalanceCard";
import Heading from "@/shared/components/ui/text/Heading";
import Inline from "@/shared/components/ui/primitives/inline/Inline";
import Text from "@/shared/components/ui/text/Text";
import CTACarousel from "@/shared/components/ui/cta-carousel/CTACarousel";
import PieChart3DCard from "@/shared/components/ui/charts/pie/PieChart3DCard";

const StocksOverlay = () => {
  const dispatch = useDispatch();

  const isOpen = useAppSelector(
    (state) => state.assets.groups["stocks"].overlay?.isOpen
  );

  const assets = useAppSelector((state) =>
    selectAssetsWithBalanceByGroup(state, "stocks")
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

  const [selected, setSelected] = useState(false);

  return (
    <Overlay
      isOpen={isOpen}
      onOpenChange={(isOpen) =>
        dispatch(toggleGroupOverlay({ isOpen, groupId: "stocks" }))
      }
      title="Stocks"
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
                    buyAssetId: "QQQ",
                  })
                )
              }
            >
              Swap
            </ButtonGroupItem>
            <ButtonGroupItem
              icon={ArrowCircleUpIcon}
              onPress={() => dispatch(toggleSendModal({ isOpen: true }))}
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
            <PieChart3DCard data={pieChartData} name="Performance" />
          )}
          {totalBalance === 0 && (
            <ZeroBalanceCard
              image={{ src: ChartLineUpIcon, alt: "Chart line up" }}
              title={<>Invest in 50+ stocks. No broker needed.</>}
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
          <CTACarousel
            slides={[
              {
                title: "Build a retirement portfolio",
                caption: "Invest in Gold Shares, Nasdaq, and more with MyFye",
                icon: ChartLineUpIcon,
                action: () =>
                  dispatch(
                    toggleSwapModal({
                      isOpen: true,
                      buyAssetId: "QQQ",
                      sellAssetId: "USD",
                    })
                  ),
              },
            ]}
          />
        </Section>
      </Stack>
    </Overlay>
  );
};

export default StocksOverlay;
