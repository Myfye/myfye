import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface DepositState {
  modal: {
    isOpen: boolean;
  };
}

const initialState: DepositState = {
  modal: {
    isOpen: false,
  },
};

const depositSlice = createSlice({
  name: "deposit",
  initialState,
  reducers: {
    toggleModal(state, action: PayloadAction<boolean>) {
      state.modal.isOpen = action.payload;
    },
    unmount: () => ({ ...initialState }),
  },
});

export const { toggleModal, unmount } = depositSlice.actions;
export default depositSlice.reducer;
