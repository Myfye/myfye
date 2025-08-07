import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "@/env";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const withdrawApi = createApi({
  reducerPath: "withdrawApi",
  tagTypes: ["Withdraw"],
  baseQuery: fetchBaseQuery({
    baseUrl: MYFYE_BACKEND,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", MYFYE_BACKEND_KEY);
      return headers;
    },
  }),
  endpoints: (build) => ({
    createPayout: build.query<unknown, unknown>({
      query: ({ userId, bankAccountId, amount, currency, email }) => {
        return {
          url: `/create_payout`,
          method: "POST",
          mode: "cors",
          credentials: "include",
          body: {
            user_id: userId,
            bank_account_id: bankAccountId,
            amount: amount,
            currency: currency,
            email: email,
          },
        };
      },
    }),
    addBankAccount: build.query<unknown, unknown>({
      query: ({
        userId,
        receiverId,
        accountName,
        beneficiaryName,
        speiInstitutionCode,
        speiClabe,
        type = "spei_bitso",
        speiProtocol = "clabe",
      }) => {
        return {
          url: `/add_bank_account`,
          method: "POST",
          mode: "cors",
          credentials: "include",
          body: {
            user_id: userId,
            receiver_id: receiverId,
            name: accountName,
            beneficiary_name: beneficiaryName,
            spei_institution_code: speiInstitutionCode,
            spei_clabe: speiClabe,
            type,
            spei_protocol: speiProtocol,
          },
        };
      },
    }),
  }),
});

export const {
  useCreatePayoutQuery,
  useLazyCreatePayoutQuery,
  useLazyAddBankAccountQuery,
} = withdrawApi;
