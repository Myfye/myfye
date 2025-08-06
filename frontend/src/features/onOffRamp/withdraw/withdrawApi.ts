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
  }),
});

export const { useCreatePayoutQuery } = withdrawApi;
