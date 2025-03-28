/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import Overlay from "@/components/ui/overlay/Overlay";
import Button from "@/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SwapCoinSummary from "./SwapCoinSummary";
import { toggleOverlay } from "./swapSlice";

const ConfirmSwapOverlay = ({ zIndex = 1000 }) => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.swap.overlays.confirmSwap.isOpen
  );

  const handleOpen = (e: boolean) => {
    dispatch(toggleOverlay({ type: "confirmSwap", isOpen: e }));
  };

  return (
    <>
      <Overlay
        isOpen={isOpen}
        onOpenChange={handleOpen}
        title="Confirm Swap"
        zIndex={zIndex}
      >
        <div>
          <section>
            <SwapCoinSummary />
          </section>
          <section></section>
          <section>
            <menu
              css={css`
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: var(--control-gap-medium);
              `}
            >
              <li>
                <Button
                  expand
                  variant="neutral"
                  onPress={() =>
                    void dispatch(
                      toggleOverlay({ type: "confirmSwap", isOpen: false })
                    )
                  }
                >
                  Cancel
                </Button>
              </li>
              <li>
                <Button expand>Confirm</Button>
              </li>
            </menu>
          </section>
        </div>
      </Overlay>
    </>
  );
};

export default ConfirmSwapOverlay;
