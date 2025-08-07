import { configureStore } from "@reduxjs/toolkit";
//import currentUserDataReducer from './ephemeralUserData';
import userWalletDataReducer from "./userWalletData.tsx";
import swapReducer from "@/features/swap/swapSlice.ts";
import kycReducer from "@/features/compliance/kycSlice.ts";
import {
  QRCodeModalReducer,
  addContactModalReducer,
} from "./modalReducers.tsx";
import {
  cashBalanceOverlayReducer,
  coinSummaryOverlayReducer,
  cryptoBalanceOverlayReducer,
  selectContactOverlayReducer,
  settingsOverlayReducer,
  userInfoOverlayReducer,
} from "./overlayReducers.tsx";

import assetsReducer from "@/features/assets/assetsSlice.ts";
import sendReducer from "@/features/send/sendSlice.ts";
import receiveReducer from "@/features/receive/receiveSlice.ts";
import payReducer from "@/features/pay/paySlice.ts";
import withdrawReducer from "@/features/onOffRamp/withdraw/withdrawSlice.ts";
import withdrawOnChainReducer from "@/features/onOffRamp/withdraw/onChain/withdrawOnChainSlice.ts";
import withdrawOffChainReducer from "@/features/onOffRamp/withdraw/offChain/withdrawOffChainSlice.ts";
import depositOffChainReducer from "@/features/onOffRamp/deposit/offChain/depositOffChainSlice.ts";
import depositReducer from "@/features/onOffRamp/deposit/depositSlice.ts";
import { usersApi } from "@/features/users/usersApi.ts";
import { setupListeners } from "@reduxjs/toolkit/query";
import { contactsApi } from "@/features/contacts/contactsApi.ts";
import { solanaApi } from "@/features/solana/solanaApi.ts";
import { depositApi } from "@/features/onOffRamp/deposit/depositApi.ts";

const store = configureStore({
  reducer: {
    userWalletData: userWalletDataReducer,

    // Modals
    // USE SPECIFIC SLICES NOT THESE
    QRCodeModal: QRCodeModalReducer,
    addContactModal: addContactModalReducer,

    // Overlays
    // USE SPECIFIC SLICES NOT THESE
    cashBalanceOverlay: cashBalanceOverlayReducer,
    cryptoBalanceOverlay: cryptoBalanceOverlayReducer,
    userInfoOverlay: userInfoOverlayReducer,
    settingsOverlay: settingsOverlayReducer,
    selectContactOverlay: selectContactOverlayReducer,

    // Coin overlay
    // USE SPECIFIC SLICES NOT THESE
    coinSummaryOverlay: coinSummaryOverlayReducer,

    // Swap
    swap: swapReducer,

    // KYC
    kyc: kycReducer,

    // Assets
    assets: assetsReducer,

    // Send
    send: sendReducer,

    // Receive
    receive: receiveReducer,

    // Pay
    pay: payReducer,

    // Withdraw
    withdraw: withdrawReducer,
    withdrawOnChain: withdrawOnChainReducer,
    withdrawOffChain: withdrawOffChainReducer,

    // deposit
    deposit: depositReducer,
    depositOffChain: depositOffChainReducer,

    // APIs
    [usersApi.reducerPath]: usersApi.reducer,
    [contactsApi.reducerPath]: contactsApi.reducer,
    [solanaApi.reducerPath]: solanaApi.reducer,
    [depositApi.reducerPath]: depositApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      usersApi.middleware,
      contactsApi.middleware,
      solanaApi.middleware,
      depositApi.middleware,
    ]),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);

export default store;
