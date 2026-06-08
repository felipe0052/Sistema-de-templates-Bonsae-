"use client"

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
import { usePdfSettings } from "@/hooks/use-pdf-settings"

export function PdfSettingsCard() {
  const { pdfFormat, setPdfFormat, margins, setMargins, saving, handleSavePdf } = usePdfSettings()

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
