import { createSlice } from "@reduxjs/toolkit";

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

export const QRCodeModalReducer = QRCodeModalSlice.reducer;
export const addContactModalReducer = addContactModalSlice.reducer;

export const { setOpen: setQRCodeModalOpen } = QRCodeModalSlice.actions;
export const { setOpen: setAddContactModalOpen } = addContactModalSlice.actions;
