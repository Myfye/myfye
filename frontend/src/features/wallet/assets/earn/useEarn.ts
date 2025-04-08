import { RootState } from "@/redux/store";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { calcBalanceUsd } from "../assets/utils";

const useEarn = () => {
  const stocks = useSelector((state: RootState) => {
    const assetIds = state.assets.ids;
    const stockIds = assetIds.filter((assetId) => {
      if (state.assets.assets[assetId]) return true;
    });
    const stocks = stockIds.map((stockId) => state.assets.assets[stockId]);
    return stocks;
  });

  const stocksBalanceUsd = useMemo(() => calcBalanceUsd(stocks), [stocks]);

  return { stocks, stocksBalanceUsd };
};

export default useStocks;
