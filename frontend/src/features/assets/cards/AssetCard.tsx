import { css } from "@emotion/react";
import AssetIcon from "../AssetIcon";
import { RefObject, useState, useEffect } from "react";
import KYCOverlay from "@/features/compliance/kycOverlay";
// import Button from "@/shared/components/ui/button/Button";
// import Menu from "@/shared/components/ui/menu/Menu";

import AssetCardController from "./AssetCardController";
import { formatBalance } from "../utils";
import { AbstractedAsset, Asset } from "../types";
import { useSelector } from "react-redux";

import {
  MenuTrigger,
  Button as AriaButton,
  Popover,
  Menu,
  MenuItem,
  Button,
} from "react-aria-components";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  ArrowLineDown,
  DotsThreeVertical,
} from "@phosphor-icons/react";
import { useDispatch } from "react-redux";
import { toggleModal as toggleSwapModal } from "@/features/swap/swapSlice";
import { toggleModal as toggleSendModal } from "@/features/send/sendSlice";
import { toggleModal as toggleReceiveModal } from "@/features/receive/receiveSlice";
import { toggleModal as toggleKYCModal } from "@/features/compliance/kycSlice";
import Modal from "@/shared/components/ui/modal/Modal";
import { Key } from "react-aria";
import { assetMetadata } from "../assetMetadata";

type TimeSeriesValue = { [key: string]: { [key: string]: string } };

const AssetCard = ({
  id,
  title,
  fiatCurrency,
  symbol,
  groupId,
  balance,
  icon,
  ref,
  showOptions,
  showBalance,
  showCurrencySymbol = true,
  radio,
  isSelected,
  ...restProps
}: {
  id: AbstractedAsset["id"];
  title: AbstractedAsset["label"];
  fiatCurrency: Asset["fiatCurrency"];
  symbol: AbstractedAsset["symbol"];
  groupId: AbstractedAsset["groupId"];
  balance: number;
  ref: RefObject<HTMLButtonElement>;
  icon: AbstractedAsset["icon"];
  showOptions: boolean;
  showBalance: boolean;
  showCurrencySymbol?: boolean;
  radio?: boolean;
  isSelected?: boolean;
}) => {
  const [showKYCOverlay, setShowKYCOverlay] = useState(false);
  const [showAssetInfo, setShowAssetInfo] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<Set<Key>>(new Set(["7d"]));

  const dispatch = useDispatch();
  const currentUserKYCVerified = useSelector((state: RootState) => state.userWalletData.currentUserKYCVerified);

  const formattedBalance = formatBalance(balance, fiatCurrency);

  const handleSwapClick = () => {
    /*
    if (!currentUserKYCVerified) {
      console.log("opening KYC modal");
      dispatch(toggleKYCModal({ isOpen: true }));
    } else {
      console.log("opening swap modal");
      dispatch(
        toggleSwapModal({
          isOpen: true,
          abstractedAssetId: id,
        })
      );
    }
      */

    console.log("opening swap modal");
    dispatch(
      toggleSwapModal({
        isOpen: true,
        abstractedAssetId: id,
      })
    );
    
  };

  const handleReceiveClick = () => {
    if (!currentUserKYCVerified) {
      console.log("opening KYC modal");
      dispatch(toggleKYCModal({ isOpen: true }));
    } else {
      console.log("opening receive modal");
      dispatch(toggleReceiveModal(true));
    }
  };

  // Placeholder description for now
  const assetDescription = assetMetadata[symbol]?.description || `This is a quick description for ${title}. More details about the asset can go here.`;

  // Modal component for asset info
  const AssetInfoModal = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) => (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={title}
      height={400}
      zIndex={2000}
    >
      <div style={{ padding: "1rem 0", textAlign: "center" }}>
        <p style={{ marginTop: "1.5rem" }}>{assetDescription}</p>
        <Button
          style={{ marginTop: "2rem", textDecoration: "underline", fontWeight: 400 }}
          onPress={() => onOpenChange(false)}
        >
          Close
        </Button>
      </div>
    </Modal>
  );

  return (
    <>
      <AssetInfoModal isOpen={showAssetInfo} onOpenChange={setShowAssetInfo} />
      <div
        className="asset-card"
        css={css`
          display: grid;
          grid-template-columns: ${showOptions ? "1fr auto" : "1fr"};
          align-items: center;
          gap: ${showOptions ? "var(--size-200)" : 0};
          width: 100%;
          background-color: ${isSelected
            ? "var(--clr-green-100)"
            : "var(--clr-surface-raised)"};
          padding: var(--size-150);
          border-radius: var(--border-radius-medium);
          height: 4.25rem;
          position: relative;
          &::before {
            content: "";
            display: ${isSelected ? "block" : "none"};
            outline: 2px solid var(--clr-primary);
            outline-offset: -2px;
            position: absolute;
            inset: 0;
            margin: auto;
            width: 100%;
            height: 100%;
            border-radius: var(--border-radius-medium);
          }
        `}
        onClick={e => {
          // Prevent modal from opening when clicking the options button
          if ((e.target as HTMLElement).closest(".asset-card-options")) return;
          setShowAssetInfo(true);
        }}
        {...restProps}
      >
        <div
          css={css`
            display: grid;
            grid-template-columns: auto 1fr;
            column-gap: var(--size-150);
            line-height: var(--line-height-tight);
            width: 100%;
            user-select: none;
          `}
        >
          <AssetIcon icon={icon} />
          <div
            className="content"
            css={css`
              align-content: center;
              gap: var(--size-150);
            `}
          >
            <div
              css={css`
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                align-self: center;
              `}
            >
              <div
                className="title"
                css={css`
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  justify-content: center;
                `}
              >
                <p
                  css={css`
                    font-weight: var(--fw-active);
                    font-size: var(--fs-medium);
                  `}
                >
                  {title}
                </p>
                <p
                  css={css`
                    font-size: var(--fs-small);
                    color: var(--clr-text-neutral);
                    text-transform: uppercase;
                    margin-block-start: var(--size-050);
                  `}
                >
                  {symbol}
                </p>
              </div>
              {showBalance && (
                <p
                  css={css`
                    font-weight: var(--fw-active);
                    font-size: var(--fs-medium);
                  `}
                >
                  {showCurrencySymbol ? formattedBalance : balance}
                </p>
              )}
            </div>
          </div>
        </div>
        {showOptions && (
          <MenuTrigger>
            <Button
              className="asset-card-options"
              css={css`
                display: grid;
                place-items: center;
                width: 2rem;
                height: 2rem;
                border-radius: var(--border-radius-circle);
                border: 1px solid var(--clr-neutral-300);
              `}
            >
              <DotsThreeVertical size={20} />
            </Button>
            <Popover placement="bottom end">
              <Menu
                css={css`
                  padding: var(--size-075);
                  width: 12rem;
                  border-radius: var(--border-radius-medium);
                  background-color: var(--clr-surface-raised);
                  box-shadow: var(--box-shadow-popout);
                  overflow: auto;
                  font-size: var(--fs-medium);
                  user-select: none;
                `}
              >
                <MenuItem>Send</MenuItem>
                <MenuItem>Receive</MenuItem>
                <MenuItem>Swap</MenuItem>
              </Menu>
            </Popover>
          </MenuTrigger>
        )}
      </div>
    </>
  );
};

export default AssetCard;