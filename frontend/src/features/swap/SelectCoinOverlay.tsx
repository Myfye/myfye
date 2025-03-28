import CoinCardList from "@/components/ui/coin-card/CoinCardList";
import Overlay from "@/components/ui/overlay/Overlay";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setCoin, toggleOverlay } from "./swapSlice";

const SelectCoinOverlay = ({ zIndex = 1000 }) => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.swap.overlays.selectCoin.isOpen
  );

  const handleOpen = (e: boolean) => {
    dispatch(toggleOverlay({ type: "selectCoin", isOpen: e }));
  };

  const onCoinSelect = (coin) => {
    console.log(coin);
  };

  return (
    <Overlay
      title="Select coin"
      isOpen={isOpen}
      onOpenChange={handleOpen}
      zIndex={zIndex}
    >
      <div>
        <section className="cash">
          <CoinCardList onCoinSelect={onCoinSelect}></CoinCardList>
        </section>
        <section className="crypto">
          <CoinCardList onCoinSelect={onCoinSelect}></CoinCardList>
        </section>
      </div>
    </Overlay>
  );
};

export default SelectCoinOverlay;
