import { configureStore } from '@reduxjs/toolkit'
import todoReducer from '../features/todoSlice'
import { productApi } from '../services/products'
import { authApi } from '../services/auth'

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    [productApi.reducerPath]: productApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productApi.middleware,
      authApi.middleware
    ),
})