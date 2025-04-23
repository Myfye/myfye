import { useMemo, useState } from "react";

import { css } from "@emotion/react";

import { useDispatch, useSelector } from "react-redux";
import AssetCardList from "@/features/assets/cards/AssetCardList";

import usDollarCoinIcon from "@/assets/svgs/coins/usd-coin.svg";
import euroCoinIcon from "@/assets/svgs/coins/eur-coin.svg";
import usdyCoinIcon from "@/assets/svgs/coins/usdy-coin.svg";
import Overlay from "@/components/ui/overlay/Overlay";
import useBalance from "@/hooks/useBalance";
import { setWithdrawCryptoOverlayOpen } from "@/redux/overlayReducers";
import SelectContactOverlay from "./select-contact-overlay/SelectContactOverlay";
import { addCurrentCoin } from "@/redux/coinReducer";

const WithdrawCryptoOverlay = ({ isOpen, onOpenChange }) => {
  const dispatch = useDispatch();
  const { usdyBalanceInUSD } = useBalance();
  const usdtSolBalance = useSelector(
    (state: any) => state.userWalletData.usdtSolBalance
  );
  const eurcSolBalance = useSelector(
    (state: any) => state.userWalletData.eurcSolBalance
  );

  const { solBalanceInUSD, btcBalanceInUSD } = useBalance();

  const [isSelectContactOverlayOpen, setSelectContactOverlayOpen] =
    useState(false);

  const cashCoins = useMemo(
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

  const cryptoCoins = useMemo(
    () => [
      {
        title: "Bitcoin",
        currency: "usd",
        type: "btc",
        balance: usdtSolBalance,
      },
      {
        title: "Solana",
        currency: "usd",
        type: "sol",
        balance: eurcSolBalance,
      },
    ],
    [solBalanceInUSD, btcBalanceInUSD]
  );

  const onAssetSelect = (coin) => {
    dispatch(addCurrentCoin(coin));
    setSelectContactOverlayOpen(true);
  };

  return (
    <>
      <Overlay isOpen={isOpen} onOpenChange={onOpenChange} title="Select Coin">
        <section
          css={css`
            margin-block-start: var(--size-600);
            padding: 0 var(--size-250);
          `}
        >
          <p
            className="caption"
            css={css`
              color: var(--clr-text-weaker);
              margin-block-end: var(--size-300);
            `}
          >
            Cash
          </p>
          <AssetCardList
            coins={cashCoins}
            showOptions={false}
            onAssetSelect={onAssetSelect}
          />
        </section>
        <section
          css={css`
            margin-block-start: var(--size-700);
            padding: 0 var(--size-250);
          `}
        >
          <p
            className="caption"
            css={css`
              color: var(--clr-text-weaker);
              margin-block-end: var(--size-300);
            `}
          >
            Crypto
          </p>
          <AssetCardList
            coins={cryptoCoins}
            showOptions={false}
            onAssetSelect={onAssetSelect}
          />
        </section>
      </Overlay>
    </>
  );
};

export default WithdrawCryptoOverlay;
