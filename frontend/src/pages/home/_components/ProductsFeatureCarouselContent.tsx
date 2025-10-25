import { css } from "@emotion/react";
import { AnimatePresence, motion } from "motion/react";
import { FeatureSlide } from "./ProductFeaturesCarousel";
import Button from "@/shared/components/ui/button/Button";
import { Button as AriaButton } from "react-aria-components";
import { useContext } from "react";
import { QRCodeModalContext } from "../context/QRCodeModalContext";

interface ProductFeaturesCarouselContentProps {
  selectedFeature: string;
  features: FeatureSlide[];
  onFeatureSelect: (id: string) => void;
}

const ProductFeaturesCarouselContent = ({
  selectedFeature,
  onFeatureSelect,
  features,
}: ProductFeaturesCarouselContentProps) => {
  const { setModalOpen } = useContext(QRCodeModalContext);
  return (
    <div
      className="product-feature-carousel-inner"
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        grid-column: 1 / 6;
      `}
    >
      <div className="sections-wrapper">
        <ul className="sections">
          {features.map((feature) => (
            <motion.li
              key={feature.id}
              animate={selectedFeature === feature.id ? "active" : "inactive"}
              variants={{ active: { opacity: 1 }, inactive: { opacity: 0.3 } }}
              css={css`
                color: var(--clr-white);
              `}
            >
              <AriaButton
                className="heading-5x-large"
                onPress={() => onFeatureSelect(feature.id)}
              >
                {feature.title}
              </AriaButton>
            </motion.li>
          ))}
        </ul>
      </div>
      <div
        className="description"
        css={css`
          margin-block-start: auto;
          isolation: isolate;
          position: relative;
        `}
      >
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            animate={selectedFeature === feature.id ? "active" : "inactive"}
            variants={{ active: { opacity: 1 }, inactive: { opacity: 0 } }}
            css={css`
              position: absolute;
              bottom: 0;
              left: 0;
            `}
          >
            <p
              css={css`
                font-size: 1.5rem;
                font-weight: 600;
                margin-block-end: var(--size-500);
                color: var(--clr-white);
                max-width: 30ch;
                line-height: 1.4;
              `}
            >
              {feature.description}
            </p>
            <Button
              variant="secondary"
              color="white"
              size="large"
              onPress={() => setModalOpen(true)}
            >
              {feature.actionTitle}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductFeaturesCarouselContent;
