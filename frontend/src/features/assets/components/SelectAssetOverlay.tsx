import { css } from "@emotion/react";
import Overlay, { OverlayProps } from "@/shared/components/ui/overlay/Overlay";
import { Asset, AssetSection } from "../types/types";
import AssetCardListSelect from "../cards/AssetCardListSelect";
import SearchField from "@/shared/components/ui/search/SearchField";
import { useEffect, useRef, useState } from "react";
import fuzzysort from "fuzzysort";
import { cn } from "cn-utility";

interface SelectAssetOverlayProps extends OverlayProps {
  assetSections: assetSection[];
  onAssetSelect: (assetId: Asset["id"]) => void;
  selectedAssetId: Asset["id"] | null;
  disableSearch?: boolean;
  assetCardListSelectOptions?: {
    showBalance?: boolean;
    showBalanceUSD?: boolean;
    showCurrencySymbol?: boolean;
  };
}

const filterSections = (sections: assetSection[], searchValue: string) => {
  if (searchValue === "") return sections;

  const allAssets = sections.flatMap((section) =>
    section.assets.map((asset) => ({
      ...asset,
      _sectionId: section.id, // Tag each asset with the sectionId
    }))
  );

  const results = fuzzysort.go(searchValue, allAssets, {
    keys: ["label", "symbol"],
    limit: 100,
    threshold: 0.5,
  });

  const assetMap = new Map<string, Asset[]>();

  results.forEach(({ obj }) => {
    // remove sectionId to reveal original Asset
    const { _sectionId, ...strippedObj } = obj;

    // if the map doesn't have a sectionId, put it there
    if (!assetMap.has(_sectionId)) {
      assetMap.set(_sectionId, []);
    }

    // push the object to that sectionId key
    assetMap.get(_sectionId)?.push(strippedObj);
  });

  return sections
    .map((section) => {
      const assets = assetMap.get(section.id);
      if (!assets) return null;
      return { ...section, assets };
    })
    .filter((asset) => !!asset);
};

const SelectAssetOverlay = ({
  isOpen,
  onOpenChange,
  assetSections,
  onAssetSelect,
  selectedAssetId,
  zIndex = 1000,
  disableSearch = false,
  assetCardListSelectOptions,
  ...restProps
}: SelectAssetOverlayProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredSections, setFilteredSections] = useState(assetSections);
  const searchRef = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    setFilteredSections(filterSections(assetSections, searchValue));
  }, [searchValue, setFilteredSections, assetSections]);

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
          className={cn(
            "heading-small",
            !section.label ? "visually-hidden" : false
          )}
          css={css`
            color: var(--clr-text);
            margin-block-end: var(--size-150);
          `}
        >
          {section.label}
        </h2>
        <AssetCardListSelect
          {...assetCardListSelectOptions}
          assets={section.assets}
          onAssetSelect={onAssetSelect}
          selectedAsset={selectedAssetId}
        />
      </section>
    ));
  };

  return (
    <Overlay
      {...restProps}
      title="Select asset"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      zIndex={zIndex}
      initialFocus={searchRef}
      direction="vertical"
    >
      <div
        css={css`
          margin-inline: var(--size-250);
          padding-block-end: var(--size-200);
        `}
      >
        {!disableSearch && (
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
              ref={searchRef}
            />
          </div>
        )}
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
