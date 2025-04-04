import { RootState } from "@/redux/store";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const useStocks = () => {
  const stocks = useSelector((state: RootState) => state.stocks.stocks);
  const getBalanceUSD = useMemo(() => {
    let count = 0;
    for (const key in stocks) {
      count += stocks[key].priceInUSD;
    }
    return count;
  }, [stocks]);
  return { getBalanceUSD };
};

export default useStocks;
