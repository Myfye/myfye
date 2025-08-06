import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "@/env";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "./users.types";

export const usersApi = createApi({
  reducerPath: "usersApi",
  tagTypes: ["Users"],
  baseQuery: fetchBaseQuery({
    baseUrl: MYFYE_BACKEND,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", MYFYE_BACKEND_KEY);
      return headers;
    },
  }),
  endpoints: (build) => ({
    createUser: build.query<User, User>({
      query: ({
        email,
        phoneNumber,
        firstName,
        lastName,
        country,
        evmPubKey,
        solanaPubKey,
        privyUserId,
        personaAccountId,
        blindPayReceiverId,
        blindPayEvmWalletId,
      }) => {
        return {
          url: `/create_user`,
          method: "POST",
          mode: "cors",
          credentials: "include",
          body: {
            email,
            phoneNumber,
            firstName,
            lastName,
            country,
            evmPubKey,
            solanaPubKey,
            privyUserId,
            personaAccountId,
            blindPayReceiverId,
            blindPayEvmWalletId,
          },
        };
      },
    }),
    getUser: build.query<User, { email: string; privyUserId?: string }>({
      query: ({ privyUserId }) => {
        return {
          url: `/get_user_by_privy_id`,
          method: "POST",
          mode: "cors",
          credentials: "include",
          body: {
            privyUserId,
          },
        };
      },
    }),
    getUserBankAccounts: build.query<User[], string>({
      query: (userId) => {
        return {
          url: `/get_bank_accounts`,
          method: "POST",
          body: {
            current_user_id: userId,
          },
        };
      },
    }),
    searchUsers: build.query<User[], { query: string; userId: string }>({
      query: ({ query, userId }) => {
        return {
          url: `/search_users`,
          method: "POST",
          body: {
            current_user_id: userId,
            query,
          },
        };
      },
    }),
  }),
});

export const {
  useCreateUserQuery,
  useGetUserQuery,
  useSearchUsersQuery,
  useGetUserBankAccountsQuery,
} = usersApi;
