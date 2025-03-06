import React, { useState, useEffect } from 'react';
import myfyeEarn from '../../assets/myfyeEarn.png'
import { useSelector, useDispatch } from 'react-redux';
import { setShowEarnPage, setDepositWithdrawProductType} from '../../redux/userWalletData.tsx';
import InvestmentValue from './InvestmentValue.tsx';

export default function EarnTile() {

    const dispatch = useDispatch();

    const handleEarnPageClick = () => {
        dispatch(setShowEarnPage(true))
        dispatch(setDepositWithdrawProductType('Earn'))
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      };

    const selectedLanguageCode = useSelector((state: any) => state.userWalletData.selectedLanguageCode);
    const usdySolBalance = useSelector((state: any) => state.userWalletData.usdySolBalance);

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
          <img style={{ width: '150px', height: 'auto'}}src={myfyeEarn}/>
          
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',}}>
          
              <label htmlFor="deposit" style={{ fontSize: '20px', 
               display: 'flex', alignItems: 'center', }}>
              $ <span style={{ fontSize: '35px' }}>
                
              <InvestmentValue/>
          
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
                     fontSize: '20px'     
                 }} onClick={handleEarnPageClick}>
                      {selectedLanguageCode === 'en' && `View Portfolio`}
                      {selectedLanguageCode === 'es' && `Ver Portafolio`}
                 </div>
                 </div>
                 </div>
          
          </div>
          </div>)}