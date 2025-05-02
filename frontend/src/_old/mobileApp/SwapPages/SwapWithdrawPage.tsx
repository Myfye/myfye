import React, { useState, useEffect } from "react";
import menuIcon from "../../../assets/menuIcon.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import backButton from "../../../assets/backButton3.png";
import { getFunctions } from "firebase/functions";
import {
  setusdySolValue,
  setbtcSolValue,
  setusdcSolValue,
} from "../../../redux/userWalletData.tsx";
import { swap } from "../../../features/swap/SwapService.tsx";
import LoadingAnimation from "../../sunset/LoadingAnimation.tsx";
import {
  setShowSwapWithdrawPage,
  setSwapWithdrawTransactionStatus,
  setShouldShowBottomNav,
} from "../../../redux/userWalletData.tsx";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useSolanaWallets } from "@privy-io/react-auth/solana";

// TO DO: disabled transactions
// import {getUserTransactionsEnabled} from '../helpers/getUserData';

function SwapWithdraw() {
  const MINIMUM_VALUE = 0.01;
  const [withdrawalInProgress, setWithdrawalInProgress] = useState(false);
  const showMenu = useSelector(
    (state: any) => state.userWalletData.showSwapWithdrawPage
  );
  const db = getFirestore();
  const [feeAmountInUSD, setfeeAmountInUSD] = useState(0.1);
  const dispatch = useDispatch();
  const [currencySelected, setcurrencySelected] = useState("");
  const functions = getFunctions();
  const [menuPosition, setMenuPosition] = useState("-110vh");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageColor, setErrorMessageColor] = useState("#222222");
  const [withdrawalButtonActive, setWithdrawalButtonActive] = useState(false);
  const [confirmButtonActive, setconfirmButtonActive] = useState(false);
  const [reviewButtonClicked, setreviewButtonClicked] = useState(false);
  const [withdrawal, setWithdrawal] = useState("");
  const priceOfUSDYinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfUSDYinUSDC
  );
  const priceOfBTCinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfBTCinUSDC
  );
  const [selectedWithdrawalPortion, setselectedWithdrawalPortion] =
    useState("");
  const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
  const usdyBalance = useSelector(
    (state: any) => state.userWalletData.usdySolBalance
  );
  const depositWithdrawProductType = useSelector(
    (state: any) => state.userWalletData.depositWithdrawProductType
  );
  const [shouldNotify, setShouldNotify] = useState(false);
  const transactionStatus = useSelector(
    (state: any) => state.userWalletData.swapWithdrawTransactionStatus
  );
  const btcSolBalance = useSelector(
    (state: any) => state.userWalletData.btcSolBalance
  );
  const selectedLanguageCode = useSelector(
    (state: any) => state.userWalletData.selectedLanguageCode
  );
  const { wallets } = useSolanaWallets();
  const usdcSolBalance = useSelector(
    (state: any) => state.userWalletData.usdcSolBalance
  );

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldNotify) {
        const message = "Hold on! We are almost done.";
        e.returnValue = message; // Legacy method for cross browser support
        return message; // For modern browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldNotify]);

  //default to 100% cash out
  useEffect(() => {
    if (depositWithdrawProductType == "Earn") {
      setWithdrawal(`${usdyBalance}`);
    } else if (depositWithdrawProductType == "Crypto") {
      setWithdrawal(`${btcSolBalance}`);
    }
    if (
      depositWithdrawProductType == "Earn" &&
      usdyBalance * priceOfUSDYinUSDC > MINIMUM_VALUE
    ) {
      setWithdrawalButtonActive(true);
    } else if (
      depositWithdrawProductType == "Crypto" &&
      btcSolBalance * priceOfBTCinUSDC > MINIMUM_VALUE
    ) {
      // hardcode BTC price
      setWithdrawalButtonActive(true);
    } else {
      setWithdrawalButtonActive(false);
    }
  }, [
    usdyBalance,
    btcSolBalance,
    depositWithdrawProductType,
    priceOfUSDYinUSDC,
    priceOfBTCinUSDC,
  ]);

  useEffect(() => {
    if (showMenu) {
      setMenuPosition("0"); // Bring the menu into view
      window.scrollTo(0, 0);
    } else {
      setMenuPosition("-110vh"); // Move the menu off-screen

      setcurrencySelected("");
    }
    console.log(priceOfBTCinUSDC);
  }, [showMenu]);

  useEffect(() => {
    if (transactionStatus === "Signed") {
      setErrorMessageColor("#60A05B");
      setErrorMessage("Swapping, Please Wait");
      if (selectedLanguageCode == "es") {
        setErrorMessage("Intercambio, por favor espera");
      } else {
        setErrorMessage("Swapping, Please Wait");
      }
      setErrorMessageColor("#60A05B");
    }

    if (transactionStatus === "Success") {
      updateUserBalance();
      setErrorMessageColor("#60A05B");
      if (selectedLanguageCode == "es") {
        setErrorMessage("Exito!");
      } else {
        setErrorMessage("Success!");
      }

      console.log(
        "Calling handleWithdrawal with pubKey: ",
        publicKey,
        " usdyBalance: ",
        usdyBalance
      );
      const cleanedWithdrawal = withdrawal.replace(/[\s$,!#%&*()A-Za-z]/g, "");
      const withdrawalToNumber = Number(cleanedWithdrawal);
      handleWithdrawSuccess(withdrawalToNumber);

      setTimeout(() => {
        setErrorMessage("");
        setconfirmButtonActive(false);
        setreviewButtonClicked(false);
        setWithdrawalInProgress(false);
        setWithdrawal("");
        setfeeAmountInUSD(0.1);
        handleMenuClick();
      }, 1500);
    }
    if (transactionStatus === "Fail") {
      if (selectedLanguageCode == "es") {
        setErrorMessage("La transacción falló, por favor inténtalo de nuevo.");
      } else {
        setErrorMessage("Swap Failed, Please Try Again");
      }
      setErrorMessageColor("#000000");
      setWithdrawalInProgress(false);
      setShouldNotify(false);
    }
  }, [transactionStatus]);

  const handleMenuClick = () => {
    // Add your logic here for what happens when the menu is clicked
    dispatch(setShouldShowBottomNav(true));
    setreviewButtonClicked(false);
    setconfirmButtonActive(false);
    dispatch(setShowSwapWithdrawPage(false));
    dispatch(setSwapWithdrawTransactionStatus(""));
    setErrorMessage("");
  };

  const handleCashOutButtonClick = async () => {
    console.log("Withdraw usdyBalance: ", usdyBalance);
    if (
      (depositWithdrawProductType == "Earn" &&
        usdyBalance * priceOfUSDYinUSDC >= MINIMUM_VALUE) ||
      (depositWithdrawProductType == "Crypto" &&
        btcSolBalance * priceOfBTCinUSDC >= MINIMUM_VALUE)
    ) {
      // TO DO: user transactions enabled
      // const isTransactionsEnabled = await getUserTransactionsEnabled(user!.userId!);
      const transactionsEnabled = true;
      if (transactionsEnabled) {
        let feeAmountNativeSmallestDenomination: number = 0;

        if (depositWithdrawProductType == "Earn") {
          feeAmountNativeSmallestDenomination = Math.round(
            (feeAmountInUSD / priceOfUSDYinUSDC) * 1e6
          );
        }

        if (depositWithdrawProductType == "Crypto") {
          feeAmountNativeSmallestDenomination = Math.round(
            (feeAmountInUSD / priceOfBTCinUSDC) * 1e8
          );
        }

        // update UI
        setErrorMessage("Check your wallet...");
        setErrorMessageColor("#60A05B");
        setWithdrawalInProgress(true);

        if (!isNaN(feeAmountNativeSmallestDenomination)) {
          let convertToSmallestDenomination = 0;
          if (depositWithdrawProductType == "Earn") {
            convertToSmallestDenomination = Math.round(usdyBalance * 1e6);
          } else if (depositWithdrawProductType == "Crypto") {
            convertToSmallestDenomination = Math.round(btcSolBalance * 1e8);
          }

          setShouldNotify(true);

          // inputAmount is total balance minus fee
          const inputAmount: number = convertToSmallestDenomination;

          let inputCurrency: String = "";
          if (depositWithdrawProductType == "Earn") {
            inputCurrency = "usdySol";
          } else if (depositWithdrawProductType == "Crypto") {
            inputCurrency = "btcSol";
          }
          const outputCurrency: String = "usdcSol";

          const wallet = wallets[0];

          console.log(
            "Calling swap with input amount",
            convertToSmallestDenomination
          );
          console.log(
            "Calling swap with input fee",
            feeAmountNativeSmallestDenomination
          );

          const signWithdrawalSuccess = await swap(
            wallet,
            publicKey,
            convertToSmallestDenomination,
            inputCurrency!,
            outputCurrency!,
            dispatch,
            "withdraw",
            feeAmountNativeSmallestDenomination
          );

          setShouldNotify(false);
        } else {
          setErrorMessage(
            "Error when processing fee, the amount may be too low, please contact support"
          );
          setErrorMessageColor("#000000");
          setWithdrawalInProgress(false);
        }
      } else {
        if (selectedLanguageCode == "es") {
          setErrorMessage(
            "Transacciones deshabilitadas, comuníquese con el soporte de Myfye"
          );
        } else {
          setErrorMessage(
            "Transactions disabled, please contact Myfye support"
          );
        }
      }
    } else {
      setErrorMessage(`Sorry, the minimum withdrawal is $${MINIMUM_VALUE}`);
      setWithdrawalInProgress(false);
    }
  };

  const handleWithdrawSuccess = async (withdrawalToNumber: number) => {
    const transactionsCollectionRef = collection(db, "earnTransactions");

    let transactionType = "";

    if (depositWithdrawProductType == "Earn") {
      transactionType = "withdrawal";
    } else if (depositWithdrawProductType == "Crypto") {
      transactionType = "cryptoWithdrawal";
    }

    let withdrawalAmount = withdrawalToNumber;

    if (depositWithdrawProductType == "Crypto") {
      withdrawalAmount = withdrawalToNumber * priceOfBTCinUSDC;
    }

    const docRef = await addDoc(transactionsCollectionRef, {
      type: transactionType,
      time: new Date().toISOString(),
      amount: withdrawalToNumber,
      currencySelected: "usdySol",
      publicKey: publicKey,
    });

    if (docRef) {
      // success ready to update UI
      // To Do nice animation for withdraw complete
    }
  };

  const updateUserBalance = () => {
    if (depositWithdrawProductType == "Earn") {
      const newUSDCBalance = usdcSolBalance + usdyBalance / priceOfUSDYinUSDC;

      console.log("Setting setusdySolValue to", 0);
      console.log("Setting susdcSolBalance to", newUSDCBalance);

      dispatch(setusdySolValue(0));
      dispatch(setusdcSolValue(newUSDCBalance));
    } else if (depositWithdrawProductType == "Crypto") {
      const newUSDCBalance = usdcSolBalance + btcSolBalance / priceOfBTCinUSDC;

      console.log("Setting setbtcSolValue to", 0);
      console.log("Setting susdcSolBalance to", newUSDCBalance);

      dispatch(setbtcSolValue(0));
      dispatch(setusdcSolValue(newUSDCBalance));
    }
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
    <div style={{ backgroundColor: "white", overflowX: "hidden" }}>
      {showMenu && (
        <div
          style={{
            position: "absolute", // Position it relative to the viewport
            top: 0, // Align to the top of the viewport
            left: 0, // Align to the right of the viewport
            padding: "15px",
            cursor: "pointer",
            zIndex: 20, // Add some padding for spacing from the edges
          }}
        >
          {!withdrawalInProgress ? (
            <>
              <img
                style={{ width: "auto", height: "35px", background: "white" }}
                src={
                  showMenu
                    ? currencySelected
                      ? backButton
                      : backButton
                    : menuIcon
                }
                onClick={handleMenuClick}
                alt="Exit"
              />
            </>
          ) : (
            <>
              <div
                style={{
                  width: "45px",
                  height: "45px",
                  backgroundColor: "white",
                  border: "none",
                }}
              ></div>
            </>
          )}
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: menuPosition,
          left: 0, // Use state variable for position
          paddingTop: "15px",
          height: "100dvh",
          backgroundColor: "white",
          width: "100vw",
          transition: "top 0.5s ease", // Animate the left property
          zIndex: 4,
        }}
      >
        <div style={{ padding: "15px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{ marginTop: "10px", fontSize: "35px", color: "#222222" }}
            >
              {selectedLanguageCode === "en" && `Withdraw`}
              {selectedLanguageCode === "es" && `Retirar`}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              height: "80vh",
            }}
          >
            <div>
              {withdrawalInProgress ? (
                <>
                  <div
                    style={{
                      marginBottom: "15px",
                      display: "flex",
                      flexDirection: "column",
                      marginTop: "20px",
                    }}
                  >
                    <LoadingAnimation />
                  </div>
                </>
              ) : (
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: "90px",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontSize: "18px", color: "black" }}>
                      {selectedLanguageCode === "en" && `Account Value: `}
                      {selectedLanguageCode === "es" && `Valor de la cuenta: `}

                      {depositWithdrawProductType === "Crypto" && (
                        <span>
                          ${" "}
                          {(btcSolBalance * priceOfBTCinUSDC)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </span>
                      )}

                      {depositWithdrawProductType === "Earn" && (
                        <span>
                          ${" "}
                          {(usdyBalance * priceOfUSDYinUSDC)
                            .toFixed(4)
                            .toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: "20px", display: "flex" }}>
                    {selectedLanguageCode === "en" && `Fee: `}
                    {selectedLanguageCode === "es" && `Tarifa: `}
                    <div>&nbsp;1%</div>
                    {/* feeAmountInUSD > 0 ? (<>
          $ {(feeAmountInUSD.toFixed(6).split('.')[0].toLocaleString() + '.' + feeAmountInUSD.toFixed(6).split('.')[1]).replace(/\.?0+$/, '')}
          </>) : (<></>) */}
                  </div>
                </div>
              )}

              {!withdrawalInProgress ? (
                <div>
                  {usdyBalance > 0.9 && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: "90px",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div style={{ marginLeft: "20px" }}>$ </div>

                      {depositWithdrawProductType === "Crypto" && (
                        <span>
                          <div style={{ fontSize: "36px" }}>
                            {(btcSolBalance * priceOfBTCinUSDC - feeAmountInUSD)
                              .toFixed(4)
                              .toLocaleString()}
                          </div>
                        </span>
                      )}

                      {depositWithdrawProductType === "Earn" && (
                        <span>
                          <div style={{ fontSize: "36px" }}>
                            {(usdyBalance * priceOfUSDYinUSDC - feeAmountInUSD)
                              .toFixed(4)
                              .toLocaleString()}
                          </div>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{}}></div>
              )}

              {errorLabelText()}
            </div>

            {withdrawalInProgress ? (
              <div></div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <button
                  style={{
                    backgroundColor: withdrawalButtonActive
                      ? "#03A9F4"
                      : "#D1E5F4",
                    color: withdrawalButtonActive ? "white" : "#CCCCCC",
                    padding: "10px 20px",
                    fontSize: "25px",
                    marginTop: "20px",
                    fontWeight: "bold",
                    textAlign: "center",
                    borderRadius: "10px",
                    border: "1px solid transparent",
                    cursor: "pointer",
                    width: "80vw",
                  }}
                  onClick={handleCashOutButtonClick}
                >
                  {selectedLanguageCode === "en" && `Cash Out`}
                  {selectedLanguageCode === "es" && `Retiro De Efectivo`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SwapWithdraw;
