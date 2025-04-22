import PieChart from "@/components/ui/pie-chart/PieChart";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  selectAbstractedAssetBalanceUSD,
  selectAbstractedAssetsWithBalanceByGroup,
  selectAssetsBalanceUSDByGroup,
  selectAssetsByGroup,
  toggleGroupOverlay,
} from "../assetsSlice";
import { css } from "@emotion/react";
import WalletOverlay from "../../wallet/WalletOverlay";
import Card from "@/components/ui/card/Card";
import { ChartLineUp } from "@phosphor-icons/react";
import Button from "@/components/ui/button/Button";
import EarnBreakdownModal from "./EarnBreakdownModal";
import { useState } from "react";

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

  const assets = useSelector((state: RootState) =>
    selectAbstractedAssetsWithBalanceByGroup(state, "earn")
  );

  const balanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "earn")
  );

  const [isBreakdownOpen, setBreakdownOpen] = useState(false);

  const handleBreakdownOpen = (isOpen: boolean) => {
    setBreakdownOpen(isOpen);
  };
  return (
    <>
      <WalletOverlay
        isOpen={isOpen}
        onOpenChange={handleOpen}
        balance={balanceUSD}
        title="Earn"
        groupId="earn"
      >
        <section
          className="pie-chart-container"
          css={css`
            margin-inline: var(--size-250);
            margin-block-start: var(--size-300);
          `}
        >
          <div
            className="pie-chart-container"
            css={css`
              position: relative;
            `}
          >
            <div
              className="button-wrapper"
              css={css`
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: absolute;
                inset: 0;
                margin: auto;
                left: auto;
                right: 0;
                z-index: 1;
              `}
            >
              <Button
                size="x-small"
                color="neutral"
                onPress={() => void setBreakdownOpen(true)}
              >
                View breakdown
              </Button>
            </div>
            <PieChart data={pieChartData} type="earn"></PieChart>
          </div>
        </section>
        <section
          css={css`
            margin-block-start: var(--size-400);
            padding-inline: var(--size-250);
          `}
        >
          <Card
            title={
              <span
                css={css`
                  display: flex;
                  flex-direction: column;
                  align-items: start;
                `}
              >
                <span>US Dollar Yield</span>
                <span
                  css={css`
                    margin-block-start: var(--size-025);
                    margin-block-end: var(--size-050);
                    font-size: var(--fs-x-small);
                    color: var(--clr-accent);
                    font-weight: var(--fw-default);
                  `}
                >
                  7.00%&nbsp;
                  <span
                    css={css`
                      color: var(--clr-text-weaker);
                    `}
                  >
                    APY
                  </span>
                </span>
              </span>
            }
            caption="Earn yield by depositing money into a lending and borrowing protocol."
            icon={ChartLineUp}
          />
        </section>
      </WalletOverlay>
      <EarnBreakdownModal
        data={pieChartData}
        isOpen={isBreakdownOpen}
        onOpenChange={handleBreakdownOpen}
      />
    </>
  );
};

export default EarnOverlay;
