'use client'
import { Provider } from 'react-redux'
import { useRef } from 'react'
import { makeStore } from '@/lib/store' // named import

export default function ReduxProvider({ children, preloadedState }) {
  const storeRef = useRef()
  if (!storeRef.current) {
    storeRef.current = makeStore(preloadedState) // create per session/render
  }
  return <Provider store={storeRef.current}>{children}</Provider>
}
