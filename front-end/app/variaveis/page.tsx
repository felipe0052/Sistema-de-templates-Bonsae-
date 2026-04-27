"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Variable, Pencil, Trash2 } from "lucide-react"
import { useStore } from "@/components/store-provider"
import { toast } from "sonner"
import type { Variavel } from "@/lib/types"

const emptyVariableForm = { nome_variavel: "", descricao: "", exemplo: "" }

export default function VariaveisPage() {
  const { variaveis, addVariavel, updateVariavel, deleteVariavel, isLoading } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVarId, setEditingVarId] = useState<string | null>(null)
  const [variableForm, setVariableForm] = useState(emptyVariableForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  if (isLoading) return null

  const filteredVariaveis = variaveis.filter(
    (v) =>
      v.nome_variavel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.descricao.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleEditClick = (variavel: Variavel) => {
    setEditingVarId(variavel.id)
    setVariableForm({
      nome_variavel: variavel.nome_variavel,
      descricao: variavel.descricao,
      exemplo: variavel.exemplo || "",
    })
    setIsDialogOpen(true)
  }

  const handleSubmitVar = async () => {
    if (!variableForm.nome_variavel.trim()) {
      toast.error("O nome da variável é obrigatório.")
      return
    }
    if (!variableForm.descricao.trim()) {
      toast.error("A descrição da variável é obrigatória.")
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        nome_variavel: variableForm.nome_variavel.trim(),
        descricao: variableForm.descricao.trim(),
        exemplo: variableForm.exemplo.trim(),
      }

      if (editingVarId) {
        await updateVariavel(editingVarId, payload)
        toast.success("Variável atualizada com sucesso!")
      } else {
        await addVariavel(payload)
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
      await deleteVariavel(id)
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
        {/* Header */}
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
          <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateClick}>
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
                  <Label htmlFor="nome_variavel">Nome da Variável</Label>
                  <Input
                    id="nome_variavel"
                    placeholder="Ex: numero_processo"
                    value={variableForm.nome_variavel}
                    onChange={(e) => setVariableForm({ ...variableForm, nome_variavel: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use apenas letras minúsculas e underscores
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva para que serve esta variável"
                    value={variableForm.descricao}
                    onChange={(e) => setVariableForm({ ...variableForm, descricao: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exemplo">Exemplo (opcional)</Label>
                  <Input
                    id="exemplo"
                    placeholder="Ex: 1234/2024"
                    value={variableForm.exemplo}
                    onChange={(e) => setVariableForm({ ...variableForm, exemplo: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => handleDialogChange(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmitVar} disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : editingVarId ? "Salvar Alterações" : "Criar Variável"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Variable className="h-5 w-5 text-primary" />
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

        {/* Variables Table */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-base">
              Variáveis Disponíveis ({filteredVariaveis.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variável</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Exemplo</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVariaveis.map((variavel) => (
                  <TableRow key={variavel.id}>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="font-mono text-xs bg-primary/10 text-primary"
                      >
                        {`{{${variavel.nome_variavel}}}`}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {variavel.descricao}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {variavel.exemplo || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(variavel)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Excluir
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir variável</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação removerá a variável {`{{${variavel.nome_variavel}}}`} da lista pública de templates.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteVar(variavel.id)}
                                disabled={deletingId === variavel.id}
                              >
                                {deletingId === variavel.id ? "Excluindo..." : "Excluir"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
