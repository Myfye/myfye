// import { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { setSolanaPubKey } from "../../redux/userWalletData.tsx";
// import { useDispatch } from "react-redux";
// import { useSolanaWallets } from "@privy-io/react-auth/solana";
// import { updateUserSolanaPubKey } from "./LoginService.tsx";
// import getSolanaBalances from "../../functions/GetSolanaBalances.tsx";

// export const usePrivySolanaWallets = ({
//   privyUserId,
// }: {
//   privyUserId: string;
// }) => {
//   /*
//     Create solana wallets for the user no input
//     required.

//     Sets the pubkey in the redux store.

//     Keeps track of when the wallet is ready to be used for
//     signing. (the passkey is connected)
//     */
//   const { createWallet, wallets } = useSolanaWallets();
//   const [wallet] = wallets;

//   const createWalletAsync = async () => {
//     try {
//       console.log("Creating wallet");
//       await createWallet();
//     } catch (error) {
//       console.error("Error creating wallet", error);
//     }
//   };

//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (!wallets || wallet.address) {
//       createWalletAsync();
//     }
//   }, []);

//   if (wallet.address) {
//     dispatch(setSolanaPubKey(wallet.address));

//     // Get the balances
//     getSolanaBalances(wallet.address, dispatch);

//     // Save the Solana public key to the database
//     if (privyUserId) {
//       updateUserSolanaPubKey(privyUserId, wallet.address).catch((error) =>
//         console.error("Error saving Solana public key:", error)
//       );
//     }
//   } else {
//     console.log("no wallets found:", wallets, "creating...");
//     createWalletAsync();
//   }
// };
