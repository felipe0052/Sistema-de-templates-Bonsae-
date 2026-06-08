"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "@/lib/api-client"

type Step = "login" | "activation" | "tenant_selection"

interface Tenant {
  id: number
  name: string
}

interface LoginResponse {
  status: string
  access_token?: string
  tenants?: Tenant[]
}

export function useLoginFlow() {
  const router = useRouter()
  const { token, setAuthToken } = useAuth()
  const [step, setStep] = useState<Step>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [tempToken, setTempToken] = useState("")
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (token) router.replace("/templates")
  }, [router, token])

  const handleLoginResponse = useCallback(
    (data: LoginResponse) => {
      if (data.status === "needs_tenant_selection") {
        setTempToken(data.access_token ?? "")
        setTenants(data.tenants ?? [])
        setStep("tenant_selection")
      } else {
        setAuthToken(data.access_token ?? null)
        router.replace("/templates")
        toast.success("Login realizado com sucesso.")
      }
    },
    [router, setAuthToken],
  )

  const handleLogin = useCallback(async () => {
    if (!email) return toast.error("Preencha seu e-mail.")
    if (!password) return toast.error("Preencha sua senha.")
    setIsSubmitting(true)
    try {
      const data = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
      handleLoginResponse(data)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Credenciais inválidas.")
    } finally {
      setIsSubmitting(false)
    }
  }, [email, password, handleLoginResponse])

  const handleActivationRequest = useCallback(async () => {
    if (!email) return toast.error("Preencha seu e-mail.")
    setIsSubmitting(true)
    try {
      const data = await apiFetch<{ status: string; message?: string }>("/auth/identify", {
        method: "POST",
        body: JSON.stringify({ email }),
      })
      if (data.status === "needs_activation") {
        toast.success(data.message || "Enviamos o link de ativação para o seu e-mail.")
      } else if (data.status === "needs_password") {
        toast.info("Sua conta já está ativa. Entre com e-mail e senha.")
        setStep("login")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao solicitar ativação.")
    } finally {
      setIsSubmitting(false)
    }
  }, [email])

  const handleTenantSelection = useCallback(
    async (tenantId: number) => {
      setIsSubmitting(true)
      try {
        const data = await apiFetch<{ access_token: string }>("/auth/select-tenant", {
          method: "POST",
          body: JSON.stringify({ tenant_id: tenantId }),
          token: tempToken,
        })
        setAuthToken(data.access_token)
        router.replace("/templates")
        toast.success("Login realizado com sucesso.")
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao selecionar organização.")
      } finally {
        setIsSubmitting(false)
      }
    },
    [tempToken, router, setAuthToken],
  )

  return {
    step,
    setStep,
    email,
    setEmail,
    password,
    setPassword,
    tenants,
    isSubmitting,
    handleLogin,
    handleActivationRequest,
    handleTenantSelection,
  }
}
