import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getAuthToken } from '@/lib/authToken/authToken'

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
         baseUrl: process.env.NEXT_PUBLIC_API_URL,
         prepareHeaders: (headers) => {
            const authToken = getAuthToken()
            if (authToken) {
                headers.set("Authorization", `Bearer ${authToken}`)
            }
            return headers;
         }
    }),
    tagTypes: ["auth"],
    endpoints: (build) => ({
        // Register datas
        registerUser: build.mutation({
            query: (data) => ({
                url: "auth/otp/send/",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["auth"]
        }),
        registerVerify: build.mutation({
            query: (data) => ({
                url: "auth/otp/verify/",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["auth"]
        }),
    }),
})