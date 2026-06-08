"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table"
import { Search, Variable as VariableIcon } from "lucide-react"
import { useVariables } from "@/hooks/use-variables"
import { toast } from "sonner"
import { VariableTableRow } from "@/components/variables/variable-table-row"
import { VariableFormDialog } from "@/components/variables/variable-form-dialog"

const emptyVariableForm = { variable_name: "", description: "", example: "" }

export default function VariablesPage() {
  const { variables, addVariable, updateVariable, deleteVariable, isLoading } = useVariables()
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVarId, setEditingVarId] = useState<string | null>(null)
  const [variableForm, setVariableForm] = useState(emptyVariableForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  if (isLoading) {
    return (
      <DashboardLayout title="Variáveis" subtitle="Gerencie as variáveis disponíveis para os templates">
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="h-10 w-[250px] bg-muted rounded-md animate-pulse" />
            <div className="h-10 w-[130px] bg-muted rounded-md animate-pulse" />
          </div>
          <div className="rounded-xl border bg-card shadow animate-pulse">
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-4 w-1/4 bg-muted rounded" />
                  <div className="h-4 w-2/4 bg-muted rounded" />
                  <div className="h-4 w-1/4 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const filteredVariables = variables.filter(
    (v) =>
      v.variable_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const resetForm = () => {
    setVariableForm(emptyVariableForm)
    setEditingVarId(null)
  }

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const handleCreateClick = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEditClick = (variable: { id: string; variable_name: string; description: string; example?: string }) => {
    setEditingVarId(variable.id)
    setVariableForm({
      variable_name: variable.variable_name,
      description: variable.description,
      example: variable.example || "",
    })
    setIsDialogOpen(true)
  }

  const handleSubmitVar = async () => {
    if (!variableForm.variable_name.trim()) {
      toast.error("O nome da variável é obrigatório.")
      return
    }
    if (!variableForm.description.trim()) {
      toast.error("A descrição da variável é obrigatória.")
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        variable_name: variableForm.variable_name.trim(),
        description: variableForm.description.trim(),
        example: variableForm.example.trim(),
      }

      if (editingVarId) {
        await updateVariable(editingVarId, payload)
        toast.success("Variável atualizada com sucesso!")
      } else {
        await addVariable(payload)
        toast.success("Variável criada com sucesso!")
      }

      handleDialogChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar a variável.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteVar = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteVariable(id)
      toast.success("Variável excluída com sucesso!")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir a variável.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <DashboardLayout
      title="Variáveis"
      subtitle="Gerencie as variáveis disponíveis para os templates"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar variáveis..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <VariableFormDialog
            isOpen={isDialogOpen}
            onOpenChange={handleDialogChange}
            editingVarId={editingVarId}
            form={variableForm}
            onFormChange={setVariableForm}
            onSubmit={handleSubmitVar}
            isSubmitting={isSubmitting}
            onCreateClick={handleCreateClick}
          />
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <VariableIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Como usar variáveis
                </h3>
                <p className="text-sm text-muted-foreground">
                  As variáveis são inseridas nos templates usando a sintaxe{" "}
                  <code className="bg-muted px-1 py-0.5 rounded text-primary font-mono">
                    {"{{nome_variavel}}"}
                  </code>
                  . Quando o documento é gerado, as variáveis são substituídas pelos
                  dados reais informados pelo usuário.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-base">
              Variáveis Disponíveis ({filteredVariables.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variável</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Exemplo</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVariables.map((variable) => (
                  <VariableTableRow
                    key={variable.id}
                    variable={variable}
                    isNotEditable={(variable.source ?? "manual") !== "manual"}
                    isDeleting={deletingId === variable.id}
                    onEdit={handleEditClick}
                    onDelete={() => handleDeleteVar(variable.id)}
                  />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
