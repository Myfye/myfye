import { configureStore } from "@reduxjs/toolkit";
//import currentUserDataReducer from './ephemeralUserData';
import userWalletDataReducer from "./userWalletData.tsx";
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
import { currentCoinReducer } from "./coinReducer.tsx";
import { currentContactReducer } from "./contactReducer.tsx";

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

    // Current coin/contact for sending/receiving
    currentCoin: currentCoinReducer,
    currentContact: currentContactReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
