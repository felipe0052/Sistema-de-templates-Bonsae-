"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { LoaderCircle, LockKeyhole, Mail } from "lucide-react"
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
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-8">
        <div className="w-full space-y-4">
          <div className="flex justify-center">
            <Image
              src="/academy-2.png"
              alt="Bonsae"
              width={140}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </div>

          <Card className="w-full border-border/70 bg-white shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Entrar</CardTitle>
              <CardDescription>Use suas credenciais para acessar o painel.</CardDescription>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
