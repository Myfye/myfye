import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface WithdrawState {
  modal: {
    isOpen: boolean;
  };
}

// Define the initial state
const initialState: WithdrawState = {
  modal: {
    isOpen: false,
  },
};

const withdrawSlice = createSlice({
  name: "withdraw",
  initialState,
  reducers: {
    toggleModal(state, action: PayloadAction<boolean>) {
      state.modal.isOpen = action.payload;
    },
    unmount: () => ({ ...initialState }),
  },
});

export const { toggleModal, unmount } = withdrawSlice.actions;
export default withdrawSlice.reducer;
