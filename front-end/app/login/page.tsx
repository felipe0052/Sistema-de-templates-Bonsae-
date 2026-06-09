"use client"

import { Loader2, Lock, Mail, Building } from "lucide-react"
import { AuthLayout } from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { FormFieldWithIcon } from "@/components/form-field-with-icon"
import { useLoginFlow } from "@/hooks/use-login-flow"

const STEP_META: Record<string, { title: string; description: string }> = {
  login: { title: "Entrar", description: "Acesse com as credenciais cadastradas no sistema." },
  activation: { title: "Ativar conta", description: "Informe seu e-mail institucional para receber o link de primeiro acesso." },
  tenant_selection: { title: "Escolha o NPJ", description: "Você possui vínculo com mais de uma organização." },
}

export default function LoginPage() {
  const {
    step, setStep, email, setEmail, password, setPassword,
    tenants, isSubmitting, handleLogin, handleActivationRequest, handleTenantSelection,
  } = useLoginFlow()

  const { title, description } = STEP_META[step]

  return (
    <AuthLayout title={title} description={description}>
      {step === "login" && (
        <>
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
              onKeyDown: (e) => e.key === "Enter" && handleLogin(),
            }}
          />
          <FormFieldWithIcon
            label="Senha"
            htmlFor="password"
            icon={Lock}
            inputProps={{
              id: "password",
              type: "password",
              autoComplete: "current-password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && handleLogin(),
            }}
          />
          <Button className="w-full" onClick={handleLogin} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Entrar
          </Button>
          <div className="space-y-3 border-t pt-5 text-center">
            <p className="text-sm text-muted-foreground">Primeiro acesso ou conta importada?</p>
            <Button type="button" variant="outline" className="w-full" onClick={() => setStep("activation")} disabled={isSubmitting}>
              Ativar conta
            </Button>
          </div>
        </>
      )}

      {step === "activation" && (
        <>
          <FormFieldWithIcon
            label="E-mail"
            htmlFor="activation-email"
            icon={Mail}
            inputProps={{
              id: "activation-email",
              type: "email",
              autoComplete: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && handleActivationRequest(),
            }}
          />
          <Button className="w-full" onClick={handleActivationRequest} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar link de ativação
          </Button>
          <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("login")} disabled={isSubmitting}>
            Voltar para login
          </Button>
        </>
      )}

      {step === "tenant_selection" && (
        <div className="space-y-3">
          {tenants.map((t) => (
            <Button key={t.id} variant="outline" className="w-full justify-start h-auto py-3 px-4" onClick={() => handleTenantSelection(t.id)} disabled={isSubmitting}>
              <Building className="mr-3 h-5 w-5 text-muted-foreground" />
              <span className="text-left font-medium">{t.name}</span>
            </Button>
          ))}
        </div>
      )}
    </AuthLayout>
  )
}
