import React, { useState, useEffect } from 'react';
import menuIcon from '../../assets/menuIcon.png';
import { useSelector } from 'react-redux';
import { 
    setPrivySolanaWalletReady,
    setSolanaPubKey
 } from '../redux/userWalletData.tsx';
import { useDispatch } from 'react-redux';
import {useSolanaWallets} from '@privy-io/react-auth/solana';


function PrivyUseSolanaWallets() {
    /*
    Create solana wallets for the user no input
    required. 

    Sets the pubkey in the redux store.

    Keeps track of when the wallet is ready to be used for 
    signing. (the passkey is connected)
    */
    const {createWallet, ready, wallets} = useSolanaWallets();
    const dispatch = useDispatch();

    useEffect(() => { 
        if (!wallets) {
            createWalletAsync(); // Call the async function
        }
    }, []);


    useEffect(() => {
        console.log('solana wallets', wallets);
        if (Array.isArray(wallets) && wallets.length > 0 && wallets[0].address) {
            dispatch(setSolanaPubKey(wallets[0].address));
        } else {
            console.log('no wallets found:', wallets, 'creating...');
            createWalletAsync();
        }
    }, [wallets]);


    useEffect(() => {
        // The wallet is ready to be used for signing 
        // If it is not ready, the pass key probably
        // Needs to be connected to the user
        dispatch(setPrivySolanaWalletReady((ready)))
    }, [ready]);

    const createWalletAsync = async () => {
        try {
            console.log('creating wallet');
            await createWallet(); // Await the async function
        } catch (error) {
            console.error('Error ', error);
        }
    };

    return (
        <div>
        </div>
    );
}

export default PrivyUseSolanaWallets


