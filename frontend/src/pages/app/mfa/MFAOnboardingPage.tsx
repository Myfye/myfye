import {
  useWallets,
  getEmbeddedConnectedWallet,
} from "@privy-io/react-auth";
import { setStatus } from "@/features/mfa/stores/mfaSlice";
import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import LoadingScreen from "@/shared/components/ui/loading/LoadingScreen";

const MFAOnboardingPage = () => {
  const { wallets } = useWallets();
  const status = useAppSelector((state) => state.mfa.status);

  // Check if embedded wallet already exists (created automatically with TEE)
  // No MFA required - just wait for wallet to be ready
  useEffect(() => {
    const embeddedWallet = getEmbeddedConnectedWallet(wallets);
    if (embeddedWallet) {
      // If wallet already exists and status is null, mark wallet as ready
      if (!status || status === null) {
        setStatus("created_wallet");
      }
    }
  }, [wallets, status]);

  // Show loading screen while waiting for wallet to be created
  // Once wallet is ready (status === "created_wallet"), AppRouter will show main app
  return (
    <div className="landing-layout">
      <LoadingScreen />
    </div>
  );
};

export default MFAOnboardingPage;
