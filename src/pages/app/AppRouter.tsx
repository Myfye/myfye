import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import ProfilePage from "../mobileApp/ProfilePage.tsx";
import EarnPage from "../mobileApp/EarnPage.tsx";
import CryptoPage from "../mobileApp/CryptoPage.tsx";
import { useSelector } from "react-redux";
import { Buffer } from "buffer";
import LoadingAnimation from "../../components/LoadingAnimation.tsx";
import myfyelogo from "../../assets/MyFyeLogo2.png";
import Language from "../mobileApp/LanguagePage.tsx";
import Support from "../mobileApp/Support.tsx";
import WalletTile from "../../components/mobileApp/WalletTile.tsx";
import EarnTile from "../../components/mobileApp/EarnTile.tsx";
import CryptoTile from "../../components/mobileApp/CryptoTile.tsx";
import BottomNav from "../../components/mobileApp/BottomNavigation.tsx";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "../../styles/components.css";
import {
  setShowRequestPage,
  setShowSendPage,
} from "../../redux/userWalletData.tsx";
import {
  usePrivy,
  useLoginWithPasskey,
  useMfaEnrollment,
} from "@privy-io/react-auth";
import {
  HandleUserLogIn,
  UpdatePasskey,
  getUsers,
} from "../../functions/HandleUserLogIn.tsx";
import WalletPage from "../mobileApp/WalletPage.tsx";
import MainDepositPage from "../../components/mobileApp/wallet/MainDepositPage.tsx";
import SwapDeposit from "../mobileApp/SwapPages/SwapDepositPage.tsx";
import SwapWithdraw from "../mobileApp/SwapPages/SwapWithdrawPage.tsx";
import PrivyUseSolanaWallets from "../../components/PrivyUseSolanaWallets.tsx";
import SendPage from "../mobileApp/SendPage.tsx";
import RequestPage from "../mobileApp/RequestPage.tsx";
import Button from "@/components/ui/button/Button.tsx";

import appLogo from "@/assets/myfyeleaf.png";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import AppNavDrawer from "./_components/layout/footer/AppNavDrawer.tsx";
import Footer from "./_components/layout/footer/Footer.tsx";
import Header from "./_components/layout/header/Header.tsx";
import QRCodeDialog from "./_components/qr-code/QRCodeDialog.tsx";
import NavMenu from "./_components/layout/header/nav-menu/NavMenu.tsx";
import Main from "./_components/layout/main/Main.tsx";
import HomePage from "./home/Home.tsx";
import LoginHeader from "./login/_components/LoginHeader.tsx";
import LoginMain from "./login/_components/LoginMain.tsx";
import LoginFooter from "./login/_components/LoginFooter.tsx";
import LoginPage from "./login/_components/LoginPage.tsx";
import Home from "./home/Home.tsx";

function WebAppInner() {
  window.Buffer = Buffer;

  const { showMfaEnrollmentModal } = useMfaEnrollment();

  const firstNameUI = useSelector(
    (state: any) => state.userWalletData.currentUserFirstName
  );
  const userPassKeyState = useSelector(
    (state: any) => state.userWalletData.passKeyState
  );
  const priceOfUSDYinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfUSDYinUSDC
  );
  const priceOfBTCinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfBTCinUSDC
  );
  const priceOfEURCinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfEURCinUSDC
  );
  const selectedLanguageCode = useSelector(
    (state: any) => state.userWalletData.selectedLanguageCode
  );
  const KYCVerifired = useSelector(
    (state: any) => state.userWalletData.currentUserKYCVerified
  );
  const users = useSelector((state: any) => state.userWalletData.users);
  const dispatch = useDispatch();

  const [userDataLoaded, setUserDataLoaded] = useState(false); // To do: get user data
  const ANNOUNCMENT_MESSAGE = "";

  const { user, ready, authenticated, login, linkPasskey } = usePrivy();
  const { state, loginWithPasskey } = useLoginWithPasskey();

  const [enrolledInMFA, setEnrolledInMFA] = useState<boolean>(false);

  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  useEffect(() => {
    const handleLogin = async () => {
      if (authenticated) {
        try {
          if (!user?.wallet) {
          }
          await HandleUserLogIn(
            user,
            dispatch,
            priceOfUSDYinUSDC,
            priceOfBTCinUSDC,
            priceOfEURCinUSDC
          );
          setUserDataLoaded(true);
        } catch (error) {
          console.error("Error during login:", error);
        }
      }
    };

    if (user?.mfaMethods[0] == "passkey") {
      setEnrolledInMFA(true);
    }

    handleLogin();
  }, [authenticated, user]);
  // To do:
  // Get all users
  // Get contacts
  // Get uncreaters user balance

  useEffect(() => {
    getUsers(dispatch);
  }, []);

  useEffect(() => {
    console.log(state);
    if (state.status == "done") {
      UpdatePasskey(dispatch);
    }
  }, [state]);

  const handleSendPageClick = () => {
    dispatch(setShowSendPage(true));
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const handleRequestPageClick = () => {
    dispatch(setShowRequestPage(true));
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  if (authenticated) {
    return (
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

      <div className="app-layout">
        {userDataLoaded ? (
          <>
            <Header>
              <NavMenu></NavMenu>
              <QRCodeDialog />
            </Header>
            <Main>
              <Home></Home>
            </Main>
            <Footer>
              <AppNavDrawer></AppNavDrawer>
            </Footer>
          </>
        ) : (
          <div
            className="loading-screen"
            css={css`
              display: grid;
              place-items: center;
              height: 100dvh;
              background-color: var(--clr-accent);
            `}
          >
            <DotLottieReact
              src="https://lottie.host/744ea5d2-8d13-4f4c-b0a0-11e94caef4c2/2xZe6NoQB2.lottie"
              loop
              autoplay
              className={css`
                width: 6rem;
              `}
            />
          </div>
        )}
      </div>
    );
  } else {
    return (
      <>
        <LoginPage>
          <LoginHeader>
            <img
              className="aspect-ratio-square"
              css={css`
                width: var(--size-800);
              `}
              src={appLogo}
              alt="MyFye"
            />
          </LoginHeader>
          <LoginMain>
            <section
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
                    width: 80%;
                    border: 1px solid var(--clr-neutral-200);
                    border-radius: var(--border-radius-medium);
                    aspect-ratio: 1;
                    background-color: var(--clr-surface);
                    margin-inline: auto;
                  `}
                >
                  Image
                </div>
              </div>
            </section>
            <section
              className="heading-container"
              css={css`
                margin-block-start: var(--size-400);
                text-align: center;
              `}
            >
              <h1 className="heading-x-large" css={css``}>
                Welcome to MyFye
              </h1>
              <p
                className="subtitle"
                css={css`
                  margin-block-start: var(--size-200);
                  color: var(--clr-text-neutral);
                `}
              >
                Hold stocks, crypto, USD/EUR, and more
              </p>
            </section>
          </LoginMain>
          <LoginFooter>
            <Button
              size="large"
              expand={true}
              isDisabled={disableLogin}
              onPress={() => login()}
            >
              Get started
            </Button>
            <button onClick={login}>login test</button>
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
