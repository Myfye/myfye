import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import userImage from '../../assets/user.png';
import home from '../../assets/home.png';
import dollarSign from '../../assets/dollarSign.png';
import wallet from '../../assets/wallet.png';
import history from '../../assets/history.png';
import cash from '../../assets/cash.png';
import { setShowPayPage, setShowEarnPage, setShowWalletPage,
  setShowAccountHistory, setShowProfileMenu, setShowSendPage,
  setShowRequestPage, setShowWithdrawStablecoinPage, 
  setShowSwapWithdrawPage, setShowSwapDepositPage,
  setShowCryptoPage
 } from '../../redux/userWalletData.tsx';
// import Menu from '../appcomponents/menu';

function BottomNav() {

    const shouldShowBottomNav = useSelector((state: any) => state.userWalletData.shouldShowBottomNav );

    const dispatch = useDispatch()
    const [animateEarn, setAnimateEarn] = useState(false);
    const [animateHome, setAnimateHome] = useState(false);
    const [animatePay, setAnimatePay] = useState(false);
    const [animateWallet, setAnimateWallet] = useState(false);
    const [animateProfile, setAnimateProfile] = useState(false);
    const selectedLanguageCode = useSelector((state: any) => state.userWalletData.selectedLanguageCode);

    const [showMenu, setShowMenu] = useState(false);
    
      const handlePayPageClick = () => {
        // Add your logic here for what happens when the menu is clicked
        setAnimatePay(true);
        setTimeout(() => setAnimatePay(false), 500); // Animation duration

        dispatch(setShowPayPage(true))

        dispatch(setShowProfileMenu(false))
        dispatch(setShowEarnPage(false))
        dispatch(setShowWalletPage(false))
        dispatch(setShowCryptoPage(false))
      };


      const handleEarnPageClick = () => {
        setAnimateEarn(true);
        setTimeout(() => setAnimateEarn(false), 500); // Animation duration
        dispatch(setShowEarnPage(true))
        
        dispatch(setShowProfileMenu(false))
        dispatch(setShowPayPage(false))
        dispatch(setShowWalletPage(false))
        dispatch(setShowCryptoPage(false))
      };

      const handleWalletPageClick = () => {
        setAnimateWallet(true);
        setTimeout(() => setAnimateWallet(false), 500); // Animation duration
        dispatch(setShowWalletPage(true))
        
        dispatch(setShowProfileMenu(false))
        dispatch(setShowEarnPage(false))
        dispatch(setShowPayPage(false))
        dispatch(setShowCryptoPage(false))
      };

      const handleProfileMenuClick = () => {
        setAnimateProfile(true);
        setTimeout(() => setAnimateProfile(false), 500); // Animation duration
        dispatch(setShowProfileMenu(true))

        dispatch(setShowPayPage(false))
        dispatch(setShowEarnPage(false))
        dispatch(setShowWalletPage(false))
      };



      const handleHomePageClick = () => {
        setAnimateHome(true);
        setTimeout(() => setAnimateHome(false), 500); // Animation duration
        dispatch(setShowPayPage(false))
        dispatch(setShowEarnPage(false))
        dispatch(setShowWalletPage(false))
        dispatch(setShowSendPage(false))
        dispatch(setShowRequestPage(false))
        dispatch(setShowWithdrawStablecoinPage(false))
        dispatch(setShowSwapWithdrawPage(false))
        dispatch(setShowSwapDepositPage(false))
        dispatch(setShowCryptoPage(false))
      };
    
      const animationStyle = `
      @keyframes growShrink {
        0% {
          box-shadow: 0 0 0 0 rgba(0, 128, 0, 0.7);
          background-color: rgba(0, 128, 0, 0.7);
        }
        50% {
          box-shadow: 0 0 20px 20px rgba(0, 128, 0, 0.0);
          background-color: rgba(0, 128, 0, 0.0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(0, 128, 0, 0.0);
          background-color: rgba(0, 128, 0, 0.0);
        }
      }
  
      .grow-shrink-animation {
        animation: growShrink 0.5s ease-in-out;
      }
    `;
  

      return (
        <div>
          {shouldShowBottomNav && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px', // Adjust height as needed
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          backgroundColor: 'white',
          borderTop: '1px solid #ccc', // Optional border for better visibility
          zIndex: 5 // was 2 
        }}>


<div>
      <style>{animationStyle}</style>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0px',
          ...(animateEarn ? { animation: 'growShrink 0.5s ease-in-out' } : {})
        }}
        onAnimationStart={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
        onClick={handleEarnPageClick}
      >
        <img
          src={dollarSign}
          alt="Nav 1"
          style={{
            width: '38px',
            height: 'auto',
            opacity: '0.75'
          }}
        />
        <div>
        {selectedLanguageCode === 'en' && `Earn`}
        {selectedLanguageCode === 'es' && `Ganar`}
        </div>
      </div>
    </div>

          <div>
      <style>{animationStyle}</style>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0px',
          ...(animatePay ? { animation: 'growShrink 0.5s ease-in-out' } : {})
        }}
        onAnimationStart={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
        onClick={handlePayPageClick}
      >
        <img
          src={cash}
          alt="Nav 2"
          style={{
            width: '40px',
            height: 'auto',
            opacity: '0.7'
          }}
        />
        <div>
        {selectedLanguageCode === 'en' && `Pay`}
        {selectedLanguageCode === 'es' && `Pagar`}
        </div>
      </div>
    </div>


          <div>
      <style>{animationStyle}</style>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5px',
          ...(animateHome ? { animation: 'growShrink 0.5s ease-in-out' } : {})
        }}
        onAnimationStart={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
        onClick={handleHomePageClick}
      >
        <img
          src={home}
          alt="Nav 3"
          style={{
            width: '44px',
            height: 'auto',
            opacity: '0.7'
          }}
        />
        <div>
        {selectedLanguageCode === 'en' && `Home`}
        {selectedLanguageCode === 'es' && `Hogar`}
        </div>
      </div>
    </div>


          <div>
      <style>{animationStyle}</style>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0px',
          ...(animateWallet ? { animation: 'growShrink 0.5s ease-in-out' } : {})
        }}
        onAnimationStart={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
        onClick={handleWalletPageClick}
      >
        <img
          src={wallet}
          alt="Nav 4"
          style={{
            width: '40px',
            height: 'auto',
            opacity: '0.7'
          }}
        />
        <div>        
          {selectedLanguageCode === 'en' && `Wallet`}
        {selectedLanguageCode === 'es' && `Billetera`}</div>
      </div>
    </div>

    <div>
      <style>{animationStyle}</style>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0px',
          ...(animateProfile ? { animation: 'growShrink 0.5s ease-in-out' } : {})
        }}
        onAnimationStart={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
        onClick={handleProfileMenuClick}
      >
        <img
          src={userImage}
          alt="Nav 5"
          style={{
            width: '40px',
            height: 'auto',
            opacity: '0.7'
          }}
        />
        <div>
        {selectedLanguageCode === 'en' && `Profile`}
        {selectedLanguageCode === 'es' && `Perfil`}
        </div>
      </div>
    </div>

        </div>
        )}
        </div>
      );
}

export default BottomNav;