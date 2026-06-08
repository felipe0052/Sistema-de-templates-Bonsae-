import { toast } from "sonner"
import type { Document, Template } from "@/lib/types"

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export async function downloadPdf(
  renderTemplatePdf: (id: string, vars: Record<string, string>, behavior: string) => Promise<Blob | null>,
  doc: Document,
  templates: Template[],
): Promise<void> {
  const template = templates.find((t) => t.id === doc.template_id)
  if (!template) return

  try {
    const pdfBlob = await renderTemplatePdf(doc.template_id, doc.data_json, "underline")
    if (!pdfBlob || pdfBlob.type !== "application/pdf") {
      toast.error("Não foi possível gerar o PDF para download.")
      return
    }

    const fileNameBase = slugify(doc.name || template.template_name || "documento")

    const downloadUrl = window.URL.createObjectURL(pdfBlob)
    const link = document.createElement("a")
    link.href = downloadUrl
    link.download = `${fileNameBase || "documento"}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)

    toast.success("PDF baixado com sucesso.")
  } catch {
    toast.error("Erro ao baixar PDF.")
  }
}
