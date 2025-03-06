import React, { useState, useEffect } from 'react';
import menuIcon from '../../../assets/menuIcon.png';
import { useSelector, useDispatch } from 'react-redux';
import backButton from '../../../assets/backButton3.png';
import usdcSol from '../../../assets/usdcSol.png';
import usdtSol from '../../../assets/usdtSol.png';
import eurcSol from '../../../assets/eurcSol.png';
import pyusdSol from '../../../assets/pyusdSol.png';
import { 
  setShowWithdrawStablecoinPage, 
  setShouldShowBottomNav, 
  setusdcSolValue, 
  setusdtSolValue,
  seteurcSolValue,
  setRecentlyUsedSolanaAddresses } from '../../../redux/userWalletData.tsx';
  import { 
    getFirestore, 
    doc, 
    updateDoc, 
    getDoc,
    setDoc,
    arrayUnion } from 'firebase/firestore';
  import LoadingAnimation from '../../../components/LoadingAnimation.tsx';
  import getUserTransactionsEnabled from '../../../functions/GetUserTransactionsEnabled.tsx';
import { tokenTransfer } from '../../../functions/Transaction.tsx';
import {useSolanaWallets} from '@privy-io/react-auth/solana';

function WithdrawStableCoin() {
  const showWithdrawStablecoinPage = useSelector((state: any) => state.userWalletData.showWithdrawStablecoinPage);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageColor, setErrorMessageColor] = useState('#222222');
    const [currencySelected, setcurrencySelected] = useState('usdcSol');
    const [addressCopied, setaddressCopied] = useState(false); 
    const currentUserEmail = useSelector((state: any) => state.userWalletData.currentUserEmail);
    const [Message, setMessage] = useState('');
    const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
    const [SubmitButtonActive, setSubmitButtonActive] = useState(false);
    const connectedWallets = useSelector((state: any) => state.userWalletData.connectedWallets);
    const [menuPosition, setMenuPosition] = useState('-110vh'); 
    const usdcSolBalance = useSelector((state: any) => state.userWalletData.usdcSolBalance);
    const usdtSolBalance = useSelector((state: any) => state.userWalletData.usdtSolBalance);
    const pyusdSolBalance = useSelector((state: any) => state.userWalletData.pyusdSolBalance);
    const eurcSolBalance = useSelector((state: any) => state.userWalletData.eurcSolBalance);
    const usdyBalance = useSelector((state: any) => state.userWalletData.usdySolBalance);
    const [selectedPortion, setselectedPortion] = useState('');
    const [balanceSelected, setbalanceSelected] = useState(0);
    const dispatch = useDispatch();
    const [withdrawalButtonActive, setWithdrawalButtonActive] = useState(false);
    const [withdrawalInProgress, setWithdrawalInProgress] = useState(false);
    const [addressText, setAddressText] = useState('');
    const [amountText, setAmountText] = useState('');
    const recentlyUsedSolanaAddresses = useSelector((state: any) => state.userWalletData.recentlyUsedSolanaAddresses);
    const [showAddressesDropdown, setShowAddressesDropdown] = useState(false);
    const db = getFirestore();
    const selectedLanguageCode = useSelector((state: any) => state.userWalletData.selectedLanguageCode);

    const ready = useSelector((state: any) => state.userWalletData.privyWalletReady);

    const { wallets} = useSolanaWallets();
    

    useEffect(() => {

      if (currencySelected == 'usdcSol') {
        setbalanceSelected(usdcSolBalance)
      }
        
      }, [usdcSolBalance]);


    useEffect(() => {
        if (showWithdrawStablecoinPage) {
          setMenuPosition('0'); // Bring the menu into view
        } else {
          setMenuPosition('-110vh'); // Move the menu off-screen
        }
      }, [showWithdrawStablecoinPage]);
    
      const handleMenuClick = () => {
        dispatch(setShouldShowBottomNav(true));
        dispatch(setShowWithdrawStablecoinPage(false));
      };

      const handleCurrencySelection = (selection: string) => {
        // Add your logic here for what happens when the menu is clicked

        setcurrencySelected(selection)
        if (selection == 'usdcSol') {
            setbalanceSelected(usdcSolBalance);
        } else if (selection == 'usdtSol')  {
            setbalanceSelected(usdtSolBalance);
        } else if (selection == 'pyusdSol')  {
          setbalanceSelected(pyusdSolBalance);
        } else if (selection == 'eurcSol')  {
          setbalanceSelected(eurcSolBalance);
        }

      };


      const handleQuarterButtonClick = () => {
        if (balanceSelected>0.001) {
          const newWithdrawal = (0.25 * balanceSelected);
        setAmountText(String(newWithdrawal.toFixed(2).toString().replace(/\.?0+$/, '')))
        checkForValidInput(addressText, String(newWithdrawal));
        } else {
            setAmountText("$ 0.0")
        }
        setselectedPortion('25%');
      };
      
      const handleHalfButtonClick = () => {
        if (balanceSelected>0.0001) {
          const newWithdrawal = (0.5 * balanceSelected);
          setAmountText(String(newWithdrawal.toFixed(2).toString().replace(/\.?0+$/, '')))
          checkForValidInput(addressText, String(newWithdrawal));
        }else {
            setAmountText("$ 0.0")
        }
        setselectedPortion('50%');
      };
      
      const handleTwoThirdsButtonClick = () => {
        if (balanceSelected>0.0001) {
          const newWithdrawal = (0.75 * balanceSelected);
          setAmountText(String(newWithdrawal.toFixed(2).toString().replace(/\.?0+$/, '')))
          checkForValidInput(addressText, String(newWithdrawal));
        } else {
            setAmountText("$ 0.0")
        }
        setselectedPortion('75%');
      };
      
      const handleAllButtonClick = () => {
        if (balanceSelected>0.0001) {
          const newWithdrawal = Math.floor(balanceSelected * 100) / 100;
          setAmountText(String(newWithdrawal.toFixed(2).toString().replace(/\.?0+$/, '')))
          checkForValidInput(addressText, String(newWithdrawal));
        } else {
            setAmountText("$ 0.0")
        }
        setselectedPortion('100%');
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

      const handleAddressClick = (newAddress: string) => {
        setAddressText(newAddress);
        setShowAddressesDropdown(false); // Hide dropdown after selection
        checkForValidInput(newAddress, amountText);
    };


    const removeWhitespace = (str: string) => {
        return str.replace(/\s/g, '');
      };


      const checkForValidInput = (newAddress: string, newAmount: string) => {
        const preCleanedAmount = newAmount.replace(/[\s$,!#%&*()A-Za-z]/g, '');
        const cleanedAmount = removeWhitespace(preCleanedAmount);
        const amountToNumber = Number(cleanedAmount);
        const cleanedAddress = removeWhitespace(newAddress);
    
        const isValidSolanaAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(cleanedAddress);
    
        if (!isValidSolanaAddress || cleanedAmount === '' || cleanedAddress === '') {
            setWithdrawalButtonActive(false);
        } else if (!isNaN(amountToNumber) && amountToNumber > 0.00001 && 
        (amountToNumber <= balanceSelected)) {
            setWithdrawalButtonActive(true);
        } else {
            setWithdrawalButtonActive(false);
        }
    }
    


    const handleWithdrawalButtonClick = async () => {
      

        if (withdrawalButtonActive) {
          const cleanedAddress = removeWhitespace(addressText)
          const cleanedAmount = amountText.replace(/[\s$,!#%&*()A-Za-z]/g, '');
          const amountToNumber = Number(cleanedAmount);
          //const isTransactionsEnabled = await getUserTransactionsEnabled(user!.userId!);
          // TO DO: pass user ID
          const isTransactionsEnabled = true
          if (isNaN(amountToNumber)) {
            setErrorMessageColor('#222222');
            if (selectedLanguageCode == 'es') {
              setErrorMessage('Cantidad no válida')
            } else {
              setErrorMessage('Invalid amount');
            }
          } else if (amountToNumber > balanceSelected) {
            setErrorMessageColor('#222222');
            if (selectedLanguageCode == 'es') {
              setErrorMessage('Saldo insuficiente')
            } else {
              setErrorMessage('Insufficient balance');
            }
          } else if (amountToNumber < 0.001) {
            setErrorMessageColor('#222222');
            if (selectedLanguageCode == 'es') {
              setErrorMessage('Mínimo: $0.001')
            } else {
              setErrorMessage('Minimum: $0.001');
            }
          } else if (!isTransactionsEnabled) {
            setErrorMessageColor('#222222');
            if (selectedLanguageCode == 'es') {
              setErrorMessage('Transacciones deshabilitadas, comuníquese con el soporte de Myfye');
            } else {
              setErrorMessage('Transactions disabled, please contact Myfye support')
            }
          } else {
            setAmountText('');
            setAddressText('')
            saveRecentlyUsedSolanaAddress(cleanedAddress);
            setWithdrawalInProgress(true);
            setErrorMessageColor('#2E7D32');

            if (selectedLanguageCode == 'es') {
              setErrorMessage('Revisa tu billetera.')
            } else {
              setErrorMessage('Check your wallet');
            }
            const convertToSmallestDenomination = amountToNumber* 10 *10 *10 *10 *10 *10;
            setWithdrawalButtonActive(false); // Deactivate button here


            //if (!ready || !wallet) return;

            const wallet = wallets[0];
        

           const transactionSuccess = await tokenTransfer(
            publicKey, 
            cleanedAddress, 
            convertToSmallestDenomination, 
            currencySelected, 
            wallet);

            console.log('Got transaction status: ', transactionSuccess)

            if (transactionSuccess) {
                
              setErrorMessageColor('#2E7D32');
              setErrorMessage('Transaction Success!');

              if (currencySelected == 'usdcSol') {
                dispatch(setusdcSolValue(parseFloat((usdcSolBalance - amountToNumber).toFixed(6))));
            } else if (currencySelected == 'usdtSol') {
                dispatch(setusdtSolValue(parseFloat((usdtSolBalance - amountToNumber).toFixed(6))));
            } else if (currencySelected == 'eurcSol') {
                dispatch(seteurcSolValue(parseFloat((eurcSolBalance - amountToNumber).toFixed(6))));
            }

              setTimeout(() => {
                setWithdrawalInProgress(false);
                setErrorMessage('');
                dispatch(setShowWithdrawStablecoinPage(false))
                dispatch(setShouldShowBottomNav(true))
              }, 2000);
              
          } else {
            setWithdrawalInProgress(false);
            setErrorMessageColor('#222222');
            if (selectedLanguageCode == 'es') {
              setErrorMessage('Lo sentimos, hubo un error con tu transacción. Por favor inténtalo de nuevo más tarde.')
            } else {
              setErrorMessage('Sorry, there was an error with your transaction. Please try again later')
            }
          }
        }
      };
    }

    const saveRecentlyUsedSolanaAddress = async (address: string) => {
      const publicKeyDoc = doc(db, 'pubKeys', publicKey); // Ensure `publicKey` is defined in your scope
    
      try {
        // Check if the document exists
        const docSnap = await getDoc(publicKeyDoc);
    
        if (!docSnap.exists()) {
          // Document does not exist, create it with the initial array
          await setDoc(publicKeyDoc, {
            recentlyUsedAddresses: [address],
          });
          console.log('Document created and address added.');
        } else {
          // Document exists, update it using arrayUnion
          await updateDoc(publicKeyDoc, {
            recentlyUsedAddresses: arrayUnion(address),
          });
          console.log('Address added to recently used addresses.');
        }
    
        // Update local state
        if (!recentlyUsedSolanaAddresses.includes(address)) {
          setRecentlyUsedSolanaAddresses([...recentlyUsedSolanaAddresses, address]);
        }
      } catch (error) {
        console.error('Error updating document:', error);
      }
    };


    const errorLabelText = () => {
        if (errorMessage) {
          return (
            <div>
{withdrawalInProgress && ( 
<div style={{display: 'flex', justifyContent: 'center', marginTop: '-130px', marginBottom: '10px' }}>
<LoadingAnimation/>
            </div>
            )}

            <label
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto',
                marginTop: '0px',
                fontSize: '20px',
                color: errorMessageColor,
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

    return (
        <div style={{ backgroundColor: 'white' }}>

{ showWithdrawStablecoinPage && (
<div style={{ 
      position: 'absolute', // Position it relative to the viewport
      top: 0,              // Align to the top of the viewport
      left: 0,            // Align to the right of the viewport
      padding: '15px',
      cursor: 'pointer',
      zIndex: 7,
    }}>

            <img style={{width: 'auto', height: '35px', background: 'white'}} src={ showWithdrawStablecoinPage ? (
                 backButton) : menuIcon }
            onClick={handleMenuClick} alt="Exit" />
            </div>)}



      <div style={{
        position: 'absolute',
        top: menuPosition,
        left: 0, // Use state variable for position
        paddingTop: '15px',
        height: '90vh',
        backgroundColor: 'white',
        width: '100vw',
        transition: 'top 0.5s ease', // Animate the left property
        overflowY: 'hidden',
        zIndex: 6
      }}>


<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
<div style={{marginTop: '0px', fontSize: '35px', color: '#222222'}}>
{selectedLanguageCode === 'en' && `Withdraw`}
{selectedLanguageCode === 'es' && `Retirar`}
</div>
</div>

<div>




<div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '40px' }}>

<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
    
<div style={{ display: 'flex', alignItems: 'center', 
                background: (currencySelected == 'usdcSol') ? '#444444' : '#ffffff', 
                color: (currencySelected == 'usdcSol') ? '#ffffff' : '#000000',  
padding: '7px', borderRadius: '10px', border: '1px solid black',  }} onClick={() => handleCurrencySelection('usdcSol')}>
                    <img id="usdcSolIcon" src={usdcSol} style={{ width: '40px', height: 'auto' }} />
                    <div id="usdcSolTicker" style={{ marginLeft: '8px' }}>USDC</div> {/* Adjust marginLeft as needed */}
                </div>


                <div style={{ display: 'flex', alignItems: 'center', 
                background: (currencySelected == 'usdtSol') ? '#444444' : '#ffffff', 
                color: (currencySelected == 'usdtSol') ? '#ffffff' : '#000000', 
                padding: '7px', borderRadius: '10px', 
                border: '1px solid black', }} onClick={() => handleCurrencySelection('usdtSol')}>
                    <img  src={usdtSol} style={{ width: '40px', height: 'auto' }} ></img>
                    <div style={{ marginLeft: '8px' }}>USDT</div> {/* Adjust marginLeft as needed */}
                    
                </div>


                <div style={{ display: 'flex', alignItems: 'center', 
                background: (currencySelected == 'eurcSol') ? '#444444' : '#ffffff', 
                color: (currencySelected == 'eurcSol') ? '#ffffff' : '#000000',  
padding: '7px', borderRadius: '10px', border: '1px solid black',  }} onClick={() => handleCurrencySelection('eurcSol')}>
                    <img id="eurcSolIcon" src={eurcSol} style={{ width: '39px', height: 'auto' }} />
                    <div id="eurcSolTicker" style={{ marginLeft: '8px' }}>EURC</div> {/* Adjust marginLeft as needed */}
                </div>

                </div>

</div>

<div style={{marginTop: '20px', fontSize: '20px', marginLeft: '20px'}}>
{selectedLanguageCode === 'en' && `Balance: `}
{selectedLanguageCode === 'es' && `Valor de la cuenta: `} {balanceSelected}</div>


<div
    style={{
      width: '90%',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '40px',
        maxWidth: '500px',
        height: '82vh'
    }}
    >


        <div style={{ marginTop: '30px'}}>
  <div style={{marginBottom: '15px', display: 'flex', 
    flexDirection: 'column', opacity: withdrawalInProgress ? '0' : '1' }}>
      
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
    <input
      id="SolanaAddress"
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
        width: recentlyUsedSolanaAddresses ? '80%' : ''
      }}
      placeholder={selectedLanguageCode === 'en' ? 'Solana Address' : selectedLanguageCode === 'es' ? 'Dirección Solana' : 'Solana Address'}
      autoComplete='off'
    />
<div style={{
    color: '#ffffff',
    cursor: 'pointer',
    marginLeft: '10px',
    fontSize: '20px',
    backgroundColor: '#4C7A34',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'inline-flex',  // Changed to inline-flex to respect width and height
    alignItems: 'center',    // Vertically center the content
    justifyContent: 'center' // Horizontally center the content
}}
onClick={() => setShowAddressesDropdown(!showAddressesDropdown)}>
    @
</div>
      
    </div>


    {showAddressesDropdown && (
                <div style={{
                  backgroundColor: '#EEEEEE', borderRadius: '5px',
                  color: '#444444', padding: '10px', marginTop: '5px',}}>
                  <div style={{ fontStyle: 'italic', fontWeight: 'bold' }}>
                    
                  {selectedLanguageCode === 'en' && `Recently Used`}
                  {selectedLanguageCode === 'es' && `Recientemente Usado`}

                  </div>
                    {recentlyUsedSolanaAddresses.map((address: string, index: number) => (
                        <div
                            key={index}
                            onClick={() => handleAddressClick(address)}
                            style={{
                                cursor: 'pointer',
                                marginBottom: '5px',
                                borderRadius: '5px', marginLeft: '10px', marginTop: '10px'
                            }}
                        >
                            {`${address.slice(0, 4)}...${address.slice(-4)}`}
                        </div>
                    ))}
                </div>
            )}
  </div>

  
  <div style={{ marginBottom: '15px', display: 'flex', 
    flexDirection: 'column', opacity: withdrawalInProgress ? '0' : '1' }}>
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
      placeholder={selectedLanguageCode === 'en' ? 'Amount' : 'Cantidad'}
    />
  </div>
<div style={{opacity: withdrawalInProgress ? '0' : '1'}}>
  <div style={styles.tradeTimeframeButtonRow} >
        <button style={selectedPortion === '25%' ? styles.selectedButton : styles.button} onClick={handleQuarterButtonClick}>25%</button>
        <button style={selectedPortion === '50%' ? styles.selectedButton : styles.button} onClick={handleHalfButtonClick}>50%</button>
        <button style={selectedPortion === '75%' ? styles.selectedButton : styles.button} onClick={handleTwoThirdsButtonClick}>75%</button>
        <button style={selectedPortion === '100%' ? styles.selectedButton : styles.button} onClick={handleAllButtonClick}>100%</button>
      </div>
      </div>

      {errorLabelText()}

  <button
    style={{
        backgroundColor: withdrawalButtonActive ? '#03A9F4' : '#D1E5F4',
        color: withdrawalButtonActive ? '#222222': '#CCCCCC',
        opacity: withdrawalInProgress ? '0' : '1',
        display: 'inline-block',
        padding: '10px 20px',
        fontSize: '25px',
        marginTop: '5px',
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: '10px',
        border: '1px solid transparent',
        cursor: 'pointer',
        width: '100%'
      }} onClick={handleWithdrawalButtonClick}>
        {selectedLanguageCode === 'en' && `Send`}
        {selectedLanguageCode === 'es' && `Enviar`}
      </button>


      </div>


      </div>
</div>

                  </div> 


        </div>
    )
}
export default WithdrawStableCoin;