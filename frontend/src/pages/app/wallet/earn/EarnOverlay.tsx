import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  selectAssetsBalanceUSDByGroup,
  toggleGroupOverlay,
} from "../../../../features/assets/assetsSlice";
import EarnBreakdownModal from "./EarnBreakdownModal";
import { useState } from "react";
import Overlay from "@/shared/components/ui/overlay/Overlay";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Section from "@/shared/components/layout/section/Section";
import Stack from "@/shared/components/ui/primitives/stack/Stack";
import BalanceCard from "@/shared/components/ui/card/BalanceCard";
import { toggleModal as toggleSwapModal } from "@/features/swap/swapSlice";
import { ChartLineUpIcon } from "@phosphor-icons/react";
import CTACarousel from "@/shared/components/ui/cta-carousel/CTACarousel";
import EarnPieChartCard from "./EarnPieChartCard";

const EarnOverlay = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.assets.groups["earn"].overlay.isOpen
  );

  const totalBalance = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "earn")
  );

  const [isBreakdownOpen, setBreakdownOpen] = useState(false);

  return (
    <>
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
            <BalanceCard balance={totalBalance} marginTop="var(--size-100)" />
          </Section>
          <Section marginTop="var(--size-300)">
            <EarnPieChartCard onPress={() => setBreakdownOpen(true)} />
          </Section>
          <Section marginBottom="var(--size-100)" padding="none">
            <CTACarousel
              slides={[
                {
                  title: "Earn up to 7% APY",
                  caption:
                    "Earn yield by depositing money into your MyFye wallet",
                  icon: ChartLineUpIcon,
                  action: () =>
                    dispatch(
                      toggleSwapModal({
                        isOpen: true,
                        sellAssetId: "USD",
                        buyAssetId: "USDY",
                      })
                    ),
                },
              ]}
            />
          </Section>
        </Stack>
      </Overlay>
      <EarnBreakdownModal
        isOpen={isBreakdownOpen}
        onOpenChange={(isOpen) => setBreakdownOpen(isOpen)}
      />
    </>
  );
};

export default EarnOverlay;
