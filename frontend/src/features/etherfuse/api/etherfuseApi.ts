import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "@/env";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface GetTransactionHistoryQuery {
  userId: string;
  evmPubKey: string;
  solPubKey: string;
  limit?: number;
  offset?: number;
}

export const etherfuseApi = createApi({
  reducerPath: "etherfuseApi",
  tagTypes: ["Etherfuse"],
  baseQuery: fetchBaseQuery({
    baseUrl: MYFYE_BACKEND,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", MYFYE_BACKEND_KEY);
      return headers;
    },
  }),
  endpoints: (build) => ({
    getUserData: build.query<unknown, GetTransactionHistoryQuery>({
      query: () => {
        return {
          url: `/get-user-data`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetUserDataQuery, useLazyGetUserDataQuery } = etherfuseApi;
