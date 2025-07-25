import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Buffer } from "buffer";
import "./styles/components.css";
import {
  usePrivy,
  useLoginWithPasskey,
  useMfaEnrollment,
  useWallets,
} from "@privy-io/react-auth";
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
import KYCOverlay from "@/features/compliance/kycOverlay.tsx";
import { RootState } from "@/redux/store.tsx";
import Toaster from "@/features/notifications/toaster/Toaster.tsx";
import LoadingScreen from "@/shared/components/ui/loading/LoadingScreen.tsx";
import PrivyUseSolanaWallets from "./features/authentication/PrivyUseSolanaWallets.tsx";
import peopleOnMyfye from "@/assets/peopleOnMyfye.png";
import { useNavigate } from "react-router-dom";
import { checkIfMobileOrTablet } from "./shared/utils/mobileUtils.ts";
import MFAOnboarding from "./pages/app/login/mfaOnboarding.tsx";
import Button from "./shared/components/ui/button/Button.tsx";

function WebAppInner() {
  window.Buffer = Buffer;

  const { wallets } = useWallets();
  const dispatch = useDispatch();

  const [userDataLoaded, setUserDataLoaded] = useState(false); // To do: get user data

  const { user, ready, authenticated, login } = usePrivy();

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
          await HandleUserLogIn(user, dispatch, wallets);
          setUserDataLoaded(true);
        } catch (error) {
          console.error("Error during login:", error);
        }
      }
    };
    handleLogin();
  }, [authenticated, user]);

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
        <KYCOverlay />
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
