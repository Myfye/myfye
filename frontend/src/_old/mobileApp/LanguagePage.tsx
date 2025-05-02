import React, { useState, useEffect } from 'react';
import menuIcon from '../../assets/menuIcon.png';
import { useSelector, useDispatch } from 'react-redux';
import backButton from '../../assets/backButton3.png';
import LanguageIcon from '../../assets/LanguageIcon.png';
import { setShouldShowBottomNav, 
    setSelectedLanguageCode } from '../../redux/userWalletData.tsx';
import { useParams } from 'react-router-dom';

function LanguagePage() {

    const [showMenu, setShowMenu] = useState(false);
    const dispatch = useDispatch()
    const [menuPosition, setMenuPosition] = useState('-150vh'); 
    const selectedLanguageCode = useSelector((state: any) => state.userWalletData.selectedLanguageCode);

    const { lang } = useParams();

    useEffect(() => {
        if (lang == 'es') {
            dispatch(setSelectedLanguageCode('es'))
        } else {
            dispatch(setSelectedLanguageCode('en'))
        }
      }, []);


    useEffect(() => {
        if (showMenu) {
          setMenuPosition('0'); // Bring the menu into view
        } else {
          setMenuPosition('-150vh'); // Move the menu off-screen
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


      const handleClick = (language: string) => {
        dispatch(setShouldShowBottomNav(true))
        dispatch(setSelectedLanguageCode(language))
        setShowMenu(!showMenu);
    };

    const checkmarkStyle = {
        color: 'green',
        marginLeft: 'auto',
        fontWeight: 'bold',
        fontSize: '20px'
    };


    return (
        <div style={{ backgroundColor: 'white' }}>

<img src={LanguageIcon} style={{width: '35px', height: '35px', opacity: '0.72'}}
onClick={handleMenuClick}></img>

{ showMenu && (
<div style={{ 
      position: 'absolute', // Position it relative to the viewport
      top: 0,              // Align to the top of the viewport
      left: 0,            // Align to the right of the viewport
      padding: '15px',
      cursor: 'pointer',
      zIndex: 4    
    }}>

        <img style={{width: 'auto', height: '35px', background: 'white'}} src={ showMenu ? (backButton) : menuIcon }
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
        transition: 'top 0.5s ease', // Animate the left property
        zIndex: 3  
      }}>

        <div style={{marginTop: '0px', textAlign: 'center', fontSize: '35px', color: '#222222'}}>Language</div>

        <div style={{ marginTop: '40px', display: 'flex', 
            flexDirection: 'column', fontSize: '20px', 
            gap: '15px', paddingLeft: '20px', alignItems: 'center' }}>
            
            <div style={{ display: 'flex', maxWidth: '400px', width: '70vw',
                paddingBottom: '15px',
                borderBottom: '1px solid #777777' }}
                onClick={() => handleClick('en')}>
                <div >English</div>
                {selectedLanguageCode === 'en' && <span style={checkmarkStyle}>&#10003;</span>}
            </div>
            <div style={{ display: 'flex', maxWidth: '400px', width: '70vw',
                paddingBottom: '15px',
                borderBottom: '1px solid #777777' }}
                onClick={() => handleClick('es')}>
                <div>Español</div>
                {selectedLanguageCode === 'es' && <span style={checkmarkStyle}>&#10003;</span>}
            </div>
        </div>

      </div> 


        </div>
    )
}

export default LanguagePage;