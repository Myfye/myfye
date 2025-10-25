import { configureStore } from "@reduxjs/toolkit";
//import currentUserDataReducer from './ephemeralUserData';
import userWalletDataReducer from "./userWalletData.tsx";
import swapReducer from "@/features/swap/stores/swapSlice.ts";
import kycReducer from "@/features/compliance/stores/kycSlice.ts";
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

import assetsReducer from "@/features/assets/stores/assetsSlice.ts";
import sendReducer from "@/features/send/stores/sendSlice.ts";
import receiveReducer from "@/features/receive/stores/receiveSlice.ts";
import payReducer from "@/features/pay/stores/paySlice.ts";
import withdrawReducer from "@/features/onOffRamp/withdraw/withdrawSlice.ts";
import withdrawOnChainReducer from "@/features/onOffRamp/withdraw/onChain/withdrawOnChainSlice.ts";
import withdrawOffChainReducer from "@/features/onOffRamp/withdraw/offChain/withdrawOffChainSlice.ts";
import depositOffChainReducer from "@/features/onOffRamp/deposit/offChain/depositOffChainSlice.ts";
import depositReducer from "@/features/onOffRamp/deposit/depositSlice.ts";
import mfaReducer from "@/features/mfa/stores/mfaSlice.ts";
import altUSDReducer from "@/features/onOffRamp/deposit/onChain/altUSD/altUSDSlice.ts";
import { setupListeners } from "@reduxjs/toolkit/query";
import { contactsApi } from "@/features/contacts/api/contactsApi.ts";
import { solanaApi } from "@/features/solana/solanaApi.ts";
import { depositApi } from "@/features/onOffRamp/deposit/depositApi.ts";
import { baseRelayerApi } from "@/features/base_relayer/api/baseRelayerApi.ts";
import { withdrawApi } from "@/features/onOffRamp/withdraw/withdrawApi.ts";
import ctaCarouselReducer from "@/shared/components/ui/cta-carousel/ctaCarouselSlice.ts";
import { activityApi } from "@/features/activity/api/activityApi.ts";
import activityReducer from "@/features/activity/stores/activitySlice.ts";
import { usersApi } from "@/features/users/api/usersApi.ts";

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

    activity: activityReducer,

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
    altUSD: altUSDReducer,

    // MFA
    mfa: mfaReducer,

    // CTA Carousel
    ctaCarousel: ctaCarouselReducer,

    // APIs
    [usersApi.reducerPath]: usersApi.reducer,
    [contactsApi.reducerPath]: contactsApi.reducer,
    [solanaApi.reducerPath]: solanaApi.reducer,
    [depositApi.reducerPath]: depositApi.reducer,
    [withdrawApi.reducerPath]: withdrawApi.reducer,
    [baseRelayerApi.reducerPath]: baseRelayerApi.reducer,
    [activityApi.reducerPath]: activityApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      usersApi.middleware,
      contactsApi.middleware,
      solanaApi.middleware,
      depositApi.middleware,
      withdrawApi.middleware,
      baseRelayerApi.middleware,
      activityApi.middleware,
    ]),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);

export default store;
