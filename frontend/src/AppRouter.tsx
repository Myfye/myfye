import { useState, useEffect } from "react";
import { Buffer } from "buffer";
import "./styles/components.css";
import {
  usePrivy,
  useLoginWithPasskey,
  getEmbeddedConnectedWallet,
  useWallets,
} from "@privy-io/react-auth";
import { Address, createWalletClient, custom } from "viem";
import { HandleUserLogIn } from "./features/authentication/misc/LoginService.tsx";
import logo from "@/assets/logo/myfye_logo_white.svg";
import loginScreen from "@/assets/login/login_screen.webp";

import { css } from "@emotion/react";
import QRCodeModal from "./features/qr-code/components/QRCodeModal.tsx";
import LoginHeader from "./pages/app/login/_components/LoginHeader.tsx";
import LoginMain from "./pages/app/login/_components/LoginMain.tsx";
import LoginFooter from "./pages/app/login/_components/LoginFooter.tsx";
import LoginPage from "./pages/app/login/LoginPage.tsx";
import Router from "./pages/app/Router.tsx";
import SendModal from "@/features/send/components/SendModal.tsx";
import ReceiveModal from "@/features/receive/components/ReceiveModal.tsx";
import DepositModal from "@/features/onOffRamp/deposit/DepositModal.tsx";
import WithdrawModal from "@/features/onOffRamp/withdraw/WithdrawModal.tsx";
import SwapModal from "@/features/swap/components/SwapModal.tsx";
import KYCOverlay from "@/features/compliance/components/KYCOverlay.tsx";
import Toaster from "@/features/notifications/components/toaster/Toaster.tsx";
import AltUSDModal, {
  useAltUSDModal,
} from "@/features/onOffRamp/deposit/onChain/altUSD/detectAltUSD.tsx";
import LoadingScreen from "@/shared/components/ui/loading/LoadingScreen.tsx";
import PrivyUseSolanaWallets from "./features/authentication/misc/PrivyUseSolanaWallets.tsx";
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
import MFAOnboardingPage from "./pages/app/mfa/MFAOnboardingPage.tsx";
import { useAppDispatch, useAppSelector } from "./redux/hooks.tsx";
import ActivityOverlay from "./features/activity/components/ActivityOverlay.tsx";

function WebAppInner() {
  window.Buffer = Buffer;

  const { wallets } = useWallets();
  const firstNameUI = useAppSelector(
    (state) => state.userWalletData.currentUserFirstName
  );
  const userPassKeyState = useAppSelector(
    (state) => state.userWalletData.passKeyState
  );
  const selectedLanguageCode = useAppSelector(
    (state) => state.userWalletData.selectedLanguageCode
  );
  const KYCVerifired = useAppSelector(
    (state) => state.userWalletData.currentUserKYCVerified
  );
  const evmPubKey = useAppSelector((state) => state.userWalletData.evmPubKey);
  const solanaPubKey = useAppSelector(
    (state) => state.userWalletData.solanaPubKey
  );
  const embeddedWallet = useAppSelector(
    (state) => state.userWalletData.embeddedWallet
  );

  const walletClient = useAppSelector(
    (state) => state.userWalletData.walletClient
  );
  const dispatch = useAppDispatch();

  // Move the hook call here at the component level
  const { executeTransfer } = useCrossChainTransfer(
    embeddedWallet,
    walletClient
  );

  const [userDataLoaded, setUserDataLoaded] = useState(false); // To do: get user data

  const { user, ready, authenticated, login } = usePrivy();
  const { state, loginWithPasskey } = useLoginWithPasskey();

  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  useEffect(() => {
    const handleLogin = async () => {
      if (authenticated && user) {
        console.log("BRIDGING in AppRouter wallets:", wallets);

        try {
          console.log("calling HandleUserLogin");
          // TODO: calling this twice, we should call it once
          await HandleUserLogIn(user, dispatch, wallets);

          // Set embedded wallet
          const wallet = getEmbeddedConnectedWallet(wallets);
          if (wallet) {
            const provider = await wallet.getEthereumProvider();
            const client = createWalletClient({
              account: wallet.address as Address,
              chain: base, // Use the Base chain object
              transport: custom(provider),
            });

            dispatch(setWalletClient(client));
            dispatch(setEmbeddedWallet(wallet));
          }
          setUserDataLoaded(true);
        } catch (error) {
          console.error("Error during login:", error);
        }
      }
    };
    handleLogin();
  }, [authenticated, user]);
  /*
  useEffect(() => {
    const listenForUSDCBase = async () => {
      const usdcBaseBalance = await getUSDCBalanceOnBase(
        evmPubKey,
        solanaPubKey
      );

      console.log("BRIDGING uusdcBaseBalance", usdcBaseBalance);
      console.log("BRIDGING executeTransfer", executeTransfer);

      if (solanaPubKey && walletClient && embeddedWallet) {
        await executeTransfer(
          SupportedChainId.BASE,
          SupportedChainId.SOLANA_MAINNET,
          "0.05",
          "fast",
          solanaPubKey
        );
      } else {
        console.log("BRIDGING no solana pub key found");
      }
    };
    listenForUSDCBase();
  }, [solanaPubKey, evmPubKey, walletClient, embeddedWallet]);
*/

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
                    #02302c 100%
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
                css={css`
                  font-size: 1.5rem;
                  font-weight: 700;
                  line-height: var(--line-height-heading);
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
                  max-width: 35ch;
                  margin-inline: auto;
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

  // Check if wallet exists - no MFA required
  // Legacy users with passkey will still work, new TEE users use email OTP for signing
  if (!user?.wallet?.address) {
    return <MFAOnboardingPage />;
  }

  // Default screen

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
      <AltUSDModal />
      <ActivityOverlay />
      <KYCOverlay zIndex={99999} />
      <PrivyUseSolanaWallets />
      <Toaster />
    </div>
  );
}

const AppRouter = () => {
  return (
    <div className="site-layout">
      <WebAppInner />
    </div>
  );
};

export default AppRouter;