import { RootState } from "@/redux/store";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { calcBalanceUsd } from "../utils";

const useStocks = () => {
  const stocks = useSelector((state: RootState) => {});

  const stocksBalanceUsd = useMemo(() => calcBalanceUsd(stocks), [stocks]);

  return { stocks, stocksBalanceUsd };
};

export default useStocks;
