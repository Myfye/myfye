import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "@/env";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface CreatePayinResponse {
  receiver_id: string;
  id: string;
  pix_code: string | null;
  memo_code: string | null;
  clabe: string;
  status: string;
  payin_quote_id: string;
  instance_id: string;
  tracking_transaction: {
    step: string;
    status: string | null;
    external_id: string;
    completed_at: string | null;
  };
  tracking_payment: {
    step: "on_hold";
    provider_name: string | null;
    completed_at: string | null;
  };
  tracking_complete: {
    step: "on_hold";
    transaction_hash: string | null;
    completed_at: string | null;
  };
  tracking_partner_fee: {
    step: "on_hold";
    transaction_hash: string | null;
    completed_at: string | null;
  };
  created_at: string;
  updated_at: string;
  image_url: string | null;
  first_name: "Gavin";
  last_name: "Milligan";
  legal_name: string | null;
  type: string;
  payment_method: string;
  sender_amount: number;
  receiver_amount: number;
  token: string;
  partner_fee_amount: number;
  commercial_quotation: number;
  blindpay_quotation: number;
  currency: "MXN" | "BRL";
  billing_fee: null;
  name: string;
  address: string;
  network: string;
  total_fee_amount: 0.53;
  blindpay_bank_details: {
    routing_number: string;
    account_number: string;
    account_type: string;
    beneficiary: {
      name: string;
      address_line_1: string;
      address_line_2: string;
    };
    receiving_bank: {
      name: string;
      address_line_1: string;
      address_line_2: string;
    };
  };
}

interface CreatePayinQuery {
  blindPayEvmWalletId: string;
  amount: number;
  currency: string;
  email: string;
}

export const depositApi = createApi({
  reducerPath: "depositApi",
  tagTypes: ["DepositApi"],
  baseQuery: fetchBaseQuery({
    baseUrl: MYFYE_BACKEND,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", MYFYE_BACKEND_KEY);
      return headers;
    },
  }),
  endpoints: (build) => ({
    createPayin: build.query<CreatePayinResponse, CreatePayinQuery>({
      query: ({ blindPayEvmWalletId, amount, currency, email }) => {
        return {
          url: `/new_payin`,
          method: "POST",
          mode: "cors",
          credentials: "include",
          body: {
            blockchain_wallet_id: blindPayEvmWalletId,
            amount: amount,
            currency: currency,
            email: email,
          },
        };
      },
    }),
  }),
});

export const { useLazyCreatePayinQuery } = depositApi;
