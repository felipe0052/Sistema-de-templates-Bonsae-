"use client"

import { useState } from "react"
import { useVariables } from "@/hooks/use-variables"
import { toast } from "sonner"

const emptyVariableForm = { variable_name: "", description: "", example: "" }

export function useVariableDialog() {
  const { addVariable, updateVariable, deleteVariable } = useVariables()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVarId, setEditingVarId] = useState<string | null>(null)
  const [variableForm, setVariableForm] = useState(emptyVariableForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

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

  return {
    isDialogOpen,
    editingVarId,
    variableForm,
    isSubmitting,
    deletingId,
    setVariableForm,
    handleDialogChange,
    handleCreateClick,
    handleEditClick,
    handleSubmitVar,
    handleDeleteVar,
  }
}
