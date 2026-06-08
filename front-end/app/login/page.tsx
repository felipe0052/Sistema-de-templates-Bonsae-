"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Loader2, Lock, Mail, Building } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "@/lib/api-client"
import { AuthLayout } from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const { token, setAuthToken } = useAuth()
  
  const [step, setStep] = useState<"login" | "activation" | "tenant_selection">("login")
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [tempToken, setTempToken] = useState("")
  const [tenants, setTenants] = useState<{id: number, name: string}[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (token) {
      router.replace("/templates")
    }
  }, [router, token])

  const handleActivationRequest = async () => {
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
  }

  const handleLogin = async () => {
    if (!email) return toast.error("Preencha seu e-mail.")
    if (!password) return toast.error("Preencha sua senha.")

    setIsSubmitting(true)
    try {
      const data = await apiFetch<{ status: string; access_token?: string; tenants?: {id: number, name: string}[] }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
      handleLoginResponse(data)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Credenciais inválidas.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTenantSelection = async (tenantId: number) => {
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
  }

  const handleLoginResponse = (data: { status: string; access_token?: string; tenants?: {id: number, name: string}[] }) => {
    if (data.status === "needs_tenant_selection") {
      setTempToken(data.access_token ?? "")
      setTenants(data.tenants ?? [])
      setStep("tenant_selection")
    } else {
      setAuthToken(data.access_token ?? null)
      router.replace("/templates")
      toast.success("Login realizado com sucesso.")
    }
  }

  const stepTitle = step === "login" ? "Entrar" : step === "activation" ? "Ativar conta" : "Escolha o NPJ"
  const stepDescription =
    step === "login"
      ? "Acesse com as credenciais cadastradas no sistema."
      : step === "activation"
        ? "Informe seu e-mail institucional para receber o link de primeiro acesso."
        : "Você possui vínculo com mais de uma organização."

  return (
    <AuthLayout title={stepTitle} description={stepDescription}>
      {step === "login" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email" type="email" autoComplete="email" className="pl-9"
                value={email} onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password" type="password" autoComplete="current-password" className="pl-9"
                value={password} onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
          </div>
          <Button className="w-full" onClick={handleLogin} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Entrar
          </Button>

          <div className="space-y-3 border-t pt-5 text-center">
            <p className="text-sm text-muted-foreground">Primeiro acesso ou conta importada?</p>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setStep("activation")}
              disabled={isSubmitting}
            >
              Ativar conta
            </Button>
          </div>
        </>
      )}

      {step === "activation" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="activation-email">E-mail</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="activation-email"
                type="email"
                autoComplete="email"
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleActivationRequest()}
              />
            </div>
          </div>

          <Button className="w-full" onClick={handleActivationRequest} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar link de ativação
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setStep("login")}
            disabled={isSubmitting}
          >
            Voltar para login
          </Button>
        </>
      )}

      {step === "tenant_selection" && (
        <div className="space-y-3">
          {tenants.map((t) => (
            <Button 
              key={t.id} variant="outline" className="w-full justify-start h-auto py-3 px-4"
              onClick={() => handleTenantSelection(t.id)} disabled={isSubmitting}
            >
              <Building className="mr-3 h-5 w-5 text-muted-foreground" />
              <span className="text-left font-medium">{t.name}</span>
            </Button>
          ))}
        </div>
      )}
    </AuthLayout>
  )
}
