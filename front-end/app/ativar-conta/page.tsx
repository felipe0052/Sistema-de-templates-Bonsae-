"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Lock, Mail } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "@/lib/api-client"
import { AuthLayout } from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function ActivationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuthToken } = useAuth()
  
  const emailParam = searchParams.get("email") || ""
  const tokenParam = searchParams.get("token") || ""

  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (!emailParam || !tokenParam) {
      setErrorMessage("Link de ativação inválido. Por favor, acesse o link enviado para o seu e-mail.")
    }
  }, [emailParam, tokenParam])

  const handleActivate = async () => {
    if (password.length < 8) {
      return toast.error("A senha deve ter no mínimo 8 caracteres.")
    }
    if (password !== passwordConfirmation) {
      return toast.error("As senhas não coincidem.")
    }

    setIsSubmitting(true)
    try {
      const data = await apiFetch<{ status: string; access_token?: string }>("/auth/activate", {
        method: "POST",
        body: JSON.stringify({
          email: emailParam,
          token: tokenParam,
          password,
          password_confirmation: passwordConfirmation,
        }),
      })

      if (data.status === "needs_tenant_selection") {
        toast.success("Conta ativada! Faça o login para acessar seus NPJs.")
        router.replace("/login")
      } else {
        setAuthToken(data.access_token ?? null)
        toast.success("Conta ativada com sucesso!")
        router.replace("/templates")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro inesperado.")
      setErrorMessage(error instanceof Error ? error.message : "Erro inesperado.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (errorMessage) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-destructive font-medium">{errorMessage}</p>
        <Button variant="outline" onClick={() => router.replace("/login")}>
          Voltar para o Login
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        <Label>E-mail</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input disabled className="pl-9 bg-slate-50" value={emailParam} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Nova Senha</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="password" type="password" className="pl-9"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password_confirmation">Confirmar Senha</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="password_confirmation" type="password" className="pl-9"
            value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full" onClick={handleActivate} disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Ativar e Entrar
      </Button>
    </>
  )
}

export default function ActivateAccountPage() {
  return (
    <AuthLayout title="Criar Senha" description="Este é seu primeiro acesso. Defina uma senha segura para sua conta.">
      <Suspense fallback={<div className="flex justify-center p-4"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground" /></div>}>
        <ActivationForm />
      </Suspense>
    </AuthLayout>
  )
}
