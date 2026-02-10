import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:5000/auth",
    credentials: 'include',
    prepareHeaders: (headers) => {
        // Get token from localStorage if needed
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    
    // Handle errors consistently
    if (result.error) {
        // If backend returns error in standard format
        if (result.error.data?.message) {
            result.error.data = {
                ...result.error.data,
                message: result.error.data.message
            };
        }
    }
    
    return result;
};

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (build)=>({
      loginUser: build.mutation({
        query: (credentials)=>({
            url: '/login',
            method: 'POST',
            body: credentials
      })
    }),

    signUpUser : build.mutation({
        query : (newUser)=>({
            url: '/signup',
            method: 'POST',
            body: newUser
        })
    })
})
})

export const {useLoginUserMutation, useSignUpUserMutation} = authApi