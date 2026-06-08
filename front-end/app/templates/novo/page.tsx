"use client"

import { useRouter } from "next/navigation"
import { TemplateForm } from "@/components/template-form"
import { useTemplatesMutations } from "@/hooks/use-templates"

export default function NovoTemplatePage() {
  const router = useRouter()
  const { addTemplate } = useTemplatesMutations()

  return (
    <TemplateForm
      mode="create"
      title="Novo Template"
      subtitle="Crie um novo modelo de documento"
      onSave={async (values) => {
        await addTemplate({
          ...values,
          client_id: "1",
        })
        router.push("/templates")
      }}
    />
  )
}
