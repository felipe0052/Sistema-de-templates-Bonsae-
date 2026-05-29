"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { LoaderCircle, LockKeyhole, Mail, Building } from "lucide-react"
import { toast } from "sonner"

import { useStore } from "@/components/store-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000/api"

export default function LoginPage() {
  const router = useRouter()
  const { token, setAuthToken } = useStore()
  
  const [step, setStep] = useState<"identify" | "password" | "tenant_selection">("identify")
  
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

  const apiRequest = async (path: string, body?: Record<string, any>, tokenOverride?: string) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
    if (tokenOverride) headers["Authorization"] = `Bearer ${tokenOverride}`

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.message || data.errors?.[Object.keys(data.errors)[0]]?.[0] || "Ocorreu um erro.")
    }

    return data
  }

  const handleIdentify = async () => {
    if (!email) return toast.error("Preencha seu e-mail.")
    setIsSubmitting(true)
    try {
      const data = await apiRequest("/auth/identify", { email })
      if (data.status === "needs_activation") {
        toast.info(data.message)
        // Permanece no step identify para mostrar a msg ou podemos ir para uma tela de sucesso
      } else if (data.status === "needs_password") {
        setStep("password")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro na identificação.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogin = async () => {
    setIsSubmitting(true)
    try {
      const data = await apiRequest("/auth/login", { email, password })
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
      const data = await apiRequest("/auth/select-tenant", { tenant_id: tenantId }, tempToken)
      setAuthToken(data.access_token)
      router.replace("/templates")
      toast.success("Login realizado com sucesso.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao selecionar organização.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLoginResponse = (data: any) => {
    if (data.status === "needs_tenant_selection") {
      setTempToken(data.access_token)
      setTenants(data.tenants)
      setStep("tenant_selection")
    } else {
      setAuthToken(data.access_token)
      router.replace("/templates")
      toast.success("Login realizado com sucesso.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-8">
        <div className="w-full space-y-4">
          <div className="flex justify-center">
            <Image src="/academy-2.png" alt="Bonsae" width={140} height={48} className="h-12 w-auto" priority />
          </div>

          <Card className="w-full border-border/70 bg-white shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">
                {step === "identify" && "Entrar"}
                {step === "password" && "Sua Senha"}
                {step === "tenant_selection" && "Escolha o NPJ"}
              </CardTitle>
              <CardDescription>
                {step === "identify" && "Informe seu e-mail institucional para acessar."}
                {step === "password" && "Digite sua senha para continuar."}
                {step === "tenant_selection" && "Você possui vínculo com mais de uma organização."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              
              {step === "identify" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email" type="email" autoComplete="email" className="pl-9"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleIdentify()}
                      />
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleIdentify} disabled={isSubmitting}>
                    {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Continuar
                  </Button>
                </>
              )}

              {step === "password" && (
                <>
                  <div className="space-y-2">
                    <Label>E-mail</Label>
                    <div className="text-sm font-medium text-muted-foreground flex justify-between">
                      {email}
                      <button onClick={() => setStep("identify")} className="text-primary hover:underline text-xs">Alterar</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password" type="password" autoComplete="current-password" className="pl-9" autoFocus
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      />
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleLogin} disabled={isSubmitting}>
                    {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Entrar
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

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
