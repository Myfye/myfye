import Overlay from "@/shared/components/ui/overlay/Overlay";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleOverlay, unmount } from "../depositOffChainSlice";
import etheruse_logo from "@/assets/etherfuse_logo.jpg";
import { css } from "@emotion/react";
import { CheckCircle, Bank, CreditCard } from "@phosphor-icons/react";
import Button from "@/shared/components/ui/button/Button";
import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from '@/env';
import axios from 'axios';
import toast from 'react-hot-toast/headless';
import leafLoading from "@/assets/lottie/leaf-loading.json";
import { useState, useEffect } from 'react';
import { useLottie } from 'lottie-react';
import { useNumberPad } from "@/shared/components/ui/number-pad/useNumberPad";
import AmountSelectScreen from "@/shared/components/ui/amount-select-screen/AmountSelectScreen";
import { updateAmount, updatePresetAmount } from "../depositOffChainSlice";

const EtherfuseRampOverlay = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.depositOffChain.overlays.etherfuse.isOpen
  );

  const userId = useAppSelector(
    (state) => state.userWalletData.currentUserID
  );

  const solanaPubKey = useAppSelector(
    (state) => state.userWalletData.solanaPubKey
  );

  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Transaction state for amount selection
  const [transaction, setTransaction] = useState({
    amount: 0,
    formattedAmount: "0",
    payin: {
      currency: "mxn" // Set to Mexican Peso
    },
    fee: 0
  });

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
      setTransaction(prev => ({
        ...prev,
        formattedAmount: newAmount,
        amount: parseFloat(newAmount) || 0
      }));
    } else {
      const newAmount = transaction.formattedAmount === "0" ? input : transaction.formattedAmount + input;
      setTransaction(prev => ({
        ...prev,
        formattedAmount: newAmount,
        amount: parseFloat(newAmount) || 0
      }));
    }
  };

  // Handle preset amount updates
  const handleUpdatePresetAmount = (presetAmount: string | null) => {
    if (presetAmount) {
      setTransaction(prev => ({
        ...prev,
        formattedAmount: presetAmount,
        amount: parseFloat(presetAmount) || 0
      }));
    }
  };

  // Handle submit button press
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      console.log("Etherfuse deposit amount:", transaction.amount, "MXN");
      
      // Call the Etherfuse order endpoint
      const response = await axios.post(
        `${MYFYE_BACKEND}/etherfuse/order`,
        {
          userId: userId,
          publicKey: solanaPubKey,
          blockchain: "solana",
          fiatAmount: transaction.amount,
          direction: "onramp",
          memo: "Etherfuse deposit order"
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
        toast.success("Deposit order created successfully!");
        
        // Open the status page in a new tab if it exists
        if (response.data.statusPage) {
          console.log("Opening status page:", response.data.statusPage);
          window.open(response.data.statusPage, '_blank');
        }
      } else {
        toast.error("Failed to create deposit order");
      }


    } catch (error) {
      console.error("Error submitting Etherfuse deposit:", error);
      
      // Extract the actual error message from the response
      let errorMessage = "Error processing deposit. Please try again.";
      
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
        title="Deposit amount to bank account"
        hideTitle
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
              handleUpdatePresetAmount(presetAmount);
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
              label: "$10,000",
              value: "10000",
            },
          ]}
          primaryAction={{
            action: () => {
              // You can add currency selection logic here if needed
              console.log("Currency selection clicked");
            },
            props: {
              leftContent: {
                title: "Deposit",
                subtitle: "Mexican Peso",
              },
              icon: "MXFlag",
            },
          }}
          onSubmit={handleSubmit}
          submitLabel={"Deposit Now"}
          submitButtonProps={{
            isLoading: isSubmitting,
            isDisabled: transaction.amount === 0,
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
      title="Bank Deposit"
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
            We partner with Etherfuse to provide <br/> secure bank account deposits
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
                Complete your deposit
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

export default EtherfuseRampOverlay;
