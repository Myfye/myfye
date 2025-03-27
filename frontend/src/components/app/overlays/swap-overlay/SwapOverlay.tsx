/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import Overlay from "@/components/ui/overlay/Overlay";

const SwapOverlay = ({ isOpen, onOpenChange }) => {
  return (
    <>
      <Overlay
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Review swap"
      ></Overlay>
    </>
  );
};

export default SwapOverlay;
