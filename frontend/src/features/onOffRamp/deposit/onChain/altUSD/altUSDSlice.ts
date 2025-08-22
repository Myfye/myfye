import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AltUSDState {
  modal: {
    isOpen: boolean;
  };
  balances: {
    usdtBalance: number;
    pyusdBalance: number;
  };
}

const initialState: AltUSDState = {
  modal: {
    isOpen: false,
  },
  balances: {
    usdtBalance: 0,
    pyusdBalance: 0,
  },
};

const altUSDSlice = createSlice({
  name: "altUSD",
  initialState,
  reducers: {
    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.modal.isOpen = action.payload;
    },
    setUSDTBalance: (state, action: PayloadAction<number>) => {
      console.log(`DETECT ALT USD Redux: setUSDTBalance called with ${action.payload}`);
      state.balances.usdtBalance = action.payload;
      // Auto-open modal if USDT balance is significant
      if (action.payload > 0.01) {
        console.log(`DETECT ALT USD Redux: Auto-opening modal for USDT balance ${action.payload}`);
        state.modal.isOpen = true;
      }
      console.log(`DETECT ALT USD Redux: State after setUSDTBalance:`, {
        usdtBalance: state.balances.usdtBalance,
        pyusdBalance: state.balances.pyusdBalance,
        modalIsOpen: state.modal.isOpen
      });
    },
    setPYUSDBalance: (state, action: PayloadAction<number>) => {
      console.log(`DETECT ALT USD Redux: setPYUSDBalance called with ${action.payload}`);
      state.balances.pyusdBalance = action.payload;
      // Auto-open modal if PYUSD balance is significant
      if (action.payload > 0.01) {
        console.log(`DETECT ALT USD Redux: Auto-opening modal for PYUSD balance ${action.payload}`);
        state.modal.isOpen = true;
      }
      console.log(`DETECT ALT USD Redux: State after setPYUSDBalance:`, {
        usdtBalance: state.balances.usdtBalance,
        pyusdBalance: state.balances.pyusdBalance,
        modalIsOpen: state.modal.isOpen
      });
    },
    setBalances: (state, action: PayloadAction<{ usdtBalance: number; pyusdBalance: number }>) => {
      state.balances = action.payload;
      // Auto-open modal if either balance is significant
      if (action.payload.usdtBalance > 0.01 || action.payload.pyusdBalance > 0.01) {
        state.modal.isOpen = true;
      }
    },
    unmount: () => ({ ...initialState }),
  },
});

export const { 
  setModalOpen, 
  setUSDTBalance, 
  setPYUSDBalance, 
  setBalances, 
  unmount 
} = altUSDSlice.actions;

export default altUSDSlice.reducer;
