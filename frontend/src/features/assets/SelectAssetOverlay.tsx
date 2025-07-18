import { css } from "@emotion/react";
import Overlay from "@/shared/components/ui/overlay/Overlay";
import { AbstractedAsset, AbstractedAssetSection } from "../assets/types";
import AssetCardListSelect from "./cards/AssetCardListSelect";

const SelectAssetOverlay = ({
  isOpen,
  onOpenChange,
  abstractedAssetSections,
  onAssetSelect,
  selectedAbstractedAssetId,
  zIndex = 1000,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  zIndex?: number;
  abstractedAssetSections: AbstractedAssetSection[];
  onAssetSelect: (abstractedAssetId: AbstractedAsset["id"]) => void;
  selectedAbstractedAssetId: AbstractedAsset["id"] | null;
}) => {
  return (
    <Overlay
      title="Select coin"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      zIndex={zIndex}
    >
      <div
        css={css`
          margin-inline: var(--size-250);
          padding-block-end: var(--size-200);
        `}
      >
        <div
          css={css`
            display: grid;
            gap: var(--size-300);
            margin-block-start: var(--size-400);
          `}
        >
          {abstractedAssetSections.map((section, i) => (
            <section data-section={section.id}>
              <h2
                className="heading-small"
                css={css`
                  color: var(--clr-text);
                  margin-block-end: var(--size-150);
                `}
              >
                {section.label}
              </h2>
              <AssetCardListSelect
                assets={section.abstractedAssets}
                onAssetSelect={onAssetSelect}
                selectedAsset={selectedAbstractedAssetId}
              ></AssetCardListSelect>
            </section>
          ))}
        </div>
      </div>
    </Overlay>
  );
};

export default SelectAssetOverlay;
