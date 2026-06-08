"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Lock, Mail, User, Building } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/hooks/use-auth"
import { AuthLayout } from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { FormFieldWithIcon } from "@/components/form-field-with-icon"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000/api"

export default function RegisterPage() {
  const router = useRouter()
  const { token, setAuthToken } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [tenantName, setTenantName] = useState("")
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
      throw new Error(data?.message || "Falha ao registrar.")
    }

    if (!data.access_token) {
      throw new Error("O backend não retornou um token de acesso.")
    }

    return data.access_token as string
  }

  const handleRegister = async () => {
    setIsSubmitting(true)

    try {
      const accessToken = await authenticate("/register", { name, email, password, tenant_name: tenantName })
      setAuthToken(accessToken)
      router.replace("/templates")
      toast.success("Conta criada com sucesso.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível registrar."
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Criar Conta" description="Preencha os dados abaixo para se cadastrar.">
      <FormFieldWithIcon
        label="Nome Completo"
        htmlFor="name"
        icon={User}
        inputProps={{
          id: "name",
          type: "text",
          autoComplete: "name",
          value: name,
          onChange: (e) => setName(e.target.value),
        }}
      />

      <FormFieldWithIcon
        label="E-mail"
        htmlFor="email"
        icon={Mail}
        inputProps={{
          id: "email",
          type: "email",
          autoComplete: "email",
          value: email,
          onChange: (e) => setEmail(e.target.value),
        }}
      />

      <FormFieldWithIcon
        label="Senha"
        htmlFor="password"
        icon={Lock}
        inputProps={{
          id: "password",
          type: "password",
          autoComplete: "new-password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
        }}
      />

      <FormFieldWithIcon
        label="Organização"
        htmlFor="tenantName"
        icon={Building}
        inputProps={{
          id: "tenantName",
          type: "text",
          placeholder: "Nome da sua empresa ou espaço",
          value: tenantName,
          required: true,
          onChange: (e) => setTenantName(e.target.value),
        }}
      />

      <Button
        className="w-full"
        onClick={handleRegister}
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Cadastrar
      </Button>

      <div className="flex justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
