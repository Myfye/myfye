import { css } from "@emotion/react";
import Overlay from "@/shared/components/ui/overlay/Overlay";
import { AbstractedAsset, AbstractedAssetSection } from "../assets/types";
import AssetCardListSelect from "./cards/AssetCardListSelect";
import SearchField from "@/shared/components/ui/search/SearchField";
import { useEffect, useState } from "react";
import fuzzysort from "fuzzysort";

interface SelectAssetOverlayProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  zIndex?: number;
  abstractedAssetSections: AbstractedAssetSection[];
  onAssetSelect: (abstractedAssetId: AbstractedAsset["id"]) => void;
  selectedAbstractedAssetId: AbstractedAsset["id"] | null;
}

const filterSections = (
  sections: AbstractedAssetSection[],
  searchValue: string
) => {
  if (searchValue === "") return sections;

  const allAssets = sections.flatMap((section) =>
    section.abstractedAssets.map((asset) => ({
      ...asset,
      _sectionId: section.id, // Tag each asset with the sectionId
    }))
  );

  const results = fuzzysort.go(searchValue, allAssets, {
    keys: ["label", "symbol"],
    limit: 100,
    threshold: 0.5,
  });

  const abstractedAssetMap = new Map<string, AbstractedAsset[]>();

  results.forEach(({ obj }) => {
    // remove sectionId to reveal original Abstracted Asset
    const { _sectionId, ...strippedObj } = obj;

    // if the map doesn't have a sectionId, put it there
    if (!abstractedAssetMap.has(_sectionId)) {
      abstractedAssetMap.set(_sectionId, []);
    }

    // push the object to that sectionId key
    abstractedAssetMap.get(_sectionId)?.push(strippedObj);
  });

  return sections
    .map((section) => {
      const abstractedAssets = abstractedAssetMap.get(section.id);
      if (!abstractedAssets) return null;
      return { ...section, abstractedAssets };
    })
    .filter((asset) => !!asset);
};

const SelectAssetOverlay = ({
  isOpen,
  onOpenChange,
  abstractedAssetSections,
  onAssetSelect,
  selectedAbstractedAssetId,
  zIndex = 1000,
}: SelectAssetOverlayProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredSections, setFilteredSections] = useState(
    abstractedAssetSections
  );

  useEffect(() => {
    setFilteredSections(filterSections(abstractedAssetSections, searchValue));
  }, [searchValue, setFilteredSections, abstractedAssetSections]);

  const getResultsUI = () => {
    if (filteredSections.length === 0)
      return (
        <div>
          <p
            css={css`
              text-align: center;
              color: var(--clr-text-weak);
              font-weight: var(--fw-active);
            `}
          >
            No assets found
          </p>
        </div>
      );

    return filteredSections.map((section) => (
      <section data-section={section.id} key={section.id}>
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
        />
      </section>
    ));
  };

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
            padding-block-start: var(--size-200);
            padding-block-end: var(--size-200);
            position: sticky;
            top: 0;
            z-index: 1;
            background-color: var(--clr-surface);
          `}
        >
          <SearchField
            placeholder="Search assets"
            onClear={() => setSearchValue("")}
            onChange={(val) => setSearchValue(val)}
            value={searchValue}
          />
        </div>
        <div
          css={css`
            display: grid;
            gap: var(--size-300);
            margin-block-start: var(--size-300);
          `}
        >
          {getResultsUI()}
        </div>
      </div>
    </Overlay>
  );
};

export default SelectAssetOverlay;
