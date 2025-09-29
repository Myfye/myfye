import Overlay from "@/shared/components/ui/overlay/Overlay";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleOverlay, unmount } from "../withdrawSlice";
import etheruse_logo from "@/assets/etherfuse_logo.jpg";
import { css } from "@emotion/react";
import { CheckCircle, Bank, CreditCard } from "@phosphor-icons/react";
import Button from "@/shared/components/ui/button/Button";
import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from '@/env';
import axios from 'axios';
import toast from 'react-hot-toast/headless';
import leafLoading from "@/assets/lottie/leaf-loading.json";
import success from "@/assets/lottie/success.json";
import fail from "@/assets/lottie/fail.json";
import { useState, useEffect, useMemo } from 'react';
import { useLottie } from 'lottie-react';
import { useNumberPad } from "@/shared/components/ui/number-pad/useNumberPad";
import AmountSelectScreen from "@/shared/components/ui/amount-select-screen/AmountSelectScreen";
import { updateAmount, updatePresetAmount } from "../withdrawSlice";
import { RootState } from "@/redux/store";
import { SendTransactionStatus } from "@/features/send/types";
import { useSolanaWallets } from "@privy-io/react-auth";
import { Connection, Transaction, VersionedTransaction } from "@solana/web3.js";
import bs58 from "bs58";
import { HELIUS_API_KEY } from "@/env";

const EtherfuseRampOverlay = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.withdraw.overlays.etherfuse.isOpen
  );
  const assets = useAppSelector((state: RootState) => state.assets);

  const currentCETESBalance = assets.assets["CETES"].balance;
  const cetesPrice = assets.assets["CETES"].exchangeRateUSD;
  const pesoPrice = assets.assets["MXN"].exchangeRateUSD;

  const userId = useAppSelector(
    (state) => state.userWalletData.currentUserID
  );

  const solanaPubKey = useAppSelector(
    (state) => state.userWalletData.solanaPubKey
  );

  const { wallets } = useSolanaWallets();
  const wallet = wallets[0];
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signingOnChain, setSigningOnChain] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<SendTransactionStatus>("idle");
  
  // Transaction state from Redux
  const transaction = useAppSelector((state) => state.withdraw.transaction);

  // Function to sign and submit burn transaction
  const signBurnTransaction = async (burnTransactionString: string) => {
    try {
      console.log("Etherfuse Starting burn transaction signing process...");
      
      if (!wallet) {
        throw new Error("Etherfuse No wallet connected");
      }

      // Create Solana connection
      const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
      const connection = new Connection(RPC);

      // Deserialize the transaction
      console.log("Etherfuse Burn transaction string:", burnTransactionString);
      console.log("Etherfuse Burn transaction string length:", burnTransactionString.length);
      
      // Decode the base58 transaction string from Etherfuse
      const transactionBuffer = Buffer.from(bs58.decode(burnTransactionString));
      console.log("Etherfuse Base58 decode successful, buffer length:", transactionBuffer.length);
      
      // Deserialize as a legacy transaction (we know this is the format Etherfuse uses)
      const transaction = Transaction.from(transactionBuffer);
      console.log("Etherfuse Legacy transaction deserialized successfully");

      // The transaction from Etherfuse is already partially signed (fee payer signed)
      // We just need the user to sign it as the second signer
      console.log("Etherfuse Transaction is already partially signed, user needs to sign as second signer...");
      
      // Sign with user's wallet (as the second signer)
      console.log("Etherfuse Signing with user wallet...");
      const userSignedTx = await wallet.signTransaction(transaction);
      
      console.log("Etherfuse User signing successful, submitting to network...");

      // Submit the fully signed transaction
      const signature = await connection.sendRawTransaction(userSignedTx.serialize(), {
        skipPreflight: true,
        maxRetries: 3
      });
      
      console.log("Etherfuse Burn transaction submitted successfully:", signature);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error("Transaction failed confirmation");
      }

      console.log("Etherfuse Burn transaction confirmed!");
      setTransactionStatus("success");
      toast.success("Withdrawal completed successfully!");
      
      // Close the signing overlay after success
      setTimeout(() => {
        setSigningOnChain(false);
        setTransactionStatus("idle");
        dispatch(toggleOverlay({ type: "etherfuse", isOpen: false }));
      }, 2000);

    } catch (error) {
      console.error("Etherfuse Error signing burn transaction:", error);
      setTransactionStatus("fail");
      toast.error(error.message);
      
      // Close the signing overlay after error
      setTimeout(() => {
        setSigningOnChain(false);
        setTransactionStatus("idle");
      }, 2500);
    }
  };

  // Function to check onboarding status via backend API
  const checkOnboardingStatus = async () => {
    setIsLoading(true);
    
    try {
      console.log("Etherfuse Checking Etherfuse onboarding status for user:", userId);
      
      const response = await axios.post(
        `${MYFYE_BACKEND}/etherfuse/get-user-data`,
        {
          userId: userId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': MYFYE_BACKEND_KEY,
          },
          withCredentials: true
        }
      );

      console.log("Etherfuse customer data response:", response.data);
      
      // Check if the response has bankAccountDetails and status is 'active'
      if (response.data && response.data.bankAccountDetails && response.data.bankAccountDetails.status === 'active') {
        console.log("Etherfuse User is onboarded and bank account is active");
        setIsOnboarded(true);
      } else {
        console.log("Etherfuse User is not fully onboarded or bank account is not active");
        setIsOnboarded(false);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      
      // If user is not found or any other error, they're not onboarded
      setIsOnboarded(false);
      
      // Log the error but don't show toast to user since this is a background check
      if (error.response?.status === 400) {
        console.log("Etherfuse User not found in Etherfuse system - not onboarded");
      } else {
        console.error("Etherfuse Unexpected error checking onboarding status:", error.response?.data || error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Call the function when component mounts
  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  // Set up number pad props
  const numberPadProps = useNumberPad({
    onStartDelete: (input) => {
      handleUpdateAmount(input);
    },
    onUpdateAmount: (input) => {
      handleUpdateAmount(input);
    },
    onUpdatePresetAmount: (presetAmount) => {
      handleUpdatePresetAmount(presetAmount);
    },
    formattedAmount: transaction.formattedAmount,
  });

  // Handle amount updates
  const handleUpdateAmount = (input: string) => {
    if (input === "delete") {
      const newAmount = transaction.formattedAmount.slice(0, -1) || "0";
      dispatch(updateAmount({
        amount: parseFloat(newAmount) || 0,
        formattedAmount: newAmount
      }));
    } else {
      const newAmount = transaction.formattedAmount === "0" ? input : transaction.formattedAmount + input;
      dispatch(updateAmount({
        amount: parseFloat(newAmount) || 0,
        formattedAmount: newAmount
      }));
    }
  };

  // Handle preset amount updates
  const handleUpdatePresetAmount = (presetAmount: string | null) => {
    if (presetAmount) {
      dispatch(updatePresetAmount(presetAmount));
    }
  };

  // Handle submit button press
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      console.log("Etherfuse withdrawal amount:", transaction.amount, "MXN");
      
      // Call the Etherfuse order endpoint
      const response = await axios.post(
        `${MYFYE_BACKEND}/etherfuse/order`,
        {
          userId: userId,
          publicKey: solanaPubKey,
          blockchain: "solana",
          fiatAmount: transaction.amount,
          direction: "offramp",
          memo: "Etherfuse withdrawal order"
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': MYFYE_BACKEND_KEY,
          },
          withCredentials: true
        }
      );

      console.log("Etherfuse order response:", response.data);
      
      if (response.data) {
        
        setSigningOnChain(true);

        // Function to check order details and look for burnTransaction
        let pollAttempts = 0;
        const maxPollAttempts = 2;
        
        const checkOrderDetails = async () => {
          try {
            pollAttempts++;
            console.log(`Polling attempt ${pollAttempts}/${maxPollAttempts}`);
            
            const orderDetails = await axios.post(
              `${MYFYE_BACKEND}/etherfuse/order-details`,
              {
                orderId: response.data.offramp.orderId
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'x-api-key': MYFYE_BACKEND_KEY,
                },
                withCredentials: true
              }
            );

            console.log("Etherfuse order details response:", orderDetails.data);

            // Check if burnTransaction exists
            if (orderDetails.data.burnTransaction) {
              console.log("Etherfuse Withdrawal order created successfully!");
              console.log("Burn transaction found:", orderDetails.data.burnTransaction);
              
              // Sign and submit the burn transaction
              await signBurnTransaction(orderDetails.data.burnTransaction);
              
            } else {
              if (pollAttempts < maxPollAttempts) {
                console.log("Etheerfuse No burn transaction found, retrying");
                // Wait 3 seconds and try again
                setTimeout(checkOrderDetails, 2000);
              } else {
                console.log("Max polling attempts reached. No burn transaction found.");
                setSigningOnChain(false);
                setTransactionStatus("idle");
                toast.error("Error, please try again later");
              }
            }
          } catch (error) {
            console.error("Error checking order details:", error);
            setSigningOnChain(false);
            setTransactionStatus("idle");
            toast.error("Error, please try again later");
          }
        };

        // Start checking order details
        setTimeout(checkOrderDetails, 2000);

      } else {
        toast.error("Failed to create withdrawal order");
      }


    } catch (error) {
      console.error("Error submitting Etherfuse withdrawal:", error);
      
      // Extract the actual error message from the response
      let errorMessage = "Error processing withdrawal. Please try again.";
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setIsOnboarded(false);
      await new Promise(resolve => setTimeout(resolve, 4300));
      toast.error("Did you complete these steps?");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLaunchEtherfuse = async () => {
    try {
      console.log("Launching Etherfuse for user:", userId);
      
      const response = await axios.post(
        `${MYFYE_BACKEND}/etherfuse/onboarding`,
        {
          userId: userId,
          publicKey: solanaPubKey,
          blockchain: "solana"
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': MYFYE_BACKEND_KEY,
          },
          withCredentials: true
        }
      );

      console.log("Etherfuse onboarding response:", response.data);
      
      // Handle successful response - open the presigned URL
      if (response.data.presigned_url) {
        console.log("Opening Etherfuse onboarding URL:", response.data.presigned_url);
        window.open(response.data.presigned_url, '_blank');
      } else {
        toast.error("Error please try again later");
      }
      
    } catch (error) {
      console.error("Error launching Etherfuse:", error);
      toast.error("Error please try again later");
    }
  };


  // Loading animation configuration
  const loadingOptions = {
    loop: true,
    animationData: leafLoading,
    autoplay: true,
  };

  const { View: LoadingView } = useLottie(loadingOptions);

  // Show loading animation if isLoading is true
  if (isLoading) {
    return (
      <Overlay
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(toggleOverlay({ type: "etherfuse", isOpen }));
        }}
        zIndex={2001}
        onExit={() => {
          dispatch(unmount());
        }}
        title="Bank Deposit"
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            padding: var(--size-300);
          `}
        >
          {LoadingView}
          <p
            css={css`
              margin-top: var(--size-200);
              font-size: 14px;
              color: var(--color-text-secondary);
              text-align: center;
            `}
          >
            Checking your onboarding status...
          </p>
        </div>
      </Overlay>
    );
  }

  if (signingOnChain) {
    return (
      <Overlay
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(toggleOverlay({ type: "etherfuse", isOpen }));
        }}
        zIndex={2001}
        onExit={() => {
          dispatch(unmount());
        }}
        title="Withdrawal Processing"
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            padding: var(--size-300);
          `}
        >
          <div
            css={css`
              transform: ${transactionStatus === "fail" || transactionStatus === "success" ? "scale(0.5)" : "scale(3.5)"};
              margin-bottom: var(--size-400);
            `}
          >
            <UIAnimation transactionStatus={transactionStatus} />
          </div>
        </div>
      </Overlay>
    );
  }



  // Show amount selection screen when user is onboarded
  if (isOnboarded) {
    return (
      <Overlay
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          dispatch(toggleOverlay({ type: "etherfuse", isOpen }));
        }}
        zIndex={2001}
        onExit={() => {
          dispatch(unmount());
        }}
        title="Withdraw CETES"
      >

        <AmountSelectScreen
          amountDisplayProps={{
            amount: transaction.formattedAmount,
            fiatCurrency: transaction.payin.currency,
            fee: transaction.fee,
          }}
          numberPadProps={numberPadProps}
          amountSelectorGroupProps={{
            label: "Select preset amount",
            onChange: (presetAmount) => {
              if (presetAmount === "max") {
                console.log("Etherfuse currentCETESBalance", currentCETESBalance, "cetesPrice", cetesPrice, "pesoPrice", pesoPrice);
                dispatch(updateAmount({
                  amount: currentCETESBalance,
                  formattedAmount: currentCETESBalance.toFixed(2).toString()
                }));
              } else {
                handleUpdatePresetAmount(presetAmount);
              }
            },
          }}
          amountSelectors={[
            {
              id: "1",
              label: "$500",
              value: "500",
            },
            {
              id: "2",
              label: "$1,000",
              value: "1000",
            },
            {
              id: "3",
              label: "$5,000",
              value: "5000",
            },
            {
              id: "4",
              label: "MAX",
              value: "max",
            },
          ]}
          onSubmit={handleSubmit}
          submitLabel={"Withdraw Now"}
          submitButtonProps={{
            isLoading: isSubmitting,
            isDisabled: transaction.amount === 0 || transaction.amount > currentCETESBalance,
          }}
        />
      </Overlay>
    );
  }

  return (
    <Overlay
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        dispatch(toggleOverlay({ type: "etherfuse", isOpen }));
      }}
      zIndex={2001}
      onExit={() => {
        dispatch(unmount());
      }}
      title="Bank Withdrawal"
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: var(--size-300);
          gap: var(--size-200);
        `}
      >
        {/* Header Section */}
        <div
          css={css`
            text-align: center;
            margin-bottom: var(--size-200);
          `}
        >
          <h2
            css={css`
              font-size: 18px;
              font-weight: 600;
              margin-bottom: var(--size-100);
              color: var(--color-text-primary);
            `}
          >
            Banking Partner
          </h2>
          <img
            src={etheruse_logo}
            alt="Etherfuse Logo"
            css={css`
              height: 40px;
              margin: 0 auto var(--size-100) auto;
              display: block;
            `}
          />
          <p
            css={css`
              font-size: 14px;
              color: var(--color-text-secondary);
              line-height: 1.4;
            `}
          >
            We partner with Etherfuse to provide <br/> secure bank account withdrawals
          </p>
        </div>

        {/* Steps Section */}
        <div
          css={css`
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: var(--size-150);
          `}
        >

          {/* Step 1 */}
          <div
            css={css`
              display: flex;
              align-items: center;
              gap: var(--size-100);
              padding: var(--size-100);
              background: var(--color-background-secondary);
              border-radius: var(--radius-100);
            `}
          >
            <div
              css={css`
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                color: #1a5d1a;
                font-weight: 700;
                font-size: 18px;
              `}
            >
              1
            </div>
            <div
              css={css`
                display: flex;
                align-items: center;
                gap: var(--size-150);
                flex: 1;
              `}
            >
              <CheckCircle size={20} color="var(--color-success)" />
              <span
                css={css`
                  font-size: 14px;
                  color: var(--color-text-primary);
                `}
              >
                Verify your identity
              </span>
            </div>
          </div>

          {/* Step 2 */}
          <div
            css={css`
              display: flex;
              align-items: center;
              gap: var(--size-100);
              padding: var(--size-100);
              background: var(--color-background-secondary);
              border-radius: var(--radius-100);
            `}
          >
            <div
              css={css`
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                color: #1a5d1a;
                font-weight: 700;
                font-size: 18px;
              `}
            >
              2
            </div>
            <div
              css={css`
                display: flex;
                align-items: center;
                gap: var(--size-150);
                flex: 1;
              `}
            >
              <Bank size={20} color="var(--color-primary)" />
              <span
                css={css`
                  font-size: 14px;
                  color: var(--color-text-primary);
                `}
              >
                Add your banking information
              </span>
            </div>
          </div>

          {/* Step 3 */}
          <div
            css={css`
              display: flex;
              align-items: center;
              gap: var(--size-100);
              padding: var(--size-100);
              background: var(--color-background-secondary);
              border-radius: var(--radius-100);
            `}
          >
            <div
              css={css`
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                color: #1a5d1a;
                font-weight: 700;
                font-size: 18px;
              `}
            >
              3
            </div>
            <div
              css={css`
                display: flex;
                align-items: center;
                gap: var(--size-150);
                flex: 1;
              `}
            >
              <CreditCard size={20} color="var(--color-primary)" />
              <span
                css={css`
                  font-size: 14px;
                  color: var(--color-text-primary);
                `}
              >
                Complete your withdrawal
              </span>
            </div>
          </div>
        </div>

        {/* Launch Button */}
        <Button expand onPress={handleLaunchEtherfuse}>
          Launch Etherfuse
        </Button>
      </div>
    </Overlay>
  );
};

const UIAnimation = ({
  transactionStatus,
}: {
  transactionStatus: SendTransactionStatus;
}) => {
  const options = useMemo(() => {
    switch (transactionStatus) {
      case "success": {
        return {
          loop: false,
          animationData: success,
          autoplay: true,
        };
      }
      case "fail": {
        return {
          loop: false,
          animationData: fail,
          autoplay: true,
        };
      }
      default: {
        return {
          loop: true,
          animationData: leafLoading,
          autoplay: true,
        };
      }
    }
  }, [transactionStatus]);

  const { View } = useLottie(options);

  return <>{View}</>;
};

export default EtherfuseRampOverlay;
