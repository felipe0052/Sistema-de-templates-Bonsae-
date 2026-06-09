"use client"

import type { Template } from "@/lib/types"
import { CompactList } from "./compact-list"
import { GridList } from "./grid-list"
import { useTemplatesMutations } from "@/hooks/use-templates"
import { toast } from "sonner"

interface TemplateListProps {
  templates: Template[]
  compact?: boolean
}

export function TemplateList({ templates, compact = false }: TemplateListProps) {
  const { deleteTemplate, addTemplate } = useTemplatesMutations()

  const handleDuplicate = (template: Template) => {
    addTemplate({
      ...template,
      template_name: `${template.template_name} (Cópia)`,
    })
    toast.success("Template duplicado com sucesso!")
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este template?")) {
      deleteTemplate(id)
      toast.success("Template excluído com sucesso!")
    }
  }

  if (compact) {
    return <CompactList templates={templates} />
  }

  return <GridList templates={templates} onDelete={handleDelete} onDuplicate={handleDuplicate} />
}
