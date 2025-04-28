import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "@/env";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
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
    getTopContacts: build.query<string, string>({
      query: (userId) => {
        console.log("getTopContacts - userId:", userId);
        console.log("getTopContacts - userId type:", typeof userId);
        return {
          url: `/get_top_contacts`,
          method: "POST",
          body: {
            current_user_id: userId,
          },
        };
      },
      transformResponse: (response) => {
        console.log("getTopContacts - API response:", response);
        return response;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTopContactsQuery } = contactsApi;
