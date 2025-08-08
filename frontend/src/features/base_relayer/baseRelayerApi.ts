import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "@/env";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Address } from "viem";

export const baseRelayerApi = createApi({
  reducerPath: "baseRelayerApi",
  tagTypes: ["BaseRelayer"],
  baseQuery: fetchBaseQuery({
    baseUrl: "https://relayer.base.org/sponsored",
  }),
  endpoints: (build) => ({
    getBaseRelayer: build.query<
      unknown,
      { sponsoredBy: string; signedTransaction: Address; chainId: number }
    >({
      query: ({ sponsoredBy = "base", signedTransaction, chainId }) => {
        return {
          url: "/",
          method: "POST",
          mode: "cors",
          credentials: "include",
          body: {
            signedTransaction,
            chainId,
            sponsoredBy, // Base sponsors the gas
          },
        };
      },
    }),
  }),
});

export const { useLazyGetBaseRelayerQuery } = baseRelayerApi;
