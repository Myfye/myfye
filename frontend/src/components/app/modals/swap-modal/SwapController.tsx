import { ArrowDown, CaretRight } from "@phosphor-icons/react";

const SwapControl = ({ type, coin }) => {
  return (
    <div className="swap-control">
      <section className="select-value">
        <p>{type === "buy" ? "Buy" : "Sell"}</p>
        <input type="text" />
        <p></p>
      </section>
      <section className="select-coin">
        <button>
          <icon></icon>
          {coin.title}
          <CaretRight />
        </button>
      </section>
    </div>
  );
};

const SwapController = () => {
  return (
    <div className="swap-controller">
      <SwapControl type="buy" />
      <div className="icon-wrapper">
        <ArrowDown />
      </div>
      <SwapControl type="sell" />
    </div>
  );
};

export default SwapController;
