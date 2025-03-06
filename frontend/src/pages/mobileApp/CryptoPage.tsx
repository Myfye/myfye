import React, { useState, useEffect } from "react";
import menuIcon from "../../assets/menuIcon.png";
import { useSelector } from "react-redux";
import backButton from "../../assets/backButton3.png";
import HoldingsPortfolio from "../../components/mobileApp/earnSwaps/HoldingsPortfolio.tsx";
import PieChartComponent from "../../components/PieChart.tsx";
import myfyeCryptoGreen from "../../assets/myfyeCryptoGreen.png";
import {
  setShouldShowBottomNav,
  setShowEarnPage,
  setShowSwapWithdrawPage,
  setShowSwapDepositPage,
  setDepositWithdrawProductType,
  setShowCryptoPage,
} from "../../redux/userWalletData.tsx";
import { useDispatch } from "react-redux";
import history from "../../assets/history.png";
import EarnTransactions from "../../components/mobileApp/earnSwaps/EarnTransactions.tsx";

function CryptoPage() {
  const showMenu = useSelector(
    (state: any) => state.userWalletData.showCryptoPage
  );
  const [showTransactionHistory, setshowTransactionHistory] = useState(false);
  const [currencySelected, setcurrencySelected] = useState("");
  const dispatch = useDispatch();
  const [menuPosition, setMenuPosition] = useState("-150vh");
  const selectedLanguageCode = useSelector(
    (state: any) => state.userWalletData.selectedLanguageCode
  );
  const btcSolBalance = useSelector(
    (state: any) => state.userWalletData.btcSolBalance
  );
  const priceOfBTCinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfBTCinUSDC
  );

  useEffect(() => {
    if (showMenu) {
      setMenuPosition("0"); // Bring the menu into view
    } else {
      setMenuPosition("-150vh"); // Move the menu off-screen

      setcurrencySelected("");
    }
  }, [showMenu]);

  useEffect(() => {}, [showTransactionHistory]);

  const handleMenuClick = () => {
    if (showTransactionHistory) {
      toggleShowTransactionHistory();
    } else {
      if (showMenu) {
        dispatch(setShowCryptoPage(false));
      }
    }
  };

  const fadePieChartOpacity = () => {
    //dispatch(setShouldShowBottomNav(false))
  };

  const toggleShowTransactionHistory = () => {
    if (!showTransactionHistory) {
      dispatch(setShouldShowBottomNav(false));
    } else {
      dispatch(setShouldShowBottomNav(true));
    }
    setshowTransactionHistory(!showTransactionHistory);
  };

  const handleWithdrawPageClick = () => {
    dispatch(setShouldShowBottomNav(false));
    dispatch(setShowSwapWithdrawPage(true));
    dispatch(setDepositWithdrawProductType("Crypto"));
  };

  const handleDepositPageClick = () => {
    dispatch(setShouldShowBottomNav(false));
    dispatch(setShowSwapDepositPage(true));
    dispatch(setDepositWithdrawProductType("Crypto"));
  };

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

      <div
        style={{
          position: "absolute",
          top: menuPosition,
          left: 0, // Use state variable for position
          minHeight: "calc(100% + 35px)",
          backgroundColor: "white",
          width: "100vw",
          transition: "top 0.5s ease", // Animate the left property
          zIndex: 3,
        }}
      >
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
            >
              <img
                src={history}
                style={{ height: "39px", width: "39px" }}
                onClick={toggleShowTransactionHistory}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  boxShadow:
                    "2px 5px 15px rgba(0, 0, 0, 0.2), -2px 5px 15px rgba(0, 0, 0, 0.2)",
                  padding: "10px",
                  paddingBottom: "20px",
                  width: "90vw",
                  marginTop: "80px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    color: "#222222",
                    gap: window.innerHeight < 620 ? "1px" : "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      style={{
                        width: "180px",
                        height: "auto",
                        marginTop: "15px",
                      }}
                      src={myfyeCryptoGreen}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <label
                      htmlFor="deposit"
                      style={{
                        fontSize: "20px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      ${" "}
                      <span style={{ fontSize: "35px" }}>
                        <div>
                          {(btcSolBalance * priceOfBTCinUSDC)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </div>
                      </span>
                    </label>

                    <div
                      style={{
                        marginTop: "15px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-around",
                        width: "85vw",
                      }}
                      onClick={fadePieChartOpacity}
                    >
                      <div
                        style={{
                          color: "white",
                          background: "#60A05B",
                          fontWeight: "bold",
                          borderRadius: "10px",
                          border: "none",
                          height: "40px",
                          width: "135px",
                          display: "flex", // Makes this div also a flex container
                          justifyContent: "center", // Centers the text horizontally inside the button
                          alignItems: "center", // Centers the text vertically inside the button
                          cursor: "pointer",
                          fontSize: "20px",
                        }}
                        onClick={handleDepositPageClick}
                      >
                        {selectedLanguageCode === "en" && `Deposit`}
                        {selectedLanguageCode === "es" && `Déposito`}
                      </div>

                      <div
                        style={{
                          color: "white",
                          background: "#60A05B", // red '#FF6961',
                          borderRadius: "10px",
                          border: "none",
                          fontWeight: "bold",
                          height: "40px",
                          display: "flex", // Makes this div also a flex container
                          justifyContent: "center", // Centers the text horizontally inside the button
                          alignItems: "center", // Centers the text vertically inside the button
                          cursor: "pointer",
                          fontSize: "20px",
                          width: "135px",
                        }}
                        onClick={handleWithdrawPageClick}
                      >
                        {selectedLanguageCode === "en" && `Withdraw`}
                        {selectedLanguageCode === "es" && `Retirar`}
                      </div>
                    </div>
                  </div>

                  <div></div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                  background: "#ffffff",
                  borderRadius: "20px",
                  boxShadow:
                    "2px 5px 15px rgba(0, 0, 0, 0.2), -2px 5px 15px rgba(0, 0, 0, 0.2)",
                  padding: "10px",
                  paddingBottom: "25px",
                  width: "90vw",
                  marginTop: "30px",
                  marginBottom: "100px",
                }}
              >
                <div>
                  <div
                    style={{
                      marginTop: "15px",
                      textAlign: "center",
                      fontSize: "25px",
                    }}
                  >
                    {selectedLanguageCode === "en" && `Crypto Portfolio`}
                    {selectedLanguageCode === "es" && `Crypto Portafolio`}
                  </div>

                  <div style={{}}>
                    <PieChartComponent />
                  </div>
                </div>

                <div>
                  <div>
                    <a
                      href="https://www.investopedia.com/terms/b/bitcoin.asp"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "15px",
                        }}
                      >
                        <div
                          style={{
                            borderRadius: "10px",
                            padding: "10px",
                            color: "#ffffff",
                            fontWeight: "bold",
                            fontSize: "16px",
                            backgroundColor: "#60A05B",
                            textAlign: "center",
                            width: "75vw",
                          }}
                        >
                          {selectedLanguageCode === "en" &&
                            `Learn About Bitcoin`}
                          {selectedLanguageCode === "es" &&
                            `Aprender Acerca Bitcoin`}
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: "50px" }}>
            <EarnTransactions />
          </div>
        )}
      </div>
    </div>
  );
}
export default CryptoPage;
