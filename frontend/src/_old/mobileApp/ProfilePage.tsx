import React, { useState, useEffect } from 'react';
import menuIcon from '../../assets/menuIcon.png';
import { useSelector } from 'react-redux';
import backButton from '../../assets/backButton3.png';
import { useDispatch } from 'react-redux';
import { setShowProfileMenu } from '../../redux/userWalletData.tsx';
import {usePrivy} from '@privy-io/react-auth';

function ProfilePage() {

  const showMenu = useSelector((state: any) => state.userWalletData.showProfileMenu);
    const [menuPosition, setMenuPosition] = useState('-70vw'); 
    const currentUserFirstName = useSelector((state: any) => state.userWalletData.currentUserFirstName);
    const currentUserLastName = useSelector((state: any) => state.userWalletData.currentUserLastName);
    const currentUserEmail = useSelector((state: any) => state.userWalletData.currentUserEmail);
    const currentUserPubKey = useSelector((state: any) => state.userWalletData.pubKey);
    const currentUserSolValue = useSelector((state: any) => state.userWalletData.solBalance);
  const dispatch = useDispatch()


  const {ready, authenticated, logout} = usePrivy();
  // Disable logout when Privy is not ready or the user is not authenticated
  const disableLogout = !ready || (ready && !authenticated);

    useEffect(() => {
        if (showMenu) {
          setMenuPosition('0'); // Bring the menu into view
        } else {
          setMenuPosition('-100vw'); // Move the menu off-screen
        }
      }, [showMenu]);
    
      const handleMenuClick = () => {
        dispatch(setShowProfileMenu(!showMenu))
      };

      const handleLogOutClick = () => {
        dispatch(setShowProfileMenu(false))
        logout()
      };

    return (
        <div style={{ backgroundColor: 'white', overflow: 'hidden' }}>

        <div>
                    </div>

<div style={{ 
      position: 'absolute', // Position it relative to the viewport
      top: 0,              // Align to the top of the viewport
      left: 0,            // Align to the right of the viewport
      cursor: 'pointer',
      width: showMenu ? '40vw' : '0', // Cover the right side when the menu is open
      zIndex: 21,     // Add some padding for spacing from the edges
      overflow: 'hidden'
    }}>

<div style={{
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: 'transparent',
  zIndex: 21
}} onClick={() => handleMenuClick()} />

      { showMenu && (
        <div>
                    <img style={{width: '35px', height: 'auto', 
                    marginLeft: '15px', marginTop: '15px'}} src={backButton}
                    onClick={handleMenuClick} alt="Menu" />
                    </div>
      )}

            </div>

            {menuPosition == '0' && (
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0, 
            backgroundColor: 'white',
            width: '40vw',
            background: 'transparent'
          }} onClick={handleMenuClick}>

          </div>
        )}

      <div style={{
        position: 'absolute',
        top: 0,
        left: menuPosition, // Use state variable for position
        padding: '15px',
        backgroundColor: '#ffffff',
        height: '99vh',
        width: '60vw',
        transition: 'left 0.5s ease', // Animate the left property
        zIndex: 20,
        overflow: 'hidden'
      }}>



<div style={{ display: 'flex', alignItems: 'center', 
      flexDirection: 'column', justifyContent: 'center', 
       }}>

        <div style={{fontWeight: 'bold', fontSize: '18px', marginTop: '110px' }}>{currentUserFirstName} {currentUserLastName}</div>
        


        <div style={{ fontSize: '16px'}}>{currentUserEmail}</div>

      <div>Sol Address:</div>
      <div style={{fontSize: '8px'}}>{currentUserPubKey}</div>
      <div>Sol Value: {currentUserSolValue}</div>

        <div style={{marginTop: '50px'}}>
        </div>



        <button disabled={disableLogout} onClick={handleLogOutClick}
        style={{background: '#447E26', border: 'none',
        borderRadius: '10px', padding: '10px',
        fontSize: '20px',
        color: '#ffffff',
        cursor: 'pointer'}}>
      Log out
    </button>

        </div>


        <div style={{ marginTop: 'calc(80vh - 425px)' }}>
          <div>


        </div>

        <div style = {{marginTop: '40px'}}>
          
        </div>
        </div>



                  </div> 


        </div>
    )
}

export default ProfilePage;