import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "@/env";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "./users.types";

interface BankAccountResponse {
  bank_account_id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  blind_pay_receiver_id: string;
  blind_pay_details: {
    id: string;
    type: string;
    name: string;
    beneficiary_name: string;
    spei_protocol: string;
    spei_institution_code: string;
    spei_clabe: string;
  } | null;
  error: string | null;
}

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
    getUserBankAccounts: build.query<BankAccountResponse[], string>({
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
    deleteUserBankAccount: build.query<
      unknown,
      { userId: string; bankAccountId: string }
    >({
      query: ({ userId, bankAccountId }) => {
        return {
          url: `/delete_bank_account`,
          method: "POST",
          body: {
            user_id: userId,
            bank_account_id: bankAccountId,
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
