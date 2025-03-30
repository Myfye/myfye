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
export const receiveModalSlice = createSlice({
  name: "receiveModal",
  initialState: { isOpen: false },
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});
export const depositModalSlice = createSlice({
  name: "depositModal",
  initialState: { isOpen: false },
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});
export const withdrawModalSlice = createSlice({
  name: "withdrawModal",
  initialState: { isOpen: false },
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});
export const QRCodeModalSlice = createSlice({
  name: "QRCodeModal",
  initialState: { isOpen: false },
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});
export const addContactModalSlice = createSlice({
  name: "addContactModal",
  initialState: { isOpen: false },
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});
export const swapModalSlice = createSlice({
  name: "swapModalSlice",
  initialState: { isOpen: false },
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const sendModalReducer = sendModalSlice.reducer;
export const receiveModalReducer = receiveModalSlice.reducer;
export const depositModalReducer = depositModalSlice.reducer;
export const withdrawModalReducer = withdrawModalSlice.reducer;
export const QRCodeModalReducer = QRCodeModalSlice.reducer;
export const addContactModalReducer = addContactModalSlice.reducer;
export const swapModalReducer = swapModalSlice.reducer;

export const { setOpen: setSendModalOpen } = sendModalSlice.actions;
export const { setOpen: setReceiveModalOpen } = receiveModalSlice.actions;
export const { setOpen: setDepositModalOpen } = depositModalSlice.actions;
export const { setOpen: setWithdrawModalOpen } = withdrawModalSlice.actions;
export const { setOpen: setQRCodeModalOpen } = QRCodeModalSlice.actions;
export const { setOpen: setAddContactModalOpen } = addContactModalSlice.actions;
export const { setOpen: setSwapModalOpen } = swapModalSlice.actions;
