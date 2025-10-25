import Button from "@/shared/components/ui/button/Button";
import { css } from "@emotion/react";
import { useContext } from "react";
import { QRCodeModalContext } from "../context/QRCodeModalContext";
import mockup from "@/assets/mockups/swap_mockup.png";

const Swap = () => {
  const { setModalOpen } = useContext(QRCodeModalContext);
  return (
    <section
      className="swap | content-grid"
      css={css`
        background-color: var(--clr-white);
        height: calc(100svh + 6rem);
        align-content: center;
      `}
    >
      <div
        css={css`
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 7rem;
        `}
      >
        <div
          css={css`
            align-content: center;
          `}
        >
          <h2
            className="heading-5x-large"
            css={css`
              color: var(--clr-text);
            `}
          >
            Exchange currency, instantly and hassle free.
          </h2>
          <p
            css={css`
              font-size: 1.25rem;
              color: #696969;
              line-height: 1.6;
              margin-block-start: var(--size-300);
            `}
          >
            Protect against inflation with swaps between currencies, treasuries,
            stocks, and crypto.
          </p>
          <div
            css={css`
              margin-block-start: var(--size-600);
              width: 10rem;
            `}
          >
            <Button size="large" onPress={() => setModalOpen(true)} expand>
              Swap now
            </Button>
          </div>
        </div>
        <div>
          <img
            src={mockup}
            alt=""
            css={css`
              width: 320px;
            `}
          />
        </div>
      </div>
    </section>
  );
};

export default Swap;
