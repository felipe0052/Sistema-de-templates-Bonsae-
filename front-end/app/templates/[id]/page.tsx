"use client"

import { useParams, useRouter } from "next/navigation"
import { TemplateForm } from "@/components/template-form"
import { useTemplates, useTemplatesMutations } from "@/hooks/use-templates"

export default function EditarTemplatePage() {
  const params = useParams()
  const router = useRouter()
  const { templates, isLoading } = useTemplates()
  const { updateTemplate } = useTemplatesMutations()

  const template = templates.find((t) => t.id === (params.id as string))

  if (!isLoading && !template) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Template não encontrado.</p>
      </div>
    )
  }

  return (
    <TemplateForm
      mode="edit"
      template={template}
      isLoading={isLoading}
      title="Editar Template"
      subtitle={template?.template_name}
      onSave={async (values) => {
        if (!template) return
        await updateTemplate(template.id, values)
        router.push("/templates")
      }}
    />
  )
}
