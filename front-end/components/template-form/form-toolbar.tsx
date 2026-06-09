import { Button } from "@/components/ui/button"
import { Save, Eye, ArrowLeft, Play } from "lucide-react"
import Link from "next/link"
import type { Template } from "@/lib/types"
import { useRouter } from "next/navigation"

interface FormToolbarProps {
  mode: "create" | "edit"
  template?: Template | null
  isSaving: boolean
  hasUnknownVariables: boolean
  onPreview: () => void
  onSave: () => void
}

export function FormToolbar({
  mode,
  template,
  isSaving,
  hasUnknownVariables,
  onPreview,
  onSave,
}: FormToolbarProps) {
  const router = useRouter()

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>
      <div className="flex gap-2">
        {mode === "edit" && template && (
          <Button variant="outline" asChild>
            <Link href={`/templates/${template.id}/gerar`}>
              <Play className="h-4 w-4" />
              Gerar Documento
            </Link>
          </Button>
        )}
        <Button variant="outline" onClick={onPreview}>
          <Eye className="h-4 w-4 mr-2" />
          Visualizar
        </Button>
        <Button onClick={onSave} disabled={isSaving || hasUnknownVariables}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Salvando..." : mode === "create" ? "Salvar Template" : "Salvar"}
        </Button>
      </div>
    </div>
  )
}
