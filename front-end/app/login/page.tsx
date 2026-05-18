"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { LoaderCircle, LockKeyhole, Mail, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import { useStore } from "@/components/store-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000/api"

export default function LoginPage() {
  const router = useRouter()
  const { token, setAuthToken } = useStore()
  const [email, setEmail] = useState("admin@instituicao.com")
  const [password, setPassword] = useState("password")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (token) {
      router.replace("/templates")
    }
  }, [router, token])

  const authenticate = async (path: string, body?: Record<string, string>) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data?.message || "Falha ao autenticar.")
    }

    if (!data.access_token) {
      throw new Error("O backend não retornou um token de acesso.")
    }

    return data.access_token as string
  }

  const handleLogin = async (path: string, body?: Record<string, string>) => {
    setIsSubmitting(true)

    try {
      const accessToken = await authenticate(path, body)
      setAuthToken(accessToken)
      router.replace("/templates")
      toast.success("Login realizado com sucesso.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível entrar."
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 text-foreground">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <section className="flex flex-col justify-between rounded-3xl border border-border bg-white/80 p-8 shadow-sm backdrop-blur">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Image
                  src="/academy-2.png"
                  alt="Bonsae"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sistema de templates</p>
                <h1 className="text-2xl font-semibold tracking-tight">Bonsae</h1>
              </div>
            </div>

            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
                <ShieldCheck className="h-4 w-4" />
                Acesso de administrador
              </span>
              <h2 className="max-w-lg text-4xl font-semibold tracking-tight text-balance">
                Entre para gerenciar templates, documentos e variáveis.
              </h2>
              <p className="max-w-xl text-base text-muted-foreground">
                Use a conta admin seedada no ambiente de deploy para acessar os dados de demonstração com segurança e rapidez.
              </p>
            </div>
          </div>

          <div className="grid gap-3 pt-8 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="rounded-2xl border bg-background/80 p-4">
              <p className="font-medium text-foreground">Credenciais padrão</p>
              <p>admin@instituicao.com</p>
              <p>password</p>
            </div>
            <div className="rounded-2xl border bg-background/80 p-4">
              <p className="font-medium text-foreground">Tema padrão</p>
              <p>Claro, com visual limpo e leve.</p>
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <Card className="w-full border-border/70 bg-white shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Entrar</CardTitle>
              <CardDescription>Use suas credenciais de administrador para acessar o painel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className="pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => handleLogin("/login", { email, password })}
                disabled={isSubmitting}
              >
                {isSubmitting ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                Entrar
              </Button>

              <Separator />

              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleLogin("/admin-mode/login")}
                disabled={isSubmitting}
              >
                Acesso de demonstração
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
