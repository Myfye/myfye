import React, { useState, useEffect } from 'react';
import myfyeWallet from '../../assets/myfyeWallet2.png'
import { useDispatch, useSelector } from 'react-redux';
import { setShowMainDepositPage, 
    setShowWithdrawStablecoinPage } from '../../redux/userWalletData.tsx';
    
export default function WalletTile() {

    const usdcSolBalance = useSelector((state: any) => state.userWalletData.usdcSolBalance);
    const usdtSolBalance = useSelector((state: any) => state.userWalletData.usdtSolBalance);
    const eurcSolBalance = useSelector((state: any) => state.userWalletData.eurcSolBalance);
    const selectedLanguageCode = useSelector((state: any) => state.userWalletData.selectedLanguageCode);
    
    const dispatch = useDispatch();

    const handleMainDepositPageClick = () => {
        dispatch(setShowMainDepositPage(true))
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      };
    
      const handleMainWithdrawPageClick = () => {
        dispatch(setShowWithdrawStablecoinPage(true))
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
  marginTop: '15px'
}}>
<div style={{ display: 'flex',  alignItems: 'center', 
        flexDirection: 'column', color: '#222222', gap: window.innerHeight < 620 ? '1px' : '10px'  }}>
<div style={{display: 'flex', marginTop: '0px'}}>

  <img style={{ width: '180px', height: 'auto'}}src={myfyeWallet}/>

</div>

<div style={{ display: 'flex', alignItems: 'center', 
  justifyContent: 'center', flexDirection: 'column',}}>


  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', 
  width: '100%', minWidth: '240px', marginTop: '0px'}}>


  <div style={{fontSize: '25px', width: '200px', letterSpacing: '0.25px'}}>USD$ Balance:</div>
    <label style={{ fontSize: '20px', 
     display: 'flex', alignItems: 'center', }}>
    $ <span style={{ fontSize: '35px' }}>
      
    <div>
    {((usdcSolBalance + usdtSolBalance).toFixed(2)).toLocaleString('en-US')}
  </div>

    </span>
</label>

</div>



  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', 
  width: '100%', minWidth: '240px', marginTop: '-2px'}}>


  <div style={{fontSize: '25px', width: '200px',letterSpacing: '0.5px'}}>EUR€ Balance:</div>
  
    <label style={{ fontSize: '20px', 
     display: 'flex', alignItems: 'center', }}>
    € <span style={{ fontSize: '35px' }}>

    <div>
    {((eurcSolBalance).toFixed(2)).toLocaleString('en-US')}
  </div>

    </span>
</label>

</div>

   </div>




   {/*
   <Deposit/>
    <Withdraw/>
           <HoldingsPortfolio/>
  */}

<div style={{display: 'flex', 
alignItems: 'center', 
                justifyContent: 'space-around',
                marginTop: '0px',
                width: '95vw'}}>

            <div style={{
           color: '#ffffff', 
           background: '#2E7D32', // gray '#999999', 
           borderRadius: '10px', 
           border: '2px solid #2E7D32', 
           fontWeight: 'bold',
           cursor: 'pointer',
           fontSize: '20px',
           padding: '9px',
           width: '120px',
           textAlign: 'center'
       }} onClick={handleMainDepositPageClick}>
            {selectedLanguageCode === 'en' && `Deposit`}
            {selectedLanguageCode === 'es' && `Déposito`}
       </div>
       <div style={{
           color: '#ffffff', 
           background: '#2E7D32', // gray '#999999', 
           borderRadius: '10px', 
           border: '2px solid #2E7D32', 
           fontWeight: 'bold',
            padding: '9px',
           cursor: 'pointer',
           fontSize: '20px',     
           width: '120px',
           textAlign: 'center'
       }} onClick={handleMainWithdrawPageClick}>
            {selectedLanguageCode === 'en' && `Withdraw`}
            {selectedLanguageCode === 'es' && `Retirar`}
       </div>
       </div>

       </div>
       </div>)}