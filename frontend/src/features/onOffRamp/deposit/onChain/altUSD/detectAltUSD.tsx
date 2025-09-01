import pyusdSol from "@/assets/pyusdSol.png";
import usdtSol from "@/assets/usdtSol.png";
import { Money as CashIcon, Bank as BankIcon, ChartLineUp as ChartIcon } from "@phosphor-icons/react";
import Modal from "@/shared/components/ui/modal/Modal";
import { useSelector, useDispatch } from "react-redux";
import { setModalOpen, setUSDTBalance, setPYUSDBalance } from "./altUSDSlice";
import { css } from "@emotion/react";
import Button from "@/shared/components/ui/button/Button";
import { useEffect, useState } from "react";
import { swap } from "@/features/swap/solana-swap/SwapService";
import { useAppSelector } from "@/redux/hooks";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { SwapTransaction } from "@/features/swap/solana-swap/swapSlice.ts";
import { RootState } from "@/redux/store";
import { toggleOverlay, updateAmount, updateAssetId, updateInputPublicKey, updateExchangeRate } from "@/features/swap/swapSlice";
import { updateBalance } from "@/features/assets/assetsSlice";

const AltUSDModal = () => {
  const { isOpen, openModal, closeModal } = useAltUSDModal();
  const { usdtBalance, pyusdBalance } = useSelector((state: RootState) => state.altUSD.balances);
  const { isOpen: modalIsOpen } = useSelector((state: RootState) => state.altUSD.modal);
  const assets = useAppSelector((state: RootState) => state.assets);
  const {wallets: [wallet],} = useSolanaWallets();
  const walletData = useAppSelector((state: RootState) => state.userWalletData);
  const transaction = useAppSelector((state: RootState) => state.swap.transaction);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [selectedOutputCurrency, setSelectedOutputCurrency] = useState<string>("");
  const dispatch = useDispatch();

  // Monitor swap status and handle balance increment when swap succeeds
  useEffect(() => {
    if (transaction.status === "success") {
      console.log("DETECT ALT USD Swap succeeded, incrementing USD balance");
      
              // Get the current balances
        const currentUSDBalance = assets.assets["USD"].balance;
        const currentUSDYBalance = assets.assets["USDY"].balance;
        const currentQQQBalance = assets.assets["QQQ"].balance;
        const usdyPrice = assets.assets["USDY"].exchangeRateUSD;
        const qqqPrice = assets.assets["QQQ"].exchangeRateUSD;
      
      // Determine the amount to add based on selected currency
      let amountToAdd = 0;
      if (selectedCurrency === "USDT") {
        amountToAdd = usdtBalance;
        console.log(`DETECT ALT USD Adding ${amountToAdd} USD from USDT swap`);
      } else if (selectedCurrency === "PYUSD") {
        amountToAdd = pyusdBalance;
        console.log(`DETECT ALT USD Adding ${amountToAdd} USD from PYUSD swap`);
      }
      
      if (amountToAdd > 0) {
        // Increment USD balance

        if (selectedOutputCurrency === "USD") {
        dispatch(updateBalance({
            assetId: "USD",
            balance: currentUSDBalance + amountToAdd,
          }));
        } else if (selectedOutputCurrency === "USDY") {
          const usdyAmountToAdd = amountToAdd / usdyPrice;
          console.log(`DETECT ALT USD Adding ${amountToAdd} USD worth of USDY (${usdyAmountToAdd} tokens at $${usdyPrice} each) from USDY swap ${currentUSDYBalance} + ${usdyAmountToAdd} = ${currentUSDYBalance + usdyAmountToAdd}`);
          dispatch(updateBalance({
            assetId: "USDY",
            balance: currentUSDYBalance + usdyAmountToAdd,
          }));
        } else if (selectedOutputCurrency === "QQQ") {
          const qqqAmountToAdd = amountToAdd / qqqPrice;
          console.log(`DETECT ALT USD Adding ${amountToAdd} USD worth of QQQ (${qqqAmountToAdd} shares at $${qqqPrice} each) from QQQ swap ${currentQQQBalance} + ${qqqAmountToAdd} = ${currentQQQBalance + qqqAmountToAdd}`);
          dispatch(updateBalance({
            assetId: "QQQ",
            balance: currentQQQBalance + qqqAmountToAdd,
          }));
        }
        
        // Reset the altUSD balances to 0 since they've been swapped
        if (selectedCurrency === "USDT") {
          dispatch(setUSDTBalance(0));
        } else if (selectedCurrency === "PYUSD") {
          dispatch(setPYUSDBalance(0));
        }
      }
         } else if (transaction.status === "failed") {
       console.log("DETECT ALT USD Swap failed");
       // wait 2 seconds and refresh the page
       setTimeout(() => {
         window.location.reload();
       }, 2000);
     }
  }, [transaction.status, selectedCurrency, usdtBalance, pyusdBalance, assets.assets, dispatch]);

  // Debug logging
  useEffect(() => {
    console.log("DETECT ALT USD AltUSDModal Debug:", {
      usdtBalance,
      pyusdBalance,
      modalIsOpen,
      isOpen,
      shouldShow: pyusdBalance > 0.01 || usdtBalance > 0.01
    });

    if (pyusdBalance > 0.01) {
      setSelectedCurrency("PYUSD");
    } else if (usdtBalance > 0.01) {
      setSelectedCurrency("USDT");
    } else {
      // Close the modal if no balances
      setSelectedCurrency("");
      closeModal();
    }
  }, [usdtBalance, pyusdBalance, modalIsOpen, isOpen, setSelectedCurrency, closeModal]);

  // Log when Redux state changes
  useEffect(() => {
    console.log("DETECT ALT USD Component: Redux state changed:", {
      usdtBalance,
      pyusdBalance,
      modalIsOpen
    });
  }, [usdtBalance, pyusdBalance, modalIsOpen]);

  const handleSwapPressed = (outputAsset: string) => {

    setSelectedOutputCurrency(outputAsset);
    let amount = 0;
    let inputAsset = "";

    if (selectedCurrency == "USDT") {
      amount = usdtBalance;
      inputAsset = "USDT";
    } else if (selectedCurrency == "PYUSD") {
      amount = pyusdBalance;
      inputAsset = "PYUSD";
    }

    // Set minimal transaction data for the swap to proceed
    dispatch(updateAssetId({ transactionType: "sell", assetId: "USD" }));
    dispatch(updateAssetId({ transactionType: "buy", assetId: outputAsset }));
    dispatch(updateAmount({ input: amount.toString(), replace: true }));
    dispatch(updateInputPublicKey(walletData.solanaPubKey));
    

    swap({
      wallet,
      assets,
      publicKey: walletData.solanaPubKey,
      inputAmount: amount,
      inputCurrency: inputAsset,
      outputCurrency: outputAsset,
      dispatch,
      transaction,
    });

    dispatch(
      toggleOverlay({
        type: "processingTransaction",
        isOpen: true,
      })
    );

    closeModal();
  }



  // Watch for balance changes that should trigger modal
  useEffect(() => {
    if (usdtBalance > 0.01) {
      console.log("DETECT ALT USD  USDT balance detected, should trigger modal:", usdtBalance);
    }
    if (pyusdBalance > 0.01) {
      console.log("DETECT ALT USD  PYUSD balance detected, should trigger modal:", pyusdBalance);
    }
  }, [usdtBalance, pyusdBalance]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={closeModal}
      title="Deposit received!"
      height={550}
      zIndex={99999}
    >
      <div
        css={css`
          padding: var(--size-100);
          display: flex;
          flex-direction: column;
          gap: var(--size-200);
        `}
      >

        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: var(--size-200);
          `}
        >
          {(selectedCurrency == "USDT") && (
            <div
              css={css`
                display: flex;
                align-items: center;
                gap: var(--size-200);
                padding: var(--size-200);
                background-color: var(--clr-neutral-50);
              `}
            >
              <img
                src={usdtSol}
                alt="USDT"
                css={css`
                  width: 40px;
                  height: 40px;
                `}
              />
              <div
                css={css`
                  flex: 1;
                `}
              >
                <div
                  css={css`
                    font-weight: 600;
                    color: var(--clr-neutral-900);
                  `}
                >
                  ${usdtBalance.toFixed(2)} USD
                </div>
              </div>
            </div>
          )}

          {(selectedCurrency == "PYUSD") && (
            <div
              css={css`
                display: flex;
                align-items: center;
                gap: var(--size-200);
                padding: var(--size-200);
                background-color: var(--clr-neutral-50);
              `}
            >
              <img
                src={pyusdSol}
                alt="PYUSD"
                css={css`
                  width: 40px;
                  height: 40px;
                `}
              />
              <div
                css={css`
                  flex: 1;
                `}
              >
                <div
                  css={css`
                    font-weight: 600;
                    color: var(--clr-neutral-900);
                  `}
                >
                  ${pyusdBalance.toFixed(2)} USD
                </div>
              </div>
            </div>
          )}
        </div>

        <div
              css={css`
                display: flex;
                align-items: center;
                gap: var(--size-200);
                padding: var(--size-200);
                background-color: var(--clr-neutral-50);
                border-radius: var(--border-radius-small);
                border: 1px solid var(--clr-neutral-200);
              `}
            >

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>

          <div
            css={css`
              width: 2.75rem;
              height: 2.75rem;
              border-radius: var(--border-radius-circle);
              background-color: transparent;
              display: flex;
              align-items: center;
              justify-content: center;
            `}
          >
            <CashIcon 
              size={30} 
              color="var(--clr-primary)" 
              weight="light" 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginLeft: 'var(--size-200)', marginRight: 'var(--size-200)'}}>

            <div style={{ fontWeight: '600', color: 'var(--clr-neutral-900)', fontSize: 'var(--fs-medium)' }}>
            Keep funds in US Dollars
            </div>
            <div style={{ fontSize: 'var(--fs-small)' }}>
            Hold USD for instant trading
            </div>

          </div>

                    <Button
            onPress={() => handleSwapPressed('USD')}
            variant="primary"
            css={css`
              min-width: 80px;
            `}
          >
            Select
          </Button>

          </div>
        </div>













        <div
              css={css`
                display: flex;
                align-items: center;
                gap: var(--size-200);
                padding: var(--size-200);
                background-color: var(--clr-neutral-50);
                border-radius: var(--border-radius-small);
                border: 1px solid var(--clr-neutral-200);
              `}
            >

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>

          <div
            css={css`
              width: 2.75rem;
              height: 2.75rem;
              border-radius: var(--border-radius-circle);
              background-color: transparent;
              display: flex;
              align-items: center;
              justify-content: center;
            `}
          >
            <BankIcon 
              size={30} 
              color="var(--clr-primary)" 
              weight="light" 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginLeft: 'var(--size-200)', marginRight: 'var(--size-200)'}}>

            <div style={{ fontWeight: '600', color: 'var(--clr-neutral-900)', fontSize: 'var(--fs-medium)' }}>
            Create a savings account
            </div>
            <div style={{ fontSize: 'var(--fs-small)' }}>
            Earn 4.1% with U.S. Treasury Bonds
            </div>

          </div>

                    <Button
            onPress={() => handleSwapPressed('USDY')}
            variant="primary"
            css={css`
              min-width: 80px;
            `}
          >
            Select
          </Button>

          </div>
        </div>














        <div
              css={css`
                display: flex;
                align-items: center;
                gap: var(--size-200);
                padding: var(--size-200);
                background-color: var(--clr-neutral-50);
                border-radius: var(--border-radius-small);
                border: 1px solid var(--clr-neutral-200);
              `}
            >

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>

          <div
            css={css`
              width: 2.75rem;
              height: 2.75rem;
              border-radius: var(--border-radius-circle);
              background-color: transparent;
              display: flex;
              align-items: center;
              justify-content: center;
            `}
          >
            <ChartIcon 
              size={30} 
              color="var(--clr-primary)" 
              weight="light" 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginLeft: 'var(--size-200)', marginRight: 'var(--size-200)'}}>

            <div style={{ fontWeight: '600', color: 'var(--clr-neutral-900)', fontSize: 'var(--fs-medium)' }}>
            Open retirement account
            </div>
            <div style={{ fontSize: 'var(--fs-small)' }}>
            Diversify with the 100 largest companies on the Nasdaq
            </div>

          </div>

                    <Button
            onPress={() => handleSwapPressed('QQQ')}
            variant="primary"
            css={css`
              min-width: 80px;
            `}
          >
            Select
          </Button>

          </div>
        </div>



        <div
          css={css`
            display: flex;
            gap: var(--size-200);
            margin-top: var(--size-200);
          `}
        >

        </div>
      </div>
    </Modal>
  );
};

// Hook to use the AltUSD modal
export const useAltUSDModal = () => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state: RootState) => state.altUSD.modal);
  const { usdtBalance, pyusdBalance } = useSelector(
    (state: RootState) => state.altUSD.balances
  );

  const hasAltUSD = usdtBalance > 0.01 || pyusdBalance > 0.01;

  const openModal = () => {
    console.log("DETECT ALT USD Opening AltUSD modal");
    dispatch(setModalOpen(true));
  };

  const closeModal = () => {
    console.log("DETECT ALT USD Closing AltUSD modal");
    dispatch(setModalOpen(false));
  };

  return {
    isOpen: isOpen && hasAltUSD,
    openModal,
    closeModal,
  };
};

export default AltUSDModal;
