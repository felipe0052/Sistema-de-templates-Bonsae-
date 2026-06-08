import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CATEGORIAS = [
  "Declarações",
  "Comprovantes",
  "Autorizações",
  "Contratos",
  "Relatórios",
  "Outros",
]

interface InfoCardProps {
  templateName: string
  setTemplateName: (value: string) => void
  category: string
  setCategory: (value: string) => void
}

export function InfoCard({
  templateName,
  setTemplateName,
  category,
  setCategory,
}: InfoCardProps) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-base">Informações do Template</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Template</Label>
            <Input
              id="nome"
              placeholder="Ex: Declaração de Residência"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIAS.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
