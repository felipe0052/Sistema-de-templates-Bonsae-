"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTemplates } from "@/hooks/use-templates";
import { useDocuments } from "@/hooks/use-documents";
import { useVariables } from "@/hooks/use-variables";
import { useAssisteds } from "@/hooks/use-assisteds";
import { useAuth } from "@/hooks/use-auth";
import { useRenderTemplate } from "@/hooks/use-render-template";
import { toast } from "sonner";
import { extractVariables, replaceVariables } from "@/lib/store";
import { slugify } from "@/lib/pdf-download";
import { escapeHtml, findUnknownVariables, highlightPendingVariables, normalizeTemplateContent, stripVariableTokens } from "@/lib/document-utils";
import { formatValue, getAssistidoValueForVariable } from "@/lib/template-helpers";
import { ActionBar, VariableForm, DocumentPreview } from "@/components/gerar";
import type { Template } from "@/lib/types";

export default function GerarDocumentoPage() {
    const params = useParams();
    const router = useRouter();
    const { templates, isLoading: templatesLoading } = useTemplates();
    const { variables: variablesStore, variableCatalogAvailable } = useVariables();
    const { addDocument } = useDocuments();
    const { assisteds } = useAssisteds();
    const { token } = useAuth();
    const { renderTemplate, renderTemplatePdf } = useRenderTemplate();
    const isLoading = templatesLoading;
    const [template, setTemplate] = useState<Template | null>(null);
    const [dados, setDados] = useState<Record<string, string>>({});
    const [variables, setVariables] = useState<string[]>([]);
    const [selectedAssistidoId, setSelectedAssistidoId] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isLoading) return;

        const templateId = params.id as string;
        const foundTemplate = templates.find((t) => t.id === templateId);
        if (foundTemplate) {
            setTemplate(foundTemplate);
            const normalizedContent = normalizeTemplateContent(foundTemplate.content);
            const extractedVars = extractVariables(normalizedContent);
            setVariables(extractedVars);

            const initialData: Record<string, string> = {
                data_atual: new Date().toLocaleDateString("pt-BR"),
            };
            setDados(initialData);
        }
    }, [params.id, templates, isLoading]);

    const handleInputChange = (varName: string, value: string) => {
        const formattedValue = formatValue(varName, value);
        setDados((prev) => ({ ...prev, [varName]: formattedValue }));
    };

    const handleAssistidoChange = (assistidoId: string) => {
        setSelectedAssistidoId(assistidoId);

        const assistido = assisteds.find((item) => item.id === assistidoId);
        if (!assistido) return;

        setDados((prev) => {
            const nextData = { ...prev };

            variables.forEach((varName) => {
                const value = getAssistidoValueForVariable(varName, assistido);
                if (value) {
                    nextData[varName] = formatValue(varName, value);
                }
            });

            nextData.data_atual =
                prev.data_atual || new Date().toLocaleDateString("pt-BR");

            return nextData;
        });
    };

    const selectedAssistido = assisteds.find(
        (item) => item.id === selectedAssistidoId,
    );
    const assistidoName = selectedAssistido?.name || dados.nome || dados.nome_completo || dados.assistido_nome || "Novo Documento";

    const availableVariableNames = variablesStore.map((item) => item.variable_name);
    const unknownVariables = template && variableCatalogAvailable
        ? findUnknownVariables(template.content, availableVariableNames)
        : [];
    const hasUnknownVariables = unknownVariables.length > 0;

    const saveDocument = async () => {
        if (!template) return null;
        return await addDocument({
            template_id: template.id,
            name: `${template.template_name} - ${assistidoName}`,
            data_json: dados,
        });
    };

    const handleSaveDocument = async () => {
        if (!template || hasUnknownVariables) return;
        setIsSaving(true);
        try {
            const saved = await saveDocument();
            if (!saved) {
                toast.error("Não foi possível salvar o documento.");
                return;
            }
            toast.success("Documento salvo com sucesso.");
            router.push("/documentos");
        } catch (_error) {
            toast.error("Erro ao salvar documento.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleGeneratePDF = async () => {
        if (!template || hasUnknownVariables) return;

        setIsGenerating(true);

        try {
            const pdfBlob = await renderTemplatePdf(
                template.id,
                dados,
                "underline",
            );

            await saveDocument();

            if (!pdfBlob || pdfBlob.type !== "application/pdf") {
                toast.error("Não foi possível gerar o PDF para download.");
                return;
            }

            const fileNameBase =
                slugify(`${template.template_name}-${assistidoName}`);

            const downloadUrl = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `${fileNameBase || "documento"}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            toast.success("PDF baixado com sucesso.");
            router.push("/documentos");
        } catch (_error) {
            toast.error("Erro ao gerar documento via API.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePrint = async () => {
        if (!template || hasUnknownVariables) return;

        setIsGenerating(true);

        try {
            const renderedHtml = await renderTemplate(
                template.id,
                dados,
                "underline",
            );

            if (!renderedHtml) {
                toast.error(
                    "Não foi possível preparar o documento para impressão.",
                );
                return;
            }

            const printWindow = window.open("", "_blank");

            if (!printWindow) {
                toast.error("Não foi possível abrir a janela de impressão.");
                return;
            }

            const printTitle = escapeHtml(template?.template_name || "Documento");
            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${printTitle}</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            html, body {
              margin: 0;
              padding: 0;
              font-family: "Times New Roman", Times, serif;
              font-size: 12pt;
              line-height: 1.7;
              color: #000;
              background: #fff;
            }
            * {
              box-sizing: border-box;
            }
            .print-page {
              width: 100%;
              max-width: 210mm;
              min-height: 297mm;
              margin: 0 auto;
              padding: 3cm 2.5cm 2.5cm 2.5cm;
              box-sizing: border-box;
            }
            p {
              margin: 0 0 12pt 0;
              text-indent: 1.25cm;
            }
            p[style*="text-align"] {
              text-indent: 0;
            }
            h1, h2, h3, h4, h5, h6 {
              margin: 0 0 12pt 0;
              text-indent: 0;
              text-align: center;
            }
            ul, ol {
              margin: 0 0 12pt 1.2cm;
              padding: 0;
              text-indent: 0;
            }
            ul {
              list-style: disc outside;
            }
            ol {
              list-style: decimal outside;
            }
            li {
              margin: 0 0 6pt 0;
            }
          </style>
        </head>
        <body>
          <div class="print-page">${renderedHtml}</div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
        </html>
      `);
            printWindow.document.close();
        } catch (_error) {
            toast.error("Erro ao preparar impressão.");
        } finally {
            setIsGenerating(false);
        }
    };

    const processedContent = template
        ? replaceVariables(normalizeTemplateContent(template.content), dados)
        : "";

    const previewHtml = highlightPendingVariables(
        stripVariableTokens(processedContent),
    );

    if (!template) {
        return (
            <DashboardLayout title="Template não encontrado" subtitle="">
                <div className="text-center py-12">
                    <p className="text-muted-foreground">
                        Template não encontrado.
                    </p>
                    <Button className="mt-4" asChild>
                        <Link href="/templates">
                            <ArrowLeft className="h-4 w-4" />
                            Voltar aos templates
                        </Link>
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

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
                    onSave={handleSaveDocument}
                    onPrint={handlePrint}
                    onExportPdf={handleGeneratePDF}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">
                                Preencher Dados
                            </CardTitle>
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
                <style jsx>{`
                    :global(.preview-document p) {
                        margin: 0 0 12pt 0;
                        text-indent: 1.25cm;
                    }

                    :global(.preview-document) {
                        box-sizing: border-box;
                        max-width: 210mm;
                        margin: 0 auto;
                    }

                    :global(.preview-document p[style*="text-align"]) {
                        text-indent: 0;
                    }

                    :global(.preview-document h1),
                    :global(.preview-document h2),
                    :global(.preview-document h3),
                    :global(.preview-document h4),
                    :global(.preview-document h5),
                    :global(.preview-document h6) {
                        margin: 0 0 12pt 0;
                        text-indent: 0;
                        text-align: center;
                    }

                    :global(.preview-document ul),
                    :global(.preview-document ol) {
                        margin: 0 0 12pt 1.2cm;
                        padding: 0;
                        text-indent: 0;
                    }

                    :global(.preview-document ul) {
                        list-style: disc outside;
                    }

                    :global(.preview-document ol) {
                        list-style: decimal outside;
                    }

                    :global(.preview-document li) {
                        margin: 0 0 6pt 0;
                    }
                `}</style>
                <style jsx global>{`
                    @media print {
                        html, body {
                            margin: 0;
                            padding: 0;
                        }
                        aside, header, nav, button, .no-print, .dashboard-sidebar, .dashboard-header {
                            display: none !important;
                        }
                        .preview-document {
                            position: absolute !important;
                            top: 0;
                            left: 0;
                            width: 100% !important;
                            max-width: none !important;
                            padding: 3cm 2.5cm 2.5cm 2.5cm !important;
                            box-shadow: none !important;
                            border: none !important;
                            min-height: auto !important;
                        }
                        .preview-document p {
                            margin: 0 0 12pt 0;
                            text-indent: 1.25cm;
                        }
                        .preview-document p[style*="text-align"] {
                            text-indent: 0;
                        }
                        @page {
                            margin: 0;
                            size: A4;
                        }
                    }
                `}</style>
            </div>
        </DashboardLayout>
    );
}
