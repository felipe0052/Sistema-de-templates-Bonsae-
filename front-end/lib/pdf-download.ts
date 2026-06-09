import { toast } from "sonner"
import type { Document, Template } from "@/lib/types"
import { triggerDownload } from "@/lib/download-utils"

function validatePdfBlob(blob: Blob | null): blob is Blob {
  return blob !== null && blob.type === "application/pdf"
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export async function downloadPdf(
  renderTemplatePdf: (id: string, vars: Record<string, string>, behavior?: "blank" | "underline") => Promise<Blob | null>,
  doc: Document,
  templates: Template[],
): Promise<void> {
  const template = templates.find((t) => t.id === doc.template_id)
  if (!template) return

  try {
    const pdfBlob = await renderTemplatePdf(doc.template_id, doc.data_json, "underline")
    if (!validatePdfBlob(pdfBlob)) {
      toast.error("Não foi possível gerar o PDF para download.")
      return
    }

    const fileName = slugify(doc.name || template.template_name || "documento")
    triggerDownload(pdfBlob, `${fileName || "documento"}.pdf`)
    toast.success("PDF baixado com sucesso.")
  } catch {
    toast.error("Erro ao baixar PDF.")
  }
}
