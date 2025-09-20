import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleOverlay,
  updateAssetId,
  updateExchangeRate,
} from "./swapSlice";
import { Asset } from "../assets/types";
import { selectAssetsWithBalanceByDashboard } from "../assets/assetsSlice";
import ensureTokenAccount from "../../functions/ensureTokenAccount";
import { getMintAddress } from "../assets/assetsSlice";
import SelectAssetOverlay from "../assets/SelectAssetOverlay";

const SelectSwapAssetOverlay = ({ zIndex = 1000 }) => {
  const dispatch = useDispatch();

  const cashAssets = useSelector((state: RootState) =>
    selectAssetsWithBalanceByDashboard(state, "cash")
  );

  const cryptoAssets = useSelector((state: RootState) =>
    selectAssetsWithBalanceByDashboard(state, "crypto")
  );

  const stocksAssets = useSelector((state: RootState) =>
    selectAssetsWithBalanceByDashboard(state, "stocks")
  );

  const isOpen = useSelector(
    (state: RootState) => state.swap.overlays.selectAsset.isOpen
  );

  const assets = useSelector((state: RootState) => state.assets);

  const solanaPubKey = useSelector(
    (state: any) => state.userWalletData.solanaPubKey
  );

  const transactionType = useSelector(
    (state: RootState) => state.swap.overlays.selectAsset.transactionType
  );

  const transaction = useSelector((state: RootState) => state.swap.transaction);

  const onAssetSelect = (assetId: Asset["id"]) => {
    console.log(
      "Selecting asset:",
      assetId,
      "for transaction type:",
      transactionType
    );
    // to do: ensure token account
    if (transactionType === "buy") {
      console.log("Skip Ensuring token account for ", assetId);
      // TODO: if it is a stock no not ensure token account
      // ensureTokenAccountForSwap(assetId);
    }
    dispatch(
      updateAssetId({
        transactionType: transactionType,
        assetId: assetId,
      })
    );
    dispatch(
      updateExchangeRate({
        buyAssetId:
          transactionType === "buy"
            ? assetId
            : transaction.buy.assetId,
        sellAssetId:
          transactionType === "sell"
            ? assetId
            : transaction.sell.assetId,
        assets: assets,
      })
    );
    dispatch(
      toggleOverlay({
        type: "selectAsset",
        isOpen: false,
        transactionType: transactionType,
      })
    );
  };

  const ensureTokenAccountForSwap = (
    assetId: Asset["id"]
  ) => {
    console.log(
      "Ensuring token account for ",
      assetId,
      "solanaPubKey",
      solanaPubKey
    );

    try {
      const output_mint = getMintAddress(assetId);

      switch (assetId) {
        case "us_dollar":
          console.log("Ensuring token account for USDC");
          break;
        case "euro":
          console.log("Ensuring token account for EURC");
          break;
        case "us_dollar_yield":
          console.log("Ensuring token account for USDY");
          break;
        case "btc":
          console.log("Ensuring token account for BTC");
          break;
        case "sol":
          console.log("Ensuring token account for SOL");
          break;
        case "xrp":
          console.log("Ensuring token account for XRP");
          console.log("Crypto assets to be displayed:", cryptoAssets);
          break;
        case "doge":
          console.log("Ensuring token account for DOGE");
          break;
        case "sui":
          console.log("Ensuring token account for SUI");
          break;
        default:
          break;
      }
      ensureTokenAccount(String(solanaPubKey), output_mint);
    } catch (error) {
      console.error("Error could not pre check token account:", error);
    }
  };

  return (
    <>
      <SelectAssetOverlay
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(
            toggleOverlay({
              type: "selectAsset",
              isOpen,
              transactionType: transactionType,
            })
          );
        }}
        selectedAssetId={null}
        assetSections={[
          { id: "cash", label: "Cash", assets: cashAssets },
          { id: "crypto", label: "Crypto", assets: cryptoAssets },
          { id: "stocks", label: "Stocks", assets: stocksAssets },
        ]}
        onAssetSelect={onAssetSelect}
        zIndex={zIndex}
      />
    </>
  );
};

export default SelectSwapAssetOverlay;
