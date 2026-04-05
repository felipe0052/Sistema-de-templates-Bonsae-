"use client"

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

export default function ConfiguracoesPage() {
  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!")
  }

  return (
    <DashboardLayout
      title="Configurações"
      subtitle="Gerencie as configurações do sistema"
    >
      <div className="space-y-6 max-w-4xl">
        {/* Profile Settings */}
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
                <Input id="nome" defaultValue="Usuário Demo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" defaultValue="usuario@bonsae.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa/Instituição</Label>
              <Input id="empresa" defaultValue="Bonsae" />
            </div>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
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

        {/* Appearance Settings */}
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

        {/* PDF Settings */}
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
              <Select defaultValue="a4">
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
                <Input id="margin-top" defaultValue="20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="margin-bottom">Margem Inferior</Label>
                <Input id="margin-bottom" defaultValue="20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="margin-left">Margem Esquerda</Label>
                <Input id="margin-left" defaultValue="25" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="margin-right">Margem Direita</Label>
                <Input id="margin-right" defaultValue="25" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              As margens são definidas em milímetros (mm)
            </p>
          </CardContent>
        </Card>

        {/* Security Settings */}
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
