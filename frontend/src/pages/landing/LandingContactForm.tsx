import React, { useState, useEffect, useRef } from 'react';
import { getFirestore, collection, addDoc, setDoc, getDoc, doc, getDocs, query, where, } from 'firebase/firestore';

export default function LandingContactForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const isSmallScreen = window.innerWidth <= 768;

    const db = getFirestore();

    const handleDropDownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
      };

      
    const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFirstName = event.target.value;
        setFirstName(newFirstName);
      };

      const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newLastName = event.target.value;
        setLastName(newLastName);
      };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = event.target.value;
        setEmail(newEmail);
      };

      const [errorMessage, setErrorMessage] = useState('');

      const removeWhitespace = (str: string) => {
        return str.replace(/\s/g, '');
      };

      const handleContactSubmit= async () => {
        const cleanedEmail = removeWhitespace(email)
        const cleanedlastName = removeWhitespace(lastName)
        const cleanedfirstName = removeWhitespace(firstName)
        if (cleanedEmail === '' || cleanedfirstName === '' || cleanedlastName === '') {
          setErrorMessage('Please fill in all fields');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
            setErrorMessage('Please enter a valid email address');
        } else {
          setErrorMessage('Got it!')


          const newContactData = {
            email: cleanedEmail,
            firstName: cleanedfirstName,
            lastName: cleanedlastName,
            reason: selectedOption,
            timestamp: new Date().toISOString(),
        };

        const contactCollectionRef = collection(db, 'contactFormInquiries');

        const updateWithdrawals = await addDoc(contactCollectionRef, newContactData);
        
        await Promise.all([updateWithdrawals]);


        }
      };


      const errorLabelText = () => {
        if (errorMessage) {
          const color = errorMessage === 'Got it!' ? '#4CD964' : '#FF3B30';
          return (
            <label
              style={{
                display: 'flex',
                justifyContent: 'left',
                alignItems: 'left',
                margin: '0 auto',
                marginTop: '0px',
                fontSize: '18px',
                color: color,
              }}
            >
              {errorMessage}
            </label>
          );
        } else {
          return (
            <div style={{ visibility: 'hidden' }}>
              <label
                style={{
                  display: 'flex',
                  justifyContent: 'left',
                  alignItems: 'left',
                  margin: '0 auto',
                  marginTop: '0px',
                  fontSize: '18px',
                }}
              >
                $
              </label>
            </div>
          );
        }
      };

      if (!isSmallScreen) {
        return (

          <div style={{paddingTop: '15px', paddingBottom: '15px'}}>

          <div style={{display: 'flex', flexDirection: 'column', 
            width: '40vw', margin: '0 auto',
            gap: '20px', color:'#333333', fontSize: '25px', alignItems: 'center', 
            justifyContent: 'center', marginBottom: '100px', }}>
    
          <div style={{ marginBottom: '5px', display: 'flex', flexDirection: 'column',}}>
    
    
    
          <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="firstName" style={{ fontSize: isSmallScreen? '16px' : '20px', color: '#444444', marginBottom: '5px' }}>
          First Name
        </label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={handleFirstNameChange}
          onInput={handleFirstNameChange}
          style={{
            backgroundColor: '#EEEEEE', // Slightly lighter gray
            color: '#444444',
            fontSize: '20px',
            border: 'none', // Remove the border
            borderRadius: '5px', // Rounded edges
            padding: '10px 10px', // Adjust padding as needed
          }}
          placeholder="First Name"
        />
      </div>
    
    
      <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="lastName" style={{ fontSize: isSmallScreen? '16px' : '20px', color: '#444444', marginBottom: '5px' }}>
          Last Name
        </label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={handleLastNameChange}
          onInput={handleLastNameChange}
          style={{
            backgroundColor: '#EEEEEE', // Slightly lighter gray
            color: '#444444',
            fontSize: '20px',
            border: 'none', // Remove the border
            borderRadius: '5px', // Rounded edges
            padding: '10px 10px', // Adjust padding as needed
          }}
          placeholder="Last Name"
        />
      </div>
    
    
        <label htmlFor="email" style={{ fontSize: isSmallScreen? '16px' : '20px', color: '#444444',
             marginBottom: '5px' }}>
          Email
        </label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
          onInput={handleEmailChange}
          style={{
            backgroundColor: '#EEEEEE', // Slightly lighter gray
            color: '#444444',
            fontSize: '20px',
            border: 'none', // Remove the border
            borderRadius: '5px', // Rounded edges
            padding: '10px 10px', // Adjust padding as needed
          }}
          placeholder="Email"
        />
      </div>
    
      <div style={{ marginBottom: '0px', display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="lastName" style={{ fontSize: isSmallScreen? '16px' : '20px', color: '#444444', marginBottom: '5px' }}>
            How can we help?
            </label>
          <select id="options" value={selectedOption} 
            onChange={handleDropDownChange}       style={{
                backgroundColor: '#EEEEEE', // Slightly lighter gray
                color: selectedOption === '' ? '#777777' : '#444444',
                fontSize: '20px',
                border: 'none', // Remove the border
                borderRadius: '5px', // Rounded edges
                padding: '10px 10px', // Adjust padding as needed
              }}>
            <option value=""  disabled style={{color: 'green'}}>Select an option</option>
            <option value="Acquiring USDC">Acquiring USDC</option>
            <option value="Depositing my investment">Depositing my investment</option>
            <option value="All other inquiries">All other inquiries</option>
          </select>
      </div>
    
      <div>{errorLabelText()}</div>
    
      <button
        style={{
            backgroundColor: '#333333',
            color: 'white',
            padding: '10px 20px',
            fontSize: '25px',
            fontWeight: 'bold',
            textAlign: 'center',
            borderRadius: '10px',
            border: '1px solid transparent',
            cursor: 'pointer',
            width: isSmallScreen ? '70%' : '50%'
          }} onClick={handleContactSubmit}> Submit
    
          </button>
    
          </div>
    
    </div>


        )
      }

  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'column', 
        width: isSmallScreen ? '80vw' : '50vw', 
        gap: '20px', color:'#333333', fontSize: '25px',
        marginLeft: isSmallScreen ? '25px' : '0px', alignItems: isSmallScreen ? '' : 'center', 
        justifyContent: isSmallScreen ? '' : 'center', marginBottom: '100px'}}>

      <div style={{ marginBottom: '5px', display: 'flex', flexDirection: 'column',}}>



      <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
    <label htmlFor="firstName" style={{ fontSize: isSmallScreen? '16px' : '20px', color: '#444444', marginBottom: '5px' }}>
      First Name
    </label>
    <input
      id="firstName"
      type="text"
      value={firstName}
      onChange={handleFirstNameChange}
      onInput={handleFirstNameChange}
      style={{
        backgroundColor: '#EEEEEE', // Slightly lighter gray
        color: '#444444',
        fontSize: '20px',
        border: 'none', // Remove the border
        borderRadius: '5px', // Rounded edges
        padding: '10px 10px', // Adjust padding as needed
      }}
      placeholder="First Name"
    />
  </div>


  <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
    <label htmlFor="lastName" style={{ fontSize: isSmallScreen? '16px' : '20px', color: '#444444', marginBottom: '5px' }}>
      Last Name
    </label>
    <input
      id="lastName"
      type="text"
      value={lastName}
      onChange={handleLastNameChange}
      onInput={handleLastNameChange}
      style={{
        backgroundColor: '#EEEEEE', // Slightly lighter gray
        color: '#444444',
        fontSize: '20px',
        border: 'none', // Remove the border
        borderRadius: '5px', // Rounded edges
        padding: '10px 10px', // Adjust padding as needed
      }}
      placeholder="Last Name"
    />
  </div>


    <label htmlFor="email" style={{ fontSize: isSmallScreen? '16px' : '20px', color: '#444444',
         marginBottom: '5px' }}>
      Email
    </label>
    <input
      id="email"
      type="text"
      value={email}
      onChange={handleEmailChange}
      onInput={handleEmailChange}
      style={{
        backgroundColor: '#EEEEEE', // Slightly lighter gray
        color: '#444444',
        fontSize: '20px',
        border: 'none', // Remove the border
        borderRadius: '5px', // Rounded edges
        padding: '10px 10px', // Adjust padding as needed
      }}
      placeholder="Email"
    />
  </div>


  <div style={{ marginBottom: '0px', display: 'flex', flexDirection: 'column' }}>
    <label htmlFor="lastName" style={{ fontSize: isSmallScreen? '16px' : '20px', color: '#444444', marginBottom: '5px' }}>
        How can we help?
        </label>
      <select id="options" value={selectedOption} 
        onChange={handleDropDownChange}       style={{
            backgroundColor: '#EEEEEE', // Slightly lighter gray
            color: selectedOption === '' ? '#777777' : '#444444',
            fontSize: '20px',
            border: 'none', // Remove the border
            borderRadius: '5px', // Rounded edges
            padding: '10px 10px', // Adjust padding as needed
          }}>
        <option value=""  disabled style={{color: 'green'}}>Select an option</option>
        <option value="Acquiring USDC">Acquiring USDC</option>
        <option value="Depositing my investment">Depositing my investment</option>
        <option value="All other inquiries">All other inquiries</option>
      </select>
  </div>

  <div>{errorLabelText()}</div>

  <button
    style={{
        backgroundColor: '#333333',
        color: 'white',
        padding: '10px 20px',
        fontSize: '25px',
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: '10px',
        border: '1px solid transparent',
        cursor: 'pointer',
        width: isSmallScreen ? '70%' : '50%'
      }} onClick={handleContactSubmit}> Submit

      </button>

      </div>

</div>


  );
}