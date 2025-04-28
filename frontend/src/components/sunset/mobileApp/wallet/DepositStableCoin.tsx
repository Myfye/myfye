import React, { useState, useEffect } from "react";
import menuIcon from "../../../assets/menuIcon.png";
import backIcon from "../../../assets/backButton3.png";
import { useSelector, useDispatch } from "react-redux";
import backButton from "../../../assets/backButton3.png";
import usdcSol from "../../../assets/usdcSol.png";
import usdtSol from "../../../assets/usdtSol.png";
import pyusdSol from "../../../assets/pyusdSol.png";
import solanaLogo from "../../../assets/solanaLogo.png";
import copy from "../../../assets/copy.png";
import {
  setShowDepositStablecoinPage,
  setShouldShowBottomNav,
} from "../../../redux/userWalletData.tsx";

function DepositStableCoin() {
  const showDepositStablecoinPage = useSelector(
    (state: any) => state.userWalletData.showDepositStablecoinPage
  );

  const [currencySelected, setcurrencySelected] = useState("");
  const dispatch = useDispatch();
  const [addressCopied, setaddressCopied] = useState(false);
  const currentUserEmail = useSelector(
    (state: any) => state.userWalletData.currentUserEmail
  );
  const [Message, setMessage] = useState("");
  const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
  const [SubmitButtonActive, setSubmitButtonActive] = useState(false);
  const selectedLanguageCode = useSelector(
    (state: any) => state.userWalletData.selectedLanguageCode
  );

  const [menuPosition, setMenuPosition] = useState("-110vh");
  const usdcSolBalance = useSelector(
    (state: any) => state.userWalletData.usdcSolBalance
  );
  const usdtSolBalance = useSelector(
    (state: any) => state.userWalletData.usdtSolBalance
  );
  const pyusdSolBalance = useSelector(
    (state: any) => state.userWalletData.pyusdSolBalance
  );

  const usdyBalance = useSelector(
    (state: any) => state.userWalletData.usdySolBalance
  );

  const handleCopyAddress = () => {
    navigator.clipboard
      .writeText(publicKey)
      .then(() => {
        console.log("Address copied to clipboard!");
        setaddressCopied(true);

        setTimeout(() => {
          setaddressCopied(false);
        }, 2000); // 2000 milliseconds = 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy address: ", err);
      });
  };

  const removeWhitespace = (str: string) => {
    return str.replace(/\s/g, "");
  };

  const checkForMessageComplete = (newMessage: string) => {
    const cleanedMessage = removeWhitespace(newMessage);
    if (cleanedMessage === "") {
      //error
      setSubmitButtonActive(false);
    } else {
      setSubmitButtonActive(true);
    }
  };

  useEffect(() => {
    if (showDepositStablecoinPage) {
      setMenuPosition("0"); // Bring the menu into view
    } else {
      setMenuPosition("-100dvh"); // Move the menu off-screen

      setcurrencySelected("");
    }
  }, [showDepositStablecoinPage]);

  const handleMenuClick = () => {
    // Add your logic here for what happens when the menu is clicked
    dispatch(setShouldShowBottomNav(true));
    dispatch(setShowDepositStablecoinPage(false));
  };

  return (
    <div style={{ backgroundColor: "white" }}>
      {showDepositStablecoinPage && (
        <div
          style={{
            position: "absolute", // Position it relative to the viewport
            top: 0, // Align to the top of the viewport
            left: 0, // Align to the right of the viewport
            padding: "15px",
            cursor: "pointer",
            zIndex: 6,
          }}
        >
          <img
            style={{ width: "auto", height: "45px", background: "white" }}
            src={
              showDepositStablecoinPage
                ? currencySelected
                  ? backButton
                  : backIcon
                : menuIcon
            }
            onClick={handleMenuClick}
            alt="Exit"
          />
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></div>

      <div
        style={{
          position: "absolute",
          top: menuPosition,
          left: 0, // Use state variable for position
          padding: "15px",
          height: "95vh",
          backgroundColor: "white",
          width: "92vw",
          transition: "top 0.5s ease", // Animate the left property
          zIndex: 4,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ marginTop: "0px", fontSize: "40px", color: "#222222" }}>
            {selectedLanguageCode === "en" && `Deposit`}
            {selectedLanguageCode === "es" && `Déposito`}
          </div>
        </div>

        <div>
          <div
            style={{
              marginTop: "85px",
              display: "flex",
              flexDirection: "column",
              paddingLeft: "15px",
              paddingRight: "15px",
              gap: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                paddingLeft: "15px",
                paddingRight: "15px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  id="usdcSolIcon"
                  src={usdcSol}
                  style={{ width: "70px", height: "auto" }}
                />
                <div id="usdcSolTicker" style={{ marginLeft: "15px" }}>
                  USDC
                </div>{" "}
                {/* Adjust marginLeft as needed */}
              </div>

              <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                {usdcSolBalance > 0.00001 ? <>{usdcSolBalance}</> : <>0.0</>}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                paddingLeft: "15px",
                paddingRight: "15px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src={usdtSol} style={{ width: "70px", height: "auto" }} />
                <div style={{ marginLeft: "15px" }}>USDT</div>{" "}
                {/* Adjust marginLeft as needed */}
              </div>

              <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                {usdtSolBalance > 0.00001 ? <>{usdtSolBalance}</> : <>0.0</>}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                paddingLeft: "15px",
                paddingRight: "15px",
                justifyContent: "center",
                gap: "10px",
                cursor: "pointer",
                alignItems: "center",
              }}
              onClick={handleCopyAddress}
            >
              <img
                src={solanaLogo}
                style={{
                  width: "90px",
                  height: "auto",
                  background: "#666666",
                  padding: "5px",
                  borderRadius: "5px",
                }}
              />

              {addressCopied ? (
                <div
                  style={{
                    fontWeight: "bold",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  Copied!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#10003;
                </div>
              ) : (
                <div
                  style={{
                    fontWeight: "bold",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {publicKey.length >= 6
                    ? `${publicKey.substring(0, 3)}...${publicKey.substring(
                        publicKey.length - 3
                      )}`
                    : publicKey}
                  <img src={copy} style={{ width: "20px", height: "auto" }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DepositStableCoin;
