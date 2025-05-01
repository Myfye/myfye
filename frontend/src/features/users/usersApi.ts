import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "@/env";
import { User } from "@privy-io/react-auth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
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
    searchUsers: build.query<User[], { query: string; userId: number }>({
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
      transformResponse: (response) => {
        console.log("searchUsers - API response:", response);
        return response;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useSearchUsersQuery } = usersApi;
