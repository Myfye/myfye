import { useLottie } from "lottie-react";
import leafLoading from "@/assets/lottie/leaf-loading.json";
import success from "@/assets/lottie/success.json";
import fail from "@/assets/lottie/fail.json";

export type TransactionStatus = "idle" | "success" | "fail" | "signed";
interface TransactionStatusIndicatorProps {
  transactionStatus: TransactionStatus;
}

const getLottieOptions = (transactionStatus: TransactionStatus) => {
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
};
const TransactionStatusIndicator = ({
  transactionStatus,
}: TransactionStatusIndicatorProps) => {
  const options = getLottieOptions(transactionStatus);
  const { View: LottieAnimation } = useLottie(options);

  return <>{LottieAnimation}</>;
};

export default TransactionStatusIndicator;
