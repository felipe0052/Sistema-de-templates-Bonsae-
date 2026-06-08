"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Settings, Save } from "lucide-react"
import { toast } from "sonner"
import { useUserPreferences, useUpdateUser } from "@/hooks/use-user"
import { useAuth } from "@/hooks/use-auth"

export function PdfSettingsCard() {
  const { token } = useAuth()
  const prefs = useUserPreferences()
  const updateUser = useUpdateUser()

  const [pdfFormat, setPdfFormat] = useState("a4")
  const [margins, setMargins] = useState({ top: "20", bottom: "20", left: "25", right: "25" })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (prefs) {
      setPdfFormat(prefs?.pdf_default_format || "a4")
      setMargins({
        top: String(prefs?.pdf_margin_top ?? 20),
        bottom: String(prefs?.pdf_margin_bottom ?? 20),
        left: String(prefs?.pdf_margin_left ?? 25),
        right: String(prefs?.pdf_margin_right ?? 25),
      })
    }
  }, [prefs])

  const handleSavePdf = async () => {
    if (!token) return
    setSaving(true)
    try {
      await updateUser.mutateAsync({
        preferences: {
          pdf_default_format: pdfFormat,
          pdf_margin_top: Number(margins.top),
          pdf_margin_bottom: Number(margins.bottom),
          pdf_margin_left: Number(margins.left),
          pdf_margin_right: Number(margins.right),
        },
      })
      toast.success("Configurações de PDF salvas com sucesso!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar configurações de PDF")
    } finally {
      setSaving(false)
    }
  }

  return (
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
            <Input id="margin-top" type="number" value={margins.top} onChange={(e) => setMargins({ ...margins, top: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="margin-bottom">Margem Inferior</Label>
            <Input id="margin-bottom" type="number" value={margins.bottom} onChange={(e) => setMargins({ ...margins, bottom: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="margin-left">Margem Esquerda</Label>
            <Input id="margin-left" type="number" value={margins.left} onChange={(e) => setMargins({ ...margins, left: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="margin-right">Margem Direita</Label>
            <Input id="margin-right" type="number" value={margins.right} onChange={(e) => setMargins({ ...margins, right: e.target.value })} />
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
  )
}
