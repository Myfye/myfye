import React, { useState, useEffect } from "react";
import menuIcon from "../../assets/menuIcon.png";
import { useSelector } from "react-redux";
import {
  setPrivySolanaWalletReady,
  setSolanaPubKey,
} from "../redux/userWalletData.tsx";
import { useDispatch } from "react-redux";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { updateUserSolanaPubKey } from "../features/authentication/LoginService.tsx";
import getSolanaBalances from "../functions/GetSolanaBalances.tsx";

function PrivyUseSolanaWallets() {
  /*
    Create solana wallets for the user no input
    required. 

    Sets the pubkey in the redux store.

    Keeps track of when the wallet is ready to be used for 
    signing. (the passkey is connected)
    */
  const { createWallet, ready, wallets } = useSolanaWallets();
  const dispatch = useDispatch();
  const currentUser = useSelector(
    (state: any) => state.userWalletData.currentUserEmail
  );
  const privyUserId = useSelector(
    (state: any) => state.userWalletData.privyUserId
  );

  useEffect(() => {
    if (!wallets) {
      createWalletAsync();
    }
  }, []);

  /*
    useEffect(() => {
        console.log('ready', ready);
    }, [ready]);
    */

  useEffect(() => {
    if (Array.isArray(wallets) && wallets.length > 0 && wallets[0].address) {
      const solanaAddress = wallets[0].address;
      dispatch(setSolanaPubKey(solanaAddress));

      // Get the balances
      getSolanaBalances(solanaAddress, dispatch);

      // Save the Solana public key to the database
      if (privyUserId) {
        updateUserSolanaPubKey(privyUserId, solanaAddress).catch((error) =>
          console.error("Error saving Solana public key:", error)
        );
      }
    } else {
      console.log("no wallets found:", wallets, "creating...");
      createWalletAsync();
    }
  }, [wallets, privyUserId]);

  useEffect(() => {
    // The wallet is ready to be used for signing
    // If it is not ready, the pass key probably
    // Needs to be connected to the user
    dispatch(setPrivySolanaWalletReady(ready));
  }, [ready]);

  const createWalletAsync = async () => {
    try {
      console.log("creating wallet");
      await createWallet();
    } catch (error) {
      console.error("Error ", error);
    }
  };

  return <></>;
}

export default PrivyUseSolanaWallets;
