import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  usePrivy,
  useLoginWithPasskey,
  useMfaEnrollment,
  useSetWalletRecovery,
  useConnectOrCreateWallet
} from "@privy-io/react-auth";
import appLogo from "@/assets/myfyeLogo3.png";
import { css } from "@emotion/react";
import QRCodeModal from "./features/qr-code/_components/QRCodeModal.tsx";
import LoginHeader from "./pages/app/login/LoginHeader.tsx";
import LoginMain from "./pages/app/login/LoginMain.tsx";
import LoginFooter from "./pages/app/login/LoginFooter.tsx";
import LoginPage from "./pages/app/login/LoginPage.tsx";
import Router from "./shared/components/Router.tsx";
import SendModal from "@/features/send/SendModal.tsx";
import ReceiveModal from "@/features/receive/ReceiveModal.tsx";
import DepositModal from "@/features/onOffRamp/deposit/DepositModal.tsx";
import WithdrawModal from "@/features/onOffRamp/withdraw/WithdrawModal.tsx";
import SwapModal from "@/features/swap/SwapModal.tsx";
import { RootState } from "@/redux/store.tsx";
import Toaster from "@/features/notifications/toaster/Toaster.tsx";
import LoadingScreen from "@/shared/components/ui/loading/LoadingScreen.tsx";
import PrivyUseSolanaWallets from "@/shared/components/PrivyUseSolanaWallets.tsx";
import peopleOnMyfye from "@/assets/peopleOnMyfye.png";
import { useNavigate } from "react-router-dom";
import { checkIfMobileOrTablet } from "./shared/utils/mobileUtils.ts";
import {useCreateWallet} from '@privy-io/react-auth';

function mfaOnboarding() {

  const { showMfaEnrollmentModal } = useMfaEnrollment();
  const { setWalletRecovery } = useSetWalletRecovery();
  const {createWallet} = useCreateWallet();

  const firstNameUI = useSelector(
    (state: RootState) => state.userWalletData.currentUserFirstName
  );
  const selectedLanguageCode = useSelector(
    (state: RootState) => state.userWalletData.selectedLanguageCode
  );
  const KYCVerifired = useSelector(
    (state: RootState) => state.userWalletData.currentUserKYCVerified
  );
  const dispatch = useDispatch();

  const [userDataLoaded, setUserDataLoaded] = useState(false); // To do: get user data
  const ANNOUNCMENT_MESSAGE = "";

  const { user, ready, authenticated, login, linkPasskey } = usePrivy();
  const { state, loginWithPasskey } = useLoginWithPasskey();

  const [evmWalletConfirmed, setEvmWalletConfirmed] = useState(false);

  const mfaStatus = useSelector(
    (state: RootState) => state.userWalletData.mfaStatus
  );

  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  useEffect(() => {
    console.log("MFA status", mfaStatus);
  }, [mfaStatus]);

  useEffect(() => {
    console.log("(user.wallet)", user.wallet);
    if (user.wallet) {
        if (user.wallet.address) {
        if (user.wallet.address.startsWith('0x')) {
            console.log('EVM wallet confirmation');
            setEvmWalletConfirmed(true);
        } else {
            setEvmWalletConfirmed(false);
        }
        } else {
            setEvmWalletConfirmed(false);
        }
    }
  }, [user]);

  useEffect(() => {
    console.log("evmWalletConfirmed", evmWalletConfirmed);
    }, [evmWalletConfirmed]);

  const handlePasswordBackup = () => {

    createWallet();
    setWalletRecovery();
  };

  if (!evmWalletConfirmed) {
    return (
      <div>
        <div style={{display: "flex", justifyContent: "center"}}>
          <img src={appLogo} alt="appLogo" style={{ width: "auto", height: "90px" }} />
        </div>

        <div style={{marginLeft: '20px', fontSize: '20px'}}>Secure Your Account</div>
        <div style={{ display: "flex", 
            justifyContent: "center", 
            flexDirection: "column", 
            alignItems: "center",
            gap: "40px",
            paddingTop: "30px" }}>
                
          <div style={{display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '20px',}}>

            <div style={{ 
            fontSize: "25px", 
            width: "40px", 
            height: "40px", 
            border: "2px solid #447E26", 
            borderRadius: "50%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            fontWeight: "bold",
            }}>
            1
            </div>

            <button
              onClick={handlePasswordBackup}
              style={{
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: "bold",
                background: "#447E26",
                borderRadius: "10px",
                border: "3px solid #ffffff",
                padding: "10px",
                cursor: "pointer",
                width: "200px",
                textAlign: "center",
              }}
            >
              Back up with password
            </button>
          </div>
          <div style={{display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '20px',}}>

            <div style={{ 
            fontSize: "25px", 
            width: "40px", 
            height: "40px", 
            border: "3px solid transparent", 
            borderRadius: "50%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            }}>
            2
            </div>
            <div
              onClick={linkPasskey}
              style={{ width: "200px" }}
            >
              Create A Passkey
            </div>
          </div>
          <div style={{display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '20px',}}>

            <div style={{ 
            fontSize: "25px", 
            width: "40px", 
            height: "40px", 
            border: "3px solid transparent", 
            borderRadius: "50%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            }}>
            3
            </div>

            <button
              onClick={showMfaEnrollmentModal}
              style={{
                width: "200px",
                textAlign: "left",
              }}
            >
              Enroll in MFA
            </button>
          </div>
        </div>
      </div>
        );
    }

  if (mfaStatus === "createdPasskey") {
    return (
      <div>
        <div style={{display: "flex", justifyContent: "center"}}>
          <img src={appLogo} alt="appLogo" style={{ width: "auto", height: "90px" }} />
        </div>
        <div style={{marginLeft: '20px', fontSize: '20px'}}>Secure Your Account</div>
        <div style={{ display: "flex", 
            justifyContent: "center", 
            flexDirection: "column", 
            alignItems: "center",
            gap: "40px",
            paddingTop: "30px" }}>
                
          <div style={{display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '20px',}}>

              <div style={{ 
              fontSize: "25px", 
              width: "40px", 
              height: "40px", 
              border: "2px solid transparent", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center" 
              }}>
              1
              </div>

              <div style={{ textDecoration: "line-through", width: "200px" }}>Back up with password</div>
          </div>
          <div style={{display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '20px',}}>

              <div style={{ 
              fontSize: "25px", 
              width: "40px", 
              height: "40px", 
              border: "3px solid transparent", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              }}>
              2
              </div>
              <div
                onClick={linkPasskey}
                style={{ textDecoration: "line-through", width: "200px" }}
              >
                Create A Passkey
              </div>
            </div>
            <div style={{display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '20px',}}>

              <div style={{ 
              fontSize: "25px", 
              width: "40px", 
              height: "40px", 
              border: "3px solid #447E26", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              fontWeight: "bold",
              }}>
              3
              </div>

              <button
                onClick={showMfaEnrollmentModal}
                style={{
                  color: "#ffffff",
                  fontSize: "20px",
                  fontWeight: "bold",
                  background: "#447E26",
                  borderRadius: "10px",
                  border: "3px solid #ffffff",
                  padding: "10px",
                  cursor: "pointer",
                  width: "200px",
                  textAlign: "center",
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
      <div>
        <div style={{display: "flex", justifyContent: "center"}}>
          <img src={appLogo} alt="appLogo" style={{ width: "auto", height: "90px" }} />
        </div>
        <div style={{marginLeft: '20px', fontSize: '20px'}}>Secure Your Account</div>
        <div style={{ display: "flex", 
            justifyContent: "center", 
            flexDirection: "column", 
            alignItems: "center",
            gap: "40px",
            paddingTop: "30px" }}>
                
          <div style={{display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '20px',}}>

              <div style={{ 
              fontSize: "25px", 
              width: "40px", 
              height: "40px", 
              border: "2px solid transparent", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center" 
              }}>
              1
              </div>

              <div style={{ textDecoration: "line-through", width: "200px" }}>Back up with password</div>
          </div>
          <div style={{display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '20px',}}>

              <div style={{ 
              fontSize: "25px", 
              width: "40px", 
              height: "40px", 
              border: "3px solid #447E26", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              fontWeight: "bold",
              }}>
              2
              </div>
              <button
                onClick={linkPasskey}
                style={{
                  color: "#ffffff",
                  fontSize: "20px",
                  fontWeight: "bold",
                  background: "#447E26",
                  borderRadius: "10px",
                  border: "3px solid #ffffff",
                  padding: "10px",
                  cursor: "pointer",
                  width: "200px"
                }}
              >
                Create A Passkey
              </button>
            </div>
            <div style={{display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '20px',}}>

              <div style={{ 
              fontSize: "25px", 
              width: "40px", 
              height: "40px", 
              border: "3px solid transparent", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              }}>
              3
              </div>

              <div style={{width: "200px"}}>Enroll in MFA</div>
          </div>
        </div>
      </div>
    );
  }
}


export default mfaOnboarding;