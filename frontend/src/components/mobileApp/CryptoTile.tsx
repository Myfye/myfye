import React, { useState, useEffect } from 'react';
import myfyeCrypto from '../../assets/myfyeCrypto.png'
import { useSelector, useDispatch } from 'react-redux';
import { 
  setShowCryptoPage, 
  setDepositWithdrawProductType} from '../../redux/userWalletData.tsx';

export default function CryptoTile() {

    const dispatch = useDispatch();
    
    const priceOfBTCinUSDC = useSelector((state: any) => state.userWalletData.priceOfBTCinUSDC);
    const btcSolBalance = useSelector((state: any) => state.userWalletData.btcSolBalance);
    const selectedLanguageCode = useSelector((state: any) => state.userWalletData.selectedLanguageCode);

    const handleCryptoPageClick = () => {
        dispatch(setDepositWithdrawProductType('Crypto'))
        dispatch(setShowCryptoPage(true));
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      };

    return (
    
    <div style={{
  background: '#ffffff',
  borderRadius: '20px',
  boxShadow: '2px 5px 15px rgba(0, 0, 0, 0.2), -2px 5px 15px rgba(0, 0, 0, 0.2)',
  padding: '10px',
  paddingBottom: '16px',
  width: '90vw',
  marginTop: '15px',
}}>
<div style={{ display: 'flex',  alignItems: 'center', 
        flexDirection: 'column', color: '#222222', gap: window.innerHeight < 620 ? '1px' : '10px' }}>
<img style={{ width: '180px', height: 'auto'}} src={myfyeCrypto}/>
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',}}>

    <label htmlFor="deposit" style={{ fontSize: '20px', 
     display: 'flex', alignItems: 'center', }}>
    $ <span style={{ fontSize: '35px' }}>

    <div>
    {(btcSolBalance * priceOfBTCinUSDC).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
  </div>

    </span>
</label>

   
   </div>


<div>

<div style={{display: 'flex', alignItems: 'center', 
                justifyContent: 'center',
                marginTop: '0px'}}>
            <div style={{
           color: '#ffffff', 
           background: '#2E7D32', // gray '#999999', 
           borderRadius: '10px', 
           border: '2px solid #2E7D32', 
           fontWeight: 'bold',
           height: '40px', 
           width: '210px',
           display: 'flex',        // Makes this div also a flex container
           justifyContent: 'center', // Centers the text horizontally inside the button
           alignItems: 'center',// Centers the text vertically inside the button
           cursor: 'pointer',
           fontSize: '20px',     
       }} onClick={handleCryptoPageClick}>
            {selectedLanguageCode === 'en' && `View Portfolio`}
            {selectedLanguageCode === 'es' && `Ver Portafolio`}
       </div>
       </div>
       </div>
       </div>
</div> )}