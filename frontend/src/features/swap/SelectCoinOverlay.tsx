/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import CoinCardList from "@/components/ui/coin-card/CoinCardList";
import Overlay from "@/components/ui/overlay/Overlay";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setCoin, toggleOverlay } from "./swapSlice";
import { useCallback, useMemo } from "react";
import useBalance from "@/hooks/useBalance";

const SelectCoinOverlay = ({ zIndex = 1000 }) => {
  const dispatch = useDispatch();

  const { btcBalanceInUSD, solBalanceInUSD, usdyBalanceInUSD } = useBalance();
  const usdBalance = useSelector(
    (state: RootState) => state.userWalletData.usdtSolBalance
  );

  const eurcBalance = useSelector(
    (state: RootState) => state.userWalletData.eurcSolBalance
  );

  const isOpen = useSelector(
    (state: RootState) => state.swap.overlays.selectCoin.isOpen
  );

  const transactionType = useSelector(
    (state: RootState) => state.swap.overlays.selectCoin.transactionType
  );

  const handleOpen = (e: boolean) => {
    dispatch(
      toggleOverlay({
        type: "selectCoin",
        isOpen: e,
        transactionType: transactionType,
      })
    );
  };

  const onCoinSelect = useCallback(
    (coin: any) => {
      dispatch(setCoin({ transactionType: transactionType, coin: coin.type }));
      dispatch(
        toggleOverlay({
          type: "selectCoin",
          isOpen: false,
          transactionType: transactionType,
        })
      );
    },
    [transactionType]
  );

  const cryptoCoins = useMemo(
    () => [
      {
        title: "Bitcoin",
        currency: "btc",
        type: "btc",
        balance: btcBalanceInUSD,
      },
      {
        title: "Solana",
        currency: "sol",
        type: "sol",
        balance: solBalanceInUSD,
      },
    ],
    [btcBalanceInUSD, solBalanceInUSD]
  );

  const cashCoins = useMemo(
    () => [
      {
        title: "US Dollar",
        currency: "usd",
        type: "usdt",
        balance: usdBalance,
      },
      {
        title: "Euro",
        currency: "eur",
        type: "eurc",
        balance: eurcBalance,
      },
      {
        title: "US Treasury Bonds",
        currency: "usd",
        type: "usdy",
        balance: usdyBalanceInUSD,
      },
    ],
    [usdBalance, usdyBalanceInUSD, eurcBalance]
  );

  return (
    <Overlay
      title="Select coin"
      isOpen={isOpen}
      onOpenChange={handleOpen}
      zIndex={zIndex}
    >
      <div
        css={css`
          margin-inline: var(--size-250);
        `}
      >
        <section
          className="cash"
          css={css`
            margin-block-start: var(--size-400);
          `}
        >
          <h2
            className="heading-small"
            css={css`
              color: var(--clr-text-weak);
              margin-block-end: var(--size-300);
            `}
          >
            Cash
          </h2>
          <CoinCardList
            coins={cashCoins}
            onCoinSelect={onCoinSelect}
            showBalance={transactionType === "sell"}
          ></CoinCardList>
        </section>
        <section
          className="crypto"
          css={css`
            margin-block-start: var(--size-600);
          `}
        >
          <h2
            className="heading-small"
            css={css`
              color: var(--clr-text-weak);
              margin-block-end: var(--size-300);
            `}
          >
            Crypto
          </h2>
          <CoinCardList
            coins={cryptoCoins}
            onCoinSelect={onCoinSelect}
            showBalance={transactionType === "sell"}
          ></CoinCardList>
        </section>
      </div>
    </Overlay>
  );
};

export default SelectCoinOverlay;
