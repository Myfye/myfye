import { Asset } from "@/features/assets/types";
import { Address } from "viem";

export interface WithdrawOffChainTransaction {
  id: string | null;
  status: "idle" | "success" | "fail";
  amount: number | null;
  formattedAmount: string;
  assetId: Asset["id"] | null;
  fiatCurrency: "usd" | "euro";
  fee: number;
  presetAmount: string | null;
  bankInfo: {
    id: string | null;
    accountName: string | null;
    code: string | null;
    speiClabe: string | null;
    beneficiaryName: string | null;
  };
  payout: {
    id: string | null;
    expiresAt: number | null;
    commercialQuotation: number | null;
    blindPayQuotation: number | null;
    receiverAmount: number | null;
    senderAmount: number | null;
    partnerFeeAmount: number | null;
    flatFee: number | null;
    contract: {
      abi: [{}];
      address: Address | null;
      functionName: "approve" | null;
      blindpayContractAddress: Address | null;
      amount: string | null;
      network: {
        name: string | null;
        chainId: string | null;
      };
    };
    receiverLocalAmount: string | null;
    description: string | null;
  };
}

export type WithdrawOffChainOverlay =
  | "withdrawOffChain"
  | "bankPicker"
  | "bankInput"
  | "selectBank"
  | "confirmTransaction"
  | "processingTransaction"
  | "selectAsset";

export interface BankInfo {
  id: string;
  code: string;
  label: string;
  icon: string;
}

export interface BankAccount {
  id: string;
  name: string;
  beneficiary_name: string;
  spei_institution_code: string;
  spei_clabe: string;
}

export interface BankAccountResponse {
  id: string;
  type: string;
  name: string;
  beneficiary_name: string;
  spei_institution_code: string;
  spei_clabe: string;
  spei_protocol: string;
  account_class: string | null;
  account_number: string | null;
  account_type: string | null;
  created_at: string;
  // ... other fields that might be present but not needed
}

export type PresetAmountOption = "10" | "50" | "100" | "max" | null;
