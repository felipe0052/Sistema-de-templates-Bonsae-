"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Save } from "lucide-react"
import { toast } from "sonner"
import { useUser, useUpdateUser } from "@/hooks/use-user"
import { useAuth } from "@/hooks/use-auth"

export function ProfileCard() {
  const { token } = useAuth()
  const { data: user } = useUser()
  const updateUser = useUpdateUser()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
    }
  }, [user])

  const handleSaveProfile = async () => {
    if (!token) return
    setSaving(true)
    try {
      await updateUser.mutateAsync({ name, email })
      toast.success("Perfil atualizado com sucesso!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar perfil")
    } finally {
      setSaving(false)
    }
  }

  return (
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
  )
}
