import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Buffer } from "buffer";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "../../styles/components.css";
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

import appLogo from "@/assets/myfyeleaf.png";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import QRCodeModal from "../../features/qr-scanner/QRCodeModal.tsx";
import LoginHeader from "../../components/app/login/_components/LoginHeader.tsx";
import LoginMain from "../../components/app/login/_components/LoginMain.tsx";
import LoginFooter from "../../components/app/login/_components/LoginFooter.tsx";
import LoginPage from "../../components/app/login/_components/LoginPage.tsx";
import Router from "../../components/app/Router.tsx";
import SendModal from "@/components/app/modals/send-modal/SendModal.tsx";
import ReceiveModal from "@/features/receive/ReceiveModal.tsx";
import DepositModal from "@/components/app/modals/deposit-modal/DepositModal.tsx";
import WithdrawModal from "@/components/app/modals/withdraw-modal/WithdrawModal.tsx";
import {
  setDepositModalOpen,
  setQRCodeModalOpen,
  setReceiveModalOpen,
  setSendModalOpen,
  setWithdrawModalOpen,
} from "@/redux/modalReducers.tsx";
import WithdrawCryptoOverlay from "@/components/app/overlays/withdraw-overlays/withdraw-crypto-overlay/WithdrawCryptoOverlay.tsx";
import {
  setCashOverlayOpen,
  setCoinSummaryOverlayOpen,
  setCryptoSummaryOverlayOpen,
  setEarnSummaryOverlayOpen,
  setSelectContactOverlayOpen,
  setWithdrawCryptoOverlayOpen,
} from "@/redux/overlayReducers.tsx";
import SelectContactOverlay from "@/components/app/overlays/withdraw-overlays/withdraw-crypto-overlay/select-contact-overlay/SelectContactOverlay.tsx";
import EarnOverlay from "@/features/earn/EarnOverlay.tsx";
import CryptoOverlay from "@/features/crypto/CryptoOverlay.tsx";
import CashOverlay from "@/features/cash/CashOverlay.tsx";
import CoinSummaryOverlay from "@/components/app/overlays/coin-overlay/CoinSummaryOverlay.tsx";
import SwapModal from "@/features/swap/SwapModal.tsx";
import { RootState } from "@/redux/store.tsx";

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
  const priceOfSOLinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfSOLinUSDC
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
            priceOfSOLinUSDC,
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

  const isSendModalOpen = useSelector((state: any) => state.sendModal.isOpen);
  const isReceiveModalOpen = useSelector(
    (state: any) => state.receiveModal.isOpen
  );
  const isDepositModalOpen = useSelector(
    (state: any) => state.depositModal.isOpen
  );
  const isWithdrawModalOpen = useSelector(
    (state: any) => state.withdrawModal.isOpen
  );
  const isQRCodeModalOpen = useSelector(
    (state: any) => state.QRCodeModal.isOpen
  );
  const isAddContactModalOpen = useSelector(
    (state: any) => state.addContactModal.isOpen
  );

  // Overlays
  const isWithdrawFiatOverlayOpen = useSelector(
    (state: any) => state.withdrawFiatOverlay.isOpen
  );
  const isWithdrawCryptoOverlayOpen = useSelector(
    (state: any) => state.withdrawCryptoOverlay.isOpen
  );
  const isCashBalanceOverlayOpen = useSelector(
    (state: any) => state.cashBalanceOverlay.isOpen
  );
  const isCryptoBalanceOverlayOpen = useSelector(
    (state: any) => state.cryptoBalanceOverlay.isOpen
  );
  const isSendOverlayOpen = useSelector(
    (state: any) => state.sendOverlay.isOpen
  );
  const isRequestOverlayOpen = useSelector(
    (state: any) => state.requestOverlay.isOpen
  );
  const isDepositFiatOverlayOpen = useSelector(
    (state: any) => state.depositFiatOverlay.isOpen
  );
  const isUserInfoOverlayOpen = useSelector(
    (state: any) => state.userInfoOverlay.isOpen
  );
  const isSettingsOverlayOpen = useSelector(
    (state: any) => state.settingsOverlay.isOpen
  );
  const isSelectContactOverlayOpen = useSelector(
    (state: any) => state.selectContactOverlay.isOpen
  );
  const isCryptoSummaryOverlayOpen = useSelector(
    (state: any) => state.cryptoSummaryOverlay.isOpen
  );
  const isEarnSummaryOverlayOpen = useSelector(
    (state: any) => state.earnSummaryOverlay.isOpen
  );
  const isCoinSummaryOverlayOpen = useSelector(
    (state: any) => state.coinSummaryOverlay.isOpen
  );
  const isCashOverlayOpen = useSelector(
    (state: RootState) => state.cashOverlay.isOpen
  );

  if (authenticated) {
    return (
      <div className="app-layout">
        {userDataLoaded ? (
          <>
            <Router />
            {/* Modals */}
            <SendModal
              isOpen={isSendModalOpen}
              onOpenChange={(e) => dispatch(setSendModalOpen(e))}
            />
            <ReceiveModal
              isOpen={isReceiveModalOpen}
              onOpenChange={(e) => dispatch(setReceiveModalOpen(e))}
            />
            <DepositModal
              isOpen={isDepositModalOpen}
              onOpenChange={(e) => dispatch(setDepositModalOpen(e))}
            />
            <WithdrawModal
              isOpen={isWithdrawModalOpen}
              onOpenChange={(e) => dispatch(setWithdrawModalOpen(e))}
            />
            <QRCodeModal
              isOpen={isQRCodeModalOpen}
              onOpenChange={(e) => dispatch(setQRCodeModalOpen(e))}
            />
            <SwapModal />
            {/* Overlays */}
            <WithdrawCryptoOverlay
              isOpen={isWithdrawCryptoOverlayOpen}
              onOpenChange={(e) => dispatch(setWithdrawCryptoOverlayOpen(e))}
            />
            <SelectContactOverlay
              isOpen={isSelectContactOverlayOpen}
              onOpenChange={(e) => dispatch(setSelectContactOverlayOpen(e))}
            />
            <EarnOverlay
              isOpen={isEarnSummaryOverlayOpen}
              onOpenChange={(e) => dispatch(setEarnSummaryOverlayOpen(e))}
            />
            <CryptoOverlay
              isOpen={isCryptoSummaryOverlayOpen}
              onOpenChange={(e) => dispatch(setCryptoSummaryOverlayOpen(e))}
            />
            <CashOverlay
              isOpen={isCashOverlayOpen}
              onOpenChange={(e) => dispatch(setCashOverlayOpen(e))}
            />
            <CoinSummaryOverlay
              isOpen={isCoinSummaryOverlayOpen}
              onOpenChange={(e) => dispatch(setCoinSummaryOverlayOpen(e))}
            />
          </>
        ) : (
          <div
            className="loading-screen"
            css={css`
              display: grid;
              place-items: center;
              height: 100svh;
              background-color: var(--clr-accent);
            `}
          >
            <DotLottieReact
              src="https://lottie.host/744ea5d2-8d13-4f4c-b0a0-11e94caef4c2/2xZe6NoQB2.lottie"
              loop
              autoplay
              css={css`
                width: 4rem;
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
                    width: 50%;
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
            <button
              data-variant="primary"
              data-size="large"
              data-color="accent"
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
