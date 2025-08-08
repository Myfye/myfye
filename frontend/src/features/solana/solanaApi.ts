import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "@/env";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface RecentlyUsedAddressesResponse {
  id: string;
  user_id: string;
  addresses: string[];
}

export const solanaApi = createApi({
  reducerPath: "solanaApi",
  tagTypes: ["Solana"],
  baseQuery: fetchBaseQuery({
    baseUrl: MYFYE_BACKEND,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", MYFYE_BACKEND_KEY);
      return headers;
    },
    mode: "cors",
    credentials: "include",
  }),
  endpoints: (build) => ({
    saveRecentlyUsedAddresses: build.query<
      unknown,
      { userId: string; addresses: string[] }
    >({
      query: ({ userId, addresses }) => {
        return {
          url: `/save_recently_used_addresses`,
          method: "POST",
          body: {
            user_id: userId,
            addresses,
          },
        };
      },
    }),
    getRecentlyUsedAddresses: build.query<
      RecentlyUsedAddressesResponse,
      string
    >({
      query: (userId) => {
        return {
          url: `/get_recently_used_addresses`,
          method: "POST",
          body: {
            user_id: userId,
          },
        };
      },
    }),
  }),
});

export const {
  useSaveRecentlyUsedAddressesQuery,
  useGetRecentlyUsedAddressesQuery,
} = solanaApi;
