/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import Overlay from "@/components/ui/overlay/Overlay";
import CryptoSummary from "./crypto/CryptoSummary";

const CoinSummaryOverlay = ({ isOpen, onOpenChange }) => {
  return (
    <>
      <Overlay isOpen={isOpen} onOpenChange={onOpenChange}>
        <CryptoSummary />
      </Overlay>
    </>
  );
};

export default CoinSummaryOverlay;
