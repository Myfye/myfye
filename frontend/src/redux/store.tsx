import { configureStore } from "@reduxjs/toolkit";
//import currentUserDataReducer from './ephemeralUserData';
import userWalletDataReducer from "./userWalletData.tsx";
import {
  QRCodeModalReducer,
  depositModalReducer,
  receiveModalReducer,
  sendModalReducer,
  withdrawModalReducer,
} from "./modalReducers.tsx";

const store = configureStore({
  reducer: {
    userWalletData: userWalletDataReducer,
    sendModal: sendModalReducer,
    receiveModal: receiveModalReducer,
    depositModal: depositModalReducer,
    withdrawModal: withdrawModalReducer,
    QRCodeModal: QRCodeModalReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
