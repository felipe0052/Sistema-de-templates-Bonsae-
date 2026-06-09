"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGerarDocumento } from "@/hooks/use-gerar-documento"
import { ActionBar, VariableForm, DocumentPreview } from "@/components/gerar"
import { NotFoundState } from "@/components/gerar/not-found-state"
import { TemplateLoadingSkeleton } from "@/components/gerar/template-loading-skeleton"

export default function GerarDocumentoPage() {
  const {
    template, dados, variables, selectedAssistidoId,
    isGenerating, isSaving, isLoading, token, assisteds,
    variablesStore, unknownVariables, hasUnknownVariables,
    previewHtml, handleInputChange, handleAssistidoChange,
    handleSaveDocument, handleGeneratePDF, handlePrint,
  } = useGerarDocumento()

  if (isLoading) return <TemplateLoadingSkeleton />
  if (!template) return <NotFoundState />

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
