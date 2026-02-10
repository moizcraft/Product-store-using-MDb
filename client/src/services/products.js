import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'




export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000/products",
        credentials: 'include'
    }),
    endpoints: (build)=>({
        getProducts: build.query({
            query: ()=> '/getAllProducts'
        }),
        addProduct : build.mutation({
            query : (newProduct)=>({
                url: '/addProduct',
                method: 'POST',
                body: newProduct
            })
        }),
        updateProduct: build.mutation({
            query: ({id, ...updatedFields}) => ({
                url : `/updateProduct/${id}`,
                method: 'PUT',
                body: updatedFields
            })
        }),

        deleteProduct: build.mutation({
            query: (id)=>({
                url: `/deleteProduct/${id}`,
                method: 'DELETE'
            })
        })
    })
})

export const {useGetProductsQuery, useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation} = productApi