"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { DocumentPreview } from "@/components/document-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Printer, FileText } from "lucide-react";
import { useDocuments } from "@/hooks/use-documents";
import { useTemplates } from "@/hooks/use-templates";
import { useRenderTemplate } from "@/hooks/use-render-template";
import { toast } from "sonner";
import { downloadPdf } from "@/lib/pdf-download";
import { PrintStyles } from "@/components/print-styles";
import type { Document, Template } from "@/lib/types";

export default function VisualizarDocumentoPage() {
    const params = useParams();
    const router = useRouter();

    const searchParams = useSearchParams();
    const { documents, isLoading } = useDocuments();
    const { templates, isLoading: templatesLoading } = useTemplates();
    const { renderTemplatePdf } = useRenderTemplate();
    const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
    const [template, setTemplate] = useState<Template | null>(null);

    useEffect(() => {
        if (isLoading) return;

        const docId = params.id as string;
        const foundDoc = documents.find((d) => d.id === docId);

        if (foundDoc) {
            setCurrentDocument(foundDoc);
            const foundTemplate = templates.find(
                (t) => t.id === foundDoc.template_id,
            );
            if (foundTemplate) {
                setTemplate(foundTemplate);

                if (searchParams.get("print") === "true") {
                    setTimeout(() => {
                        window.print();
                    }, 500);
                }
            }
        }
    }, [params.id, documents, templates, isLoading, searchParams]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPdf = async () => {
        if (!currentDocument || !template) return;
        await downloadPdf(renderTemplatePdf, currentDocument, templates);
    };

    if (isLoading || templatesLoading) {
      return (
        <DashboardLayout title="Visualizar Documento" subtitle="">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-10 w-24 bg-muted rounded-md animate-pulse" />
              <div className="flex gap-2">
                <div className="h-10 w-24 bg-muted rounded-md animate-pulse" />
                <div className="h-10 w-32 bg-muted rounded-md animate-pulse" />
              </div>
            </div>
            <div className="rounded-xl border bg-card shadow animate-pulse">
              <div className="p-6 space-y-3">
                <div className="h-5 w-1/3 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded" />
              </div>
            </div>
            <div className="rounded-xl border bg-card shadow animate-pulse">
              <div className="p-6 space-y-4">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-5/6 bg-muted rounded" />
                <div className="h-4 w-4/6 bg-muted rounded" />
                <div className="h-4 w-3/6 bg-muted rounded" />
              </div>
            </div>
          </div>
        </DashboardLayout>
      )
    }

    if (!currentDocument || !template) {
        return (
            <DashboardLayout title="Documento não encontrado" subtitle="">
                <div className="text-center py-12">
                    <p className="text-muted-foreground">
                        O documento solicitado não foi encontrado.
                    </p>
                    <Button className="mt-4" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                        Voltar aos documentos
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Visualizar Documento" subtitle={currentDocument.name}>
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 no-print">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                        Voltar
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="h-4 w-4 mr-2" />
                            Imprimir
                        </Button>
                        <Button onClick={handleDownloadPdf}>
                            <Download className="h-4 w-4 mr-2" />
                            Baixar PDF
                        </Button>
                    </div>
                </div>

                <Card className="bg-card no-print">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-1">
                                    Detalhes do Documento
                                </h3>
                                <div className="text-sm text-muted-foreground grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                                    <p>
                                        <span className="font-medium text-foreground">
                                            Template:
                                        </span>{" "}
                                        {template.template_name}
                                    </p>
                                    <p>
                                        <span className="font-medium text-foreground">
                                            Data:
                                        </span>{" "}
                                        {new Date(
                                            currentDocument.created_at,
                                        ).toLocaleDateString("pt-BR")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="print-container">
                    <DocumentPreview
                        content={template.content}
                        letterhead={template.background_image}
                        data={currentDocument.data_json}
                    />
                </div>
            </div>

            <PrintStyles />
        </DashboardLayout>
    );
}
