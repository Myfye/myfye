import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type CTACarouselPopupTypes = "bitcoin" | "earn" | "invest";
interface CTACarouselState {
  popups: {
    [key in CTACarouselPopupTypes]: {
      isOpen: boolean;
    };
  };
}

const initialState = {
  popups: {
    earn: {
      isOpen: false,
    },
    invest: {
      isOpen: false,
    },
    bitcoin: {
      isOpen: false,
    },
  },
} satisfies CTACarouselState as CTACarouselState;

const ctaCarouselSlice = createSlice({
  name: "ctaCarouselSlice",
  initialState,
  reducers: {
    togglePopup: (
      state,
      action: PayloadAction<{ type: CTACarouselPopupTypes; isOpen: boolean }>
    ) => {
      state.popups[action.payload.type].isOpen = action.payload.isOpen;
    },
  },
});

export const { togglePopup } = ctaCarouselSlice.actions;
export default ctaCarouselSlice.reducer;
