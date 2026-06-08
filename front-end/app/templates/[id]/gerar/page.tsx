"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useTemplates } from "@/hooks/use-templates"
import { useDocuments } from "@/hooks/use-documents"
import { useVariables } from "@/hooks/use-variables"
import { useAssisteds } from "@/hooks/use-assisteds"
import { useAuth } from "@/hooks/use-auth"
import { useRenderTemplate } from "@/hooks/use-render-template"
import { toast } from "sonner"
import { extractVariables, replaceVariables } from "@/lib/store"
import { slugify } from "@/lib/pdf-download"
import { findUnknownVariables, highlightPendingVariables, normalizeTemplateContent, stripVariableTokens } from "@/lib/document-utils"
import { formatValue, getAssistidoValueForVariable } from "@/lib/template-helpers"
import { buildPrintHtml } from "@/lib/print-utils"
import { triggerDownload } from "@/lib/download-utils"
import { ActionBar, VariableForm, DocumentPreview } from "@/components/gerar"
import type { Template } from "@/lib/types"

export default function GerarDocumentoPage() {
  const params = useParams()
  const router = useRouter()
  const { templates, isLoading: templatesLoading } = useTemplates()
  const { variables: variablesStore, variableCatalogAvailable } = useVariables()
  const { addDocument } = useDocuments()
  const { assisteds } = useAssisteds()
  const { token } = useAuth()
  const { renderTemplate, renderTemplatePdf } = useRenderTemplate()
  const isLoading = templatesLoading
  const [template, setTemplate] = useState<Template | null>(null)
  const [dados, setDados] = useState<Record<string, string>>({})
  const [variables, setVariables] = useState<string[]>([])
  const [selectedAssistidoId, setSelectedAssistidoId] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isLoading) return
    const templateId = params.id as string
    const foundTemplate = templates.find((t) => t.id === templateId)
    if (foundTemplate) {
      setTemplate(foundTemplate)
      const normalizedContent = normalizeTemplateContent(foundTemplate.content)
      setVariables(extractVariables(normalizedContent))
      setDados({ data_atual: new Date().toLocaleDateString("pt-BR") })
    }
  }, [params.id, templates, isLoading])

  const handleInputChange = (varName: string, value: string) => {
    setDados((prev) => ({ ...prev, [varName]: formatValue(varName, value) }))
  }

  const handleAssistidoChange = (assistidoId: string) => {
    setSelectedAssistidoId(assistidoId)
    const assistido = assisteds.find((item) => item.id === assistidoId)
    if (!assistido) return
    setDados((prev) => {
      const nextData = { ...prev }
      variables.forEach((varName) => {
        const value = getAssistidoValueForVariable(varName, assistido)
        if (value) nextData[varName] = formatValue(varName, value)
      })
      nextData.data_atual = prev.data_atual || new Date().toLocaleDateString("pt-BR")
      return nextData
    })
  }

  const selectedAssistido = assisteds.find((item) => item.id === selectedAssistidoId)
  const assistidoName = selectedAssistido?.name || dados.nome || dados.nome_completo || dados.assistido_nome || "Novo Documento"

  const availableVariableNames = variablesStore.map((item) => item.variable_name)
  const unknownVariables = template && variableCatalogAvailable
    ? findUnknownVariables(template.content, availableVariableNames)
    : []
  const hasUnknownVariables = unknownVariables.length > 0

  const saveDocument = async () => {
    if (!template) return null
    return await addDocument({
      template_id: template.id,
      name: `${template.template_name} - ${assistidoName}`,
      data_json: dados,
    })
  }

  const handleSaveDocument = async () => {
    if (!template || hasUnknownVariables) return
    setIsSaving(true)
    try {
      const saved = await saveDocument()
      if (!saved) { toast.error("Não foi possível salvar o documento."); return }
      toast.success("Documento salvo com sucesso.")
      router.push("/documentos")
    } catch (_error) {
      toast.error("Erro ao salvar documento.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleGeneratePDF = async () => {
    if (!template || hasUnknownVariables) return
    setIsGenerating(true)
    try {
      const pdfBlob = await renderTemplatePdf(template.id, dados, "underline")
      await saveDocument()
      if (!pdfBlob || pdfBlob.type !== "application/pdf") {
        toast.error("Não foi possível gerar o PDF para download.")
        return
      }
      const fileName = slugify(`${template.template_name}-${assistidoName}`)
      triggerDownload(pdfBlob, `${fileName || "documento"}.pdf`)
      toast.success("PDF baixado com sucesso.")
      router.push("/documentos")
    } catch (_error) {
      toast.error("Erro ao gerar documento via API.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePrint = async () => {
    if (!template || hasUnknownVariables) return
    setIsGenerating(true)
    try {
      const renderedHtml = await renderTemplate(template.id, dados, "underline")
      if (!renderedHtml) { toast.error("Não foi possível preparar o documento para impressão."); return }
      const printWindow = window.open("", "_blank")
      if (!printWindow) { toast.error("Não foi possível abrir a janela de impressão."); return }
      printWindow.document.write(buildPrintHtml(renderedHtml, template.template_name))
      printWindow.document.close()
    } catch (_error) {
      toast.error("Erro ao preparar impressão.")
    } finally {
      setIsGenerating(false)
    }
  }

  const processedContent = template
    ? replaceVariables(normalizeTemplateContent(template.content), dados)
    : ""
  const previewHtml = highlightPendingVariables(stripVariableTokens(processedContent))

  if (!template) {
    return (
      <DashboardLayout title="Template não encontrado" subtitle="">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Template não encontrado.</p>
          <Button className="mt-4" asChild>
            <Link href="/templates">
              <ArrowLeft className="h-4 w-4" />
              Voltar aos templates
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Gerar Documento" subtitle={template.template_name}>
      <div className="space-y-6">
        <ActionBar
          isSaving={isSaving}
          isGenerating={isGenerating}
          hasUnknownVariables={hasUnknownVariables}
          onSave={handleSaveDocument}
          onPrint={handlePrint}
          onExportPdf={handleGeneratePDF}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Preencher Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <VariableForm
                variables={variables}
                dados={dados}
                variableStore={variablesStore}
                assisteds={assisteds}
                selectedAssistidoId={selectedAssistidoId}
                hasToken={!!token}
                onInputChange={handleInputChange}
                onAssistidoChange={handleAssistidoChange}
              />
            </CardContent>
          </Card>
          <DocumentPreview
            previewHtml={previewHtml}
            backgroundImage={template.background_image}
            variables={variables}
            dados={dados}
            hasUnknownVariables={hasUnknownVariables}
            unknownVariables={unknownVariables}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
