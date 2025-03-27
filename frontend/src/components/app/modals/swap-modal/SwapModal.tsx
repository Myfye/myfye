import { useCallback, useEffect, useMemo, useState } from "react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Modal from "@/components/ui/modal/Modal";
import NumberPad from "@/components/ui/number-pad/NumberPad";
import Button from "@/components/ui/button/Button";
import SwapOverlay from "../../overlays/swap-overlay/SwapOverlay";
import SwapInputController from "./SwapInputController";

export type SwapState = "buy" | "sell";

const SwapModal = ({ isOpen, onOpenChange }) => {
  const [height] = useState(667);
  const [isSwapOverlayOpen, setSwapOverlayOpen] = useState(false);

  const [buyValueArr, setBuyValueArr] = useState(["0"]);
  const [sellValueArr, setSellValueArr] = useState(["0"]);

  const sellGhostValueArr = useMemo(
    () => generateGhostValueArr(sellValueArr),
    [buyValueArr]
  );
  const buyGhostValueArr = useMemo(
    () => generateGhostValueArr(buyValueArr),
    [buyValueArr]
  );

  const buyValueStr = useMemo(() => buyValueArr.join(""), [buyValueArr]);
  const sellValueStr = useMemo(() => sellValueArr.join(""), [sellValueArr]);
  const buyGhostValueStr = useMemo(
    () => buyGhostValueArr.join(""),
    [buyGhostValueArr]
  );
  const sellGhostValueStr = useMemo(
    () => sellGhostValueArr.join(""),
    [sellGhostValueArr]
  );

  const [focusedSwapControl, setFocusedSwapControl] =
    useState<SwapState>("buy");

  const onFocusedSwapControlChange = (state: SwapState) => {
    setFocusedSwapControl(state);
  };

  const handleNumpadChange = (e) => {
    focusedSwapControl === "buy"
      ? setBuyValueArr((arr) => formatValue(e, arr))
      : setSellValueArr((arr) => formatValue(e, arr));
  };

  useEffect(() => {
    console.log(buyValueArr, sellValueArr, focusedSwapControl);
  }, [buyValueArr, sellValueArr, focusedSwapControl]);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Swap"
        subtitle="Swap crypto to cash, and more!"
        height={height}
      >
        <div
          css={css`
            margin-inline: var(--size-200);
            margin-block-start: var(--size-500);
            display: flex;
            flex-direction: column;
            min-height: fit-content;
            height: ${height};
            gap: var(--size-400);
          `}
        >
          <section>
            <SwapInputController
              focusedSwapControl={focusedSwapControl}
              onFocusedSwapControlChange={onFocusedSwapControlChange}
              buyValue={buyValueStr}
              buyGhostValue={buyGhostValueStr}
              sellValue={sellValueStr}
              sellGhostValue={sellGhostValueStr}
            />
          </section>
          <section>
            <Button expand onPress={() => setSwapOverlayOpen(true)}>
              Confirm
            </Button>
          </section>
          <section>
            <NumberPad onChange={handleNumpadChange} />
          </section>
        </div>
      </Modal>
      <SwapOverlay
        isOpen={isSwapOverlayOpen}
        onOpenChange={(e) => setSwapOverlayOpen(e)}
        buyCoin="btc"
        sellCoin="usdt"
      ></SwapOverlay>
    </>
  );
};

export default SwapModal;

function formatValue(input, valArr) {
  switch (input) {
    case "delete": {
      if (valArr.length === 1) {
        return ["0"];
      }
      valArr.pop();
      if (!valArr.includes(","))
        return valArr.length === 0 ? ["0"] : [...valArr];

      const newArr = formatValueArray(valArr);
      if (newArr) return newArr;
      return valArr;
    }
    case ".": {
      if (!valArr.includes(".")) return [...valArr, "."];
      return valArr;
    }
    default:
      if (valArr.length === 1 && valArr[0] === "0") {
        return [input];
      }
      const newArr = formatValueArray([...valArr, input]);
      if (newArr) return newArr;
      return valArr;
  }
}

function generateGhostValueArr(arr) {
  switch (arr.length) {
    case 0:
      return ["0", ".", "0", "0"];
    case 1:
      return arr[0] !== "0" ? [arr[0], ".", "0", "0"] : ["0", ".", "0", "0"];
    case 2:
      return arr[1] !== "." ? arr : [arr[0], ".", "0", "0"];
    case 3:
      return arr[1] === "." ? [arr[0], ".", arr[2], "0"] : ["0", ".", "0", "0"];
    case 4:
      return arr[1] === "."
        ? [arr[0], ".", arr[2], arr[3]]
        : ["0", ".", "0", "0"];
    default:
      return arr;
  }
}

function formatValueArray(arr: string[]) {
  const strValue = arr.join("").replace(",", "");

  const num = new Intl.NumberFormat("en-EN").format(strValue);

  if (num === "NaN") return false;

  return num.split("");
}
