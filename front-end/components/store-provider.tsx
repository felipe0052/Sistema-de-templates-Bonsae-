"use client"

import React, { createContext, useContext } from "react"
import { useApiStore } from "@/hooks/use-api-store"

type StoreContextType = ReturnType<typeof useApiStore>

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const store = useApiStore()
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
