import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "@/env";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../types/users.types";

interface BankAccountResponse {
  id: string;
  type: string;
  name: string;
  beneficiary_name: string;
  spei_institution_code: string;
  spei_clabe: string;
  spei_protocol: string;
  account_class: string | null;
  account_number: string | null;
  account_type: string | null;
  created_at: string;
  // ... other fields that might be present but not needed
}

type DeleteUserBankAccountQuery = { userId: string; bankAccountId: string };

type GetUserBankAccountsResponse = {
  success: boolean;
  data: BankAccountResponse[];
  message: string;
};

export const usersApi = createApi({
  reducerPath: "usersApi",
  tagTypes: ["Users", "BankAccounts"],
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
    getUserBankAccounts: build.query<GetUserBankAccountsResponse, string>({
      query: (userId) => {
        return {
          url: `/get_bank_accounts`,
          method: "POST",
          body: {
            user_id: userId,
          },
        };
      },
      providesTags: (result, error, userId) => [
        { type: "Users", id: userId },
        { type: "BankAccounts", id: userId },
      ],
    }),
    deleteUserBankAccount: build.query<unknown, DeleteUserBankAccountQuery>({
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
      // invalidatesTags: (result, error, { userId }) => [
      //   { type: "BankAccounts", id: userId },
      // ],
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
