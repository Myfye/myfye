import NumberPad from "@/components/ui/number-pad/NumberPad";
import PrivyUseSolanaWallets from "../../components/PrivyUseSolanaWallets";
import HomeTabs from "@/features/home/HomeTabs";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Button from "@/components/ui/button/Button";
import { useDispatch } from "react-redux";
import { toggleRequestOverlay, toggleSendOverlay } from "./paySlice";
import SelectContactOverlay from "./SelectContactOverlay";

const Pay = () => {
  const dispatch = useDispatch();

  const handleRequest = () => {
    dispatch(toggleRequestOverlay({ type: "selectContact", isOpen: true }));
  };

  const handlePay = () => {
    dispatch(toggleSendOverlay({ type: "selectContact", isOpen: true }));
  };

  return (
    <>
      <div
        className="pay"
        css={css`
          height: 100cqh;
        `}
      >
        <PayController />
        <NumberPad></NumberPad>
        <menu
          css={css`
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--controls-gap-medium);
          `}
        >
          <li>
            <Button expand onPress={handleRequest}>
              Request
            </Button>
          </li>
          <li>
            <Button expand onPress={handlePay}>
              Pay
            </Button>
          </li>
        </menu>
      </div>
      <RequestOverlay />
      <SendOverlay />
    </>
  );
};

export default Pay;
