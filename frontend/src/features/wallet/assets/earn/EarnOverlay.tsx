import Overlay from "@/components/ui/overlay/Overlay";
import BalanceTitle from "@/components/ui/balance-title/BalanceTitle";
import useBalance from "@/hooks/useBalance";
import PieChart from "@/components/ui/pie-chart/PieChart";
import { useMemo } from "react";
import Button from "@/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  setDepositModalOpen,
  setReceiveModalOpen,
  setSendModalOpen,
} from "@/redux/modalReducers";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  ArrowsLeftRight,
} from "@phosphor-icons/react";
import AssetCardList from "@/features/wallet/assets/cards/AssetCardList";
import { RootState } from "@/redux/store";
import { selectAssetsByGroup, toggleGroupOverlay } from "../assetsSlice";

const pieChartData = [
  {
    id: "First Citizens - Bank Deposits",
    label: "First Citizens - Bank Deposits",
    value: 0.7,
    color: "var(--clr-green-500)",
  },
  {
    id: "StoneX - US T-Bills",
    label: "StoneX - US T-Bills",
    value: 0.16,
    color: "var(--clr-blue-300)",
  },
  {
    id: "Morgan Stanley - Bank Deposits",
    label: "Morgan Stanley - Bank Deposits",
    value: 0.06,
    color: "var(--clr-blue-500)",
  },
  {
    id: "StoneX - Cash & Equivalents",
    label: "StoneX - Cash & Equivalents",
    value: 0.06,
    color: "var(--clr-blue-700)",
  },
  {
    id: "Morgan Stanley - US T-Notes",
    label: "Morgan Stanley - US T-Notes",
    value: 0.05,
    color: "var(--clr-green-700)",
  },
  {
    id: "StoneX - US T-Notes",
    label: "StoneX - US T-Notes",
    value: 0.03,
    color: "var(--clr-blue-400)",
  },
  {
    id: "First Citizens - Cash & Cash Deposits",
    label: "First Citizens - Cash & Cash Deposits",
    value: 0.02,
    color: "var(--clr-green-400)",
  },
  {
    id: "Morgan Stanley - Cash & Cash Deposits",
    label: "Morgan Stanley - Cash & Cash Deposits",
    value: 0,
    color: "var(--clr-green-300)",
  },
];

const EarnOverlay = () => {
  const { cashBalanceInUSD, usdyBalanceInUSD, eurcBalanceInUSD } = useBalance();

  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.assets.groups["earn"].overlay.isOpen
  );

  const onOpenChange = (isOpen: boolean) => {
    dispatch(toggleGroupOverlay({ isOpen, groupId: "earn" }));
  };

  const earnAssets = useSelector((state: RootState) =>
    selectAssetsByGroup(state, "earn")
  );

  // USDT
  const usdtSolBalance = useSelector(
    (state: any) => state.userWalletData.usdtSolBalance
  );

  // EURC
  const eurcSolBalance = useSelector(
    (state: any) => state.userWalletData.eurcSolBalance
  );

  const coins = useMemo(
    () => [
      {
        title: "US Dollar",
        currency: "usd",
        type: "usdt",
        balance: usdtSolBalance,
      },
      {
        title: "Euro",
        currency: "eur",
        type: "eurc",
        balance: eurcSolBalance,
      },
      {
        title: "US Treasury Bonds",
        currency: "usd",
        type: "usdy",
        balance: usdyBalanceInUSD,
      },
    ],
    [usdtSolBalance, usdyBalanceInUSD, eurcSolBalance]
  );

  return (
    <>
      <Overlay isOpen={isOpen} onOpenChange={onOpenChange} title="Earn">
        {/* {usdyBalanceInUSD === 0 &&
        eurcBalanceInUSD === 0 &&
        usdtSolBalance === 0 ? (
          <div
            css={css`
              display: grid;
              place-items: center;
              height: 100%;
            `}
          >
            <section>
              <hgroup
                css={css`
                  text-align: center;
                `}
              >
                <p className="heading-large">Deposit cash</p>
                <p className="caption-medium">Lorem ipsum dolor</p>
              </hgroup>
              <Button>Deposit cash</Button>
            </section>
          </div>
        ) : ( */}
        <>
          <section
            className="balance-container"
            css={css`
              margin-block-start: var(--size-150);
            `}
          >
            <div
              className="balance-wrapper"
              css={css`
                padding: 0 var(--size-250);
              `}
            >
              <BalanceTitle balance={cashBalanceInUSD} />
            </div>
            <menu
              className="no-scrollbar"
              css={css`
                display: flex;
                align-items: center;
                justify-content: flex-start;
                gap: var(--controls-gap-small);
                overflow-x: auto;
                padding: 0 var(--size-250);
                margin-block-start: var(--size-250);
                background-color: var(--clr-surface);
              `}
            >
              <li>
                <Button
                  size="x-small"
                  icon={ArrowCircleUp}
                  onPress={() => {
                    dispatch(setSendModalOpen(true));
                  }}
                >
                  Send
                </Button>
              </li>
              <li>
                <Button
                  size="x-small"
                  icon={ArrowCircleDown}
                  onPress={() => {
                    dispatch(setReceiveModalOpen(true));
                  }}
                >
                  Receive
                </Button>
              </li>
              <li>
                <Button
                  size="x-small"
                  icon={ArrowsLeftRight}
                  onPress={() => {
                    dispatch(setDepositModalOpen(true));
                  }}
                >
                  Swap
                </Button>
              </li>
            </menu>
          </section>
          <section
            className="pie-chart-container"
            css={css`
              margin-inline: var(--size-250);
            `}
          >
            <PieChart data={pieChartData} type="earn"></PieChart>
          </section>
          <section
            css={css`
              margin-inline: var(--size-250);
            `}
          >
            <AssetCardList coins={coins} showOptions={true} />
          </section>
        </>
        {/* )} */}
      </Overlay>
    </>
  );
};

export default EarnOverlay;
