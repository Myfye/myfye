import Overlay from "@/shared/components/ui/overlay/Overlay";
import { useId } from "react";
import TransactionConfirmationScreen from "@/shared/components/ui/transaction/confirmation/TransactionConfirmationScreen";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleModal } from "../withdrawSlice";
import { truncateSolanaAddress } from "@/shared/utils/solanaUtils";
import toast from "react-hot-toast/headless";
import { toggleOverlay, unmountOverlays } from "./withdrawOffChainSlice";
import {
  Address,
  createPublicClient,
  encodeFunctionData,
  http,
  parseAbi,
} from "viem";
import { selectAbstractedAsset } from "@/features/assets/assetsSlice";
import { useSignTransaction, useWallets } from "@privy-io/react-auth";
import { base } from "viem/chains";
import { useLazyGetBaseRelayerQuery } from "@/features/base_relayer/baseRelayerApi";

const WithdrawOnChainConfirmOverlay = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(
    (state) => state.withdrawOnChain.overlays.confirmTransaction.isOpen
  );

  const transaction = useAppSelector(
    (state) => state.withdrawOnChain.transaction
  );
  /* TODO fetch proper asset details */
  const asset = useAppSelector((state) =>
    transaction.assetId
      ? selectAbstractedAsset(state, transaction.assetId)
      : null
  );

  const {
    wallets: [wallet],
  } = useWallets();

  const { signTransaction } = useSignTransaction();

  const headingId = useId();

  const [triggerBaseRelayer, { isLoading }] = useLazyGetBaseRelayerQuery();

  const handleConfirm = async () => {
    if (!wallet) {
      throw new Error("No EVM wallet available");
    }
    // Create public client for reading blockchain data
    const publicClient = createPublicClient({
      chain: base,
      transport: http(),
    });

    const abi = parseAbi([
      "function approve(address spender, uint256 amount) returns (bool)",
    ]);

    const domain = {
      name: "USD Coin",
      version: "2",
      chainId: 8453, // Base mainnet (as number, not BigInt)
      verifyingContract: transaction.payout.contract.address,
    };

    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    // Get current nonce for the user
    const nonce = await publicClient.readContract({
      address: transaction.payout?.contract?.address,
      abi: parseAbi(["function nonces(address owner) view returns (uint256)"]),
      functionName: "nonces",
      args: [wallet.address as Address],
    });

    // Set deadline (1 hour from now)
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);

    const message = {
      owner: wallet.address,
      spender: transaction.payout.contract.blindpayContractAddress,
      value: BigInt(transaction.payout.contract.amount),
      nonce: nonce,
      deadline: deadline,
    };

    // Ensure wallet is on Base mainnet before signing
    if (wallet.chainId !== "eip155:8453") {
      await wallet.switchChain("eip155:8453" as Address);
    }

    // Estimate gas for the approval transaction
    const gasEstimate = await publicClient.estimateContractGas({
      address: transaction.payout.contract.address,
      abi,
      functionName: "approve",
      args: [
        transaction.payout.contract.blindpayContractAddress,
        BigInt(transaction.payout.contract.amount),
      ],
      account: wallet.address as Address,
    });

    console.log("Estimated gas for approval:", gasEstimate.toString());

    // Get current gas price
    const gasPrice = await publicClient.getGasPrice();
    console.log("Current gas price:", gasPrice.toString());
    // Sign the transaction with proper gas parameters
    let signature;
    try {
      const result = await signTransaction({
        to: transaction.payout.contract.address,
        data: encodeFunctionData({
          abi,
          functionName: "approve",
          args: [
            transaction.payout.contract.blindpayContractAddress,
            BigInt(transaction.payout.contract.amount),
          ],
        }),
        value: 0n,
        gas: gasEstimate,
        gasPrice: gasPrice,
        chainId: 8453n,
      });
      signature = result.signature;
      console.log("Transaction signature:", signature);
    } catch (signError) {
      console.log("Sign transaction failed:", signError);
      throw new Error(`Transaction signing failed: ${signError.message}`);
    }

    // Execute gasless smart contract approval
    console.log("Executing gasless smart contract approval...");

    const { isError, data: baseRelayerData } = await triggerBaseRelayer({
      signedTransaction: signature,
      chainId: 8453,
      sponsoredBy: "base", // Base sponsors the gas
    });

    if (isError) {
      return toast.error(`Error processing transaction. Please try again.`);
    }

    const hash = "base_sponsored_" + Date.now();
    const receipt = { status: "success", blockNumber: 0n };

    console.log(hash, receipt);

    toast.success(
      `Transferred ${transaction.formattedAmount} ${
        asset?.symbol
      } to ${truncateSolanaAddress(transaction.solAddress ?? "0x38232288")}`
    );
    dispatch(toggleModal(false));
    dispatch(unmountOverlays());
  };

  return (
    <>
      <Overlay
        isBackDisabled={isLoading}
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(toggleOverlay({ type: "confirmTransaction", isOpen }));
        }}
        zIndex={2003}
        aria-labelledby={headingId}
      >
        {/* Update for abstracted asset */}
        <TransactionConfirmationScreen
          input={{
            amount: transaction.amount ?? 0,
            icon: asset?.icon.content,
            label: asset?.label ?? "",
            tokenSymbol: asset?.symbol ?? "",
            fiatCurrency: "usd",
          }}
          output={{
            icon: "bank",
            label: transaction.solAddress ?? "0x832838232889",
          }}
          isLoading={isLoading}
          onConfirm={handleConfirm}
          onCancel={() => {
            dispatch(
              toggleOverlay({ type: "confirmTransaction", isOpen: false })
            );
          }}
          headingId={headingId}
          title="Confirm withdrawal"
        />
      </Overlay>
    </>
  );
};

export default WithdrawOnChainConfirmOverlay;
