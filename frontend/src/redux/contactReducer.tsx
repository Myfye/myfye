import { createSlice } from "@reduxjs/toolkit";

export const currentContactSlice = createSlice({
  name: "currentContact",
  initialState: { contact: null },
  reducers: {
    addCurrentContact: (state, action) => {
      state.contact = action.payload;
    },
    removeCurrentContact: (state) => {
      state.contact = null;
    },
  },
});

export const currentContactReducer = currentContactSlice.reducer;
export const { addCurrentContact, deleteCurrentContact } =
  currentContactSlice.actions;
