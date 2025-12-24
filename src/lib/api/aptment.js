import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getAuthToken } from '@/lib/authToken/authToken'

export const aptmentApi = createApi({
    reducerPath: "aptmentApi",
    baseQuery: fetchBaseQuery({
         baseUrl: process.env.NEXT_PUBLIC_API_URL,
         prepareHeaders: (headers, { extra, endpoint }) => {
            const authToken = getAuthToken()
            if (authToken) {
                headers.set("Authorization", `Bearer ${authToken}`)
            }
            return headers;
         }
    }),
    tagTypes: ["aptment"],
    endpoints: (build) => ({
        // Register datas
        getAptmentList: build.query({
            query: () => ({
                url: "listings/listings/",
            }),
            providesTags: () => ["aptment"],
        }),
        // Get aptment params
        getAptmentParams: build.query({
            query: () => ({
                url: "listings/listings/params/",
            }),
            providesTags: () => ["aptment"],
        }),

        // Add aptment
        addAptment: build.mutation({
            query: (data) => ({
                url: "listings/listings/",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["aptment"]
        }),
    }),
})