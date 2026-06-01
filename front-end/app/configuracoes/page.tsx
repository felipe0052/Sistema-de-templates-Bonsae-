"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Settings,
  User,
  Bell,
  Palette,
  Shield,
  Save,
} from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "@/lib/api-client"

export default function ConfiguracoesPage() {
  const { user, token, refreshUser } = useAuth()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [pdfFormat, setPdfFormat] = useState("a4")
  const [marginTop, setMarginTop] = useState("20")
  const [marginBottom, setMarginBottom] = useState("20")
  const [marginLeft, setMarginLeft] = useState("25")
  const [marginRight, setMarginRight] = useState("25")

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
      setPdfFormat(user.preferences?.pdf_default_format || "a4")
      setMarginTop(String(user.preferences?.pdf_margin_top ?? 20))
      setMarginBottom(String(user.preferences?.pdf_margin_bottom ?? 20))
      setMarginLeft(String(user.preferences?.pdf_margin_left ?? 25))
      setMarginRight(String(user.preferences?.pdf_margin_right ?? 25))
    }
  }, [user])

  const handleSaveProfile = async () => {
    if (!token) return
    setSaving(true)
    try {
      await apiFetch("/user", {
        method: "PUT",
        token,
        body: JSON.stringify({ name, email }),
      })
      await refreshUser()
      toast.success("Perfil atualizado com sucesso!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar perfil")
    } finally {
      setSaving(false)
    }
  }

  const handleSavePdf = async () => {
    if (!token) return
    setSaving(true)
    try {
      await apiFetch("/user", {
        method: "PUT",
        token,
        body: JSON.stringify({
          preferences: {
            pdf_default_format: pdfFormat,
            pdf_margin_top: Number(marginTop),
            pdf_margin_bottom: Number(marginBottom),
            pdf_margin_left: Number(marginLeft),
            pdf_margin_right: Number(marginRight),
          },
        }),
      })
      await refreshUser()
      toast.success("Configurações de PDF salvas com sucesso!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar configurações de PDF")
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout
      title="Configurações"
      subtitle="Gerencie as configurações do sistema"
    >
      <div className="space-y-6 max-w-4xl">
        <Card className="bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base">Perfil</CardTitle>
                <CardDescription>Gerencie suas informações pessoais</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <Button onClick={handleSaveProfile} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base">Notificações</CardTitle>
                <CardDescription>Configure suas preferências de notificação</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações por e-mail</p>
                <p className="text-sm text-muted-foreground">
                  Receba atualizações sobre documentos gerados
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Resumo semanal</p>
                <p className="text-sm text-muted-foreground">
                  Receba um resumo semanal das atividades
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alertas de sistema</p>
                <p className="text-sm text-muted-foreground">
                  Notificações sobre atualizações e manutenções
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base">Aparência</CardTitle>
                <CardDescription>Personalize a interface do sistema</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              <Select defaultValue="light">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selecione o tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Idioma</Label>
              <Select defaultValue="pt-BR">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selecione o idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base">Configurações de PDF</CardTitle>
                <CardDescription>Configure as opções de geração de documentos</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Formato padrão</Label>
              <Select value={pdfFormat} onValueChange={setPdfFormat}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selecione o formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4 (210 x 297 mm)</SelectItem>
                  <SelectItem value="letter">Carta (216 x 279 mm)</SelectItem>
                  <SelectItem value="legal">Ofício (216 x 356 mm)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="margin-top">Margem Superior</Label>
                <Input id="margin-top" type="number" value={marginTop} onChange={(e) => setMarginTop(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="margin-bottom">Margem Inferior</Label>
                <Input id="margin-bottom" type="number" value={marginBottom} onChange={(e) => setMarginBottom(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="margin-left">Margem Esquerda</Label>
                <Input id="margin-left" type="number" value={marginLeft} onChange={(e) => setMarginLeft(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="margin-right">Margem Direita</Label>
                <Input id="margin-right" type="number" value={marginRight} onChange={(e) => setMarginRight(e.target.value)} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              As margens são definidas em milímetros (mm)
            </p>
            <Button onClick={handleSavePdf} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Salvando..." : "Salvar Preferências de PDF"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base">Segurança</CardTitle>
                <CardDescription>Gerencie a segurança da sua conta</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha Atual</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </div>
            <Button variant="outline">Alterar Senha</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
