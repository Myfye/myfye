import CoinCardList from "@/components/ui/coin-card/CoinCardList";
import Overlay from "@/components/ui/overlay/Overlay";

const SelectCoinOverlay = () => {
  <Overlay title="Select coin">
    <div>
      <section className="cash">
        <CoinCardList></CoinCardList>
      </section>
      <section className="crypto">
        <CoinCardList></CoinCardList>
      </section>
    </div>
  </Overlay>;
};

export default SelectCoinOverlay;
