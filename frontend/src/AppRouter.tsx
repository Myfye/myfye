import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Buffer } from "buffer";
import "./styles/components.css";
import {
  usePrivy,
  useLoginWithPasskey,
  useMfaEnrollment,
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
import { RootState } from "@/redux/store.tsx";
import Toaster from "@/features/notifications/toaster/Toaster.tsx";
import LoadingScreen from "@/shared/components/ui/loading/LoadingScreen.tsx";
import PrivyUseSolanaWallets from "./features/authentication/PrivyUseSolanaWallets.tsx";
import peopleOnMyfye from "@/assets/peopleOnMyfye.png";
import { useNavigate } from "react-router-dom";
import { checkIfMobileOrTablet } from "./shared/utils/mobileUtils.ts";
import MFAOnboarding from "./pages/app/login/mfaOnboarding.tsx";

function WebAppInner() {
  window.Buffer = Buffer;

  const { showMfaEnrollmentModal } = useMfaEnrollment();

  const firstNameUI = useSelector(
    (state: RootState) => state.userWalletData.currentUserFirstName
  );
  const userPassKeyState = useSelector(
    (state: RootState) => state.userWalletData.passKeyState
  );
  const priceOfUSDYinUSDC = useSelector(
    (state: RootState) => state.userWalletData.priceOfUSDYinUSDC
  );
  const priceOfBTCinUSDC = useSelector(
    (state: RootState) => state.userWalletData.priceOfBTCinUSDC
  );
  const priceOfSOLinUSDC = useSelector(
    (state: RootState) => state.userWalletData.priceOfSOLinUSDC
  );
  const priceOfEURCinUSDC = useSelector(
    (state: RootState) => state.userWalletData.priceOfEURCinUSDC
  );
  const priceOfXRPinUSDC = useSelector(
    (state: RootState) => state.userWalletData.priceOfXRPinUSDC
  );
  const priceOfDOGEinUSDC = useSelector(
    (state: RootState) => state.userWalletData.priceOfDOGEinUSDC
  );
  const priceOfSUIinUSDC = useSelector(
    (state: RootState) => state.userWalletData.priceOfSUIinUSDC
  );
  const selectedLanguageCode = useSelector(
    (state: RootState) => state.userWalletData.selectedLanguageCode
  );
  const KYCVerifired = useSelector(
    (state: RootState) => state.userWalletData.currentUserKYCVerified
  );
  const users = useSelector((state: RootState) => state.userWalletData.users);
  const dispatch = useDispatch();

  const [userDataLoaded, setUserDataLoaded] = useState(false); // To do: get user data
  const ANNOUNCMENT_MESSAGE = "";

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
        try {
          await HandleUserLogIn(
            user,
            dispatch,
            priceOfUSDYinUSDC,
            priceOfBTCinUSDC,
            priceOfSOLinUSDC,
            priceOfEURCinUSDC,
            priceOfXRPinUSDC,
            priceOfSUIinUSDC,
            priceOfDOGEinUSDC
          );
          setUserDataLoaded(true);
        } catch (error) {
          console.error("Error during login:", error);
        }
      }
    };
    handleLogin();
  }, [authenticated, user]);

  if (authenticated) {
    if (userDataLoaded) {
      if (!user.wallet?.address || !user.wallet.address.startsWith("0x")) {
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
            <PrivyUseSolanaWallets />
            <Toaster />
          </div>
        );
      }
      if (mfaStatus === "createdPasskey") {
        return <MFAOnboarding />;
      }
      if (mfaStatus === "" || !mfaStatus) {
        return <MFAOnboarding />;
      }
    } else {
      return (
        <div className="app-layout">
          <LoadingScreen />
        </div>
      );
    }
  } else {
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
            <button
              data-variant="primary"
              data-size="large"
              data-color="primary-light"
              data-expand="true"
              className="button"
              type="button"
              disabled={disableLogin}
              onClick={() => login()}
            >
              Get started
            </button>
          </LoginFooter>
        </LoginPage>
      </>
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

// <div style={{ overflowX: "hidden", backgroundColor: "#ffffff" }}>
//   {userDataLoaded ? (
//     <>
//       {ANNOUNCMENT_MESSAGE && (
//         <div
//           style={{
//             textAlign: "center",
//             fontSize: "14px",
//             color: "#ffffff",
//             whiteSpace: "nowrap",
//             width: "100vw",
//             background: "#2E7D32",
//             marginBottom: "-10px",
//           }}
//         >
//           {ANNOUNCMENT_MESSAGE}
//         </div>
//       )}

//       <div
//         style={{
//           display: "flex",
//           flexDirection: "row",
//           justifyContent: "space-between",
//           marginTop: "15px",
//           marginLeft: "10px",
//           alignItems: "center",
//           paddingLeft: "10px",
//           paddingRight: "10px",
//         }}
//       >
//         <div
//           style={{
//             fontSize: "25px",
//             fontWeight: "bold",
//             width: "70vw",
//             maxWidth: "550px",
//             color: "#222222",
//           }}
//         >
//           {selectedLanguageCode === "en" && `Welcome! ${firstNameUI}`}
//           {selectedLanguageCode === "es" && `Hola, ${firstNameUI}`}
//         </div>

//         <div style={{ display: "flex", gap: "10px" }}>
//           <Language />
//           <Support />

//           <PrivyUseSolanaWallets />
//         </div>
//       </div>

//       {KYCVerifired ? (
//         <div>
//           {userPassKeyState === "done" ? (
//             <div>
//               {enrolledInMFA ? (
//                 <div>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       flexDirection: "column",
//                       color: "#222222",
//                       justifyContent: "space-around",
//                       overflowX: "hidden",
//                     }}
//                   >
//                     <WalletTile />
//                     <EarnTile />
//                     <CryptoTile />

//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-around",
//                         width: "90vw",
//                         marginTop: "35px",
//                         marginBottom: "120px",
//                       }}
//                     >
//                       <div
//                         style={{
//                           color: "#ffffff",
//                           background: "#2E7D32", // gray '#999999',
//                           borderRadius: "10px",
//                           border: "2px solid #2E7D32",
//                           fontWeight: "bold",
//                           height: "40px",
//                           width: "130px",
//                           display: "flex", // Makes this div also a flex container
//                           justifyContent: "center", // Centers the text horizontally inside the button
//                           alignItems: "center", // Centers the text vertically inside the button
//                           cursor: "pointer",
//                           fontSize: "20px",
//                         }}
//                         onClick={handleSendPageClick}
//                       >
//                         {selectedLanguageCode === "en" && `Send`}
//                         {selectedLanguageCode === "es" && `Enviar`}
//                       </div>
//                       <div
//                         style={{
//                           color: "#ffffff",
//                           background: "#2E7D32", // gray '#999999',
//                           borderRadius: "10px",
//                           border: "2px solid #2E7D32",
//                           fontWeight: "bold",
//                           height: "40px",
//                           width: "130px",
//                           display: "flex", // Makes this div also a flex container
//                           justifyContent: "center", // Centers the text horizontally inside the button
//                           alignItems: "center", // Centers the text vertically inside the button
//                           cursor: "pointer",
//                           fontSize: "20px",
//                         }}
//                         onClick={handleRequestPageClick}
//                       >
//                         {selectedLanguageCode === "en" && `Request`}
//                         {selectedLanguageCode === "es" && `Pedido`}
//                       </div>

//                     <BottomNav />
//               ) : (
//
//                       <button
//                         onClick={showMfaEnrollmentModal}
//                         style={{
//                           color: "#ffffff",
//                           fontSize: "25px",
//                           fontWeight: "bold",
//                           background: "#447E26",
//                           borderRadius: "10px",
//                           border: "3px solid #ffffff",
//                           padding: "15px",
//                           cursor: "pointer",
//                         }}
//                       >
//                         Enroll in MFA
//                       </button>
//
//               )}
//             </div>
//           ) : (
//
//                   <button
//                     onClick={linkPasskey}
//                     style={{
//                       color: "#ffffff",
//                       fontSize: "25px",
//                       fontWeight: "bold",
//                       background: "#447E26",
//                       borderRadius: "10px",
//                       border: "3px solid #ffffff",
//                       padding: "15px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Create A Passkey
//                   </button>
//
//       ) : (
//         <div>{/*<PersonaKYC/>*/}</div>
//       )}
//     </>
