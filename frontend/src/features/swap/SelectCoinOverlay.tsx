import CoinCardList from "@/components/ui/coin-card/CoinCardList";
import Overlay from "@/components/ui/overlay/Overlay";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const SelectCoinOverlay = () => {
  const dispatch = useSelector();

  const isOpen = useSelector(
    (state: RootState) => state.swap.overlays.selectCoin.isOpen
  );

  const onCoinSelect = (coin) => {
    dispatch(set);
  };

  return (
    <Overlay title="Select coin" isOpen={}>
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
