import React, { useState, useEffect } from 'react';
import menuIcon from '../../assets/menuIcon.png';
import { useSelector } from 'react-redux';
import { 
    setPrivyWalletReady,
    setWallet
 } from '../redux/userWalletData.tsx';
import { useDispatch } from 'react-redux';
import {useSolanaWallets} from '@privy-io/react-auth/solana';


function PrivyUseSolanaWallets() {
    const {createWallet, ready, wallets} = useSolanaWallets();
    
    const dispatch = useDispatch();
    useEffect(() => {
        const createWalletAsync = async () => {
            try {
                await createWallet(); // Await the async function
            } catch (error) {
                console.error('Error ', error);
            }
        };
    
        createWalletAsync(); // Call the async function
    }, []);


    useEffect(() => {
        dispatch(setPrivyWalletReady((ready)))
    }, [ready]);

    useEffect(() => {

    }, []);


    return (
        <div>
        </div>
    );
}

export default PrivyUseSolanaWallets


