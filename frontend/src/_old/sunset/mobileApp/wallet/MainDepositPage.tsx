import { useState, useEffect } from "react";
import menuIcon from "../../../assets/menuIcon.png";
import { useSelector, useDispatch } from "react-redux";
import backButton from "../../../assets/backButton3.png";
import DepositStableCoin from "./DepositStableCoin.tsx";
import WithdrawStableCoin from "./WithdrawStableCoin.tsx";
import myfyeWalletImage from "../../../assets/myfyeWallet.png";
import {
  setShouldShowBottomNav,
  setShowWithdrawStablecoinPage,
  setShowBanxaPopUp,
  setShowDepositStablecoinPage,
  setShowWalletPage,
  setShowMainDepositPage,
} from "../../../redux/userWalletData.tsx";
import history from "../../../assets/history.png";
import Banxa from "../../../assets/Banxa.png";

function MainDepositPage() {
  const showMenu = useSelector(
    (state: any) => state.userWalletData.showMainDepositPage
  );

  const dispatch = useDispatch();
  const [currencySelected, setcurrencySelected] = useState("");
  const [toggleFiat, setToggleFiat] = useState(true);
  const [addressCopied, setAddressCopied] = useState(false);
  const [showTransactionHistory, setshowTransactionHistory] = useState(false);
  const [menuPosition, setMenuPosition] = useState("-110vh");
  const currentUserEmail = useSelector(
    (state: any) => state.userWalletData.currentUserEmail
  );
  const [Message, setMessage] = useState("");
  const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
  const [showQRCode, setshowQRCode] = useState(false);
  const selectedLanguageCode = useSelector(
    (state: any) => state.userWalletData.selectedLanguageCode
  );

  const removeWhitespace = (str: string) => {
    return str.replace(/\s/g, "");
  };

  useEffect(() => {
    if (showMenu) {
      setMenuPosition("0"); // Bring the menu into view
    } else {
      setMenuPosition("-110vh"); // Move the menu off-screen
      setcurrencySelected("");
    }
  }, [showMenu]);

  const handleMenuClick = () => {
    if (showTransactionHistory) {
      toggleShowTransactionHistory();
    } else {
      if (showMenu) {
        dispatch(setShowMainDepositPage(false));
        dispatch(setShouldShowBottomNav(true));
      }
    }
  };

  const handleBanxaClick = () => {};

  const handleToggleFiat = () => {
    setToggleFiat(!toggleFiat);
  };

  const handleWithdrawStableCoinClick = () => {
    // Add your logic here for what happens when the menu is clicked
    dispatch(setShowWithdrawStablecoinPage(true));
  };

  const handleDepositStableCoinClick = () => {
    // Add your logic here for what happens when the menu is clicked
    dispatch(setShowDepositStablecoinPage(true));
  };

  const toggleShowTransactionHistory = () => {
    console.log();
    setshowTransactionHistory(!showTransactionHistory);
  };

  const handleWalletInfoClick = () => {
    const url = `https://solscan.io/account/${publicKey}`;
    window.open(url, "_blank"); // Opens the link in a new tab
  };

  function copyWalletAddress() {
    navigator.clipboard
      .writeText(publicKey) // Assume publicKey is available in your component's scope
      .then(() => {
        setAddressCopied(true);
        setTimeout(() => {
          setAddressCopied(false);
        }, 2000); // Set addressCopied to false after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy the address: ", err);
      });
  }

  return (
    <div style={{ backgroundColor: "white" }}>
      {showMenu && (
        <div
          style={{
            position: "absolute", // Position it relative to the viewport
            top: 0, // Align to the top of the viewport
            left: 0, // Align to the right of the viewport
            padding: "15px",
            cursor: "pointer",
            zIndex: 4,
          }}
        >
          <img
            style={{ width: "auto", height: "35px", background: "white" }}
            src={
              showMenu
                ? currencySelected
                  ? backButton
                  : showTransactionHistory
                  ? backButton
                  : backButton
                : menuIcon
            }
            onClick={handleMenuClick}
            alt="Exit"
          />
        </div>
      )}

      <WithdrawStableCoin />
      <DepositStableCoin />

      <div
        style={{
          position: "absolute",
          top: menuPosition,
          left: 0, // Use state variable for position
          padding: "15px",
          minHeight: "calc(100% + 35px)",
          height: "100%",
          backgroundColor: "white",
          width: "94vw",
          overflowX: "hidden",
          transition: "top 0.5s ease", // Animate the left property
          zIndex: 3,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ marginTop: "0px", fontSize: "45px", color: "#222222" }}>
            {selectedLanguageCode === "en" && `Deposit`}
            {selectedLanguageCode === "es" && `Déposito`}
          </div>
        </div>

        {!showTransactionHistory ? (
          <div>
            <div
              style={{
                position: "absolute", // Position it relative to the viewport
                top: 0, // Align to the top of the viewport
                right: 0, // Align to the right of the viewport
                padding: "15px",
                cursor: "pointer",
                zIndex: 4,
              }}
            ></div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  marginTop: "15px",
                  width: "100vw",
                  marginLeft: "-15px",
                }}
              >
                <div
                  style={{
                    color: toggleFiat ? "#2E7D32" : "#222222",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "16px",
                    padding: "9px",
                    width: "155px",
                    textAlign: "center",
                    borderBottom: toggleFiat
                      ? "3px solid #2E7D32"
                      : "3px solid #222222",
                  }}
                  onClick={handleToggleFiat}
                >
                  {selectedLanguageCode === "en" && `Credit / Debit card`}
                  {selectedLanguageCode === "es" && `Tarjeta De Crédito`}
                </div>
                <div
                  style={{
                    color: !toggleFiat ? "#2E7D32" : "#222222",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "16px",
                    padding: "9px",
                    width: "155px",
                    textAlign: "center",
                    borderBottom: !toggleFiat
                      ? "3px solid #2E7D32"
                      : "3px solid #222222",
                  }}
                  onClick={handleToggleFiat}
                >
                  Crypto
                </div>
              </div>

              {toggleFiat ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "60vh",
                  }}
                >
                  <div>
                    <div>
                      {selectedLanguageCode === "en" &&
                        `Deposit via credit or debit card directly`}
                      {selectedLanguageCode === "es" &&
                        `Deposite mediante tarjeta de crédito o débito`}
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div>
                        {selectedLanguageCode === "en" &&
                          `into your Myfye account with`}
                        {selectedLanguageCode === "es" &&
                          ` directamente en tu cuenta Myfye con`}
                      </div>
                      <img
                        src={Banxa}
                        style={{
                          height: "30px",
                          width: "auto",
                          marginLeft: "5px",
                          marginTop: "2px",
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      color: "#ffffff",
                      background: "#2E7D32", // gray '#999999',
                      borderRadius: "10px",
                      border: "2px solid #2E7D32",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontSize: "20px",
                      padding: "9px",
                      width: "120px",
                      textAlign: "center",
                    }}
                    onClick={handleBanxaClick}
                  >
                    {selectedLanguageCode === "en" && `Deposit`}
                    {selectedLanguageCode === "es" && `Déposito`}
                  </div>

                  <></>

                  {selectedLanguageCode === "en" && (
                    <div style={{ textAlign: "center", color: "#8B0000" }}>
                      Please remember to{" "}
                      <span style={{ fontWeight: "bold" }}>
                        only deposit USDC, USDT
                      </span>
                      <br />
                      <span style={{ fontWeight: "bold" }}>or EURC</span> on the
                      Solana network!
                    </div>
                  )}
                  {selectedLanguageCode === "es" && (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#8B0000",
                        width: "50vw",
                      }}
                    >
                      ¡Recuerde depositar únicamente USDC, USDT o EURC en la red
                      Solana!
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "60vh",
                    }}
                  >
                    <div style={{ width: "110px", height: "110px" }}>
                      {/* <QRCode value={publicKey} size={110} level="H" /> */}
                    </div>

                    <></>

                    {selectedLanguageCode === "en" && (
                      <div style={{ textAlign: "center", color: "#8B0000" }}>
                        Please remember to{" "}
                        <span style={{ fontWeight: "bold" }}>
                          only deposit USDC, USDT
                        </span>
                        <br />
                        <span style={{ fontWeight: "bold" }}>or EURC</span> on
                        the Solana network!
                      </div>
                    )}
                    {selectedLanguageCode === "es" && (
                      <div
                        style={{
                          textAlign: "center",
                          color: "#8B0000",
                          width: "50vw",
                        }}
                      >
                        ¡Recuerde depositar únicamente USDC, USDT o EURC en la
                        red Solana!
                      </div>
                    )}

                    <div>
                      <div
                        style={{
                          color: "#ffffff",
                          background: "#2E7D32", // gray '#999999',
                          borderRadius: "10px",
                          border: "2px solid #2E7D32",
                          fontWeight: "bold",
                          cursor: "pointer",
                          fontSize: "20px",
                          padding: "9px",
                          width: "180px",
                          textAlign: "center",
                        }}
                        onClick={copyWalletAddress}
                      >
                        {addressCopied ? (
                          <>Copied!</>
                        ) : (
                          <>
                            {selectedLanguageCode === "en" && `Copy Address`}
                            {selectedLanguageCode === "es" &&
                              `Copiar Dirección`}
                          </>
                        )}
                      </div>

                      <div
                        style={{
                          color: "#ffffff",
                          background: "#2E7D32", // gray '#999999',
                          borderRadius: "10px",
                          border: "2px solid #2E7D32",
                          fontWeight: "bold",
                          cursor: "pointer",
                          fontSize: "20px",
                          padding: "9px",
                          width: "180px",
                          textAlign: "center",
                          marginTop: "15px",
                        }}
                        onClick={handleWalletInfoClick}
                      >
                        {selectedLanguageCode === "en" && `Wallet Explorer`}
                        {selectedLanguageCode === "es" &&
                          `Explorador De Billetera`}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                {showQRCode && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100dvh",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 10, // Ensure it's above other content
                    }}
                    onClick={() => setshowQRCode(false)}
                  >
                    <div
                      style={{
                        position: "fixed",
                        top: "30vh",
                        left: 0,
                        width: "100vw",
                        height: "210px",
                        background: "#ffffff",
                        zIndex: 11,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "5px",
                        }}
                      >
                        <div
                          style={{ width: "200px", height: "200px" }}
                          onClick={() => setshowQRCode(true)}
                        >
                          {/* <QRCode value={publicKey} size={200} level="H" /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>{/*<WalletTransactions/>*/}</div>
        )}
      </div>
    </div>
  );
}
export default MainDepositPage;
