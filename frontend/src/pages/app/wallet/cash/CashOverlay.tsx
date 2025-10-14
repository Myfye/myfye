import AssetCardList from "@/features/assets/cards/AssetCardList";
import {
  selectAssetBalanceUSD,
  selectAssetsWithBalanceByGroup,
  toggleGroupOverlay,
} from "@/features/assets/assetsSlice";
import Stack from "@/shared/components/ui/primitives/stack/Stack";
import Overlay from "@/shared/components/ui/overlay/Overlay";
import BalanceCard from "@/shared/components/ui/card/BalanceCard";
import ButtonGroup from "@/shared/components/ui/button/ButtonGroup";
import ButtonGroupItem from "@/shared/components/ui/button/ButtonGroupItem";
import {
  ArrowCircleDownIcon,
  ArrowCircleUpIcon,
  ArrowsLeftRightIcon,
  CurrencyDollarIcon,
  HandArrowDownIcon,
  HandDepositIcon,
} from "@phosphor-icons/react";
import { toggleModal as toggleSwapModal } from "@/features/swap/swapSlice";
import { toggleModal as toggleSendModal } from "@/features/send/sendSlice";
import { toggleModal as toggleReceiveModal } from "@/features/receive/receiveSlice";
import Section from "@/shared/components/layout/section/Section";
import PieChart3DCard from "@/shared/components/ui/charts/pie/PieChart3DCard";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Inline from "@/shared/components/ui/primitives/inline/Inline";
import Heading from "@/shared/components/ui/text/Heading";
import CTACarousel from "@/shared/components/ui/cta-carousel/CTACarousel";
import ZeroBalanceCard from "@/shared/components/ui/card/ZeroBalanceCard";
import { PointOptionsObject } from "highcharts";
import { toggleModal as toggleDepositModal } from "@/features/onOffRamp/deposit/depositSlice";

const generatePieChartData = (
  usdBalance: number,
  euroBalanceUSD: number,
  mxnBalanceUSD: number
) => {
  const data = [];
  if (usdBalance > 0) {
    const cashData = {
      name: "USD",
      y: usdBalance,
      color: "var(--clr-green)",
    };
    data.push(cashData);
  }
  if (euroBalanceUSD > 0) {
    const euroData = {
      name: "EUR",
      y: euroBalanceUSD,
      color: "var(--clr-blue)",
    };
    data.push(euroData);
  }
  if (mxnBalanceUSD > 0) {
    const pesoData = {
      name: "MXN",
      y: mxnBalanceUSD,
      color: "var(--clr-purple)",
    };
    data.push(pesoData);
  }
  return data satisfies PointOptionsObject[];
};

const CashOverlay = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(
    (state) => state.assets.groups["cash"].overlay.isOpen
  );

  const assets = useAppSelector((state) =>
    selectAssetsWithBalanceByGroup(state, "cash")
  );

  const usdBalance = useAppSelector((state) =>
    selectAssetBalanceUSD(state, "USD")
  );

  const euroBalanceUSD = useAppSelector((state) =>
    selectAssetBalanceUSD(state, "EUR")
  );

  const mxnBalanceUSD = useAppSelector((state) =>
    selectAssetBalanceUSD(state, "MXN")
  );

  const totalBalance = usdBalance + euroBalanceUSD + mxnBalanceUSD;

  const pieChartData = generatePieChartData(
    usdBalance,
    euroBalanceUSD,
    mxnBalanceUSD
  );

  return (
    <Overlay
      isOpen={isOpen}
      onOpenChange={(isOpen) =>
        dispatch(toggleGroupOverlay({ isOpen, groupId: "cash" }))
      }
      title="Cash"
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
            <PieChart3DCard data={pieChartData} name="Cash" />
          )}
          {totalBalance === 0 && (
            <ZeroBalanceCard
              image={{ src: CurrencyDollarIcon, alt: "Dollar sign" }}
              title="Hold cash. Get paid."
              caption="Get started by making a cash deposit"
              action={() => {
                dispatch(toggleDepositModal(true));
              }}
              cta="Deposit"
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
          <CTACarousel
            slides={[
              {
                title: "Send cash. No bank needed.",
                caption: "Send cash to your friends and family with no fees.",
                icon: HandDepositIcon,
                action: () =>
                  dispatch(
                    toggleSendModal({
                      isOpen: true,
                      assetId: "USD",
                    })
                  ),
              },
              {
                title: "Receive money in an instant",
                caption:
                  "Show your wallet QR code to receive funds from across the globe",
                icon: HandArrowDownIcon,
                action: () => dispatch(toggleReceiveModal(true)),
              },
            ]}
          />
        </Section>
      </Stack>
    </Overlay>
  );
};

export default CashOverlay;
