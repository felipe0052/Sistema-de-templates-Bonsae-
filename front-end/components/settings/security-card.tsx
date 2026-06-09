"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "@/lib/api-client"

export function SecurityCard() {
  const { token } = useAuth()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [changingPassword, setChangingPassword] = useState(false)

  const handleChangePassword = async () => {
    if (!token) return
    if (newPassword.length < 8) {
      toast.error("A nova senha deve ter no mínimo 8 caracteres")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("A confirmação da senha não coincide")
      return
    }
    setChangingPassword(true)
    try {
      await apiFetch("/user/password", {
        method: "PUT",
        token,
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        }),
      })
      toast.success("Senha alterada com sucesso!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao alterar senha")
    } finally {
      setChangingPassword(false)
    }
  }

  return (
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
          <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">Nova Senha</Label>
            <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
        </div>
        <Button variant="outline" onClick={handleChangePassword} disabled={changingPassword}>
          {changingPassword ? "Alterando..." : "Alterar Senha"}
        </Button>
      </CardContent>
    </Card>
  )
}
