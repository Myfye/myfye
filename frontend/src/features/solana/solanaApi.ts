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
        console.log("saveRecentlyUsedAddresses API call - userId:", userId, "addresses:", addresses);
        return {
          url: `/save_recently_used_addresses`,
          method: "POST",
          body: {
            user_id: userId,
            addresses,
          },
        };
      },
      transformResponse: (response) => {
        console.log("saveRecentlyUsedAddresses API response:", response);
        return response;
      },
    }),
    getRecentlyUsedAddresses: build.query<
      RecentlyUsedAddressesResponse,
      string
    >({
      query: (userId) => {
        console.log("getRecentlyUsedAddresses API call - userId:", userId);
        return {
          url: `/get_recently_used_addresses`,
          method: "POST",
          body: {
            user_id: userId,
          },
        };
      },
      transformResponse: (response: RecentlyUsedAddressesResponse) => {
        console.log("getRecentlyUsedAddresses API response:", response);
        return response;
      },
    }),
  }),
});

export const {
  useSaveRecentlyUsedAddressesQuery,
  useGetRecentlyUsedAddressesQuery,
} = solanaApi;
