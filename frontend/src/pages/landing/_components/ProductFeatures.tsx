import { css } from "@emotion/react";
import ProductFeaturesCarousel from "./ProductFeaturesCarousel";

const ProductFeatures = () => {
  return (
    <section
      className="product-features | content-grid"
      css={css`
        background-color: var(--clr-primary);
      `}
    >
      <div
        css={css`
          height: 100svh;
          background-color: var(--clr-primary);
          align-content: center;
        `}
      >
        <h1
          className="heading-5x-large"
          css={css`
            color: var(--clr-white);
          `}
        >
          Store money, stocks, and crypto in a secure, all-in-one platform.
        </h1>
      </div>
      <ProductFeaturesCarousel />
    </section>
  );
};

export default ProductFeatures;
