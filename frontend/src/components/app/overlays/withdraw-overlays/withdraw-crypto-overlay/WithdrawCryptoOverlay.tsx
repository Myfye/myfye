import { useMemo, useState } from "react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { useDispatch, useSelector } from "react-redux";
import CoinCardList from "@/components/ui/coin-card/CoinCardList";

import usDollarCoinIcon from "@/assets/svgs/coins/usd-coin.svg";
import euroCoinIcon from "@/assets/svgs/coins/eur-coin.svg";
import usdyCoinIcon from "@/assets/svgs/coins/usdy-coin.svg";
import Overlay from "@/components/ui/overlay/Overlay";
import useBalance from "@/hooks/useBalance";
import { setWithdrawCryptoOverlayOpen } from "@/redux/overlayReducers";

const WithdrawCryptoOverlay = ({ isOpen, onOpenChange }) => {
  const { usdyBalanceInUSD } = useBalance();
  const usdtSolBalance = useSelector(
    (state: any) => state.userWalletData.usdtSolBalance
  );
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

  const [currentCoin, setCurrentCoin] = useState(coins[0]);

  const onCoinSelect = (coin) => {
    setCurrentCoin(coin);
  };

  return (
    <>
      <Overlay isOpen={isOpen} onOpenChange={onOpenChange}>
        <section
          css={css`
            margin-block-start: var(--size-500);
          `}
        >
          <CoinCardList
            coins={coins}
            showOptions={false}
            // onCoinSelect={onCoinSelect}
          />
        </section>
      </Overlay>
      {/* <RecepientOverlay
        coin={currentCoin}
        isOpen={isRecepientOverlayOpen}
        onOpenChange={(e) => setRecepientOverlayOpen(e)}
        onClose={() => setRecepientOverlayOpen(false)}
      /> */}
    </>
  );
};

export default WithdrawCryptoOverlay;
