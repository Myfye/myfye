import React, { useState, useEffect } from 'react';
import menuIcon from '../../assets/menuIcon.png';
import { useSelector, useDispatch } from 'react-redux';
import backButton from '../../assets/backButton3.png';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import questionMarkImage from '../../assets/questionMark.png';
import { setShouldShowBottomNav } from '../../redux/userWalletData.tsx';
import { getFunctions, httpsCallable, HttpsCallableResult } from 'firebase/functions';

function Support() {

    const [showMenu, setShowMenu] = useState(false);

    const [currencySelected, setcurrencySelected] = useState('');
    const dispatch = useDispatch()
    const [menuPosition, setMenuPosition] = useState('-800px'); 
    const firestore = getFirestore();
    const currentUserEmail = useSelector((state: any) => state.userWalletData.currentUserEmail);
    const [Message, setMessage] = useState('');
    const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
    const [SubmitButtonActive, setSubmitButtonActive] = useState(false);
    const selectedLanguageCode = useSelector((state: any) => state.userWalletData.selectedLanguageCode);

    const firstName = useSelector((state: any) => state.userWalletData.currentUserFirstName);
    const lastName = useSelector((state: any) => state.userWalletData.currentUserLastName);
    const userID = useSelector((state: any) => state.userWalletData.currentUserID);

    const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newMessage = event.target.value;
        setMessage(newMessage);
        checkForMessageComplete(Message);
    };

    const removeWhitespace = (str: string) => {
        return str.replace(/\s/g, '');
      };

    const checkForMessageComplete = (newMessage: string) => {
        const cleanedMessage = removeWhitespace(newMessage);
        if (cleanedMessage === '') {
          //error
          setSubmitButtonActive(false);
        } else {
            setSubmitButtonActive(true);

    }
}

    useEffect(() => {
        if (showMenu) {
          setMenuPosition('0'); // Bring the menu into view
        } else {
          setMenuPosition('-800px'); // Move the menu off-screen
          setcurrencySelected('');
        }
      }, [showMenu]);
    
      const handleMenuClick = () => {
        // Add your logic here for what happens when the menu is clicked

        if (showMenu) {
          dispatch(setShouldShowBottomNav(true))
          setShowMenu(!showMenu);
        } else {
          dispatch(setShouldShowBottomNav(false))
          setShowMenu(!showMenu);
        }

        
        
      };


      const handleRequestSubmitButtonClick = async () => {
        const cleanedMessage = removeWhitespace(Message);
        if (cleanedMessage === '') {
          //error
          alert("Error with this request. Please try again later.");
        } else {
          try {
              const currentDate = new Date();
              const formatter = new Intl.DateTimeFormat('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              });
              
              const creationDate = formatter.format(currentDate);
    
              interface newSupportRequest {
                email: string,
                publicKey: string,
                message: string,
                timestamp: string,
              }
              // New user created successfully
              // Create a new user object
    
              
              const newSupportRequest: newSupportRequest = {
                email: currentUserEmail,
                publicKey: publicKey,
                message: Message,
                timestamp: creationDate,
              };
    
              // Save the user document to Firestore
              const supportRequestsCollectionRef = collection(firestore, "supportRequests");
              const docRef = await addDoc(supportRequestsCollectionRef, newSupportRequest);
              const documentId = docRef.id;

              sendEmail(firstName, 'gavinmilligan1997@gmail.com', documentId,
                Message, lastName, userID, creationDate)

              sendEmail(firstName, 'eli@myfye.com', documentId,
                Message, lastName, userID, creationDate)

              setMessage('')
              setSubmitButtonActive(false)
              alert(`Support request received! We will email you at ${currentUserEmail}`);
          } catch (error: any) {
            alert("Error with this request. Please try again later.");
            }
        }
      };

      const sendEmail = async (firstName: string, email: string, supportRequestID: string,
        supportMessage: string, lastName: string, userID: string, timestamp: string
      ) => {

        const functions = getFunctions();
        const sendEmailFn = httpsCallable(functions, 
          'sendgridEmail');
          sendEmailFn({ emailAddress: email,
            firstName: firstName, 
            templateId: 'd-6e7e5976fd6849d48de52c3acedcab61',
            userID: `${userID}`,
            lastName: `${lastName}`,
            supportRequestID: `${supportRequestID}`,
            supportMessage: `${supportMessage}`,
            timestamp: `${timestamp}`,
            publicKey: `${publicKey}`})
          .then((result) => {
              // Read result of the Cloud Function.
              console.log(result);
          })
          .catch((error) => {
              // Getting the Error details.
              console.log(error);
          });
    };

    return (
        <div style={{ backgroundColor: 'white' }}>

<img src={questionMarkImage} style={{width: '35px', height: '35px', opacity: '0.72'}}
onClick={handleMenuClick}></img>

{ showMenu && (
<div style={{ 
      position: 'absolute', // Position it relative to the viewport
      top: 0,              // Align to the top of the viewport
      left: 0,            // Align to the right of the viewport
      padding: '15px',
      cursor: 'pointer',
      zIndex: 3    
    }}>

            <img style={{width: 'auto', height: '35px', background: 'white'}} src={ showMenu ? (
                currencySelected ? backButton : backButton) : menuIcon }
            onClick={handleMenuClick} alt="Exit" />
            </div>)}

                <div style={{display: 'flex', alignItems: 'center', 
                justifyContent: 'center'}}>
       </div>

      <div style={{
        position: 'absolute',
        top: menuPosition,
        left: 0, // Use state variable for position
        padding: '15px',
        height: '700px', // random number to cover home page
        backgroundColor: 'white',
        width: '92vw',
        transition: 'top 0.5s ease' // Animate the left property
      }}>

<div style={{marginTop: '0px', textAlign: 'center', fontSize: '35px', color: '#222222'}}>
{selectedLanguageCode === 'en' && `Get Help`}
{selectedLanguageCode === 'es' && `Consigue Ayuda`}
</div>

<div>



<div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column' }}>
  <label htmlFor="message" style={{ fontSize: '20px', color: '#444444', marginBottom: '5px' }}>
    
    {selectedLanguageCode === 'en' && `What issue are you running into today?`}
{selectedLanguageCode === 'es' && `
¿Con qué problema te encuentras hoy?`}
  </label>
  <textarea
    id="message"
    value={Message}
    onChange={handleMessageChange}
    style={{
      backgroundColor: '#EEEEEE', // Slightly lighter gray
      color: '#444444',
      fontSize: '20px', // Text size
      border: 'none', // Remove the border
      borderRadius: '5px', // Rounded edges
      padding: '10px', // Padding
      width: '100%', // Full-width in the container
      boxSizing: 'border-box', // Ensures padding doesn't add to the width
      height: '250px', // Adjust the height as needed, enough for about 10 lines
      resize: 'vertical', // Allows the user to resize the textarea vertically
      marginTop: '15px'
    }}
    placeholder={selectedLanguageCode === 'es' 
      ? 'Describe el problema en detalle...'
      : 'Describe the problem in detail...'}
  />
</div>


<button
    style={{
        backgroundColor: SubmitButtonActive ? '#03A9F4' : '#D1E5F4',
        color: SubmitButtonActive ? '#222222': '#CCCCCC',
        display: 'inline-block',
        padding: '10px 20px',
        fontSize: '25px',
        marginTop: '35px',
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: '10px',
        border: '1px solid transparent',
        cursor: 'pointer',
        width: '100%',
      }} onClick={handleRequestSubmitButtonClick}>
        {selectedLanguageCode === 'en' && `Submit`}
        {selectedLanguageCode === 'es' && `Entregar`}

      </button>


</div>

                  </div> 


        </div>
    )
}

export default Support;