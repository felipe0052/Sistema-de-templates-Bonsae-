import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"

interface VariableFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editingVarId: string | null
  form: { variable_name: string; description: string; example: string }
  onFormChange: (updater: (prev: { variable_name: string; description: string; example: string }) => { variable_name: string; description: string; example: string }) => void
  onSubmit: () => void
  isSubmitting: boolean
  onCreateClick: () => void
}

export function VariableFormDialog({
  isOpen,
  onOpenChange,
  editingVarId,
  form,
  onFormChange,
  onSubmit,
  isSubmitting,
  onCreateClick,
}: VariableFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Variável
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingVarId ? "Editar Variável" : "Criar Nova Variável"}
          </DialogTitle>
          <DialogDescription>
            {editingVarId
              ? "Atualize os dados da variável disponível para os templates."
              : "Adicione uma nova variável para usar nos templates de documentos."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="variable_name">Nome da Variável</Label>
            <Input
              id="variable_name"
              placeholder="Ex: numero_processo"
              value={form.variable_name}
              onChange={(e) => onFormChange((prev) => ({ ...prev, variable_name: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Use apenas letras minúsculas e underscores
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva para que serve esta variável"
              value={form.description}
              onChange={(e) => onFormChange((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="example">Exemplo (opcional)</Label>
            <Input
              id="example"
              placeholder="Ex: 1234/2024"
              value={form.example}
              onChange={(e) => onFormChange((prev) => ({ ...prev, example: e.target.value }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : editingVarId ? "Salvar Alterações" : "Criar Variável"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
