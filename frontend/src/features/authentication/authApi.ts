import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "@/env";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface UserResponse {
  email: string;
  phone_number: string | null;
  first_name: string | null;
  last_name: string | null;
  country: string | null;
  evm_pub_key: string | null;
  solana_pub_key: string | null;
  privy_user_id: string | null;
  persona_account_id: string | null;
  blind_pay_receiver_id: string | null;
  blind_pay_evm_wallet_id: string | null;
  creation_date: string | null;
}

interface CreateUserQuery {
  email: string;
  privyUserId: string;
  phoneNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  country: string | null;
  evmPubKey: string | null;
  solanaPubKey: string | null;
  personaAccountId: string | null;
  blindPayReceiverId: string | null;
  blindPayEvmWalletId: string | null;
}

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["Auth"],
  baseQuery: fetchBaseQuery({
    baseUrl: MYFYE_BACKEND,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", MYFYE_BACKEND_KEY);
      return headers;
    },
  }),
  endpoints: (build) => ({
    createUser: build.query<UserResponse, CreateUserQuery>({
      query: ({
        email,
        privyUserId,
        phoneNumber,
        firstName,
        lastName,
        country,
        evmPubKey,
        solanaPubKey,
        personaAccountId,
        blindPayReceiverId,
        blindPayEvmWalletId,
      }) => {
        return {
          url: `/create_user`,
          body: {
            email,
            privyUserId,
            phoneNumber,
            firstName,
            lastName,
            country,
            evmPubKey,
            solanaPubKey,
            personaAccountId,
            blindPayReceiverId,
            blindPayEvmWalletId,
          },
        };
      },
    }),
    getUserByPrivyId: build.query<UserResponse, CreateUserQuery>({
      query: (privyUserId) => {
        return {
          url: `/get_user_by_privy_id`,
          body: {
            privyUserId,
          },
        };
      },
    }),
  }),
});
