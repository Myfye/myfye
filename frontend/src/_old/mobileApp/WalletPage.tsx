import { useState, useEffect } from "react";
import menuIcon from "../../assets/menuIcon.png";
import { useSelector, useDispatch } from "react-redux";
import backButton from "../../assets/backButton3.png";
import DepositStableCoin from "../../components/mobileApp/wallet/DepositStableCoin.tsx";
import WithdrawStableCoin from "../../components/mobileApp/wallet/WithdrawStableCoin.tsx";
import {
  setShouldShowBottomNav,
  setShowWalletPage,
  setShowWithdrawStablecoinPage,
  setShowDepositStablecoinPage,
  setSwapFXTransactionStatus,
  seteurcSolValue,
  setusdcSolValue,
  setusdtSolValue,
} from "../../redux/userWalletData.tsx";
import history from "../assets/history.png";
import WalletTransactions from "../../components/mobileApp/wallet/WalletTransactions.tsx";
import myfyeWallet from "../../assets/myfyeWallet2.png";
import xIcon from "../../assets/xIconGray2.png";
import usdcSol from "../../assets/usdcSol.png";
import usdtSol from "../../assets/usdtSol.png";
import eurcSol from "../../assets/eurcSol.png";
import { getFunctions, httpsCallable } from "firebase/functions";
import { swap } from "../../features/swap/SwapService.tsx";
import LoadingAnimation from "../sunset/LoadingAnimation.tsx";
import { useSolanaWallets } from "@privy-io/react-auth/solana";

function WalletPage() {
  const showMenu = useSelector(
    (state: any) => state.userWalletData.showWalletPage
  );
  const dispatch = useDispatch();
  const [swapButtonActive, setSwapButtonActive] = useState(true);
  const [currencySelected, setcurrencySelected] = useState("");
  const [showTransactionHistory, setshowTransactionHistory] = useState(false);
  const [menuPosition, setMenuPosition] = useState("-800px");
  const transactionStatus = useSelector(
    (state: any) => state.userWalletData.swapFXTransactionStatus
  );
  const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
  const [showQRCode, setshowQRCode] = useState(false);
  const updatingBalance = useSelector(
    (state: any) => state.userWalletData.updatingBalance
  );
  const usdcSolBalance = useSelector(
    (state: any) => state.userWalletData.usdcSolBalance
  );
  const usdtSolBalance = useSelector(
    (state: any) => state.userWalletData.usdtSolBalance
  );
  const eurcSolBalance = useSelector(
    (state: any) => state.userWalletData.eurcSolBalance
  );
  const priceOfEURCinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfEURCinUSDC
  );
  const [qrCodeURL, setqrCodeURL] = useState("");
  const [showWalletInfoPopup, setShowWalletInfoPopup] = useState(false);
  const [showSwapPopup, setShowSwapPopup] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  const selectedLanguageCode = useSelector(
    (state: any) => state.userWalletData.selectedLanguageCode
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageColor, setErrorMessageColor] = useState("#A90900");
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const { wallets } = useSolanaWallets();
  const MINIMUM_SWAP_VALUE = 0.01;

  useEffect(() => {
    const baseUrl = "https://api.qrserver.com/v1/create-qr-code/";
    const params = new URLSearchParams({
      size: "150x150", // Size of the QR code
      data: publicKey, // Data to encode
    });
    setqrCodeURL(`${baseUrl}?${params.toString()}`);
  }, [publicKey]);

  const removeWhitespace = (str: string) => {
    return str.replace(/\s/g, "");
  };

  useEffect(() => {
    if (showMenu) {
      setMenuPosition("0"); // Bring the menu into view
    } else {
      setMenuPosition("-800px"); // Move the menu off-screen
      setcurrencySelected("usd");
      setErrorMessage("");
      if (
        usdcSolBalance >= MINIMUM_SWAP_VALUE ||
        usdtSolBalance >= MINIMUM_SWAP_VALUE
      ) {
        setSwapButtonActive(true);
      }
    }
  }, [showMenu]);

  useEffect(() => {
    if (currencySelected == "usd") {
      if (
        usdcSolBalance >= MINIMUM_SWAP_VALUE ||
        usdtSolBalance >= MINIMUM_SWAP_VALUE
      ) {
        setSwapButtonActive(true);
      } else {
        setSwapButtonActive(false);
      }
    } else if (currencySelected == "eur") {
      if (eurcSolBalance >= MINIMUM_SWAP_VALUE) {
        setSwapButtonActive(true);
      } else {
        setSwapButtonActive(false);
      }
    }
  }, [currencySelected, usdcSolBalance, usdtSolBalance, eurcSolBalance]);

  const handleMenuClick = () => {
    if (showTransactionHistory) {
      toggleShowTransactionHistory();
    } else {
      if (showMenu) {
        dispatch(setShowWalletPage(false));
      }
    }
  };

  useEffect(() => {
    if (transactionStatus === "Unsigned") {
      setErrorMessage(
        selectedLanguageCode === "es"
          ? "Por favor firme la transacción"
          : "Please sign the transaction"
      );
      setErrorMessageColor("#60A05B");
    }
    if (transactionStatus === "Signed") {
      setErrorMessage(
        selectedLanguageCode === "es"
          ? "Intercambio, por favor espera"
          : "Swapping, Please Wait"
      );
      setErrorMessageColor("#60A05B");
    }
    if (transactionStatus === "Success") {
      setErrorMessage(selectedLanguageCode === "es" ? "¡Éxito!" : "Success!");
      setErrorMessageColor("#60A05B");
      updateUserBalance();
      setTimeout(() => {
        setErrorMessage("");
        setTransactionInProgress(false);
        setShowSwapPopup(false);
      }, 1500);
      setTimeout(() => {
        if (currencySelected == "usd") {
          setcurrencySelected("eur");
        }
        if (currencySelected == "eur") {
          setcurrencySelected("usd");
        }
      }, 3000);
    } else if (transactionStatus === "Fail") {
      setErrorMessage(
        selectedLanguageCode === "es"
          ? "La transacción falló, por favor intente de nuevo"
          : "Swap failed, please try again"
      );
      setErrorMessageColor("#000000");
      setTimeout(() => {
        setTransactionInProgress(false);
        dispatch(setSwapFXTransactionStatus(""));
      }, 3000);
    }
  }, [transactionStatus]);

  const updateUserBalance = () => {
    const conversionRate = 1.04; // 1 EUR = 1.04 USD

    // Successful swap, update UI
    if (currencySelected === "usd") {
      if (usdtSolBalance > usdcSolBalance) {
        dispatch(
          seteurcSolValue(
            parseFloat((usdtSolBalance / conversionRate).toFixed(5))
          )
        );
        dispatch(setusdtSolValue(0));
      } else {
        dispatch(
          seteurcSolValue(
            parseFloat((usdcSolBalance / conversionRate).toFixed(5))
          )
        );
        dispatch(setusdcSolValue(0));
      }
    } else if (currencySelected === "eur") {
      dispatch(
        setusdcSolValue(
          parseFloat((eurcSolBalance * conversionRate).toFixed(5))
        )
      );
      dispatch(seteurcSolValue(0));
    }
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

  const handleWithdrawButtonClick = () => {
    // Add your logic here for what happens when the menu is clicked
    dispatch(setShouldShowBottomNav(false));
    dispatch(setShowWithdrawStablecoinPage(true));
  };

  const handleDepositButtonClick = () => {
    // Add your logic here for what happens when the menu is clicked
    dispatch(setShouldShowBottomNav(false));
    dispatch(setShowDepositStablecoinPage(true));
  };

  const toggleShowWalletInfoPopup = () => {
    // Add your logic here for what happens when the menu is clicked
    setShowWalletInfoPopup(!showWalletInfoPopup);
  };

  const toggleShowSwapPopup = () => {
    // Add your logic here for what happens when the menu is clicked
    setShowSwapPopup(!showSwapPopup);
  };

  const toggleShowTransactionHistory = () => {
    console.log();
    if (!showTransactionHistory) {
      dispatch(setShouldShowBottomNav(false));
    } else {
      dispatch(setShouldShowBottomNav(true));
    }
    setshowTransactionHistory(!showTransactionHistory);
  };

  const handleWalletPortfolioClick = () => {
    const url = `https://app.step.finance/en/dashboard?watching=${publicKey}`;
    window.open(url, "_blank"); // Opens the link in a new tab
  };

  const handleWalletExplorerClick = () => {
    const url = `https://solscan.io/account/${publicKey}`;
    window.open(url, "_blank"); // Opens the link in a new tab
  };

  const handleSwapButtonClick = async () => {
    let amountSelected;
    let inputCurrency;
    let outputCurrency;

    if (currencySelected == "usd") {
      outputCurrency = "eurcSol";
      if (usdtSolBalance > usdcSolBalance) {
        inputCurrency = "usdtSol";
        amountSelected = usdtSolBalance;
      } else {
        inputCurrency = "usdcSol";
        amountSelected = usdcSolBalance;
      }
    } else if (currencySelected == "eur") {
      outputCurrency = "usdcSol";
      amountSelected = eurcSolBalance;
      inputCurrency = "eurcSol";
    } else {
      dispatch(setSwapFXTransactionStatus("Fail"));
    }

    if (amountSelected < MINIMUM_SWAP_VALUE) {
      setErrorMessage(
        selectedLanguageCode === "es"
          ? "Saldo insuficiente"
          : "Insufficient balance"
      );
    } else {
      dispatch(setSwapFXTransactionStatus("Unsigned"));

      const convertToSmallestDenomination = Math.round(amountSelected * 1e6);
      setTransactionInProgress(true);

      const wallet = wallets[0];

      const inputAmount: number = convertToSmallestDenomination;
      const signDepositSuccess = swap(
        wallet,
        publicKey,
        inputAmount,
        inputCurrency!,
        outputCurrency!,
        dispatch,
        "walletSwap"
      );
    }

    /*
    setTransactionStatus('Confirming Transaction...')

  
    const transactionSuccess = await requestNewSolanaTransaction2(publicKey, 
      MYFYE_SERVER_ADDRESS, convertToSmallestDenomination, inputCurrency!, 
        primaryWallet, walletName);
    
    console.log('Got transaction status: ', transactionSuccess)

    if (transactionSuccess) {
      setTransactionStatus('Confirmed! Your balance will update soon!')

      const functions = getFunctions();
      const sendSignedTransaction = httpsCallable(functions, 'swap');
      sendSignedTransaction({
        publicKey: publicKey,
        inputAmount: amountSelected,
        inputCurrency: inputCurrency,
        outputCurrency: outputCurrency
      })

      setTimeout(() => {
        setTransactionInProgress(false);
        setShowSwapPopup(false);
        setTransactionStatus('');
      }, 2500);

    } else {
      setTransactionStatus('Transaction failed, please try again.')
    }
      */
  };

  const errorLabelText = () => {
    if (errorMessage) {
      const color = errorMessageColor;
      return (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <label
              style={{
                width: "80vw",
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
                fontSize: "18px",
                color: color,
                textAlign: "center",
              }}
            >
              {errorMessage}
            </label>
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ visibility: "hidden" }}>
          <label
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto",
              marginTop: "10px",
              fontSize: "18px",
            }}
          >
            $
          </label>
        </div>
      );
    }
  };

  return (
    <div style={{ backgroundColor: "white", overflow: "hidden" }}>
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
          height: "700px", // random number to cover home page
          backgroundColor: "white",
          width: "100vw",
          overflowX: "hidden",
          overflowY: "hidden",
          transition: "top 0.5s ease", // Animate the left property
          zIndex: 3,
        }}
      >
        {showWalletInfoPopup && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
            }}
            onClick={toggleShowWalletInfoPopup}
          >
            <div
              style={{
                backgroundColor: "white",
                width: "75vw",
                height: "50vh",
                padding: "20px",
                background: "#ffffff",
                borderRadius: "20px",
                boxShadow:
                  "4px 10px 30px rgba(0, 0, 0, 0.4), -4px 10px 30px rgba(0, 0, 0, 0.4)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={xIcon}
                style={{ width: "32px", height: "auto" }}
                onClick={toggleShowWalletInfoPopup}
              ></img>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "90%",
                  justifyContent: "space-around",
                  marginTop: "-20px",
                }}
              >
                <div style={{ width: "110px", height: "110px" }}>
                  {/* <QRCode value={publicKey} size={110} level="H" /> */}
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
                  }}
                  onClick={copyWalletAddress}
                >
                  {addressCopied ? <>Copied!</> : <>Copy Address</>}
                </div>

                <div
                  style={{
                    color: "#ffffff",
                    background: "#2E7D32", // gray '#999999',
                    borderRadius: "10px",
                    border: "2px solid #2E7D32",
                    fontWeight: "bold",
                    padding: "9px",
                    cursor: "pointer",
                    fontSize: "20px",
                    width: "180px",
                    textAlign: "center",
                  }}
                  onClick={handleWalletExplorerClick}
                >
                  Wallet Explorer
                </div>
              </div>
            </div>
          </div>
        )}

        {showSwapPopup && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
            }}
            onClick={toggleShowSwapPopup}
          >
            <div
              style={{
                backgroundColor: "white",
                width: "80vw",
                height: "60vh",
                padding: "20px",
                background: "#ffffff",
                borderRadius: "20px",
                boxShadow:
                  "8px 20px 60px rgba(0, 0, 0, 0.4), -4px 10px 30px rgba(0, 0, 0, 0.4)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={xIcon}
                style={{ width: "32px", height: "auto" }}
                onClick={toggleShowSwapPopup}
              ></img>

              {transactionInProgress ? (
                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    flexDirection: "column",
                  }}
                >
                  <div>
                    <LoadingAnimation />
                    {errorLabelText()}
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ marginTop: "20px", fontWeight: "bold" }}>
                    You pay
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "90%",
                    }}
                  >
                    <div
                      style={{
                        marginTop: "10px",
                        fontSize: "30px",
                        fontWeight: "bold",
                        width: "100px",
                        paddingLeft: "2px",
                      }}
                    >
                      &nbsp;&nbsp;
                      {currencySelected == "usd"
                        ? (usdcSolBalance > usdtSolBalance
                            ? usdcSolBalance
                            : usdtSolBalance
                          ).toFixed(2)
                        : eurcSolBalance.toFixed(2)}
                    </div>

                    <img
                      src={
                        currencySelected == "usd"
                          ? usdcSolBalance > usdtSolBalance
                            ? usdcSol
                            : usdtSol
                          : eurcSol
                      }
                      style={{ width: "auto", height: "55px" }}
                    />
                  </div>

                  <div style={{ marginTop: "20px", fontWeight: "bold" }}>
                    You receive
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "90%",
                    }}
                  >
                    <div
                      style={{
                        marginTop: "10px",
                        fontSize: "30px",
                        fontWeight: "bold",
                        width: "100px",
                      }}
                    >
                      ~
                      {currencySelected == "usd"
                        ? (
                            (usdcSolBalance > usdtSolBalance
                              ? usdcSolBalance
                              : usdtSolBalance) / priceOfEURCinUSDC
                          ).toFixed(2)
                        : (eurcSolBalance * priceOfEURCinUSDC).toFixed(2)}
                    </div>

                    <img
                      src={currencySelected == "usd" ? eurcSol : usdcSol}
                      style={{ width: "auto", height: "55px" }}
                    />
                  </div>

                  {errorLabelText()}
                  <div
                    style={{
                      display: "flex",
                      marginTop: "0px",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        color: "#ffffff",
                        background: swapButtonActive
                          ? "#2E7D32"
                          : "rgba(46, 125, 50, 0.4)",
                        borderRadius: "10px",
                        border: swapButtonActive ? "2px solid #2E7D32" : "",
                        fontWeight: "bold",
                        padding: "9px",
                        cursor: "pointer",
                        fontSize: "20px",
                        width: "200px",
                        textAlign: "center",
                        marginTop: "10px",
                        height: "27px",
                      }}
                      onClick={handleSwapButtonClick}
                    >
                      {selectedLanguageCode === "en" && "Swap"}
                      {selectedLanguageCode === "es" && `Intercambio`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
              {/*<img src={history} style={{height: '39px', width: '39px'}} onClick={toggleShowTransactionHistory}/>*/}
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  style={{ width: "180px", height: "auto", marginTop: "15px" }}
                  src={myfyeWallet}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  width: "100vw",
                  height: "65vh",
                  flexDirection: "column",
                  marginTop: "30px",
                }}
              >
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "0 0 20px 20px",
                    boxShadow:
                      "2px 5px 15px rgba(0, 0, 0, 0.2), -2px 5px 15px rgba(0, 0, 0, 0.2), 0px -32px 48px rgba(0, 0, 0, 0.4)",
                    padding: "10px",
                    paddingBottom: "20px",
                    width: "90vw",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  {/* Tabs */}
                  <div
                    style={{
                      display: "flex",
                      position: "absolute",
                      top: "-38px",
                      left: "0",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        padding: "10px 20px",
                        borderRadius: "20px 20px 0 0",
                        background: "#ffffff",
                        color: "#222222",
                        cursor: "pointer",
                        marginRight: "5px",
                        flex: 1,
                      }}
                      onClick={() => setcurrencySelected("usd")}
                    >
                      <div
                        style={{
                          textAlign: "center",
                          color:
                            currencySelected === "usd" ? "#2E7D32" : "#222222",
                          fontSize: "20px",
                          fontWeight: "bold",
                        }}
                      >
                        U.S. Dollar
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "10px 20px",
                        borderRadius: "20px 20px 0 0",
                        background: "#ffffff",
                        color: "#222222",
                        cursor: "pointer",
                        flex: 1,
                      }}
                      onClick={() => setcurrencySelected("eur")}
                    >
                      <div
                        style={{
                          textAlign: "center",
                          color:
                            currencySelected === "eur" ? "#2E7D32" : "#222222",
                          fontSize: "20px",
                          fontWeight: "bold",
                        }}
                      >
                        Euro
                      </div>
                    </div>
                  </div>

                  <hr
                    style={{
                      border: "none",
                      height: "1.5px",
                      backgroundColor: "#BBBBBB",
                      borderRadius: "10px",
                    }}
                  />

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
                        flexDirection: "column",
                      }}
                    >
                      {/* Content inside the tile */}
                      <div style={{ marginTop: "30px" }}>
                        {currencySelected === "usd" && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-around",
                              width: "100%",
                              minWidth: "240px",
                            }}
                          >
                            <label
                              style={{
                                fontSize: "20px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              USD$ Balance: $
                              <span style={{ fontSize: "30px" }}>
                                <div>
                                  {(usdcSolBalance + usdtSolBalance)
                                    .toFixed(2)
                                    .toLocaleString("en-US")}
                                </div>
                              </span>
                            </label>
                          </div>
                        )}
                        {currencySelected === "eur" && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-around",
                              width: "100%",
                              minWidth: "240px",
                            }}
                          >
                            <label
                              style={{
                                fontSize: "20px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              EUR€ Balance: €
                              <span style={{ fontSize: "30px" }}>
                                <div>
                                  {eurcSolBalance
                                    .toFixed(2)
                                    .toLocaleString("en-US")}
                                </div>
                              </span>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    {/*
   <Deposit/>
    <Withdraw/>
           <HoldingsPortfolio/>
  */}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-around",
                        marginTop: "20px",
                        width: "95vw",
                      }}
                    >
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
                        onClick={handleDepositButtonClick}
                      >
                        {selectedLanguageCode === "en" && `Deposit`}
                        {selectedLanguageCode === "es" && `Déposito`}
                      </div>
                      <div
                        style={{
                          color: "#ffffff",
                          background: "#2E7D32", // gray '#999999',
                          borderRadius: "10px",
                          border: "2px solid #2E7D32",
                          fontWeight: "bold",
                          padding: "9px",
                          cursor: "pointer",
                          fontSize: "20px",
                          width: "120px",
                          textAlign: "center",
                        }}
                        onClick={handleWithdrawButtonClick}
                      >
                        {selectedLanguageCode === "en" && `Withdraw`}
                        {selectedLanguageCode === "es" && `Retirar`}
                      </div>
                    </div>

                    <div
                      style={{
                        color: "#ffffff",
                        background: "#2E7D32", // gray '#999999',
                        borderRadius: "10px",
                        border: "2px solid #2E7D32",
                        fontWeight: "bold",
                        padding: "9px",
                        cursor: "pointer",
                        fontSize: "20px",
                        width: "200px",
                        textAlign: "center",
                        marginTop: "10px",
                      }}
                      onClick={toggleShowSwapPopup}
                    >
                      {selectedLanguageCode === "en" &&
                        currencySelected === "eur" &&
                        "Swap to U.S. Dollars"}
                      {selectedLanguageCode === "en" &&
                        currencySelected === "usd" &&
                        "Swap to Euros"}
                      {selectedLanguageCode === "es" && `Intercambio`}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    color: "#ffffff",
                    background: "#2E7D32", // gray '#999999',
                    borderRadius: "10px",
                    border: "2px solid #2E7D32",
                    fontWeight: "bold",
                    padding: "9px",
                    cursor: "pointer",
                    fontSize: "20px",
                    width: "180px",
                    textAlign: "center",
                  }}
                  onClick={toggleShowWalletInfoPopup}
                >
                  {selectedLanguageCode === "en" && `Wallet Info`}
                  {selectedLanguageCode === "es" && `Información De Billetera`}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <WalletTransactions />
          </div>
        )}
      </div>
    </div>
  );
}
export default WalletPage;
