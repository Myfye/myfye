import React, { useState, useEffect } from "react";
import menuIcon from "../../../assets/menuIcon.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { swap } from "../../../features/swap/SwapService.tsx";
import { useDispatch } from "react-redux";
import {
  setusdcSolValue,
  setusdtSolValue,
  setSwapDepositTransactionStatus,
  settotalInvestingValue,
  setShowSwapDepositPage,
  setpyusdSolValue,
  seteurcSolValue,
  setShouldShowBottomNav,
  setusdySolValue,
  setbtcSolValue,
} from "../../../redux/userWalletData.tsx";
import LoadingAnimation from "../../../components/LoadingAnimation.tsx";
import backButton from "../../../assets/backButton3.png";
import solIcon from "../../../assets/solIcon.png";
import usdcSol from "../../../assets/usdcSol.png";
import usdtSol from "../../../assets/usdtSol.png";
import eurcSol from "../../../assets/eurcSol.png";
import { getFunctions, httpsCallable } from "firebase/functions";
import FailImage from "../../../assets/FailImage.png";
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  addDoc,
} from "firebase/firestore";
import GetUserTransactionsEnabled from "../../../functions/GetUserTransactionsEnabled.tsx";

import { useSolanaWallets } from "@privy-io/react-auth/solana";

function SwapDeposit() {
  const MINIMUM_DEPOSIT_VALUE = 0.01;

  const functions = getFunctions();
  const db = getFirestore();

  const showMenu = useSelector(
    (state: any) => state.userWalletData.showSwapDepositPage
  );

  const primaryWallet = null; //to do get the wallet
  const user = null; //to do get the user

  const [networkSelected, setNetworkSelected] = useState("solana");
  const [currencySelected, setcurrencySelected] = useState("");
  const [balanceSelectedInUSD, setbalanceSelectedInUSD] = useState(0);
  const priceOfUSDYinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfUSDYinUSDC
  );
  const priceOfBTCinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfBTCinUSDC
  );
  const [menuPosition, setMenuPosition] = useState("-110vh");
  const pieChartOpacity = useSelector(
    (state: any) => state.userWalletData.pieChartOpacity
  );
  const usdcSolBalance = useSelector(
    (state: any) => state.userWalletData.usdcSolBalance
  );
  const usdtSolBalance = useSelector(
    (state: any) => state.userWalletData.usdtSolBalance
  );
  const pyusdSolBalance = useSelector(
    (state: any) => state.userWalletData.pyusdSolBalance
  );
  const busdSolBalance = useSelector(
    (state: any) => state.userWalletData.busdSolBalance
  );
  const usdcEthBalance = useSelector(
    (state: any) => state.userWalletData.usdcEthBalance
  );
  const usdtEthBalance = useSelector(
    (state: any) => state.userWalletData.usdtEthBalance
  );
  const busdEthBalance = useSelector(
    (state: any) => state.userWalletData.busdEthBalance
  );
  const usdySolBalance = useSelector(
    (state: any) => state.userWalletData.usdySolBalance
  );
  const eurcSolBalance = useSelector(
    (state: any) => state.userWalletData.eurcSolBalance
  );
  const depositWithdrawProductType = useSelector(
    (state: any) => state.userWalletData.depositWithdrawProductType
  );
  const selectedLanguageCode = useSelector(
    (state: any) => state.userWalletData.selectedLanguageCode
  );
  const [usdyQuoteOutput, setusdyQuoteOutput] = useState(0);
  const btcSolBalance = useSelector(
    (state: any) => state.userWalletData.btcSolBalance
  );

  const walletName = useSelector((state: any) => state.userWalletData.type);

  const [animateShowAddressUsdcSol, setanimateShowAddressUsdcSol] =
    useState(false);
  const [animateShowAddressUsdtSol, setanimateShowAddressUsdtSol] =
    useState(false);
  const [animateShowAddressEurcSol, setanimateShowAddressEurcSol] =
    useState(false);
  const [animateShowAddressPyusdSol, setanimateShowAddressPyusdSol] =
    useState(false);

  const [solanaWalletConnected, setsolanaWalletConnected] = useState(false);
  const [ethereumWalletConnected, setethereumWalletConnected] = useState(false);

  const dispatch = useDispatch();
  const [depositButtonActive, setDepositButtonActive] = useState(false);
  const transactionStatus = useSelector(
    (state: any) => state.userWalletData.swapDepositTransactionStatus
  );
  const [deposit, setDeposit] = useState("");
  const [selectedDepositPortion, setselectedDepositPortion] = useState("");
  const cryptoList = useSelector(
    (state: any) => state.userWalletData.cryptoList
  );
  const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
  const connectedWallets = useSelector(
    (state: any) => state.userWalletData.connectedWallets
  );
  const initialPrincipal = useSelector(
    (state: any) => state.userWalletData.initialPrincipal
  );
  const initialInvestmentDate = useSelector(
    (state: any) => state.userWalletData.initialInvestmentDate
  );
  const principalHistory = useSelector(
    (state: any) => state.userWalletData.principalInvestedHistory
  );
  const principalInvested = useSelector(
    (state: any) => state.userWalletData.principalInvested
  );
  const [errorMessageOpacity, setErrorMessageOpacity] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageColor, setErrorMessageColor] = useState("#A90900");
  const [depositInProgress, setDepositInProgress] = useState(false);
  const navigate = useNavigate();
  const [newDepositAmount, setnewDepositAmount] = useState(0);

  const { wallets } = useSolanaWallets();

  //wallets[0].signTransaction()

  useEffect(() => {
    if (showMenu) {
      setMenuPosition("0"); // Bring the menu into view
      window.scrollTo(0, 0);
    } else {
      setMenuPosition("-110vh"); // Move the menu off-screen

      if (usdcSolBalance >= MINIMUM_DEPOSIT_VALUE && usdtSolBalance < 0.01) {
        setcurrencySelected("usdcSol");
        setbalanceSelectedInUSD(usdcSolBalance);
      } else if (
        usdtSolBalance >= MINIMUM_DEPOSIT_VALUE &&
        usdcSolBalance < 0.01
      ) {
        setcurrencySelected("usdtSol");
        setbalanceSelectedInUSD(usdtSolBalance);
      } else {
        setcurrencySelected("");
      }
    }
  }, [showMenu]);

  const handleMenuClick = () => {
    // Add your logic here for what happens when the menu is clicked
    console.log("Selected currency: ", currencySelected);

    dispatch(setShouldShowBottomNav(true));
    if (!showMenu) {
      dispatch(setShowSwapDepositPage(false));
    } else {
      if (depositInProgress) {
        // Do nothing
      } else {
        dispatch(setSwapDepositTransactionStatus(""));
        dispatch(setShowSwapDepositPage(false));
      }
    }
  };

  useEffect(() => {
    if (transactionStatus === "Signed") {
      setErrorMessage(
        selectedLanguageCode === "es"
          ? "Intercambio, por favor espera"
          : "Swapping, Please Wait"
      );
      setErrorMessageColor("#60A05B");
    }
    if (transactionStatus === "Success") {
      handleBalanceIsUpdating()
        .then((message) => {
          setErrorMessage(
            selectedLanguageCode === "es" ? "¡Éxito!" : "Success!"
          );
          setErrorMessageColor("#60A05B");
          // The following two lines of code are different types of balances
          updateUserBalance(); // Update the stable coin balance already
          setTimeout(() => {
            setDepositInProgress(false);
            setErrorMessage("");
            dispatch(setShowSwapDepositPage(false));
            //dispatch(setShouldShowBottomNav(true)) // Need to show bottom nav again
          }, 1500);
        })
        .catch((error) => {
          console.error(error);
          setErrorMessage(
            selectedLanguageCode === "es"
              ? "Estamos teniendo un pequeño problema al procesar su depósito. Por favor, espere 10 minutos antes de contactar al servicio de atención al cliente."
              : "We are having a little trouble processing your deposit. Please give it 10 minutes before reaching out to customer support."
          );
          setErrorMessageColor("#000000");
        });
    } else if (transactionStatus === "Fail") {
      setErrorMessage(
        selectedLanguageCode === "es"
          ? "La transacción falló, por favor intente de nuevo"
          : "Swap failed, please try again"
      );
      setErrorMessageColor("#000000");
      setDepositInProgress(false);
    }
  }, [transactionStatus]);

  const handleDepositChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDeposit = event.target.value;
    if (newDeposit.length == 1 && newDeposit[0] != "$") {
      setDeposit(newDeposit);
    } else {
      setDeposit(newDeposit);
    }
    setselectedDepositPortion("");
    checkForDepositFieldComplete(newDeposit);
  };

  const checkForDepositFieldComplete = (newDeposit: string) => {
    const cleanedDeposit = newDeposit.replace(/[\s$,!#%&*()A-Za-z]/g, "");
    const depositToNumber = Number(cleanedDeposit);

    if (!isNaN(depositToNumber) && depositToNumber >= MINIMUM_DEPOSIT_VALUE) {
      if (depositToNumber <= balanceSelectedInUSD) {
        setDepositButtonActive(true);
        setErrorMessage("");
      } else {
        setDepositButtonActive(false);
        setErrorMessage(
          selectedLanguageCode === "es"
            ? "Saldo insuficiente"
            : "Insufficient balance"
        );
        setErrorMessageColor("#222222");
      }
    } else {
      setDepositButtonActive(false);
      setErrorMessage(
        selectedLanguageCode === "es"
          ? "El depósito mínimo es de $1"
          : "The minimum deposit is $1"
      );
      setErrorMessageColor("#222222");
    }
    if (depositToNumber > 30) {
      setDepositButtonActive(false);
      setErrorMessage(
        selectedLanguageCode === "es"
          ? "El depósito máximo es de $30"
          : "The maximum deposit is $30"
      );
      setErrorMessageColor("#222222");
    }
  };

  const handleQuarterButtonClick = () => {
    if (balanceSelectedInUSD > 0.0001) {
      const newDeposit = (0.25 * balanceSelectedInUSD)
        .toFixed(2)
        .toString()
        .replace(/\.?0+$/, "");
      console.log("Setting deposit to:", newDeposit); // Added logging
      setDeposit(newDeposit);
      checkForDepositFieldComplete(String(newDeposit));
    }
    setselectedDepositPortion("25%");
  };

  const handleHalfButtonClick = () => {
    if (balanceSelectedInUSD > 0.0001) {
      const newDeposit = (0.5 * balanceSelectedInUSD)
        .toFixed(2)
        .toString()
        .replace(/\.?0+$/, "");
      console.log("Setting deposit to:", newDeposit); // Added logging
      setDeposit(newDeposit);
      checkForDepositFieldComplete(String(newDeposit));
    }
    setselectedDepositPortion("50%");
  };

  const handleTwoThirdsButtonClick = () => {
    if (balanceSelectedInUSD > 0.0001) {
      const newDeposit = (0.75 * balanceSelectedInUSD)
        .toFixed(2)
        .toString()
        .replace(/\.?0+$/, "");
      console.log("Setting deposit to:", newDeposit); // Added logging
      setDeposit(newDeposit);
      checkForDepositFieldComplete(String(newDeposit));
    }
    setselectedDepositPortion("75%");
  };

  const handleAllButtonClick = () => {
    if (balanceSelectedInUSD > 0.0001) {
      const newDeposit = (Math.floor(balanceSelectedInUSD * 100) / 100)
        .toFixed(2)
        .toString()
        .replace(/\.?0+$/, "");
      console.log("Setting deposit to:", newDeposit); // Added logging
      setDeposit(newDeposit);
      checkForDepositFieldComplete(String(newDeposit));
    }
    setselectedDepositPortion("100%");
  };

  const handleCurrencySelection = (currency: string) => {
    switch (currency) {
      case "usdcSol":
        if (usdcSolBalance < MINIMUM_DEPOSIT_VALUE) {
          copyAddressFor(usdcSol);
          document
            .getElementById("usdcSol")
            ?.classList.add("animate-close-open");
          document
            .getElementById("usdcSolLabel")
            ?.classList.add("animate-fade-in-out");
          setTimeout(() => {
            setanimateShowAddressUsdcSol(true);
          }, 1000);

          setTimeout(() => {
            document
              .getElementById("usdcSol")
              ?.classList.remove("animate-close-open");
            document
              .getElementById("usdcSolLabel")
              ?.classList.remove("animate-fade-in-out");
            setanimateShowAddressUsdcSol(false);
          }, 5000);
        } else {
          setbalanceSelectedInUSD(usdcSolBalance);
          setcurrencySelected(currency);
        }
        break;
      case "eurcSol":
        if (eurcSolBalance < MINIMUM_DEPOSIT_VALUE) {
          copyAddressFor(eurcSol);
          document
            .getElementById("eurcSol")
            ?.classList.add("animate-close-open");
          document
            .getElementById("eurcSolLabel")
            ?.classList.add("animate-fade-in-out");
          setTimeout(() => {
            setanimateShowAddressEurcSol(true);
          }, 1000);

          setTimeout(() => {
            document
              .getElementById("eurcSol")
              ?.classList.remove("animate-close-open");
            document
              .getElementById("eurcSolLabel")
              ?.classList.remove("animate-fade-in-out");
            setanimateShowAddressEurcSol(false);
          }, 5000);
        } else {
          setbalanceSelectedInUSD(eurcSolBalance);
          setcurrencySelected(currency);
        }
        break;
      case "pyusdSol":
        if (pyusdSolBalance < MINIMUM_DEPOSIT_VALUE) {
          copyAddressFor("pyusdSol");
          document
            .getElementById("pyusdSol")
            ?.classList.add("animate-close-open");
          document
            .getElementById("pyusdSolLabel")
            ?.classList.add("animate-fade-in-out");
          setTimeout(() => {
            setanimateShowAddressPyusdSol(true);
          }, 1000);

          setTimeout(() => {
            document
              .getElementById("pyusdSol")
              ?.classList.remove("animate-close-open");
            document
              .getElementById("pyusdSolLabel")
              ?.classList.remove("animate-fade-in-out");
            setanimateShowAddressPyusdSol(false);
          }, 5000);
        } else {
          setbalanceSelectedInUSD(pyusdSolBalance);
          setcurrencySelected(currency);
        }
        break;
      case "usdtSol":
        if (usdtSolBalance < MINIMUM_DEPOSIT_VALUE) {
          copyAddressFor(usdtSol);
          document
            .getElementById("usdtSol")
            ?.classList.add("animate-close-open");
          document
            .getElementById("usdtSolLabel")
            ?.classList.add("animate-fade-in-out");
          setTimeout(() => {
            setanimateShowAddressUsdtSol(true);
          }, 1000);

          setTimeout(() => {
            document
              .getElementById("usdtSol")
              ?.classList.remove("animate-close-open");
            document
              .getElementById("usdtSolLabel")
              ?.classList.remove("animate-fade-in-out");
            setanimateShowAddressUsdtSol(false);
          }, 5000);
        } else {
          setbalanceSelectedInUSD(usdtSolBalance);
          setcurrencySelected(currency);
        }
        break;
      default:
        console.log("Unknown currency selected");
    }
  };

  const copyAddressFor = (currency: string) => {
    navigator.clipboard
      .writeText(publicKey)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text to clipboard", err);
      });
  };

  const handleNetworkSelection = (network: string) => {
    setNetworkSelected(network);
  };

  const handleDepositButtonClick = async () => {
    if (depositButtonActive) {
      let depositToNumber = 0.0;
      const isTransactionsEnabled = true; // to do block some users
      if (!newDepositAmount) {
        const cleanedDeposit = deposit.replace(/[\s$,!#%&*()A-Za-z]/g, "");
        depositToNumber = Number(cleanedDeposit);
        setnewDepositAmount(depositToNumber);
      } else {
        depositToNumber = newDepositAmount;
      }

      if (isNaN(depositToNumber)) {
        setErrorMessage("Invalid amount");
        setErrorMessageColor("#A90900");
      } else if (depositToNumber > balanceSelectedInUSD) {
        setErrorMessage("Insufficient balance");
        setErrorMessageColor("#A90900");
      } else if (depositToNumber < MINIMUM_DEPOSIT_VALUE) {
        setErrorMessage(`Minimum: $${MINIMUM_DEPOSIT_VALUE}`);
        setErrorMessageColor("#A90900");
      } else if (!isTransactionsEnabled) {
        setErrorMessageColor("#222222");
        if (selectedLanguageCode == "es") {
          setErrorMessage(
            "Transacciones deshabilitadas, comuníquese con el soporte de Myfye"
          );
        } else {
          setErrorMessage(
            "Transactions disabled, please contact Myfye support"
          );
        }
      } else {
        setDeposit("");
        setDepositInProgress(true);
        setErrorMessageColor("#60A05B");
        setErrorMessage("Check your wallet");
        const convertToSmallestDenomination =
          depositToNumber * 10 * 10 * 10 * 10 * 10 * 10;
        setDepositButtonActive(false); // Deactivate button here

        console.log("connectedWallets", connectedWallets);
        console.log("walletName: ", walletName);

        console.log("Requesting new transaction");

        const inputAmount: number = convertToSmallestDenomination;
        const inputCurrency: string = currencySelected;
        let outputCurrency: string = "";

        console.log(
          "Current depositWithdrawProductType:",
          depositWithdrawProductType
        );

        if (depositWithdrawProductType == "Earn") {
          outputCurrency = "usdySol";
        } else if (depositWithdrawProductType == "Crypto") {
          outputCurrency = "btcSol";
        }

        const wallet = wallets[0];

        const signDepositSuccess = await swap(
          wallet,
          publicKey,
          inputAmount,
          inputCurrency!,
          outputCurrency!,
          dispatch,
          "deposit"
        );
      }
    }
  };

  const updateUserBalance = () => {
    const newUSDBalance = balanceSelectedInUSD - newDepositAmount;

    if (depositWithdrawProductType == "Earn") {
      const newUSDYBalance =
        usdySolBalance + newDepositAmount / priceOfUSDYinUSDC;
      console.log("setting new usdy balance", newUSDYBalance);
      dispatch(setusdySolValue(newUSDYBalance));
    } else if (depositWithdrawProductType == "Crypto") {
      const newBTCBalance = btcSolBalance + newDepositAmount / priceOfBTCinUSDC;
      console.log("setting new btc balance", newBTCBalance);
      dispatch(setbtcSolValue(newBTCBalance));
    }

    console.log("setting new usdc balance", newUSDBalance);
    if (currencySelected == "usdcSol") {
      dispatch(setusdcSolValue(newUSDBalance));
    } else if (currencySelected == "usdtSol") {
      dispatch(setusdtSolValue(newUSDBalance));
    } else if (currencySelected == "pyusdSol") {
      dispatch(setpyusdSolValue(newUSDBalance));
    } else if (currencySelected == "eurcSol") {
      dispatch(seteurcSolValue(newUSDBalance));
    }
  };

  function goBackButtonPressed() {
    dispatch(setSwapDepositTransactionStatus(""));
  }

  function tryAgainButtonPressed() {
    setDepositButtonActive(true);
    dispatch(setSwapDepositTransactionStatus(""));
    handleDepositButtonClick();
  }

  async function handleBalanceIsUpdating() {
    const pubKeyDocRef = doc(db, "pubKeys", publicKey);

    const transactionsCollectionRef = collection(db, "earnTransactions");
    try {
      console.log(
        "saving update with micro usd amount",
        newDepositAmount * 1000000
      );

      if (depositWithdrawProductType == "Earn") {
        const quote = await getSwapQuote();
        const newUSDYBalance =
          Number(usdySolBalance) + Number(quote.outAmount / 1000000);

        setusdyQuoteOutput(quote.outAmount / 1000000);

        await setDoc(
          pubKeyDocRef,
          {
            updatingBalance: true,
            hotBalanceUSDY: newUSDYBalance,
          },
          { merge: true }
        );
      }

      let transactionType = "";

      if (depositWithdrawProductType == "Earn") {
        transactionType = "deposit";
      } else if (depositWithdrawProductType == "Crypto") {
        transactionType = "cryptoDeposit";
      }

      const docRef = await addDoc(transactionsCollectionRef, {
        type: transactionType,
        time: new Date().toISOString(),
        amount: newDepositAmount,
        currency: currencySelected,
        publicKey: publicKey,
      });

      console.log("Saved to database!");
      return "Update saved successfully"; // Resolve with a message or useful data
    } catch (error) {
      console.log("Error saving update balance", error);
      throw new Error("Failed to save update: " + error); // Reject the promise with an error
    }
  }

  async function getSwapQuote() {
    const inputMintAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC mint
    const outputMintAddress = "A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6"; // USDY mint

    const quoteResponse = await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMintAddress}&amount=${
        newDepositAmount * 1000000
      }&slippageBps=50`
    ).then((response) => response.json());

    return quoteResponse;
  }

  const errorLabelText = () => {
    if (errorMessage) {
      return (
        <div>
          <label
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto",
              marginTop: "15px",
              fontSize: "18px",
              color: errorMessageColor,
              textAlign: "center",
            }}
          >
            {errorMessage}
          </label>
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
              marginTop: "15px",
              fontSize: "18px",
            }}
          >
            $
          </label>
        </div>
      );
    }
  };

  const styles = {
    tradeTimeframeButtonRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 10px",
      gap: "10px",
      fontWeight: "bold",
    },
    button: {
      flex: 1,
      padding: "5px",
      paddingTop: "12px",
      paddingBottom: "12px",
      backgroundColor: "white",
      color: "#444444",
      borderRadius: "4px",
      border: "2px solid #444444",
      fontSize: "14px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    selectedButton: {
      flex: 1,
      padding: "5px",
      paddingTop: "12px",
      paddingBottom: "12px",
      backgroundColor: "#444444",
      color: "white",
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: "bold",
      border: "2px solid #444444",
    },
  };

  return (
    <div style={{ backgroundColor: "white", overflowX: "hidden" }}>
      {showMenu && (
        <div
          style={{
            position: "absolute", // Position it relative to the viewport
            top: 0, // Align to the top of the viewport
            left: 0, // Align to the right of the viewport
            marginTop: "15px",
            marginLeft: "15px",
            cursor: "pointer",
            zIndex: 10,
            overflowX: "hidden", // Add some padding for spacing from the edges
          }}
        >
          {!depositInProgress ? (
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
          ) : (
            <div
              style={{
                width: "45px",
                height: "45px",
                backgroundColor: "white",
                zIndex: 10,
                border: "none",
              }}
            />
          )}
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: menuPosition,
          left: 0, // Use state variable for position
          paddingTop: "15px",
          height: "calc(100svh)",
          backgroundColor: "white",
          width: "100vw",
          transition: "top 0.5s ease", // Animate the left property
          zIndex: 4,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "-15px",
          }}
        >
          <div style={{ marginTop: "0px", fontSize: "45px", color: "#222222" }}>
            {selectedLanguageCode === "en" && `Deposit`}
            {selectedLanguageCode === "es" && `Déposito`}
          </div>
        </div>

        {depositInProgress && (
          <div
            style={{
              marginBottom: "15px",
              display: "flex",
              flexDirection: "column",
              marginTop: "20px",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "-15px",
            }}
          >
            <LoadingAnimation />
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "20px",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "-15px",
          }}
        >
          <div style={{ width: "85vw" }}>
            {transactionStatus == "Fail" && (
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "60px",
                  }}
                >
                  <img
                    src={FailImage}
                    style={{ width: "60px", height: "60px" }}
                  ></img>
                  <div>{errorLabelText()}</div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        background: "#DDDDDD",
                        color: "#000000",
                        padding: "10px",
                        borderRadius: "5px",
                        marginTop: "90px",
                        width: "70px",
                        textAlign: "center",
                        flex: "1",
                        marginRight: "15px",
                        cursor: "pointer",
                      }}
                      onClick={goBackButtonPressed}
                    >
                      Go Back
                    </div>

                    <div
                      style={{
                        background: "#86EA6E",
                        color: "#000000",
                        padding: "10px",
                        borderRadius: "5px",
                        marginTop: "90px",
                        width: "70px",
                        textAlign: "center",
                        flex: "1",
                        marginLeft: "15px",
                        cursor: "pointer",
                      }}
                      onClick={tryAgainButtonPressed}
                    >
                      Try Again
                    </div>
                  </div>
                </div>
              </div>
            )}

            {transactionStatus != "Fail" && (
              <div style={{ color: "#222222" }}>
                {principalInvested >= 0.01 ? (
                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "25px",
                      opacity: depositInProgress ? 0 : 1,
                    }}
                  >
                    Increase your return
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "25px",
                      opacity: depositInProgress ? 0 : 1,
                    }}
                  >
                    {depositWithdrawProductType === "Crypto" && (
                      <>
                        {selectedLanguageCode === "en" &&
                          `Hold your own Bitcoin`}
                        {selectedLanguageCode === "es" &&
                          `Sostén tu propio bitcoin`}
                      </>
                    )}

                    {depositWithdrawProductType === "Earn" && (
                      <>
                        {selectedLanguageCode === "en" &&
                          `Start saving... safely`}
                        {selectedLanguageCode === "es" &&
                          `Empieza a ahorrar... de forma segura`}
                      </>
                    )}
                  </div>
                )}

                {currencySelected ? (
                  <div>
                    {!depositInProgress && (
                      <div>
                        <div
                          style={{
                            marginBottom: "15px",
                            display: "flex",
                            flexDirection: "column",
                            marginTop: "30px",
                          }}
                        >
                          <label
                            htmlFor="deposit"
                            style={{
                              fontSize: "20px",
                              color: "#222222",
                              marginBottom: "15px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            ${" "}
                            <span style={{ fontSize: "35px" }}>
                              {currencySelected == "usdcSol" && usdcSolBalance}
                              {currencySelected == "usdtSol" && usdtSolBalance}
                              {currencySelected == "pyusdSol" &&
                                pyusdSolBalance}
                              {currencySelected == "eurcSol" && eurcSolBalance}

                              {currencySelected == "usdcEth" && usdcEthBalance}
                              {currencySelected == "usdtEth" && usdtEthBalance}
                              {currencySelected == "busdEth" && busdEthBalance}
                            </span>
                            <div style={{ marginLeft: "5px" }}>
                              {currencySelected == "usdcSol" && <>USDC</>}
                              {currencySelected == "usdtSol" && <>USDT</>}
                              {currencySelected == "pyusdSol" && <>PYUSD</>}
                              {currencySelected == "eurcSol" && <>EURC</>}

                              {currencySelected == "usdcEth" && <>USDC</>}
                              {currencySelected == "usdtEth" && <>USDT</>}
                              {currencySelected == "busdEth" && <>BUSD</>}
                            </div>
                            <img
                              src={
                                networkSelected === "solana" ? solIcon : solIcon
                              }
                              alt={
                                networkSelected === "ethereum"
                                  ? "Ethereum Logo"
                                  : "Solana Logo"
                              }
                              style={{
                                height: "20px",
                                width: "auto",
                                marginLeft: "-5px",
                                padding: "10px 7px",
                                borderRadius: "5px",
                                marginRight: "3px",
                              }}
                            />
                          </label>

                          <input
                            id="deposit"
                            type="number"
                            inputMode="decimal" // or 'numeric'
                            autoComplete="off"
                            value={deposit}
                            onChange={handleDepositChange}
                            onInput={handleDepositChange}
                            style={{
                              backgroundColor: "#EEEEEE", // Slightly lighter gray
                              color: "#222222",
                              fontSize: "20px",
                              border: "none", // Remove the border
                              borderRadius: "5px", // Rounded edges
                              padding: "10px 10px", // Adjust padding as needed
                            }}
                            placeholder="0"
                          />
                        </div>

                        <div style={styles.tradeTimeframeButtonRow}>
                          <button
                            style={
                              selectedDepositPortion === "25%"
                                ? styles.selectedButton
                                : styles.button
                            }
                            onClick={handleQuarterButtonClick}
                          >
                            25%
                          </button>
                          <button
                            style={
                              selectedDepositPortion === "50%"
                                ? styles.selectedButton
                                : styles.button
                            }
                            onClick={handleHalfButtonClick}
                          >
                            50%
                          </button>
                          <button
                            style={
                              selectedDepositPortion === "75%"
                                ? styles.selectedButton
                                : styles.button
                            }
                            onClick={handleTwoThirdsButtonClick}
                          >
                            75%
                          </button>
                          <button
                            style={
                              selectedDepositPortion === "100%"
                                ? styles.selectedButton
                                : styles.button
                            }
                            onClick={handleAllButtonClick}
                          >
                            100%
                          </button>
                        </div>
                      </div>
                    )}

                    {errorLabelText()}

                    {!depositInProgress ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <button
                          style={{
                            backgroundColor: depositButtonActive
                              ? "#03A9F4"
                              : "#D1E5F4",
                            color: depositButtonActive ? "white" : "#CCCCCC",
                            padding: "10px 20px",
                            fontSize: "25px",
                            marginTop: "40px",
                            fontWeight: "bold",
                            textAlign: "center",
                            borderRadius: "10px",
                            border: "1px solid transparent",
                            cursor: "pointer",
                            width: "100%",
                          }}
                          onClick={handleDepositButtonClick}
                        >
                          {selectedLanguageCode === "en" && `Invest`}
                          {selectedLanguageCode === "es" && `Invertir`}
                        </button>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-evenly",
                          marginTop: "25px",
                          fontSize: "25px",
                          cursor: "pointer",
                        }}
                      >
                        <div></div>
                      </div>

                      <div style={{ marginTop: "25px" }}>
                        {networkSelected == "solana" && (
                          <div>
                            {!currencySelected && (
                              <>
                                {pyusdSolBalance +
                                  usdcSolBalance +
                                  usdtSolBalance <
                                MINIMUM_DEPOSIT_VALUE ? (
                                  <>
                                    <div
                                      style={{
                                        paddingBottom: "15px",
                                        color: "#2E7D32",
                                      }}
                                    >
                                      Minimum investment: $
                                      {MINIMUM_DEPOSIT_VALUE}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      style={{
                                        paddingBottom: "15px",
                                        color: "#2E7D32",
                                      }}
                                    >
                                      Minimum investment: $
                                      {MINIMUM_DEPOSIT_VALUE}
                                    </div>
                                  </>
                                )}
                              </>
                            )}

                            {animateShowAddressUsdcSol &&
                            !solanaWalletConnected ? (
                              <>
                                <div
                                  id="usdcSol"
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between", // This will put maximum space between the main items
                                    marginLeft: "10px",
                                    padding: "15px",
                                    boxShadow:
                                      "0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)",
                                    borderRadius: "10px",
                                    marginBottom: "15px",
                                    width: "80vw",
                                  }}
                                  onClick={() =>
                                    handleCurrencySelection("usdcSol")
                                  }
                                >
                                  {/* Grouping image and "USDC" together in a div */}
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <img
                                      id="usdcSolIcon"
                                      src={usdcSol}
                                      style={{ width: "70px", height: "auto" }}
                                    />
                                    <div
                                      id="usdcSolTicker"
                                      style={{ marginLeft: "15px" }}
                                    >
                                      USDC
                                    </div>{" "}
                                    {/* Adjust marginLeft as needed */}
                                  </div>

                                  <div
                                    id="usdcSolLabel"
                                    style={{
                                      maxWidth: "100px",
                                      textAlign: "center",
                                    }}
                                  >
                                    Add a Solana Wallet
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div
                                  id="usdcSol"
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between", // This will put maximum space between the main items
                                    marginLeft: "10px",
                                    padding: "15px",
                                    boxShadow:
                                      "0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)",
                                    borderRadius: "10px",
                                    marginBottom: "15px",
                                    width: "80vw",
                                  }}
                                  onClick={() =>
                                    handleCurrencySelection("usdcSol")
                                  }
                                >
                                  {/* Grouping image and "USDC" together in a div */}
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <img
                                      id="usdcSolIcon"
                                      src={usdcSol}
                                      style={{ width: "70px", height: "auto" }}
                                    />
                                    <div
                                      id="usdcSolTicker"
                                      style={{ marginLeft: "15px" }}
                                    >
                                      USDC
                                    </div>{" "}
                                    {/* Adjust marginLeft as needed */}
                                  </div>

                                  <div id="usdcSolLabel">
                                    {animateShowAddressUsdcSol ? (
                                      <div>
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                          }}
                                        >
                                          <div style={{ marginLeft: "10px" }}>
                                            Address Copied &#10003;
                                          </div>
                                          <div style={{ fontWeight: "bold" }}>
                                            {publicKey.length >= 6
                                              ? `${publicKey.substring(
                                                  0,
                                                  3
                                                )}...`
                                              : publicKey}
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div style={{ marginRight: "15px" }}>
                                        ${usdcSolBalance}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}

                            {animateShowAddressUsdtSol &&
                            !solanaWalletConnected ? (
                              <>
                                <div
                                  id="usdtSol"
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between", // This will put maximum space between the main items
                                    marginLeft: "10px",
                                    padding: "15px",
                                    boxShadow:
                                      "0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)",
                                    borderRadius: "10px",
                                    marginBottom: "15px",
                                    width: "80vw",
                                  }}
                                  onClick={() =>
                                    handleCurrencySelection("usdtSol")
                                  }
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <img
                                      id="usdtSolIcon"
                                      src={usdtSol}
                                      style={{ width: "70px", height: "auto" }}
                                    />
                                    <div
                                      id="usdtSolTicker"
                                      style={{ marginLeft: "15px" }}
                                    >
                                      USDT
                                    </div>{" "}
                                    {/* Adjust marginLeft as needed */}
                                  </div>

                                  <div
                                    id="usdtSolLabel"
                                    style={{
                                      maxWidth: "100px",
                                      textAlign: "center",
                                    }}
                                  >
                                    Add a Solana Wallet
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div
                                  id="usdtSol"
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between", // This will put maximum space between the main items
                                    marginLeft: "10px",
                                    padding: "15px",
                                    boxShadow:
                                      "0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)",
                                    borderRadius: "10px",
                                    marginBottom: "15px",
                                    width: "80vw",
                                  }}
                                  onClick={() =>
                                    handleCurrencySelection("usdtSol")
                                  }
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <img
                                      id="usdtSolIcon"
                                      src={usdtSol}
                                      style={{ width: "70px", height: "auto" }}
                                    />
                                    <div
                                      id="usdtSolTicker"
                                      style={{ marginLeft: "15px" }}
                                    >
                                      USDT
                                    </div>{" "}
                                    {/* Adjust marginLeft as needed */}
                                  </div>

                                  <div id="usdtSolLabel">
                                    {animateShowAddressUsdtSol ? (
                                      <div>
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                          }}
                                        >
                                          <div style={{ marginLeft: "10px" }}>
                                            Address Copied &#10003;
                                          </div>
                                          <div style={{ fontWeight: "bold" }}>
                                            {publicKey.length >= 6
                                              ? `${publicKey.substring(
                                                  0,
                                                  3
                                                )}...`
                                              : publicKey}
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div style={{ marginRight: "15px" }}>
                                        ${usdtSolBalance}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}

                            {animateShowAddressEurcSol &&
                            !solanaWalletConnected ? (
                              <>
                                <div
                                  id="eurcSol"
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between", // This will put maximum space between the main items
                                    marginLeft: "10px",
                                    padding: "15px",
                                    boxShadow:
                                      "0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)",
                                    borderRadius: "10px",
                                    marginBottom: "15px",
                                    width: "80vw",
                                  }}
                                  onClick={() =>
                                    handleCurrencySelection("eurcSol")
                                  }
                                >
                                  {/* Grouping image and "USDC" together in a div */}
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <img
                                      id="eurcSolIcon"
                                      src={usdcSol}
                                      style={{ width: "70px", height: "auto" }}
                                    />
                                    <div
                                      id="eurcSolTicker"
                                      style={{ marginLeft: "15px" }}
                                    >
                                      EURC
                                    </div>{" "}
                                    {/* Adjust marginLeft as needed */}
                                  </div>

                                  <div
                                    id="eurcSolLabel"
                                    style={{
                                      maxWidth: "100px",
                                      textAlign: "center",
                                    }}
                                  >
                                    Add a Solana Wallet
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div
                                  id="eurcSol"
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between", // This will put maximum space between the main items
                                    marginLeft: "10px",
                                    padding: "15px",
                                    boxShadow:
                                      "0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)",
                                    borderRadius: "10px",
                                    marginBottom: "15px",
                                    width: "80vw",
                                  }}
                                  onClick={() =>
                                    handleCurrencySelection("eurcSol")
                                  }
                                >
                                  {/* Grouping image and "USDC" together in a div */}
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <img
                                      id="eurcSolIcon"
                                      src={usdcSol}
                                      style={{ width: "70px", height: "auto" }}
                                    />
                                    <div
                                      id="eurcSolTicker"
                                      style={{ marginLeft: "15px" }}
                                    >
                                      EURC
                                    </div>{" "}
                                    {/* Adjust marginLeft as needed */}
                                  </div>

                                  <div id="eurcSolLabel">
                                    {animateShowAddressEurcSol ? (
                                      <div>
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                          }}
                                        >
                                          <div style={{ marginLeft: "10px" }}>
                                            Address Copied &#10003;
                                          </div>
                                          <div style={{ fontWeight: "bold" }}>
                                            {publicKey.length >= 6
                                              ? `${publicKey.substring(
                                                  0,
                                                  3
                                                )}...`
                                              : publicKey}
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div style={{ marginRight: "15px" }}>
                                        ${eurcSolBalance}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SwapDeposit;
