/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import Overlay from "@/components/ui/overlay/Overlay";
import Button from "@/components/ui/button/Button";
import SwapCoinSummary from "./SwapCoinSummary";

const SwapOverlay = ({ isOpen, onOpenChange, buyCoin, sellCoin }) => {
  return (
    <>
      <Overlay isOpen={isOpen} onOpenChange={onOpenChange} title="Confirm Swap">
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
                  onPress={() => void onOpenChange(false)}
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

export default SwapOverlay;
