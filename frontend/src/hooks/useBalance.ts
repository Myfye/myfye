import { useMemo } from "react";
import { useSelector } from "react-redux";

const useBalance = () => {
  /* Cash */

  // USDT
  const usdtSolBalance = useSelector(
    (state: any) => state.userWalletData.usdtSolBalance
  );
  const usdcSolBalance = useSelector(
    (state: any) => state.userWalletData.usdcSolBalance
  );

  // EURC
  const eurcSolBalance = useSelector(
    (state: any) => state.userWalletData.eurcSolBalance
  );
  const priceOfEURCinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfEURCinUSDC
  );
  const eurcBalanceInUSD = useMemo(
    () => eurcSolBalance * priceOfEURCinUSDC,
    [eurcSolBalance, priceOfEURCinUSDC]
  );

  // USDY
  const usdySolBalance = useSelector(
    (state: any) => state.userWalletData.usdySolBalance
  );
  const priceOfUSDYinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfUSDYinUSDC
  );
  const usdyBalanceInUSD = useMemo(
    () => usdySolBalance * priceOfUSDYinUSDC,
    [eurcSolBalance, priceOfUSDYinUSDC]
  );

  const cashBalance = useMemo(
    () => usdtSolBalance + usdcSolBalance + eurcBalanceInUSD,
    [usdtSolBalance, eurcBalanceInUSD, usdcSolBalance]
  );

  // BTC
  const btcSolBalance = useSelector(
    (state: any) => state.userWalletData.btcSolBalance
  );
  const priceOfBTCinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfBTCinUSDC
  );
  const btcBalanceInUSD = useMemo(
    () => btcSolBalance * priceOfBTCinUSDC,
    [btcSolBalance, priceOfBTCinUSDC]
  );

  // SOL
  const solBalance = useSelector(
    (state: any) => state.userWalletData.solBalance
  );
  const priceOfSolinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfSolinUSDC
  );
  const solBalanceInUSD = useMemo(
    () => solBalance * /*priceOfSolinUSDC*/ 1,
    [solBalance, priceOfSolinUSDC]
  );

  const cryptoBalance = useMemo(
    () => btcBalanceInUSD + solBalanceInUSD,
    [btcBalanceInUSD, solBalanceInUSD]
  );

  const totalBalance = useMemo(
    () => cryptoBalance + cashBalance + usdyBalanceInUSD,
    [cryptoBalance, cashBalance]
  );

  return {
    totalBalanceInUSD: totalBalance,
    cryptoBalanceInUSD: cryptoBalance,
    solBalanceInUSD,
    btcBalanceInUSD,
    cashBalanceInUSD: cashBalance,
    usdyBalanceInUSD: usdyBalanceInUSD,
    eurcBalanceInUSD: eurcBalanceInUSD,
  };
};

export default useBalance;
