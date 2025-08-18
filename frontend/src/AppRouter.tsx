import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Buffer } from "buffer";
import "./styles/components.css";
import {
  usePrivy,
  useLoginWithPasskey,
  useMfaEnrollment,
  getEmbeddedConnectedWallet,
  useWallets
} from "@privy-io/react-auth";
import { createWalletClient, custom } from 'viem';
import { HandleUserLogIn } from "./features/authentication/LoginService.tsx";
import logo from "@/assets/logo/myfye_logo_white.svg";
import loginScreen from "@/assets/login/login_screen.webp";

import { css } from "@emotion/react";
import QRCodeModal from "./features/qr-code/_components/QRCodeModal.tsx";
import LoginHeader from "./pages/app/login/LoginHeader.tsx";
import LoginMain from "./pages/app/login/LoginMain.tsx";
import LoginFooter from "./pages/app/login/LoginFooter.tsx";
import LoginPage from "./pages/app/login/LoginPage.tsx";
import Router from "./pages/app/Router.tsx";
import SendModal from "@/features/send/SendModal.tsx";
import ReceiveModal from "@/features/receive/ReceiveModal.tsx";
import DepositModal from "@/features/onOffRamp/deposit/DepositModal.tsx";
import WithdrawModal from "@/features/onOffRamp/withdraw/WithdrawModal.tsx";
import SwapModal from "@/features/swap/SwapModal.tsx";
import KYCOverlay from "@/features/compliance/KYCOverlay.tsx";
import Toaster from "@/features/notifications/toaster/Toaster.tsx";
import LoadingScreen from "@/shared/components/ui/loading/LoadingScreen.tsx";
import PrivyUseSolanaWallets from "./features/authentication/PrivyUseSolanaWallets.tsx";
import MFAOnboarding from "./pages/app/login/mfaOnboarding.tsx";
import { setEmbeddedWallet, setWalletClient } from "./redux/userWalletData.tsx"; 
import { useCrossChainTransfer } from "./functions/bridge/use-cross-chain-transfer.ts";
import { getUSDCBalanceOnBase } from "./functions/checkForEVMDeposit.ts";
import {
  SupportedChainId,
  SUPPORTED_CHAINS,
  CHAIN_TO_CHAIN_NAME,
} from "./functions/bridge/chains.ts";
import { evmAddressToBytes32 } from "./functions/bridge/solana-utils.ts";
import { base } from "viem/chains";
import Button from "@/shared/components/ui/button/Button.tsx";

function WebAppInner() {
  window.Buffer = Buffer;

  const { wallets } = useWallets();
  const firstNameUI = useSelector(
    (state: RootState) => state.userWalletData.currentUserFirstName
  );
  const userPassKeyState = useSelector(
    (state: RootState) => state.userWalletData.passKeyState
  );
  const selectedLanguageCode = useSelector(
    (state: RootState) => state.userWalletData.selectedLanguageCode
  );
  const KYCVerifired = useSelector(
    (state: RootState) => state.userWalletData.currentUserKYCVerified
  );
  const evmPubKey = useSelector(
    (state: RootState) => state.userWalletData.evmPubKey
  );
  const solanaPubKey = useSelector(
    (state: RootState) => state.userWalletData.solanaPubKey
  );
  const embeddedWallet = useSelector(
    (state: RootState) => state.userWalletData.embeddedWallet
  );

  const walletClient = useSelector(
    (state: RootState) => state.userWalletData.walletClient
  );
  const users = useSelector((state: RootState) => state.userWalletData.users);
  const dispatch = useDispatch();

  // Move the hook call here at the component level
  const { executeTransfer } = useCrossChainTransfer(embeddedWallet, walletClient);

  const [userDataLoaded, setUserDataLoaded] = useState(false); // To do: get user data

  const { user, ready, authenticated, login, linkPasskey } = usePrivy();
  const { state, loginWithPasskey } = useLoginWithPasskey();

  const mfaStatus = useSelector(
    (state: RootState) => state.userWalletData.mfaStatus
  );

  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  useEffect(() => {
    console.log("MFA status", mfaStatus);
  }, [mfaStatus]);

  useEffect(() => {
    const handleLogin = async () => {
      if (authenticated && user) {

        console.log("BRIDGING in AppRouter wallets:", wallets);

        try {
          console.log("calling HandleUserLogin"); 
          // TODO: calling this twice, we should call it once
          await HandleUserLogIn(
            user,
            dispatch,
            wallets
          );

          // Set embedded wallet
          const wallet = getEmbeddedConnectedWallet(wallets);
          if (wallet) {
            const provider = await wallet.getEthereumProvider();
            const client = createWalletClient({
              account: wallet.address,
              chain: base, // Use the Base chain object
              transport: custom(provider),
            });
            
            dispatch(setWalletClient(client));
            dispatch(setEmbeddedWallet(wallet));
          }
      


          await HandleUserLogIn(user, dispatch, wallets);
          setUserDataLoaded(true);
        } catch (error) {
          console.error("Error during login:", error);
        }
      }
    };
    handleLogin();
  }, [authenticated, user]);

  useEffect(() => {
    const listenForUSDCBase = async () => {
      const usdcBaseBalance = await getUSDCBalanceOnBase(evmPubKey, solanaPubKey);

      console.log('BRIDGING uusdcBaseBalance', usdcBaseBalance)
      console.log('BRIDGING executeTransfer', executeTransfer)

      
      if (solanaPubKey && walletClient && embeddedWallet) {
        
        await executeTransfer(
          SupportedChainId.BASE,
          SupportedChainId.SOLANA_MAINNET,
          "0.05",
          "fast",
          solanaPubKey
        );
      } else {
        console.log('BRIDGING no solana pub key found')
      }
      }
      listenForUSDCBase();
  }, [solanaPubKey, evmPubKey, walletClient, embeddedWallet]);

  if (!authenticated) {
    return (
      <>
        <LoginPage>
          <LoginHeader>
            <img
              css={css`
                width: 7rem;
              `}
              src={logo}
              alt="Myfye"
            />
          </LoginHeader>
          <LoginMain>
            <div
              className="img-wrapper"
              css={css`
                width: 60%;
                height: 40vh;
                margin-inline: auto;
                position: relative;
                isolation: isolate;
                &::before {
                  content: "";
                  display: block;
                  width: 100%;
                  height: 30%;
                  inset: 0;
                  margin: auto;
                  top: auto;
                  position: absolute;
                  z-index: 1;
                  background-image: linear-gradient(
                    to bottom,
                    transparent 0%,
                    var(--clr-teal-900) 100%
                  );
                }
              `}
            >
              <img
                src={loginScreen}
                alt=""
                css={css`
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                  object-position: bottom;
                `}
              />
            </div>
            <section
              css={css`
                margin-block-start: var(--size-600);
                text-align: center;
              `}
            >
              <h1
                className="heading-xx-large"
                css={css`
                  font-weight: 700;
                  color: var(--clr-white);
                `}
              >
                Earn, invest, and save. <br /> No bank account needed.
              </h1>
              <p
                className="caption"
                css={css`
                  margin-block-start: var(--size-200);
                  color: var(--clr-neutral-300);
                `}
              >
                Access global markets for stocks, treasuries, crypto, and more
                with no third parties
              </p>
            </section>
          </LoginMain>
          <LoginFooter>
            <Button
              expand
              size="large"
              isDisabled={disableLogin}
              onPress={() => login()}
              color="primary-light"
            >
              Get started
            </Button>
          </LoginFooter>
        </LoginPage>
      </>
    );
  }

  if (!userDataLoaded) {
    return (
      <div className="landing-layout">
        <LoadingScreen />
      </div>
    );
  }

  if (
    !user?.wallet?.address ||
    !user?.wallet.address.startsWith("0x") ||
    mfaStatus === "createdPasskey" ||
    mfaStatus === "" ||
    !mfaStatus
  ) {
    // normal user flow was interrupted, show onboarding
    return <MFAOnboarding />;
  }

  if (mfaStatus === "enrolled") {
    return (
      <div className="app-layout">
        <Router />
        {/* Modals */}
        <SendModal />
        <ReceiveModal />
        <DepositModal />
        <WithdrawModal />
        <QRCodeModal />
        <SwapModal />
        <KYCOverlay zIndex={99999} />
        <PrivyUseSolanaWallets />
        <Toaster />
      </div>
    );
  }
}

const AppRouter = () => {
  return (
    <div className="site-layout">
      <WebAppInner />
    </div>
  );
};

export default AppRouter;
