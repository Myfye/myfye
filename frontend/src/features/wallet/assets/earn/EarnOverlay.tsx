import Overlay from "@/components/ui/overlay/Overlay";
import BalanceTitle from "@/components/ui/balance-title/BalanceTitle";
import PieChart from "@/components/ui/pie-chart/PieChart";
import Button from "@/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  setReceiveModalOpen,
  setSendModalOpen,
  setSwapModalOpen,
} from "@/redux/modalReducers";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  ArrowsLeftRight,
} from "@phosphor-icons/react";
import { RootState } from "@/redux/store";
import {
  selectAssetsBalanceUSDByGroup,
  selectAssetsByGroup,
  toggleGroupOverlay,
} from "../assetsSlice";
import { css } from "@emotion/react";
import WalletOverlay from "../../WalletOverlay";

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
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.assets.groups["earn"].overlay.isOpen
  );

  const handleOpen = (isOpen: boolean) => {
    dispatch(toggleGroupOverlay({ isOpen, groupId: "earn" }));
  };

  const earnAssets = useSelector((state: RootState) =>
    selectAssetsByGroup(state, "earn")
  );

  const balanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "earn")
  );
  return (
    <>
      <WalletOverlay
        isOpen={isOpen}
        onOpenChange={handleOpen}
        balance={balanceUSD}
        title="Earn"
      >
        <section
          className="pie-chart-container"
          css={css`
            margin-inline: var(--size-250);
          `}
        >
          <PieChart data={pieChartData} type="earn"></PieChart>
        </section>
      </WalletOverlay>
    </>
  );
};

export default EarnOverlay;
