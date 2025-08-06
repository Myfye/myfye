import { configureStore } from "@reduxjs/toolkit";
//import currentUserDataReducer from './ephemeralUserData';
import userWalletDataReducer from "./userWalletData.tsx";
import swapReducer from "@/features/swap/swapSlice.ts";
import kycReducer from "@/features/compliance/kycSlice.ts";
import {
  QRCodeModalReducer,
  addContactModalReducer,
  depositModalReducer,
  receiveModalReducer,
  sendModalReducer,
  withdrawModalReducer,
} from "./modalReducers.tsx";
import {
  cashBalanceOverlayReducer,
  coinSummaryOverlayReducer,
  cryptoBalanceOverlayReducer,
  depositFiatOverlayReducer,
  requestOverlayReducer,
  selectContactOverlayReducer,
  sendOverlayReducer,
  settingsOverlayReducer,
  userInfoOverlayReducer,
  withdrawCryptoOverlayReducer,
  withdrawFiatOverlayReducer,
} from "./overlayReducers.tsx";

import assetsReducer from "@/features/assets/assetsSlice.ts";
import sendReducer from "@/features/send/sendSlice.ts";
import receiveReducer from "@/features/receive/receiveSlice.ts";
import payReducer from "@/features/pay/paySlice.ts";
import withdrawReducer from "@/features/onOffRamp/withdraw/withdrawSlice.ts";
import withdrawOnChainReducer from "@/features/onOffRamp/withdraw/onChain/withdrawOnChainSlice.ts";
import withdrawOffChainReducer from "@/features/onOffRamp/withdraw/offChain/withdrawOffChainSlice.ts";
import { usersApi } from "@/features/users/usersApi.ts";
import { setupListeners } from "@reduxjs/toolkit/query";
import { contactsApi } from "@/features/contacts/contactsApi.ts";
import { solanaApi } from "@/features/solana/solanaApi.ts";

const store = configureStore({
  reducer: {
    userWalletData: userWalletDataReducer,

    // Modals
    sendModal: sendModalReducer,
    receiveModal: receiveModalReducer,
    depositModal: depositModalReducer,
    withdrawModal: withdrawModalReducer,
    QRCodeModal: QRCodeModalReducer,
    addContactModal: addContactModalReducer,

    // Overlays
    withdrawFiatOverlay: withdrawFiatOverlayReducer,
    withdrawCryptoOverlay: withdrawCryptoOverlayReducer,
    cashBalanceOverlay: cashBalanceOverlayReducer,
    cryptoBalanceOverlay: cryptoBalanceOverlayReducer,
    sendOverlay: sendOverlayReducer,
    requestOverlay: requestOverlayReducer,
    depositFiatOverlay: depositFiatOverlayReducer,
    userInfoOverlay: userInfoOverlayReducer,
    settingsOverlay: settingsOverlayReducer,
    selectContactOverlay: selectContactOverlayReducer,

    // Coin overlay
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

    // APIs
    [usersApi.reducerPath]: usersApi.reducer,
    [contactsApi.reducerPath]: contactsApi.reducer,
    [solanaApi.reducerPath]: solanaApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      usersApi.middleware,
      contactsApi.middleware,
      solanaApi.middleware,
    ]),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);

export default store;
