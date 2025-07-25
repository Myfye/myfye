// Need to use the React-specific entry point to import createApi
import { MYFYE_BACKEND } from "@/env";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const pokemonApi = createApi({
  reducerPath: "activityApi",
  baseQuery: fetchBaseQuery({ baseUrl: MYFYE_BACKEND }),
  endpoints: (builder) => ({
    getTransactionHistory: builder.query<Pokemon, string>({
      query: () => `/get_transaction_history`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPokemonByNameQuery } = pokemonApi;
