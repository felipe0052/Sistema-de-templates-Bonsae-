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
} from "@/components/ui/dialog"

interface VariableFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editingVarId: string | null
  form: { variable_name: string; description: string; example: string }
  onFormChange: (updater: (prev: { variable_name: string; description: string; example: string }) => { variable_name: string; description: string; example: string }) => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function VariableFormDialog({
  isOpen,
  onOpenChange,
  editingVarId,
  form,
  onFormChange,
  onSubmit,
  isSubmitting,
}: VariableFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Variável</DialogTitle>
          <DialogDescription>
            Atualize os dados da variável disponível para os templates.
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
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
