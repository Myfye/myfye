import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import LoadingAnimation from "../../components/sunset/LoadingAnimation.tsx";
import backButton from "../../assets/backButton3.png";
import {
  getFunctions,
  httpsCallable,
  HttpsCallableResult,
} from "firebase/functions";
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  getDoc,
  addDoc,
  arrayUnion,
} from "firebase/firestore";
import {
  setShowSendPage,
  setShouldShowBottomNav,
  setusdcSolValue,
  setusdtSolValue,
  seteurcSolValue,
} from "../../redux/userWalletData.tsx";
import usdcSol from "../../assets/usdcSol.png";
import usdtSol from "../../assets/usdtSol.png";
import pyusdSol from "../../assets/pyusdSol.png";
import eurcSol from "../../assets/eurcSol.png";
import { tokenTransfer } from "../../functions/Transaction.tsx";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import User from "../../functions/UserInterface.tsx";

function SendPage() {
  const functions = getFunctions();
  const db = getFirestore();
  const [errorMessage, setErrorMessage] = useState("");
  const showSendPage = useSelector(
    (state: any) => state.userWalletData.showSendPage
  );
  const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
  const [selectedPortion, setselectedPortion] = useState("");
  const [menuPosition, setMenuPosition] = useState("-130vh");
  const usdcSolBalance = useSelector(
    (state: any) => state.userWalletData.usdcSolBalance
  );
  const usdtSolBalance = useSelector(
    (state: any) => state.userWalletData.usdtSolBalance
  );
  const pyusdSolBalance = useSelector(
    (state: any) => state.userWalletData.pyusdSolBalance
  );
  const eurcSolBalance = useSelector(
    (state: any) => state.userWalletData.eurcSolBalance
  );
  const selectedContact = useSelector(
    (state: any) => state.userWalletData.selectedContact
  );
  const users = useSelector((state: any) => state.userWalletData.users);
  const [sendButtonActive, setSendButtonActive] = useState(false);
  const [sendInProgress, setSendInProgress] = useState(false);
  const [addressText, setAddressText] = useState("");
  const [amountText, setAmountText] = useState("");
  const [stableCoinBalance, setStableCoinBalance] = useState(0);
  const currentUserEmail = useSelector(
    (state: any) => state.userWalletData.currentUserEmail
  );
  const currentUserFirstName = useSelector(
    (state: any) => state.userWalletData.currentUserFirstName
  );
  const [currencySelected, setcurrencySelected] = useState("usdcSol");
  const walletName = useSelector((state: any) => state.userWalletData.type);
  const userEmail = useSelector(
    (state: any) => state.userWalletData.currentUserEmail
  );
  const [sendingToSelectedContact, setSendingToSelectedConact] =
    useState(false);
  const dispatch = useDispatch();
  const selectedLanguageCode = useSelector(
    (state: any) => state.userWalletData.selectedLanguageCode
  );
  const { wallets } = useSolanaWallets();

  useEffect(() => {
    if (usdtSolBalance > usdcSolBalance && usdtSolBalance > eurcSolBalance) {
      setStableCoinBalance(usdtSolBalance);
      setcurrencySelected("usdtSol");
    } else if (eurcSolBalance > usdcSolBalance) {
      setStableCoinBalance(eurcSolBalance);
      setcurrencySelected("eurcSol");
    } else {
      setStableCoinBalance(usdcSolBalance);
      setcurrencySelected("usdcSol");
    }
  }, [usdcSolBalance, usdtSolBalance, eurcSolBalance]);

  useEffect(() => {
    console.log("users!", users);
  }, [users]);

  useEffect(() => {
    console.log("selectedContactEmail", selectedContact);
    if (selectedContact) {
      if (typeof selectedContact === "string") {
        setAddressText(selectedContact);
      } else {
        setAddressText(`@${selectedContact?.username!}`);
      }
    } else {
      setAddressText("");
    }
  }, [selectedContact]);

  useEffect(() => {
    if (showSendPage) {
      setMenuPosition("0"); // Bring the menu into view
    } else {
      setMenuPosition("-130vh"); // Move the menu off-screen
    }
  }, [showSendPage]);

  const handleMenuClick = () => {
    console.log("handle menu click");
    dispatch(setShouldShowBottomNav(true));
    dispatch(setShowSendPage(!showSendPage));
    setAddressText("");
  };

  useEffect(() => {
    const preventPullToRefresh = (e: TouchEvent) => {
      if (e.touches && e.touches.length === 1 && e.touches[0].screenY > 50) {
        e.preventDefault();
      }
    };

    if (sendInProgress) {
      // Add the touchmove event listener when the function is running
      document.addEventListener("touchmove", preventPullToRefresh, {
        passive: false,
      });
    }

    return () => {
      // Remove the touchmove event listener when the function is not running
      document.removeEventListener("touchmove", preventPullToRefresh);
    };
  }, [sendInProgress]);

  const handleQuarterButtonClick = () => {
    console.log("Handling button click", stableCoinBalance);
    if (stableCoinBalance > 0.0001) {
      const newDeposit = (0.25 * stableCoinBalance)
        .toFixed(2)
        .toString()
        .replace(/\.?0+$/, "");
      console.log("Setting deposit to:", newDeposit); // Added logging
      setAmountText(`${newDeposit}`);
      checkForValidInput(addressText, newDeposit);
    } else {
      setAmountText("$ 0.0");
    }
    setselectedPortion("25%");
  };

  const handleHalfButtonClick = () => {
    console.log("Handling button click", stableCoinBalance);
    if (stableCoinBalance > 0.0001) {
      const newDeposit = (0.5 * stableCoinBalance)
        .toFixed(2)
        .toString()
        .replace(/\.?0+$/, "");
      console.log("Setting deposit to:", newDeposit); // Added logging
      setAmountText(`${newDeposit}`);
      checkForValidInput(addressText, newDeposit);
    } else {
      setAmountText("$ 0.0");
    }
    setselectedPortion("50%");
  };

  const handleTwoThirdsButtonClick = () => {
    console.log("Handling button click", stableCoinBalance);
    if (stableCoinBalance > 0.0001) {
      const newDeposit = (0.75 * stableCoinBalance)
        .toFixed(2)
        .toString()
        .replace(/\.?0+$/, "");
      console.log("Setting deposit to:", newDeposit); // Added logging
      setAmountText(`${newDeposit}`);
      checkForValidInput(addressText, newDeposit);
    } else {
      setAmountText("$ 0.0");
    }
    setselectedPortion("75%");
  };

  const handleAllButtonClick = () => {
    console.log("Handling button click", stableCoinBalance);
    if (stableCoinBalance > 0.0001) {
      const newDeposit = (Math.floor(stableCoinBalance * 100) / 100)
        .toFixed(2)
        .toString()
        .replace(/\.?0+$/, "");
      console.log("Setting deposit to:", newDeposit); // Added logging
      setAmountText(`${newDeposit}`);
      checkForValidInput(addressText, newDeposit);
    } else {
      setAmountText("$ 0.0");
    }
    setselectedPortion("100%");
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = event.target.value;
    setAddressText(newAddress.toLowerCase());
    checkForValidInput(newAddress, amountText);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = event.target.value;
    setAmountText(newAmount);
    checkForValidInput(addressText, newAmount);
  };

  const removeWhitespace = (str: string) => {
    return str.replace(/\s/g, "");
  };

  const checkForValidInput = (newAddress: string, newAmount: string) => {
    const preCleanedAmount = newAmount.replace(/[\s$,!#%&*()A-Za-z]/g, "");
    const cleanedAmount = removeWhitespace(preCleanedAmount);
    const amountToNumber = Number(cleanedAmount);
    const cleanedAddress = removeWhitespace(newAddress);
    const cleanedPhoneNumber = removeWhitespace(cleanedAddress).replace(
      /[-()]/g,
      ""
    );
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phoneRegex = /^\d{10}$/;

    const isValidEmailAddress = emailRegex.test(cleanedAddress);
    const isValidPhoneNumber = phoneRegex.test(cleanedPhoneNumber);

    if (selectedContact && newAddress.startsWith("@")) {
      // Selected contact
      setSendButtonActive(true);
      setErrorMessage("");
      setSendingToSelectedConact(true);
    } else if (cleanedAmount === "" || cleanedAddress === "") {
      setSendButtonActive(false);
      setErrorMessage("Please fill in all fields");
      setSendingToSelectedConact(false);
    } else if (!isValidEmailAddress && !isValidPhoneNumber) {
      setSendButtonActive(false);
      setErrorMessage("Please enter a valid email address or phone number");
      setSendingToSelectedConact(false);
    } else if (isNaN(amountToNumber) && amountToNumber < 0.00001) {
      setSendButtonActive(false);
      setErrorMessage("Please enter a valid number");
      setSendingToSelectedConact(false);
    } else if (amountToNumber > stableCoinBalance) {
      setSendButtonActive(false);
      setErrorMessage("Insufficient balance");
      setSendingToSelectedConact(false);
    } else {
      setSendButtonActive(true);
      setErrorMessage("");
    }
  };

  const handleSendButtonClick = async () => {
    if (sendButtonActive) {
      // to do: use isTransactionsEnabled
      const isTransactionsEnabled = true;

      if (isTransactionsEnabled) {
        const cleanedAddress = removeWhitespace(addressText);
        const cleanedAmount = amountText.replace(/[\s$,!#%&*()A-Za-z]/g, "");
        const amountToNumber = Number(cleanedAmount);
        const cleanedPhoneNumber = removeWhitespace(addressText).replace(
          /[-()]/g,
          ""
        );
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const phoneRegex = /^\d{10}$/;

        const isValidEmailAddress = emailRegex.test(cleanedAddress);
        const isValidPhoneNumber = phoneRegex.test(cleanedPhoneNumber);

        let dataType = "";
        let receiverData = "";

        if (!isValidEmailAddress && isValidPhoneNumber) {
          // sending by phone number
          dataType = "phone";
          receiverData = cleanedPhoneNumber;
        } else if (isValidEmailAddress && !isValidPhoneNumber) {
          // sending by email
          dataType = "email";
          receiverData = cleanedAddress;
        } else if (!sendingToSelectedContact) {
          setErrorMessage("Problem with address or phone number input");
          return;
        }

        if (isNaN(amountToNumber)) {
          if (selectedLanguageCode == "es") {
            setErrorMessage("Cantidad no válida");
          } else {
            setErrorMessage("Invalid amount");
          }
        } else if (amountToNumber > stableCoinBalance) {
          if (selectedLanguageCode == "es") {
            setErrorMessage("Saldo insuficiente");
          } else {
            setErrorMessage("Insufficient balance");
          }
        } else if (amountToNumber < 0.001) {
          if (selectedLanguageCode == "es") {
            setErrorMessage("Mínimo: $0.001");
          } else {
            setErrorMessage("Minimum: $0.001");
          }
        } else {
          setSendInProgress(true);
          if (selectedLanguageCode == "es") {
            setErrorMessage("Revisa tu billetera.");
          } else {
            setErrorMessage("Check your wallet");
          }
          const convertToSmallestDenomination =
            amountToNumber * 10 * 10 * 10 * 10 * 10 * 10;
          setSendButtonActive(false); // Deactivate button here
          console.log("Requesting new transaction");

          const wallet = wallets[0];

          if (sendingToSelectedContact) {
            const transactionSuccess = await tokenTransfer(
              publicKey,
              cleanedAddress,
              convertToSmallestDenomination,
              currencySelected,
              wallet
            );

            console.log("Got transaction status: ", transactionSuccess);
            if (transactionSuccess) {
              sendPhoneText(
                currentUserFirstName,
                cleanedPhoneNumber,
                amountToNumber
              );
              const updateTransactionsPromise = saveTransaction(
                amountToNumber,
                `${selectedContact.firstName} ${selectedContact.lastName}`
              );
              await Promise.all([updateTransactionsPromise]);

              setErrorMessage(`Sent to ${addressText}!`);

              if (currencySelected == "usdcSol") {
                dispatch(
                  setusdcSolValue(
                    parseFloat((usdcSolBalance - amountToNumber).toFixed(6))
                  )
                );
              } else if (currencySelected == "usdtSol") {
                dispatch(
                  setusdtSolValue(
                    parseFloat((usdtSolBalance - amountToNumber).toFixed(6))
                  )
                );
              } else if (currencySelected == "eurcSol") {
                dispatch(
                  seteurcSolValue(
                    parseFloat((eurcSolBalance - amountToNumber).toFixed(6))
                  )
                );
              }

              setTimeout(() => {
                setSendInProgress(false);
                setErrorMessage("");
                dispatch(setShouldShowBottomNav(true));
              }, 2000);
            } else {
              setSendInProgress(false);
              if (selectedLanguageCode == "es") {
                setErrorMessage(
                  "Lo sentimos, hubo un error con tu transacción. Por favor inténtalo de nuevo más tarde."
                );
              } else {
                setErrorMessage(
                  "Sorry, there was an error with your transaction. Please try again."
                );
              }
            }
          } else {
            // to do get a privy user
            // get the potential matches
            // const users = await getDynamicUsers(receiverData, dataType);

            let locatedUser: User | null = null;

            if (dataType == "email") {
              locatedUser = await findUserWithEmail(cleanedAddress);
            }

            /*else if (dataType == 'phone') {
          locatedUser =  await cleanDynamicUserDataWithPhone(users, cleanedAddress);
        }
          */

            /*
        If there is a myfye user with this email or phone number, send to 
        their public key, else send to the server address and send the user 
        an email ot text letting them know that they have money on MyFye. 
        When the users comes to make an account, send them the money.
        */

            let receiverPublicKey;

            if (locatedUser) {
              for (const linkedAccount of locatedUser.linked_accounts) {
                if (
                  linkedAccount["type"] == "wallet" &&
                  isValidSolanaAddress(linkedAccount["address"])
                ) {
                  receiverPublicKey = linkedAccount["address"];
                  break;
                }
              }
            } else {
              // to do pre generate a wallet
              console.log("Not located user");
              setErrorMessage(`Creating a new wallet for ${cleanedAddress}`);
              receiverPublicKey = await pregenerateUserAndReturnPublicKey(
                cleanedAddress
              ); // Take an email and make a new user
            }

            console.log("Sending to: ", receiverPublicKey);
            const transactionSuccess = await tokenTransfer(
              publicKey,
              receiverPublicKey,
              convertToSmallestDenomination,
              currencySelected,
              wallet
            );

            console.log("Got transaction status: ", transactionSuccess);
            if (transactionSuccess) {
              if (dataType == "email") {
                sendEmail(currentUserFirstName, cleanedAddress, amountToNumber);
                const updateTransactionsPromise = saveTransaction(
                  amountToNumber,
                  cleanedAddress
                );
                const updateContactsPromise = saveEmailContact(cleanedAddress);
                await Promise.all([
                  updateTransactionsPromise,
                  updateContactsPromise,
                ]);
              } else if (dataType == "phone") {
                sendPhoneText(
                  currentUserFirstName,
                  cleanedPhoneNumber,
                  amountToNumber
                );
                const updateTransactionsPromise = saveTransaction(
                  amountToNumber,
                  cleanedPhoneNumber
                );
                const updateContactsPromise =
                  savePhoneContact(cleanedPhoneNumber);
                await Promise.all([
                  updateTransactionsPromise,
                  updateContactsPromise,
                ]);
              }
              setSendInProgress(false);

              /*
          if (receiverPublicKey == 'DR5s8mAdygzmHihziLzDBwjuux1R131ydAG2rjYhpAmn') {
            // save the user's balance that doe not have an account yet
            saveUncreatedUserBalance(cleanedAddress, amountToNumber)
          }
            */

              setErrorMessage("");
              // this is a rough workaround to save the change to redux and reload the page
              setTimeout(
                () => setErrorMessage(`Sent USD to ${addressText}`),
                30
              );
            } else {
              setSendInProgress(false);
              setErrorMessage(
                "Sorry, there was an error with your transaction. Please try again."
              );
            }
          }
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
    }
  };

  async function pregenerateUserAndReturnPublicKey(emailAddress) {
    try {
      const pregenerateUserFn = httpsCallable(
        functions,
        "pregeneratePrivyUser"
      );

      const result = await pregenerateUserFn({
        emailAddress: emailAddress,
      });

      console.log("pregenerate result", result);

      // Extract linkedAccounts from response data
      const linkedAccounts = (result.data as any)?.linkedAccounts || [];

      // Find the wallet account
      const walletAccount = linkedAccounts.find(
        (account) => account.type === "wallet"
      );

      if (walletAccount) {
        console.log("Wallet Public Key:", walletAccount.address);
        return walletAccount.address;
      } else {
        console.warn("No wallet account found");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const getDynamicUsers = async (receiverData: string, dataType: string) => {
    const getUserDataFn = httpsCallable(functions, "getDynamicUsers");

    return getUserDataFn({ receiverData: receiverData, dataType: dataType })
      .then((result) => {
        // Assuming the result follows the structure { data: { users: User[] } }
        const usersData = result as HttpsCallableResult<{ users: User[] }>;
        console.log("usersData", usersData);
        return usersData.data; // This returns { data: { users: User[] } }
      })
      .catch((error) => {
        console.error("Failed to fetch user data", error);
        throw error; // Rethrow to handle it outside or indicate failure
      });
  };

  const findUserWithEmail = async (sendToEmail: string) => {
    if (users) {
      console.log("finding", sendToEmail, "in", users);
      for (const user of users) {
        let foundEmail = false;
        let solanaWalletCreated = false;
        for (const linkedAccount of user.linked_accounts) {
          console.log(
            "checking linkedAccount['address']",
            linkedAccount["address"]
          );
          if (
            linkedAccount["type"] == "email" &&
            linkedAccount["address"] == sendToEmail
          ) {
            foundEmail = true;
          }
          if (
            linkedAccount["type"] == "wallet" &&
            isValidSolanaAddress(linkedAccount["address"])
          ) {
            solanaWalletCreated = true;
          }
        }
        if (foundEmail && solanaWalletCreated) {
          console.log("Found a user to send to ", user);
          return user;
        }
        foundEmail = false;
        solanaWalletCreated = false;
      }
      console.log("No matching user found");
      return null; // Optionally return null if no matching email is found
    } else {
      console.log("No user data available");
      return null; // Return null if data or users array is not valid
    }
  };

  /*
const cleanDynamicUserDataWithPhone = async (data: { users: User[] }, sendToPhoneNumber: string) => {
  if (data && data.users) {
    for (const user of data.users) {
      const phoneNumber = user.phoneNumber ?? "No email provided";
      const phoneCountryCode = user.phoneCountryCode ?? "No country code provided";
      const walletPublicKey = user.walletPublicKey ?? "No public key provided";
      if (sendToPhoneNumber === phoneNumber && walletPublicKey !== "No public key provided") {
        console.log(`phoneNumber: ${phoneNumber}, 
          Country code: ${phoneCountryCode}, 
          Wallet Public Key: ${walletPublicKey}`);
        return user;  // This will return the walletPublicKey from the function
      }
    }
    console.log("No matching user found");
    return null;  // Optionally return null if no matching email is found
  } else {
    console.log("No user data available");
    return null;  // Return null if data or users array is not valid
  }
};
*/

  const isValidSolanaAddress = (address: string): boolean => {
    try {
      // Check if the address is a string
      if (typeof address !== "string") {
        return false;
      }

      // Check length (base58 encoded addresses are 44 characters)
      if (address.length !== 44) {
        return false;
      }

      // Check if it contains only base58 characters (1-9, A-H, J-N, P-Z, a-k, m-z)
      const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
      return base58Regex.test(address);
    } catch {
      return false;
    }
  };

  const saveUncreatedUserBalance = async (email: string, amount: number) => {
    const contactCollectionRef = collection(db, "uncreatedUserBalances");
    const userBalanceDocRef = doc(contactCollectionRef, email); // Specify the document ID explicitly as email

    try {
      // Attempt to retrieve the existing document
      const docSnap = await getDoc(userBalanceDocRef);
      let newAmount = amount;

      if (docSnap.exists()) {
        // If document exists, retrieve current amount and add the new amount
        const currentData = docSnap.data();
        newAmount += currentData.amountInUSD;
        newAmount = parseFloat(newAmount.toFixed(6));
      }

      // Update or set the document with the new amount
      await setDoc(userBalanceDocRef, { amountInUSD: newAmount });

      console.log("saveUncreatedUserBalance successfully updated!");
    } catch (error) {
      console.error("Error accessing or updating document: ", error);
    }
  };

  const sendEmail = async (
    firstName: string,
    email: string,
    amount: number
  ) => {
    const functions = getFunctions();
    const sendEmailFn = httpsCallable(functions, "sendgridEmail");
    sendEmailFn({
      emailAddress: email,
      firstName: firstName,
      templateId: "d-01416b6dc85446b7baf63c535e2950e8",
      amount: `$${amount}`,
    })
      .then((result) => {
        // Read result of the Cloud Function.
        console.log(result);
      })
      .catch((error) => {
        // Getting the Error details.
        console.log(error);
      });
  };

  const sendPhoneText = async (
    firstName: string,
    phoneNumber: string,
    amount: number
  ) => {
    const functions = getFunctions();

    const message = `${firstName} paid you $${amount} with Myfye! Hop on to https://myfye.com to claim this cash. Don't know why you are receiving this message? Don't worry, you can safely ignore it.`;
    const sendTextMessageFn = httpsCallable(functions, "sendTextMessage");
    sendTextMessageFn({ message: message, phoneNumber: phoneNumber })
      .then((result) => {
        // Read result of the Cloud Function.
        console.log(result);
      })
      .catch((error) => {
        // Getting the Error details.
        console.log(error);
      });
  };

  async function saveTransaction(amount: number, address: string) {
    const transactionsCollectionRef = collection(db, "payTransactions");
    try {
      console.log("saving transaction");

      const docRef = await addDoc(transactionsCollectionRef, {
        type: "deposit",
        time: new Date().toISOString(),
        amount: amount,
        currency: currencySelected,
        publicKey: publicKey,
        receiverEmail: address,
        senderEmail: userEmail,
      });

      console.log("Saved to database!", docRef);
      return "Update saved successfully"; // Resolve with a message or useful data
    } catch (error) {
      console.log("Error saving update balance", error);
      throw new Error("Failed to save update: " + error); // Reject the promise with an error
    }
  }

  async function saveEmailContact(sendToAddress: string) {
    /*
  Perform a write every time
  even if the contacts already know eachother
  TO DO:
  make it more efficient
  */
    const contactCollectionRef = collection(db, "contacts");
    const contactDocRef = doc(contactCollectionRef, currentUserEmail);
    const updateContactOne = await setDoc(
      contactDocRef,
      {
        emails: arrayUnion(sendToAddress),
      },
      { merge: true }
    );

    const contactDocRefTwo = doc(contactCollectionRef, sendToAddress);
    const updateContactTwo = await setDoc(
      contactDocRefTwo,
      {
        emails: arrayUnion(currentUserEmail),
      },
      { merge: true }
    );

    await Promise.all([updateContactOne, updateContactTwo]);
  }

  async function savePhoneContact(sendToAddress: string) {
    /*
  Perform a write every time
  even if the contacts already know eachother
  TO DO:
  make it more efficient
  */
    const contactCollectionRef = collection(db, "contacts");
    const contactDocRef = doc(contactCollectionRef, currentUserEmail);
    const updateContactOne = await setDoc(
      contactDocRef,
      {
        phoneNumbers: arrayUnion(sendToAddress),
      },
      { merge: true }
    );

    const contactDocRefTwo = doc(contactCollectionRef, sendToAddress);
    const updateContactTwo = await setDoc(
      contactDocRefTwo,
      {
        phoneNumbers: arrayUnion(currentUserEmail),
      },
      { merge: true }
    );

    await Promise.all([updateContactOne, updateContactTwo]);
  }

  const styles = {
    tradeTimeframeButtonRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 10px",
      gap: "10px",
    },
    button: {
      flex: 1,
      padding: "5px",
      paddingTop: "12px",
      paddingBottom: "12px",
      backgroundColor: "white",
      color: "#333333",
      border: "1px solid #333333",
      borderRadius: "4px",
      fontSize: "14px",
      cursor: "pointer",
    },
    selectedButton: {
      flex: 1,
      padding: "5px",
      paddingTop: "12px",
      paddingBottom: "12px",
      backgroundColor: "#333333",
      color: "white",
      border: "none",
      borderRadius: "4px",
      fontSize: "16px",
    },
  };

  const errorLabelText = () => {
    if (errorMessage) {
      const color = "#000000";
      return (
        <div>
          <label
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto",
              marginTop: "15px",
              fontSize: "17px",
              color: color,
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
              fontSize: "17px",
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
      {showSendPage && !sendInProgress && (
        <div
          style={{
            position: "absolute", // Position it relative to the viewport
            top: 0, // Align to the top of the viewport
            left: 0, // Align to the right of the viewport
            marginTop: "15px",
            marginLeft: "15px",
            cursor: "pointer",
            zIndex: 20,
            overflowX: "hidden", // Add some padding for spacing from the edges
          }}
        >
          <img
            style={{ width: "auto", height: "35px", background: "white" }}
            src={backButton}
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
          padding: "15px",
          height: "97vh",
          backgroundColor: "white",
          transition: "top 0.5s ease", // Animate the left property
          zIndex: 4,
          overflow: "hidden",
        }}
      >
        <div style={{ width: "93vw", marginTop: "0px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{ marginTop: "0px", fontSize: "35px", color: "#222222" }}
            >
              {selectedLanguageCode === "en" && `Send`}
              {selectedLanguageCode === "es" && `Enviar`}
            </div>
          </div>

          {sendInProgress ? (
            <div
              style={{
                marginBottom: "15px",
                display: "flex",
                flexDirection: "column",
                marginTop: "20px",
                alignItems: "center",
              }}
            >
              <LoadingAnimation />

              {errorLabelText()}

              <div style={{ marginTop: "30px" }}>
                {selectedLanguageCode === "en" && `Please wait...`}
                {selectedLanguageCode === "es" && `Espere por favor...`}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginTop: "60px", fontSize: "25px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "80vw",
                  }}
                >
                  {stableCoinBalance > 0.01 ? (
                    <div>
                      {selectedLanguageCode === "en" && `Balance`}
                      {selectedLanguageCode === "es" && `Balance`}: $
                      {stableCoinBalance.toFixed(2).toLocaleString()}
                    </div>
                  ) : (
                    <div>Balance: $0.00</div>
                  )}
                  {currencySelected == "usdtSol" && (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <div style={{ fontSize: "15px" }}>USDT</div>
                        <img
                          style={{
                            width: "auto",
                            height: "30px",
                            background: "white",
                            marginTop: "3px",
                          }}
                          src={usdtSol}
                          onClick={handleMenuClick}
                          alt="Exit"
                        />
                      </div>
                    </div>
                  )}
                  {currencySelected == "usdcSol" && (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <div style={{ fontSize: "15px" }}>USDC</div>
                        <img
                          style={{
                            width: "auto",
                            height: "30px",
                            background: "white",
                            marginTop: "3px",
                          }}
                          src={usdcSol}
                          onClick={handleMenuClick}
                          alt="Exit"
                        />
                      </div>
                    </div>
                  )}
                  {currencySelected == "pyusdSol" && (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "5px",
                          justifyContent: "center",
                        }}
                      >
                        <div style={{ fontSize: "15px" }}>PYUSD</div>
                        <img
                          style={{
                            width: "auto",
                            height: "30px",
                            background: "white",
                            marginTop: "3px",
                          }}
                          src={pyusdSol}
                          onClick={handleMenuClick}
                          alt="Exit"
                        />
                      </div>
                    </div>
                  )}
                  {currencySelected == "eurcSol" && (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <div style={{ fontSize: "15px" }}>EURC</div>
                        <img
                          style={{
                            width: "auto",
                            height: "30px",
                            background: "white",
                            marginTop: "3px",
                          }}
                          src={eurcSol}
                          onClick={handleMenuClick}
                          alt="Exit"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: "60px" }}>
                <div
                  style={{
                    marginBottom: "15px",
                    display: "flex",
                    flexDirection: "column",
                    opacity: sendInProgress ? "0" : "1",
                  }}
                >
                  <input
                    id="SolanaAddress"
                    type="text"
                    value={addressText}
                    onChange={handleAddressChange}
                    onInput={handleAddressChange}
                    style={{
                      backgroundColor: "#EEEEEE", // Slightly lighter gray
                      color: "#444444",
                      fontSize: "20px",
                      border: "none", // Remove the border
                      borderRadius: "5px", // Rounded edges
                      padding: "10px 10px", // Adjust padding as needed
                    }}
                    placeholder={
                      selectedLanguageCode === "es"
                        ? "Correo electrónico"
                        : "Email Address"
                    }
                  />
                </div>

                <div
                  style={{
                    marginBottom: "15px",
                    display: "flex",
                    flexDirection: "column",
                    opacity: sendInProgress ? "0" : "1",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      fontSize: "20px",
                      transform: "translateY(+37%) translateX(+70%)",
                      color: "#444444",
                    }}
                  >
                    $
                  </span>
                  <input
                    id="USDAmount"
                    type="number"
                    value={amountText}
                    onChange={handleAmountChange}
                    onInput={handleAmountChange}
                    style={{
                      backgroundColor: "#EEEEEE", // Slightly lighter gray
                      color: "#444444",
                      fontSize: "20px",
                      border: "none", // Remove the border
                      borderRadius: "5px", // Rounded edges
                      padding: "10px 30px", // Adjust padding as needed
                    }}
                    placeholder="0"
                  />
                </div>

                <div style={{ opacity: sendInProgress ? "0" : "1" }}>
                  <div style={styles.tradeTimeframeButtonRow}>
                    <button
                      style={
                        selectedPortion === "25%"
                          ? styles.selectedButton
                          : styles.button
                      }
                      onClick={handleQuarterButtonClick}
                    >
                      25%
                    </button>
                    <button
                      style={
                        selectedPortion === "50%"
                          ? styles.selectedButton
                          : styles.button
                      }
                      onClick={handleHalfButtonClick}
                    >
                      50%
                    </button>
                    <button
                      style={
                        selectedPortion === "75%"
                          ? styles.selectedButton
                          : styles.button
                      }
                      onClick={handleTwoThirdsButtonClick}
                    >
                      75%
                    </button>
                    <button
                      style={
                        selectedPortion === "100%"
                          ? styles.selectedButton
                          : styles.button
                      }
                      onClick={handleAllButtonClick}
                    >
                      100%
                    </button>
                  </div>
                </div>

                {errorLabelText()}

                <button
                  style={{
                    backgroundColor: sendButtonActive ? "#03A9F4" : "#D1E5F4",
                    color: sendButtonActive ? "#222222" : "#CCCCCC",
                    opacity: sendInProgress ? "0" : "1",
                    display: "inline-block",
                    padding: "10px 20px",
                    fontSize: "25px",
                    marginTop: "30px",
                    fontWeight: "bold",
                    textAlign: "center",
                    borderRadius: "10px",
                    border: "1px solid transparent",
                    cursor: "pointer",
                    width: "100%",
                  }}
                  onClick={handleSendButtonClick}
                >
                  {selectedLanguageCode === "en" && `Send`}
                  {selectedLanguageCode === "es" && `Enviar`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SendPage;
