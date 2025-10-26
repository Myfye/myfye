import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ActivityState {
  overlays: {
    activity: {
      isOpen: boolean;
    };
  };
}

const initialState: ActivityState = {
  overlays: {
    activity: {
      isOpen: false,
    },
  },
};

const activitySlice = createSlice({
  name: "pay",
  initialState,
  reducers: {
    toggleOverlay: (
      state,
      action: PayloadAction<{
        type: "activity";
        isOpen: boolean;
      }>
    ) => {
      const newOverlays = {
        ...state.overlays,
        [action.payload.type]: {
          ...state.overlays[action.payload.type],
          isOpen: action.payload.isOpen,
        },
      };
      state.overlays = newOverlays;
    },
    unmountOverlays: (state) => {
      state.overlays = { ...initialState.overlays };
      state = { ...state, overlays: { ...initialState.overlays } };
    },
    unmount: () => ({ ...initialState }),
  },
});

export const { toggleOverlay, unmount, unmountOverlays } =
  activitySlice.actions;
export default activitySlice.reducer;
