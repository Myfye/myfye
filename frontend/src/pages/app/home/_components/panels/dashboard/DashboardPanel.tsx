import Button from "@/shared/components/ui/button/Button";
import {
  ArrowCircleDownIcon,
  ArrowCircleUpIcon,
  ArrowLineDownIcon,
  ArrowLineUpIcon,
  ArrowsLeftRightIcon,
  ChartLineUpIcon,
  CurrencyCircleDollarIcon,
  PiggyBankIcon,
} from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import {
  selectAssetsBalanceUSD,
  selectAssetsBalanceUSDByGroup,
} from "@/features/assets/stores/assetsSlice";
import { toggleModal as toggleSendModal } from "@/features/send/stores/sendSlice";
import { toggleModal as toggleReceiveModal } from "@/features/receive/stores/receiveSlice";
import { toggleModal as toggleSwapModal } from "@/features/swap/stores/swapSlice";
import { toggleModal as toggleDepositModal } from "@/features/onOffRamp/deposit/depositSlice";
import { toggleModal as toggleWithdrawModal } from "@/features/onOffRamp/withdraw/withdrawSlice";
import CTACarousel from "../../../../../../shared/components/ui/cta-carousel/CTACarousel";
import bitcoinIcon from "@/assets/svgs/coins/btc-coin.svg";
import { togglePopup } from "../../../../../../shared/components/ui/cta-carousel/ctaCarouselSlice";
import BitcoinPopup from "../../../../../../shared/components/ui/cta-carousel/popups/BitcoinPopup";
import EarnPopup from "../../../../../../shared/components/ui/cta-carousel/popups/EarnPopup";
import InvestPopup from "../../../../../../shared/components/ui/cta-carousel/popups/InvestPopup";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Stack from "@/shared/components/ui/primitives/stack/Stack";
import Section from "@/shared/components/layout/section/Section";
import BalanceCard from "@/shared/components/ui/card/BalanceCard";
import ButtonGroup from "@/shared/components/ui/button/ButtonGroup";
import ButtonGroupItem from "@/shared/components/ui/button/ButtonGroupItem";
import PieChart3DCard from "@/shared/components/ui/charts/pie/PieChart3DCard";
import ZeroBalanceCard from "@/shared/components/ui/card/ZeroBalanceCard";

const DashboardPanel = ({}) => {
  const dispatch = useAppDispatch();

  const totalBalance = useSelector(selectAssetsBalanceUSD);

  const cashBalanceUSD = useAppSelector((state) =>
    selectAssetsBalanceUSDByGroup(state, "cash")
  );
  const earnBalanceUSD = useAppSelector((state) =>
    selectAssetsBalanceUSDByGroup(state, "earn")
  );
  const cryptoBalanceUSD = useAppSelector((state) =>
    selectAssetsBalanceUSDByGroup(state, "crypto")
  );
  const stocksBalanceUSD = useAppSelector((state) =>
    selectAssetsBalanceUSDByGroup(state, "stocks")
  );

  const pieChartData = (() => {
    const data = [];
    if (cashBalanceUSD > 0) {
      const cashData = {
        name: "Cash",
        y: cashBalanceUSD,
        color: "var(--clr-green)",
      };
      data.push(cashData);
    }
    if (earnBalanceUSD > 0) {
      const earnData = {
        name: "Earn",
        y: earnBalanceUSD,
        color: "var(--clr-secondary)",
      };
      data.push(earnData);
    }
    if (cryptoBalanceUSD > 0) {
      const cryptoData = {
        name: "Crypto",
        y: cryptoBalanceUSD,
        color: "var(--clr-teritary)",
      };
      data.push(cryptoData);
    }
    if (stocksBalanceUSD > 0) {
      const stocksData = {
        name: "Stocks",
        y: stocksBalanceUSD,
        color: "var(--clr-primary)",
      };
      data.push(stocksData);
    }
    return data;
  })();

  return (
    <>
      <Stack
        isolate="last"
        isolateMargin="var(--size-200)"
        height="100%"
        spread="flex-start"
        gap="none"
      >
        <Section>
          <BalanceCard balance={totalBalance} />
        </Section>
        <Section padding="none" marginTop="var(--size-200)">
          <ButtonGroup size="x-small" expand scroll>
            <ButtonGroupItem
              icon={ArrowsLeftRightIcon}
              onPress={() => {
                dispatch(toggleSwapModal({ isOpen: true }));
              }}
            >
              Swap
            </ButtonGroupItem>
            <ButtonGroupItem
              icon={ArrowCircleUpIcon}
              onPress={() => {
                dispatch(toggleSendModal({ isOpen: true }));
              }}
            >
              Send
            </ButtonGroupItem>
            <ButtonGroupItem
              icon={ArrowCircleDownIcon}
              onPress={() => {
                dispatch(toggleReceiveModal(true));
              }}
            >
              Receive
            </ButtonGroupItem>
            <ButtonGroupItem
              icon={ArrowLineUpIcon}
              onPress={() => {
                dispatch(toggleDepositModal(true));
              }}
            >
              Deposit
            </ButtonGroupItem>
            <ButtonGroupItem
              icon={ArrowLineDownIcon}
              onPress={() => {
                dispatch(toggleWithdrawModal(true));
              }}
            >
              Withdraw
            </ButtonGroupItem>
          </ButtonGroup>
        </Section>
        <Section marginTop="var(--size-300)">
          {totalBalance > 0 && (
            <PieChart3DCard data={pieChartData} name="Portfolio" />
          )}
          {totalBalance === 0 && (
            <ZeroBalanceCard
              image={{ src: CurrencyCircleDollarIcon, alt: "US Dollar" }}
              title="Manage your money, crypto, and stocks with MyFye"
              caption="Get started by depositing funds."
              action={() => {
                dispatch(toggleDepositModal(true));
              }}
              cta="Deposit funds"
            />
          )}
        </Section>
        <Section padding="none">
          <CTACarousel
            slides={[
              {
                title: "Create a savings account",
                caption: "Earn 4.1% APY with US Treasury Bonds",
                icon: PiggyBankIcon,
                action: () => {
                  dispatch(togglePopup({ type: "earn", isOpen: true }));
                },
              },
              {
                title: "Open a retirement account",
                caption:
                  "Instantly invest in the top 100 listed companies on the NASDAQ",
                icon: ChartLineUpIcon,
                action: () => {
                  dispatch(togglePopup({ type: "invest", isOpen: true }));
                },
              },
              {
                title: "Buy Bitcoin",
                caption: "Crypto made easy. Buy bitcoin instantly",
                icon: bitcoinIcon,
                action: () => {
                  dispatch(togglePopup({ type: "bitcoin", isOpen: true }));
                },
              },
            ]}
          />
        </Section>
      </Stack>
      <EarnPopup />
      <InvestPopup />
      <BitcoinPopup />
    </>
  );
};

export default DashboardPanel;
