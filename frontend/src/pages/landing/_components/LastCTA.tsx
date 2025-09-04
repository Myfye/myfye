import Button from "@/shared/components/ui/button/Button";
import { css } from "@emotion/react";
import { RefObject, useContext, useEffect } from "react";
import { QRCodeModalContext } from "../QRCodeModalContext";

const LastCTA = ({ ref }: { ref?: RefObject<HTMLElement> }) => {
  const { setModalOpen } = useContext(QRCodeModalContext);
  return (
    <section
      ref={ref}
      className="last-cta | content-grid"
      css={css`
        background-color: #02302c;
      `}
    >
      <div
        css={css`
          margin-block: 8rem;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
          `}
        >
          <h2
            className="heading-5x-large"
            css={css`
              text-align: center;
              color: var(--clr-white);
              margin-block-end: var(--size-600);
            `}
          >
            Connect to global markets, all from your phone.
          </h2>
          <div>
            <Button
              size="large"
              color="primary-light"
              onPress={() => setModalOpen(true)}
            >
              Download the app
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LastCTA;
