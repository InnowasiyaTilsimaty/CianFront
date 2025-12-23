import { configureStore } from '@reduxjs/toolkit'
import {authApi} from "./api/auth"
import {aptmentApi} from "./api/aptment"
export const makeStore = (preloadedState) =>
  configureStore({
    reducer: {
     [authApi.reducerPath]: authApi.reducer,
     [aptmentApi.reducerPath]: aptmentApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApi.middleware,
        aptmentApi.middleware
    
    ),
    
    preloadedState, // <-- now valid
    devTools: process.env.NODE_ENV !== 'production',
  })