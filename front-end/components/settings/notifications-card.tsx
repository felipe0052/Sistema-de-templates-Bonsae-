"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Bell, Save } from "lucide-react"
import { toast } from "sonner"
import { useUserPreferences, useUpdateUser } from "@/hooks/use-user"
import { useAuth } from "@/hooks/use-auth"

export function NotificationsCard() {
  const { token } = useAuth()
  const prefs = useUserPreferences()
  const updateUser = useUpdateUser()

  const [notifEmail, setNotifEmail] = useState(true)
  const [notifWeekly, setNotifWeekly] = useState(true)
  const [notifAlerts, setNotifAlerts] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (prefs) {
      setNotifEmail(prefs?.notifications?.email_notifications ?? true)
      setNotifWeekly(prefs?.notifications?.weekly_summary ?? true)
      setNotifAlerts(prefs?.notifications?.system_alerts ?? false)
    }
  }, [prefs])

  const handleSaveNotifications = async () => {
    if (!token) return
    setSaving(true)
    try {
      await updateUser.mutateAsync({
        preferences: {
          ...prefs,
          notifications: {
            email_notifications: notifEmail,
            weekly_summary: notifWeekly,
            system_alerts: notifAlerts,
          },
        },
      })
      toast.success("Preferências de notificação salvas com sucesso!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar notificações")
    } finally {
      setSaving(false)
    }
  }

  return (
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
          <Switch checked={notifEmail} onCheckedChange={setNotifEmail} />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Resumo semanal</p>
            <p className="text-sm text-muted-foreground">
              Receba um resumo semanal das atividades
            </p>
          </div>
          <Switch checked={notifWeekly} onCheckedChange={setNotifWeekly} />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Alertas de sistema</p>
            <p className="text-sm text-muted-foreground">
              Notificações sobre atualizações e manutenções
            </p>
          </div>
          <Switch checked={notifAlerts} onCheckedChange={setNotifAlerts} />
        </div>
        <Button onClick={handleSaveNotifications} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Salvando..." : "Salvar Preferências de Notificação"}
        </Button>
      </CardContent>
    </Card>
  )
}
