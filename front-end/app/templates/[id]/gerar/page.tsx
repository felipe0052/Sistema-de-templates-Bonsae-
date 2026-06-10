"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGerarDocumento } from "@/hooks/use-gerar-documento";
import { ActionBar, VariableForm, DocumentPreview } from "@/components/gerar";
import { NotFoundState } from "@/components/gerar/not-found-state";
import { TemplateLoadingSkeleton } from "@/components/gerar/template-loading-skeleton";

export default function GerarDocumentoPage() {
    const {
        template,
        dados,
        variables,
        selectedAssistidoId,
        selectedAssistido,
        isGenerating,
        isSaving,
        isLoading,
        token,
        assisteds,
        unknownVariables,
        hasUnknownVariables,
        previewHtml,
        handleAssistidoChange,
        handleSaveDocument,
        handleGeneratePDF,
        handlePrint,
    } = useGerarDocumento();

    if (isLoading) return <TemplateLoadingSkeleton />;
    if (!template) return <NotFoundState />;

    return (
        <DashboardLayout
            title="Gerar Documento"
            subtitle={template.template_name}
        >
            <div className="space-y-6">
                <ActionBar
                    isSaving={isSaving}
                    isGenerating={isGenerating}
                    hasUnknownVariables={hasUnknownVariables}
                    hasSelectedAssistido={!!selectedAssistidoId}
                    onSave={handleSaveDocument}
                    onPrint={handlePrint}
                    onExportPdf={handleGeneratePDF}
                />
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">
                            Selecionar Assistido
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <VariableForm
                            assisteds={assisteds}
                            selectedAssistidoId={selectedAssistidoId}
                            selectedAssistido={selectedAssistido}
                            hasToken={!!token}
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
                    hasSelectedAssistido={!!selectedAssistidoId}
                />
            </div>
        </DashboardLayout>
    );
}
