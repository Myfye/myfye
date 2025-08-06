import Modal, { ModalProps } from "@/shared/components/ui/modal/Modal";
import SelectorGroup, { SelectorGroupProps } from "./SelectorGroup";
import Selector from "./Selector";
import { Asset } from "@/features/assets/types";
import { Collection } from "react-aria-components";

import USDCIcon from "@/assets/svgs/coins/usd-coin.svg";
import EURCIcon from "@/assets/svgs/coins/eur-coin.svg";
import AssetIcon from "@/features/assets/AssetIcon";
import HeadlessModal from "@/shared/components/ui/modal/HeadlessModal";
import { css } from "@emotion/react";

type Token = {
  id: Asset["id"];
  label: string;
  value: Asset["id"];
  token: Asset["id"];
};
interface SelectTokenModalProps extends Omit<ModalProps, "children"> {
  onSelectToken: (token: Token) => void;
  tokens: Token[];
  selectedToken: Asset["id"] | null;
}

const tokenIconMap = {
  usdc_sol: USDCIcon,
  eurc_sol: EURCIcon,
};

const SelectTokenModal = ({
  height = 600,
  tokens,
  onSelectToken,
  selectedToken,
  ...restProps
}: SelectTokenModalProps) => {
  return (
    <HeadlessModal {...restProps} height={height}>
      <section
        css={css`
          padding-inline: var(--size-200);
        `}
      >
        <SelectorGroup onChange={onSelectToken} value={selectedToken}>
          <Collection items={tokens}>
            {(token) => {
              return (
                <Selector value={token.value}>
                  <AssetIcon
                    icon={{ content: tokenIconMap[token.id], type: "svg" }}
                    width="1rem"
                  />
                  {token.label}
                </Selector>
              );
            }}
          </Collection>
        </SelectorGroup>
      </section>
    </HeadlessModal>
  );
};

export default SelectTokenModal;
