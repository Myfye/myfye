import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "@/env";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface GetTransactionHistoryQuery {
  userId: string;
  evmPubKey: string;
  solPubKey: string;
  limit?: number;
  offset?: number;
}

export const activityApi = createApi({
  reducerPath: "activityApi",
  tagTypes: ["Activity"],
  baseQuery: fetchBaseQuery({
    baseUrl: MYFYE_BACKEND,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", MYFYE_BACKEND_KEY);
      return headers;
    },
  }),
  endpoints: (build) => ({
    getTransactionHistory: build.query<unknown, GetTransactionHistoryQuery>({
      query: ({ userId, evmPubKey, solPubKey, limit = 50, offset = 0 }) => {
        return {
          url: `/get_transaction_history`,
          method: "POST",
          body: {
            user_id: userId,
            evm_public_key: evmPubKey,
            sol_public_key: solPubKey,
            limit: limit,
            offset: offset,
          },
        };
      },
    }),
  }),
});

export const {
  useGetTransactionHistoryQuery,
  useLazyGetTransactionHistoryQuery,
} = activityApi;
