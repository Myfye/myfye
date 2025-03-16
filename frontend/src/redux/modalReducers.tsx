import { createSlice } from "@reduxjs/toolkit";

export const sendModalSlice = createSlice({
  name: "sendModal",
  initialState: { isOpen: false },
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

const sendModalReducer = sendModalSlice.reducer;

export const { setOpen: setSendModalOpen } = sendModalSlice.actions;

export const receiveModalSlice = createSlice({
  name: "receiveModal",
  initialState: { isOpen: false },
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

const receiveModalReducer = receiveModalSlice.reducer;

export const { setOpen: setReceiveModalOpen } = receiveModalSlice.actions;

export const depositModalSlice = createSlice({
  name: "depositModal",
  initialState: { isOpen: false },
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

const depositModalReducer = depositModalSlice.reducer;

export const { setOpen: setDepositModalOpen } = depositModalSlice.actions;

export const withdrawModalSlice = createSlice({
  name: "withdrawModal",
  initialState: { isOpen: false },
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

const withdrawModalReducer = withdrawModalSlice.reducer;

export const { setOpen: setWithdrawModalOpen } = withdrawModalSlice.actions;

export const QRCodeModalSlice = createSlice({
  name: "QRCodeModal",
  initialState: { isOpen: false },
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

const QRCodeModalReducer = QRCodeModalSlice.reducer;

export const { setOpen: setQRCodeModalOpen } = QRCodeModalSlice.actions;

export {
  sendModalReducer,
  receiveModalReducer,
  depositModalReducer,
  withdrawModalReducer,
  QRCodeModalReducer,
};
