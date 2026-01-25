import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  selectAssetsWithBalanceByDashboard,
  selectAssetsBalanceUSDByDashboardId,
} from "@/features/assets/stores/assetsSlice";
import AssetPanel from "../../AssetPanel";
import { css } from "@emotion/react";
import { useMemo } from "react";

// Check if current time is during weekend trading blackout
// Friday 5pm - Monday 5am (local time)
const isWeekendTradingBlackout = (): boolean => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, 5 = Friday, 6 = Saturday
  const hour = now.getHours();

  // Sunday (all day)
  if (day === 0) {
    return true;
  }

  // Saturday (all day)
  if (day === 6) {
    return true;
  }

  // Friday after 5pm (17-23)
  if (day === 5 && hour >= 17) {
    return true;
  }

  // Monday before 5am (0-4)
  if (day === 1 && hour < 5) {
    return true;
  }

  return false;
};

const CommoditiesPanel = ({}) => {
  const commoditiesAssets = useSelector((state: RootState) =>
    selectAssetsWithBalanceByDashboard(state, "commodities")
  );

  const balanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByDashboardId(state, "commodities")
  );

  const isWeekend = useMemo(() => isWeekendTradingBlackout(), []);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        height: 100%;
      `}
    >
      {isWeekend && (
        <div
          css={css`
            background-color: var(--clr-warning-surface, #fef3c7);
            border: 1px solid var(--clr-warning-border, #f59e0b);
            border-radius: var(--border-radius-medium);
            padding: var(--size-150) var(--size-200);
            margin-inline: var(--size-250);
            margin-block-start: var(--size-150);
            margin-bottom: var(--size-150);
            display: flex;
            align-items: center;
            gap: var(--size-100);
          `}
        >
          <span
            css={css`
              font-size: var(--fs-large);
            `}
          >
            ⚠️
          </span>
          <p
            css={css`
              color: var(--clr-warning-text, #92400e);
              font-size: var(--fs-small);
              font-weight: var(--fw-active);
              margin: 0;
            `}
          >
            Commodities markets are closed on weekends.
          </p>
        </div>
      )}
      <AssetPanel balance={balanceUSD} assets={commoditiesAssets} />
    </div>
  );
};

export default CommoditiesPanel;
