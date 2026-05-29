"use client"

import { useEffect, useState, Suspense } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { LoaderCircle, LockKeyhole, Mail } from "lucide-react"
import { toast } from "sonner"

import { useStore } from "@/components/store-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000/api"

function ActivationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuthToken } = useStore()
  
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
      const response = await fetch(`${API_BASE_URL}/auth/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: emailParam,
          token: tokenParam,
          password: password,
          password_confirmation: passwordConfirmation,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || data.errors?.[Object.keys(data.errors)[0]]?.[0] || "Falha na ativação.")
      }

      if (data.status === "needs_tenant_selection") {
        // We log them in partially, but it's simpler to redirect to login since they now have a password
        toast.success("Conta ativada! Faça o login para acessar seus NPJs.")
        router.replace(`/login`)
      } else {
        setAuthToken(data.access_token)
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
          <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="password" type="password" className="pl-9"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password_confirmation">Confirmar Senha</Label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="password_confirmation" type="password" className="pl-9"
            value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full" onClick={handleActivate} disabled={isSubmitting}>
        {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
        Ativar e Entrar
      </Button>
    </>
  )
}

export default function ActivateAccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-8">
        <div className="w-full space-y-4">
          <div className="flex justify-center">
            <Image src="/academy-2.png" alt="Bonsae" width={140} height={48} className="h-12 w-auto" priority />
          </div>

          <Card className="w-full border-border/70 bg-white shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Criar Senha</CardTitle>
              <CardDescription>
                Este é seu primeiro acesso. Defina uma senha segura para sua conta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Suspense fallback={<div className="flex justify-center p-4"><LoaderCircle className="animate-spin h-6 w-6 text-muted-foreground" /></div>}>
                <ActivationForm />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
