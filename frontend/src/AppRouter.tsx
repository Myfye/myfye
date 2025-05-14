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
import {
  HandleUserLogIn,
  getUsers,
} from "./features/authentication/LoginService.tsx";
import logo from "@/assets/logo/myfye_logo.svg";

import { css } from "@emotion/react";
import QRCodeModal from "./features/qr-code/_components/QRCodeModal.tsx";
import LoginHeader from "./pages/app/login/LoginHeader.tsx";
import LoginMain from "./pages/app/login/LoginMain.tsx";
import LoginFooter from "./pages/app/login/LoginFooter.tsx";
import LoginPage from "./pages/app/login/LoginPage.tsx";
import Router from "./pages/app/Router.tsx";
import SendModal from "@/features/send/SendModal.tsx";
import ReceiveModal from "@/features/receive/ReceiveModal.tsx";
import DepositModal from "@/features/on-offramp/deposit/DepositModal.tsx";
import WithdrawModal from "@/features/on-offramp/withdraw/WithdrawModal.tsx";
import SwapModal from "@/features/swap/SwapModal.tsx";
import { RootState } from "@/redux/store.tsx";
import Toaster from "@/features/notifications/toaster/Toaster.tsx";
import LoadingScreen from "@/shared/components/ui/loading/LoadingScreen.tsx";
import PrivyUseSolanaWallets from "./features/authentication/PrivyUseSolanaWallets.tsx";
import peopleOnMyfye from "@/assets/peopleOnMyfye.png";
import { useNavigate } from "react-router-dom";
import { checkIfMobileOrTablet } from "./shared/utils/mobileUtils.ts";
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
            priceOfEURCinUSDC
          );
          setUserDataLoaded(true);
        } catch (error) {
          console.error("Error during login:", error);
        }
      }
    };
    handleLogin();
  }, [authenticated, user]);

  useEffect(() => {
    getUsers(dispatch);
  }, []);

  if (authenticated) {
    if (userDataLoaded) {
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
        return (
          <div className="app-layout">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ marginTop: "80px" }}>
                <button
                  onClick={showMfaEnrollmentModal}
                  style={{
                    color: "#ffffff",
                    fontSize: "25px",
                    fontWeight: "bold",
                    background: "#447E26",
                    borderRadius: "10px",
                    border: "3px solid #ffffff",
                    padding: "15px",
                    cursor: "pointer",
                  }}
                >
                  Enroll in MFA
                </button>
              </div>
            </div>
          </div>
        );
      }
      if (mfaStatus === "" || !mfaStatus) {
        return (
          <div className="app-layout">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ marginTop: "80px" }}>
                <button
                  onClick={linkPasskey}
                  style={{
                    color: "#ffffff",
                    fontSize: "25px",
                    fontWeight: "bold",
                    background: "#447E26",
                    borderRadius: "10px",
                    border: "3px solid #ffffff",
                    padding: "15px",
                    cursor: "pointer",
                  }}
                >
                  Create A Passkey
                </button>
              </div>
            </div>
          </div>
        );
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
                width: var(--size-1600);
              `}
              src={logo}
              alt="Myfye"
            />
          </LoginHeader>
          <LoginMain>
            <div
              className="slider-container"
              css={css`
                margin-block-start: var(--size-200);
                width: 100%;
              `}
            >
              <div className="slider">
                <div
                  css={css`
                    display: grid;
                    place-items: center;
                    width: 50%;
                    border-radius: var(--border-radius-medium);
                    aspect-ratio: 1;
                    background-color: var(--clr-surface);
                    margin-inline: auto;
                  `}
                >
                  <img
                    src={peopleOnMyfye}
                    alt="People on Myfye"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "var(--border-radius-medium)",
                      maxWidth: "50vw",
                    }}
                  />
                </div>
              </div>
              <section
                css={css`
                  margin-block-start: var(--size-400);
                  text-align: center;
                `}
              >
                <h1 className="heading-x-large" css={css``}>
                  Welcome to Myfye
                </h1>
                <p
                  className="caption"
                  css={css`
                    margin-block-start: var(--size-100);
                    color: var(--clr-text-neutral);
                  `}
                >
                  Invest in stocks, crypto, treasuries, and more, fully owned by
                  you, on your phone.
                </p>
              </section>
            </div>
          </LoginMain>
          <LoginFooter>
            <button
              data-variant="primary"
              data-size="large"
              data-color="primary"
              data-expand="true"
              className="button"
              css={css`
                width: 100%;
              `}
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
