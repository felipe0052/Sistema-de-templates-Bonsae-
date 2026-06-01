"use client"

import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { apiFetch } from "@/lib/api-client"

const AUTH_TOKEN_KEY = "bonsae_auth_token"

export type User = {
  id: number
  name: string
  email: string
  preferences: {
    pdf_default_format?: string
    pdf_margin_top?: number
    pdf_margin_bottom?: number
    pdf_margin_left?: number
    pdf_margin_right?: number
  }
}

type AuthContextType = {
  token: string | null
  user: User | null
  setAuthToken: (value: string | null) => void
  clearAuthToken: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null
    }
    return localStorage.getItem(AUTH_TOKEN_KEY)
  })

  const [user, setUser] = useState<User | null>(null)

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
    setUser(null)
  }, [setAuthToken])

  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!currentToken) return
    try {
      const data = await apiFetch<User>("/user", { token: currentToken })
      setUser(data)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    if (token) {
      refreshUser()
    }
  }, [token, refreshUser])

  return (
    <AuthContext.Provider value={{ token, user, setAuthToken, clearAuthToken, refreshUser }}>
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
