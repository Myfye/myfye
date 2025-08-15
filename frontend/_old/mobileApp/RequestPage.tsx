import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import backButton from '../../assets/backButton3.png';
import { getFunctions, httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { getFirestore, doc, 
  collection, setDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { setShowRequestPage, setShouldShowBottomNav } from '../../redux/userWalletData.tsx';

function RequestPage() {

    const functions = getFunctions();
    const db = getFirestore();
    const [errorMessage, setErrorMessage] = useState('');
    const showRequestPage = useSelector((state: any) => state.userWalletData.showRequestPage);
    const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
    const [selectedPortion, setselectedPortion] = useState('');
    const [menuPosition, setMenuPosition] = useState('-130vh'); 
    const usdcSolBalance = useSelector((state: any) => state.userWalletData.usdcSolBalance);
    const usdtSolBalance = useSelector((state: any) => state.userWalletData.usdtSolBalance);
    const selectedContact = useSelector((state: any) => state.userWalletData.selectedContact);
    const [sendButtonActive, setSendButtonActive] = useState(false);
    const [sendInProgress, setSendInProgress] = useState(false);
    const [addressText, setAddressText] = useState('');
    const [amountText, setAmountText] = useState('');
    const [stableCoinBalance, setStableCoinBalance] = useState(0);
    const currentUserFirstName = useSelector((state: any) => state.userWalletData.currentUserFirstName);
    const [currencySelected, setcurrencySelected] = useState('usdcSol');
    const walletName = useSelector((state: any) => state.userWalletData.type);
    const [confirmSend, setconfirmSend] = useState(false);
    const currentUserEmail = useSelector((state: any) => state.userWalletData.currentUserEmail);
    const selectedLanguageCode = useSelector((state: any) => state.userWalletData.selectedLanguageCode);

    const dispatch = useDispatch();


    useEffect(() => {
      if (usdtSolBalance > usdcSolBalance) {
        setStableCoinBalance(usdtSolBalance)
        setcurrencySelected('usdtSol')
      } else {
        setStableCoinBalance(usdcSolBalance)
      }
    }, [usdcSolBalance, usdtSolBalance]);


    useEffect(() => {
      if (selectedContact) {
        setAddressText(selectedContact)
      } else {
        setAddressText('')
      }
    }, [selectedContact]);
    
    useEffect(() => {
      if (showRequestPage) {
        setMenuPosition('0'); // Bring the menu into view
      } else {
        setMenuPosition('-130vh'); // Move the menu off-screen
      }
    }, [showRequestPage]);
  
    const handleMenuClick = () => {
      dispatch(setShouldShowBottomNav(true));
      dispatch(setShowRequestPage(!showRequestPage));
      if (selectedContact) {
        // dispatch(setSelectedContact(''));
      }
    };

    useEffect(() => {
      const preventPullToRefresh = (e: TouchEvent) => {
          if (e.touches && e.touches.length === 1 && e.touches[0].screenY > 50) {
              e.preventDefault();
          }
      };

      if (sendInProgress) {
          // Add the touchmove event listener when the function is running
          document.addEventListener('touchmove', preventPullToRefresh, { passive: false });
      }

      return () => {
          // Remove the touchmove event listener when the function is not running
          document.removeEventListener('touchmove', preventPullToRefresh);
      };
  }, [sendInProgress]);

    const handleQuarterButtonClick = () => {
      setAmountText('1')
      checkForValidInput(addressText, String(1));
      setselectedPortion('$1');
    };
    
    const handleHalfButtonClick = () => {
      setAmountText('10')
      checkForValidInput(addressText, String(10));
      setselectedPortion('$10');
    };
    
    const handleTwoThirdsButtonClick = () => {
      setAmountText('100')
      checkForValidInput(addressText, String(10));
      setselectedPortion('$100');
    };
    
    const handleAllButtonClick = () => {
      setAmountText('1000')
      checkForValidInput(addressText, String(10));
      setselectedPortion('$1,000');
    };


    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newAddress = event.target.value;
      setAddressText(newAddress);
      checkForValidInput(newAddress, amountText);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newAmount = event.target.value;
      setAmountText(newAmount);
      checkForValidInput(addressText, newAmount);
      
    };

  const removeWhitespace = (str: string) => {
      return str.replace(/\s/g, '');
    };

    const checkForValidInput = (newAddress: string, newAmount: string) => {
      const preCleanedAmount = newAmount.replace(/[\s$,!#%&*()A-Za-z]/g, '');
      const cleanedAmount = removeWhitespace(preCleanedAmount);
      const amountToNumber = Number(cleanedAmount);
      const cleanedAddress = removeWhitespace(newAddress);
      const cleanedPhoneNumber = removeWhitespace(cleanedAddress).replace(/[-()]/g, '');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      const phoneRegex = /^\d{10}$/;

      const isValidEmailAddress = emailRegex.test(cleanedAddress);
      const isValidPhoneNumber = phoneRegex.test(cleanedPhoneNumber);
  
      if (cleanedAmount === '' || cleanedAddress === '') {
          setSendButtonActive(false);
          setErrorMessage('Please fill in all fields');
      } else if (!isValidEmailAddress && !isValidPhoneNumber) {
        setSendButtonActive(false);
        setErrorMessage('Please enter a valid email address or phone number');
      } else if (isNaN(amountToNumber) && amountToNumber < 0.00001) {
        setSendButtonActive(false);
        setErrorMessage('Please enter a valid number');
      } else if (amountToNumber > 10000) {
        setSendButtonActive(false);
        setErrorMessage('Maximum $10,000');
      } else {
        setSendButtonActive(true);
        setErrorMessage('');
      }

  }


  const handleSendButtonClick = async () => {
    if (sendButtonActive) {
      const cleanedAddress = removeWhitespace(addressText)
      const cleanedPhoneNumber = cleanedAddress.replace(/[-()]/g, '');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      const phoneRegex = /^\d{10}$/;

      const isValidEmailAddress = emailRegex.test(cleanedAddress);
      const isValidPhoneNumber = phoneRegex.test(cleanedPhoneNumber);

      const cleanedAmount = amountText.replace(/[\s$,!#%&*()A-Za-z]/g, '');
      const amountToNumber = Number(cleanedAmount);
      if (!isValidEmailAddress && !isValidPhoneNumber) {
        setErrorMessage('Please enter a valid email or phone number');
      } else if (isNaN(amountToNumber)) {
        setErrorMessage('Invalid amount');
      } else if (amountToNumber > 10000) {
        setErrorMessage('Maximum $10,000');
      } else if (amountToNumber < 0.001) {
        setErrorMessage('Minimum: $0.001');
      } else {
        setAmountText('');
        setAddressText('')

        if (isValidPhoneNumber) {
          sendPhoneText(currentUserFirstName, cleanedAddress, amountToNumber)
          await savePhoneContact(cleanedAddress);
        } else if (isValidEmailAddress) {
          sendEmail(currentUserFirstName, cleanedAddress, amountToNumber)
          await saveEmailContact(cleanedAddress);
        }

        setErrorMessage(`Invoice sent to ${cleanedAddress}`)
    }
  };
}


const sendPhoneText = async (firstName: string, phoneNumber: string, amount: number) => {

  const functions = getFunctions();

  const message = `${firstName} requested $${amount} with Myfye! Hop on to https://myfye.com to pay and connect with ${firstName}. Don't know why you are receiving this message? Don't worry, you can safely ignore it.`
  const sendTextMessageFn = httpsCallable(functions, 
    'sendTextMessage');
    sendTextMessageFn({ message: message, phoneNumber: phoneNumber})
    .then((result) => {
        // Read result of the Cloud Function.
        console.log(result);
    })
    .catch((error) => {
        // Getting the Error details.
        console.log(error);
    });
};

const sendEmail = async (firstName: string, email: string, amount: number) => {

    const functions = getFunctions();
    const sendEmailFn = httpsCallable(functions, 
      'sendgridEmail');
      sendEmailFn({ emailAddress: email,
        firstName: firstName, 
        templateId: 'd-63ff86dad3f34b9d989842a7d5efc143',
        amount: `$${amount}` })
      .then((result) => {
          // Read result of the Cloud Function.
          console.log(result);
      })
      .catch((error) => {
          // Getting the Error details.
          console.log(error);
      });
};

async function saveEmailContact(sendToAddress: string) {
  /*
  Perform a write every time
  even if the contacts already know eachother
  TO DO:
  make it more efficient
  */
  const contactCollectionRef = collection(db, 'contacts');
  const contactDocRef = doc(contactCollectionRef, currentUserEmail);
  const updateContactOne = await setDoc(contactDocRef, {
    emails: arrayUnion(sendToAddress)
}, { merge: true });

const contactDocRefTwo = doc(contactCollectionRef, sendToAddress);
const updateContactTwo = await setDoc(contactDocRefTwo, {
  emails: arrayUnion(currentUserEmail)
}, { merge: true });

  await Promise.all([updateContactOne, updateContactTwo]);
}

async function savePhoneContact(sendToAddress: string) {
  /*
  Perform a write every time
  even if the contacts already know eachother
  TO DO:
  make it more efficient
  */
  const contactCollectionRef = collection(db, 'contacts');
  const contactDocRef = doc(contactCollectionRef, currentUserEmail);
  const updateContactOne = await setDoc(contactDocRef, {
    phoneNumbers: arrayUnion(sendToAddress)
}, { merge: true });

const contactDocRefTwo = doc(contactCollectionRef, sendToAddress);
const updateContactTwo = await setDoc(contactDocRefTwo, {
  phoneNumbers: arrayUnion(currentUserEmail)
}, { merge: true });

  await Promise.all([updateContactOne, updateContactTwo]);
}

  const styles = {
    tradeTimeframeButtonRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 10px',
      gap: '10px',
    },
    button: {
      flex: 1,
      padding: '5px',
      paddingTop: '12px',
      paddingBottom: '12px',
      backgroundColor: 'white',
      color: '#333333',
      border: '1px solid #333333',
      borderRadius: '4px',
      fontSize: '14px',
      cursor: 'pointer',
    },
    selectedButton: {
      flex: 1,
      padding: '5px',
      paddingTop: '12px',
      paddingBottom: '12px',
      backgroundColor: '#333333',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
    },
  };


  const errorLabelText = () => {
    if (errorMessage) {
      const color = '#000000'
      return (
        <div>
        <label
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto',
            marginTop: '15px',
            fontSize: '18px',
            color: color,
            textAlign: 'center'
          }}
        >
          {errorMessage}
        </label>
        </div>
      );
    } else {
      return (
        <div style={{ visibility: 'hidden' }}>
          <label
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto',
              marginTop: '15px',
              fontSize: '18px',
            }}
          >
            $
          </label>
        </div>
      );
    }
  };

    return (
        <div style={{ backgroundColor: 'white', overflowX: 'hidden' }}>

{ showRequestPage && (
<div style={{ 
      position: 'absolute', // Position it relative to the viewport
      top: 0,              // Align to the top of the viewport
      left: 0,            // Align to the right of the viewport
      marginTop: '15px',
      marginLeft: '15px',
      cursor: 'pointer',
      zIndex: 20,
      overflowX: 'hidden'     // Add some padding for spacing from the edges
    }}>

<img 
    style={{ width: 'auto', height: '35px', background: 'white' }} 
    src={backButton}
    onClick={handleMenuClick} 
    alt="Exit" 
  />
        
            </div>)}


      <div style={{
        position: 'absolute',
        top: menuPosition,
        left: 0, // Use state variable for position
        padding: '15px',
        height: '97vh',
        backgroundColor: 'white',
        transition: 'top 0.5s ease', // Animate the left property
        zIndex: 4,
        overflow: 'hidden'
      }}>

<div style={{ width: '93vw', marginTop: '0px'}}>



<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
<div style={{marginTop: '0px', fontSize: '35px', color: '#222222'}}>Request</div>

</div>






{sendInProgress ? (

<div style={{ marginBottom: '15px', display: 'flex', 
flexDirection: 'column', marginTop: '-20px',
alignItems: 'center' }}>

{errorLabelText()}

<div style={{marginTop: '30px'}}>
{selectedLanguageCode === 'en' && `Please wait...`}
{selectedLanguageCode === 'es' && `Espere por favor...`}
</div>
</div>

) : (

<div>
<div style={{marginTop: '50px', fontSize: '24px'}}>

<div style={{color: '#2E7D32'}}>
{selectedLanguageCode === 'en' && `They get a message, you`}
{selectedLanguageCode === 'es' && `Ellos reciben un mensaje,`}
  <br/>
  {selectedLanguageCode === 'en' && `get paid`}
  {selectedLanguageCode === 'es' && `te pagan`}
</div>

</div>

<div style={{ marginTop: '50px'}}>


<div style={{marginBottom: '15px', display: 'flex', 
  flexDirection: 'column', opacity: sendInProgress ? '0' : '1' }}>

  <input
    id="EmailAddress"
    type="text"
    value={addressText}
    onChange={handleAddressChange}
    onInput={handleAddressChange}
    style={{
      backgroundColor: '#EEEEEE', // Slightly lighter gray
      color: '#444444',
      fontSize: '20px',
      border: 'none', // Remove the border
      borderRadius: '5px', // Rounded edges
      padding: '10px 10px', // Adjust padding as needed
    }}
      placeholder={selectedLanguageCode === 'es' 
        ? 'Correo electrónico'
        : 'Email or Phone Number'}
    autoCapitalize="none"
  />
</div>

<div style={{ marginBottom: '15px', display: 'flex', 
  flexDirection: 'column', opacity: sendInProgress ? '0' : '1' }}>
    
    <span style={{
      position: 'absolute',
      fontSize: '20px',
      transform: 'translateY(+37%) translateX(+70%)',
      color: '#444444',
    }}>$</span>
  <input
    id="USDAmount"
    type="number"
    value={amountText}
    onChange={handleAmountChange}
    onInput={handleAmountChange}
    style={{
      backgroundColor: '#EEEEEE', // Slightly lighter gray
      color: '#444444',
      fontSize: '20px',
      border: 'none', // Remove the border
      borderRadius: '5px', // Rounded edges
      padding: '10px 30px', // Adjust padding as needed
    }}
    placeholder="0"
  />
</div>

<div style={{opacity: sendInProgress ? '0' : '1'}}>
<div style={styles.tradeTimeframeButtonRow} >
      <button style={selectedPortion === '$1' ? styles.selectedButton : styles.button} onClick={handleQuarterButtonClick}>$1</button>
      <button style={selectedPortion === '$10' ? styles.selectedButton : styles.button} onClick={handleHalfButtonClick}>$10</button>
      <button style={selectedPortion === '$100' ? styles.selectedButton : styles.button} onClick={handleTwoThirdsButtonClick}>$100</button>
      <button style={selectedPortion === '$1,000' ? styles.selectedButton : styles.button} onClick={handleAllButtonClick}>$1,000</button>
    </div>
    </div>

    {errorLabelText()}

<button
  style={{
      backgroundColor: sendButtonActive ? '#03A9F4' : '#D1E5F4',
      color: sendButtonActive ? '#222222': '#CCCCCC',
      opacity: sendInProgress ? '0' : '1',
      display: 'inline-block',
      padding: '10px 20px',
      fontSize: '25px',
      marginTop: '30px',
      fontWeight: 'bold',
      textAlign: 'center',
      borderRadius: '10px',
      border: '1px solid transparent',
      cursor: 'pointer',
      width: '100%'
    }} onClick={handleSendButtonClick}>
  {selectedLanguageCode === 'en' && `Invoice`}
  {selectedLanguageCode === 'es' && `Factura`}

    </button>


    </div>
    </div>
)}



    </div>


                  </div> 

                  </div>
    )
}

export default RequestPage;

