import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleOverlay,
  updateAbstractedAssetId,
  updateExchangeRate,
} from "./swapSlice";
import { AbstractedAsset } from "../assets/types";
import { selectAbstractedAssetsWithBalanceByDashboard } from "../assets/assetsSlice";
import ensureTokenAccount from "../../functions/ensureTokenAccount";
import mintAddress from "../../functions/MintAddress";
import SelectAssetOverlay from "../assets/SelectAssetOverlay";

const SelectSwapAssetOverlay = ({ zIndex = 1000 }) => {
  const dispatch = useDispatch();

  const cashAssets = useSelector((state: RootState) =>
    selectAbstractedAssetsWithBalanceByDashboard(state, "cash")
  );

  const cryptoAssets = useSelector((state: RootState) =>
    selectAbstractedAssetsWithBalanceByDashboard(state, "crypto")
  );

  const stocksAssets = useSelector((state: RootState) =>
    selectAbstractedAssetsWithBalanceByDashboard(state, "stocks")
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

  const onAssetSelect = (abstractedAssetId: AbstractedAsset["id"]) => {
    console.log(
      "Selecting asset:",
      abstractedAssetId,
      "for transaction type:",
      transactionType
    );
    // to do: ensure token account
    if (transactionType === "buy") {
      console.log("Ensuring token account for ", abstractedAssetId);
      // TODO: if it is a stock no not ensure token account
      ensureTokenAccountForSwap(abstractedAssetId);
    }
    dispatch(
      updateAbstractedAssetId({
        transactionType: transactionType,
        abstractedAssetId: abstractedAssetId,
      })
    );
    dispatch(
      updateExchangeRate({
        buyAbstractedAssetId:
          transactionType === "buy"
            ? abstractedAssetId
            : transaction.buy.abstractedAssetId,
        sellAbstractedAssetId:
          transactionType === "sell"
            ? abstractedAssetId
            : transaction.sell.abstractedAssetId,
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
    abstractedAssetId: AbstractedAsset["id"]
  ) => {
    console.log(
      "Ensuring token account for ",
      abstractedAssetId,
      "solanaPubKey",
      solanaPubKey
    );

    try {
      const output_mint = mintAddress(abstractedAssetId);

      switch (abstractedAssetId) {
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
        selectedAbstractedAssetId={null}
        abstractedAssetSections={[
          { id: "cash", label: "Cash", abstractedAssets: cashAssets },
          { id: "crypto", label: "Crypto", abstractedAssets: cryptoAssets },
          { id: "stocks", label: "Stocks", abstractedAssets: stocksAssets },
        ]}
        onAssetSelect={onAssetSelect}
        zIndex={zIndex}
      />
    </>
  );
};

export default SelectSwapAssetOverlay;
