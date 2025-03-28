import CoinCardList from "@/components/ui/coin-card/CoinCardList";
import Overlay from "@/components/ui/overlay/Overlay";
import { useSelector } from "react-redux";

const SelectCoinOverlay = () => {
  const dispatch = useSelector();

  const onCoinSelect = (e) => {};
  return (
    <Overlay title="Select coin">
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
