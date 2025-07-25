import { useState, createContext, useContext, useRef, useEffect } from "react";
import { css } from "@emotion/react";
import usdcSol from "@/assets/usdcSol.png";
import eurcSol from "@/assets/eurcSol.png";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import AssetCardList from "@/features/assets/cards/AssetCardList";
import Overlay from "@/shared/components/ui/overlay/Overlay";
import { setWithdrawCryptoOverlayOpen } from "@/redux/overlayReducers";
import SelectContactOverlay from "./select-contact-overlay/SelectContactOverlay";
import { addCurrentCoin } from "@/redux/coinReducer";
import { useRadioGroupState } from "react-stately";
import {
  useFocusRing,
  useRadio,
  useRadioGroup,
  VisuallyHidden,
} from "react-aria";
import { selectAsset } from "@/features/assets/assetsSlice";
import Button from "@/shared/components/ui/button/Button";
import { Backspace, ArrowLeft, Check } from "@phosphor-icons/react";
import { setDepositModalOpen } from "@/redux/modalReducers";
import bbva from "@/assets/icons/bankIcons/bbva.png";
import banamex from "@/assets/icons/bankIcons/banamex.png";
import santander from "@/assets/icons/bankIcons/santander.png";
import hsbc from "@/assets/icons/bankIcons/hsbc.png";
import banorte from "@/assets/icons/bankIcons/banorte.jpg";
import bankIcon from "@/assets/icons/bankIcons/bankIcon.png";
import { useWallets } from "@privy-io/react-auth";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { usePrivy, useWallets, getEmbeddedConnectedWallet } from '@privy-io/react-auth';

const WithdrawConfirmOverlay = ({
  isOpen,
  onOpenChange,
  onBack,
  payoutQuote,
  selectedToken,
  amount,
  selectedBankAccount,
  onCloseAll,
}) => {
  const dispatch = useDispatch();
  const [clabeAddress, setClabeAddress] = useState("");
  const [pixAddress, setPixAddress] = useState("");
  const [achAccountNumber, setAchAccountNumber] = useState("");
  const [achRoutingNumber, setAchRoutingNumber] = useState("");
  const [copiedField, setCopiedField] = useState(null);
  
  // Debug logging
  console.log("WithdrawConfirmOverlay - selectedBankAccount:", selectedBankAccount);
  console.log("WithdrawConfirmOverlay - selectedBankAccount type:", typeof selectedBankAccount);
  
  /* Public keys */
  const evmPubKey = useSelector((state: any) => state.userWalletData.evmPubKey);
  const solanaPubKey = useSelector(
    (state: any) => state.userWalletData.solanaPubKey
  );
  
  // Get EVM wallet from Privy
  const { wallets } = useWallets();
  const evmWallet = wallets[0]; // Get the first wallet (always EVM)
  
  const { solanaWallets } = useSolanaWallets();
  const wallet = solanaWallets[0];


  const getBankIcon = (institutionCode) => {
    console.log("getBankIcon - institutionCode:", institutionCode);
    switch (institutionCode) {
      case "40002":
        return banamex; // Banco Nacional de México (Banamex / Citibanamex)
      case "40012":
        return bbva; // BBVA México
      case "40014":
        return santander; // Santander México
      case "40021":
        return hsbc; // HSBC México
      case "40072":
        return banorte; // Banorte (Banco Mercantil del Norte)
      default:
        return bankIcon; // Default bank icon
    }
  };

  const getLastFourDigits = (clabe) => {
    if (!clabe || clabe.length < 4) return "****";
    return clabe.slice(-4);
  };

  const handleBack = () => {
    onBack();
  };

  const executePayOut = async () => {

    // blind pay payout documentation example

    /*

    import express from "express";
    import { ethers } from "ethers";

    var app = express()

    app.get("/", async function(req, res){
    // Before start
    const rpcProviderUrl = "<Replace this>" // You can get this from https://chainlist.org/?search=base&testnets=true
    const walletPrivateKey = "<Replace this>" // This wallet must have ethers (which you can get here: https://www.alchemy.com/faucets/base-sepolia) and USDB (which you can get here https://app.blindpay.com/instances/<instance_id>/utilities/mint) to execute the transaction on step 2
    const instanceId = "<Replace this>"
    const blindpayApiKey = "<Replace this>"
    const bankAccountId = "<Replace this>"

    // BlindPay Api Configs
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${blindpayApiKey}`
    };

    // 1 Step: Create a quote
    const fiftyDollars = 5000
    const quoteBody = {
        "bank_account_id": bankAccountId,
        "currency_type": "sender",
        "cover_fees": false,
        "request_amount": fiftyDollars,
        "network": "base_sepolia", // "sepolia", "base_sepolia", "arbitrum_sepolia", "polygon_amoy"
        "token": "USDB" // on development instance is always "USDB"
    }
    const createQuote = await fetch(`https://api.blindpay.com/v1/instances/${instanceId}/quotes`, { headers, method: "POST", body: JSON.stringify(quoteBody) });
    const quoteResponse = await createQuote.json();

    // 2 Step: Approve tokens
    const provider = new ethers.JsonRpcProvider(rpcProviderUrl, quoteResponse.contract.network)
    const yourWallet = new ethers.Wallet(walletPrivateKey, provider)
    const contract = new ethers.Contract(quoteResponse.contract.address, quoteResponse.contract.abi, provider)
    const contractSigner = contract.connect(yourWallet)

    const result = await contractSigner.approve(
        quoteResponse.contract.blindpayContractAddress,
        quoteResponse.contract.amount,
    );

    res.send({
        hash: result?.hash,
        quoteId: quoteResponse.id,
    });
    });

    */

  };

  const handleConfirmWithdraw = async () => {
    try {
      console.log("Starting withdrawal confirmation...");
      
      // Execute the payout with Privy session signer
      const result = await executePayOut();
      
      if (result.success) {
        console.log("Withdrawal successful:", result);
        
        // Close the modal and show success message
        if (typeof onCloseAll === "function") {
          onCloseAll();
          dispatch(setDepositModalOpen(false));
        } else {
          onBack();
        }
      } else {
        throw new Error("Withdrawal failed");
      }
    } catch (error) {
      console.error("Error in handleConfirmWithdraw:", error);
      // Handle error - you might want to show an error message to the user
      alert(`Withdrawal failed: ${error.message}`);
    }
  };

  return (
    <Overlay
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onBack();
        }
      }}
      title="Confirm Withdrawal"
    >
      <div
        css={css`
          display: grid;
          grid-template-rows: 1fr auto;
          height: 100cqh;
          padding-block-end: var(--size-200);
        `}
      >
        <section
          css={css`
            margin-block-start: var(--size-400);
            padding-inline: var(--size-250);
          `}
        >
          <div
            css={css`
              padding: var(--size-150);
              border-radius: var(--border-radius-medium);
              background-color: var(--clr-surface-raised);
            `}
          >
            <div
              css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
              `}
            >
              <h2
                className="heading-medium"
                css={css`
                  color: var(--clr-text);
                `}
              >
                Amount
              </h2>

              <div>${payoutQuote.sender_amount/100}</div>

            </div>
            

            <div
              css={css`
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-block-start: var(--size-200);
              `}
            >
              <h2
                className="heading-medium"
                css={css`
                  color: var(--clr-text);
                `}
              >
                Bank account
              </h2>

              <div
                css={css`
                  display: flex;
                  align-items: center;
                  gap: var(--size-100);
                `}
              >
                <img
                  src={getBankIcon(selectedBankAccount?.spei_institution_code)}
                  alt="Bank"
                  css={css`
                    width: 24px;
                    height: 24px;
                    border-radius: var(--border-radius-small);
                  `}
                />
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                    gap: var(--size-50);
                  `}
                >
                  <span
                    css={css`
                      font-size: var(--fs-small);
                      color: var(--clr-text);
                      font-weight: var(--fw-semibold);
                    `}
                  >
                    {selectedBankAccount?.name}
                  </span>
                  <span
                    css={css`
                      font-size: var(--fs-small);
                      color: var(--clr-text-weaker);
                    `}
                  >
                    ...{getLastFourDigits(selectedBankAccount?.spei_clabe)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          css={css`
            margin-block-start: auto;
            padding-inline: var(--size-250);
          `}
        >
          <Button expand variant="primary" onPress={handleConfirmWithdraw}>
            Withdraw
          </Button>
        </section>
      </div>
    </Overlay>
  );
};

export default WithdrawConfirmOverlay;
