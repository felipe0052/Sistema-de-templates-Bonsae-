"use client"

import React, { createContext, useCallback, useContext, useState } from "react"

const AUTH_TOKEN_KEY = "bonsae_auth_token"

type AuthContextType = {
  token: string | null
  setAuthToken: (value: string | null) => void
  clearAuthToken: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null
    }
    return localStorage.getItem(AUTH_TOKEN_KEY)
  })

  const setAuthToken = useCallback((value: string | null) => {
    setTokenState(value)
    if (typeof window === "undefined") return
    if (value) {
      localStorage.setItem(AUTH_TOKEN_KEY, value)
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    }
  }, [])

  const clearAuthToken = useCallback(() => {
    setAuthToken(null)
  }, [setAuthToken])

  return (
    <AuthContext.Provider value={{ token, setAuthToken, clearAuthToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
