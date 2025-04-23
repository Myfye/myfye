import { css } from "@emotion/react";
import PieChart from "@/components/ui/pie-chart/PieChart";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import AssetCardList from "@/features/assets/cards/AssetCardList";
import { RootState } from "@/redux/store";
import {
  selectAbstractedAssetBalanceUSD,
  selectAbstractedAssetsWithBalanceByGroup,
  selectAssetsBalanceUSDByGroup,
  toggleGroupOverlay,
} from "../assetsSlice";
import WalletOverlay from "../../wallet/WalletOverlay";
import Button from "@/components/ui/button/Button";

const CashOverlay = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.assets.groups["cash"].overlay.isOpen
  );

  const handleOpen = (isOpen: boolean) => {
    dispatch(toggleGroupOverlay({ isOpen, groupId: "cash" }));
  };

  const assets = useSelector((state: RootState) =>
    selectAbstractedAssetsWithBalanceByGroup(state, "cash")
  );

  const usdBalance = useSelector((state: RootState) =>
    selectAbstractedAssetBalanceUSD(state, "us_dollar")
  );

  const euroBalanceUSD = useSelector((state: RootState) =>
    selectAbstractedAssetBalanceUSD(state, "euro")
  );

  const balanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "cash")
  );

  const pieChartData = useMemo(() => {
    const data = [];
    if (usdBalance > 0) {
      const usdData = {
        id: "US Dollar",
        label: "USD",
        value: usdBalance,
        color: "var(--clr-green-400)",
      };
      data.push(usdData);
    }
    if (euroBalanceUSD > 0) {
      const euroData = {
        id: "Euro",
        label: "Euro",
        value: euroBalanceUSD,
        color: "var(--clr-blue-400)",
      };
      data.push(euroData);
    }
    return data;
  }, [usdBalance, euroBalanceUSD]);

  return (
    <>
      <WalletOverlay
        isOpen={isOpen}
        onOpenChange={handleOpen}
        title="Cash"
        balance={balanceUSD}
        groupId="cash"
      >
        {pieChartData.length > 0 && (
          <section className="pie-chart-container">
            <PieChart data={pieChartData}></PieChart>
          </section>
        )}
        {pieChartData.length === 0 && (
          <section
            css={css`
              display: grid;
              place-items: center;
              width: 100%;
              height: 16rem;
            `}
          >
            <div
              css={css`
                display: flex;
                flex-direction: column;
                align-items: center;
              `}
            >
              <p className="heading-medium">Lorem ipsum</p>
              <p
                className="caption"
                css={css`
                  color: var(--clr-text-weaker);
                  margin-block-start: var(--size-050);
                `}
              >
                Lorem ispum dolor, lorum ipsum dolor
              </p>
              <div
                css={css`
                  margin-block-start: var(--size-200);
                `}
              >
                <Button>Deposit crypto</Button>
              </div>
            </div>
          </section>
        )}
        <section
          css={css`
            margin-block-start: var(--size-500);
            margin-inline: var(--size-250);
            margin-block-end: var(--size-250);
          `}
        >
          <AssetCardList assets={assets} showOptions={true} />
        </section>
      </WalletOverlay>
    </>
  );
};

export default CashOverlay;
