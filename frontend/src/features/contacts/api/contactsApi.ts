import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "@/env";
import { User } from "@privy-io/react-auth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contactsApi = createApi({
  reducerPath: "contactsApi",
  tagTypes: ["Contacts"],
  baseQuery: fetchBaseQuery({
    baseUrl: MYFYE_BACKEND,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", MYFYE_BACKEND_KEY);
      return headers;
    },
  }),
  endpoints: (build) => ({
    createContact: build.query<User, { userId: string; contactId: string }>({
      query: ({ userId, contactId }) => {
        return {
          url: `/create_contact`,
          method: "POST",
          body: {
            user_id: userId,
            contact_id: contactId,
          },
        };
      },
    }),
    getContacts: build.query<User[], string>({
      query: (userId) => {
        return {
          url: `/get_contacts`,
          method: "POST",
          body: {
            current_user_id: userId,
          },
        };
      },
    }),
    getTopContacts: build.query<User[], string>({
      query: (userId) => {
        return {
          url: `/get_top_contacts`,
          method: "POST",
          body: {
            current_user_id: userId,
          },
        };
      },
    }),
  }),
});

export const {
  useGetTopContactsQuery,
  useCreateContactQuery,
  useGetContactsQuery,
} = contactsApi;
