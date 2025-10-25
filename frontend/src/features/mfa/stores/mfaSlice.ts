import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MFAStatus } from "../types/mfa.types";

interface MFAState {
  status: MFAStatus;
}
const initialState: MFAState = {
  status: null,
};

const mfaSlice = createSlice({
  name: "mfa",
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<MFAStatus>) => {
      state.status = action.payload;
    },
  },
});

export const { setStatus } = mfaSlice.actions;
export default mfaSlice.reducer;
