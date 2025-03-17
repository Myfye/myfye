import { createSlice } from "@reduxjs/toolkit";

export const withdrawFiatOverlaySlice = createSlice({
  name: "withdrawFiatOverlay",
  initialState: { isOpen: false },
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const withdrawCryptoOverlaySlice = createSlice({
  name: "withdrawCryptoOverlay",
  initialState: { isOpen: false },
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const cashBalanceOverlaySlice = createSlice({
  name: "cashBalanceOverlay",
  initialState: { isOpen: false },
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const cryptoBalanceOverlaySlice = createSlice({
  name: "cryptoBalanceOverlay",
  initialState: { isOpen: false },
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const sendOverlaySlice = createSlice({
  name: "sendOverlay",
  initialState: { isOpen: false },
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const requestOverlaySlice = createSlice({
  name: "requestOverlay",
  initialState: { isOpen: false },
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const depositFiatOverlaySlice = createSlice({
  name: "depositFiatOverlay",
  initialState: { isOpen: false },
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const userInfoOverlaySlice = createSlice({
  name: "userInfoOverlay",
  initialState: { isOpen: false },
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const settingsOverlaySlice = createSlice({
  name: "settingsOverlay",
  initialState: { isOpen: false },
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

// Reducers
export const withdrawFiatOverlayReducer = withdrawFiatOverlaySlice.reducer;
export const withdrawCryptoOverlayReducer = withdrawCryptoOverlaySlice.reducer;
export const cashBalanceOverlayReducer = cashBalanceOverlaySlice.reducer;
export const cryptoBalanceOverlayReducer = cryptoBalanceOverlaySlice.reducer;
export const sendOverlayReducer = sendOverlaySlice.reducer;
export const requestOverlayReducer = requestOverlaySlice.reducer;
export const depositFiatOverlayReducer = depositFiatOverlaySlice.reducer;
export const userInfoOverlayReducer = userInfoOverlaySlice.reducer;
export const settingsOverlayReducer = settingsOverlaySlice.reducer;

// Actions
export const { setOpen: setWithdrawFiatOverlayOpen } =
  withdrawFiatOverlaySlice.actions;
export const { setOpen: setWithdrawCryptoOverlayOpen } =
  withdrawCryptoOverlaySlice.actions;
export const { setOpen: setCashBalanceOverlayOpen } =
  cashBalanceOverlaySlice.actions;
export const { setOpen: setCryptoBalanceOverlayOpen } =
  cryptoBalanceOverlaySlice.actions;
export const { setOpen: setSendOverlayOpen } = sendOverlaySlice.actions;
export const { setOpen: setRequestOverlayOpen } = requestOverlaySlice.actions;
export const { setOpen: setDepositFiatOverlayOpen } =
  depositFiatOverlaySlice.actions;
export const { setOpen: setUserInfoOverlayOpen } = userInfoOverlaySlice.actions;
export const { setOpen: setSettingsOverlayOpen } = settingsOverlaySlice.actions;
