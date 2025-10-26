import getSolanaBalances from "@/functions/GetSolanaBalances";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSolanaPubKey } from "@/redux/userWalletData";
import { useSolanaWallets } from "@privy-io/react-auth";
import { useEffect } from "react";
import { updateUserSolanaPubKey } from "../misc/LoginService";

const usePrivySolanaWallets = () => {
  /*
    Create solana wallets for the user no input
    required. 

    Sets the pubkey in the redux store.

    Keeps track of when the wallet is ready to be used for 
    signing. (the passkey is connected)
    */
  const { createWallet, ready, wallets } = useSolanaWallets();

  const createWalletAsync = async () => {
    try {
      console.log("Creating wallet");
      await createWallet();
    } catch (error) {
      console.error("Error creating wallet", error);
    }
  };

  const dispatch = useAppDispatch();

  const privyUserId = useAppSelector(
    (state) => state.userWalletData.privyUserId
  );

  useEffect(() => {
    if (!wallets && ready) {
      createWalletAsync();
    }
  }, [wallets, ready, createWallet]);

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
    } else if (wallets && Array.isArray(wallets) && wallets.length === 0 && ready) {
      console.log("no wallets found:", wallets, "creating...");
      createWalletAsync();
    }
  }, [wallets, privyUserId, ready, createWallet, dispatch]);
};

export default usePrivySolanaWallets;
