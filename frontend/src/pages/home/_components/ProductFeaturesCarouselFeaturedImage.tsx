import { css } from "@emotion/react";
import { AnimatePresence, motion } from "motion/react";
import { FeatureSlide } from "./ProductFeaturesCarousel";

interface ProductFeaturesCarouselFeaturedImageProps {
  selectedFeature: string;
  features: FeatureSlide[];
}

const getAnimationState = (
  features: FeatureSlide[],
  selectedFeature: string,
  index: number
) => {
  const selectedFeatureIndex = features.findIndex(
    (feat) => feat.id === selectedFeature
  );
  if (index > selectedFeatureIndex) return "next";
  if (index < selectedFeatureIndex) return "prev";
  return "active";
};

const ProductFeaturesCarouselFeaturedImage = ({
  selectedFeature,
  features,
}: ProductFeaturesCarouselFeaturedImageProps) => {
  return (
    <div
      className="featured-image-wrapper"
      css={css`
        width: 100%;
        height: 100%;
        grid-column: 7 / 13;
      `}
    >
      <div
        className="media-wrapper"
        css={css`
          position: relative;
          isolation: isolate;
          height: 100%;
          overflow: hidden;
        `}
      >
        <AnimatePresence>
          {features.map((feature, i) => {
            const animationState = getAnimationState(
              features,
              selectedFeature,
              i
            );
            return (
              <motion.div
                key={feature.id}
                animate={animationState}
                variants={{
                  active: {
                    clipPath: "inset(0 0 0 0)",
                    transition: {
                      clipPath: {
                        duration: i === 0 ? 0 : 0.75,
                        ease: "easeInOut",
                      },
                    },
                  },
                  prev: {
                    clipPath: "inset(0 0 0 0)",
                    transition: {
                      clipPath: {
                        duration: i === 0 ? 0 : 0.75,
                        ease: "easeInOut",
                      },
                    },
                  },
                  next: {
                    clipPath: "inset(100% 0 0 0)",
                    transition: {
                      clipPath: {
                        duration: i === 0 ? 0 : 0.75,
                        ease: "easeInOut",
                      },
                    },
                  },
                }}
                className="img-wrapper"
                style={{ height: "100%" }}
                css={css`
                  position: absolute;
                  width: 100%;
                  height: 100%;
                `}
              >
                <motion.img
                  variants={{
                    active: {
                      y: 0,
                      transition: {
                        y: { duration: 1, ease: "easeInOut" },
                      },
                    },
                    prev: {
                      y: -42,
                      transition: {
                        y: { duration: 0.75, ease: "easeInOut" },
                      },
                    },
                    next: {
                      y: 42,
                      transition: {
                        y: { duration: 1.25, ease: "easeInOut" },
                      },
                    },
                  }}
                  src={feature.image.src}
                  alt={feature.image.alt}
                  css={css`
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    object-fit: cover;
                  `}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductFeaturesCarouselFeaturedImage;
