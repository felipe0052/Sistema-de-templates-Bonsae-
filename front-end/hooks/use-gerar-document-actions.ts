"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDocuments } from "@/hooks/use-documents";
import { useRenderTemplate } from "@/hooks/use-render-template";
import { toast } from "sonner";
import { slugify } from "@/lib/pdf-download";
import { buildPrintHtml } from "@/lib/print-utils";
import { triggerDownload } from "@/lib/download-utils";
import type { Template } from "@/lib/types";

interface UseGerarDocumentActionsParams {
    template: Template | null;
    dados: Record<string, string>;
    assistidoName: string;
    hasUnknownVariables: boolean;
    selectedAssistidoId: string;
}

export function useGerarDocumentActions({
    template,
    dados,
    assistidoName,
    hasUnknownVariables,
    selectedAssistidoId,
}: UseGerarDocumentActionsParams) {
    const router = useRouter();
    const { addDocument } = useDocuments();
    const { renderTemplate, renderTemplatePdf } = useRenderTemplate();

    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

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
        if (!selectedAssistidoId) {
            toast.error("Selecione um assistido para gerar o documento.");
            return;
        }
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
        if (!selectedAssistidoId) {
            toast.error("Selecione um assistido para gerar o documento.");
            return;
        }
        setIsGenerating(true);
        try {
            const pdfBlob = await renderTemplatePdf(
                template.id,
                dados,
                "underline",
            );
            if (!pdfBlob || pdfBlob.type !== "application/pdf") {
                toast.error("Não foi possível gerar o PDF para download.");
                return;
            }
            const fileName = slugify(
                `${template.template_name}-${assistidoName}`,
            );
            triggerDownload(pdfBlob, `${fileName || "documento"}.pdf`);
            toast.success("PDF baixado com sucesso.");
            saveDocument().catch(() => {});
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            toast.error("Erro ao gerar documento via API.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePrint = async () => {
        if (!template || hasUnknownVariables) return;
        if (!selectedAssistidoId) {
            toast.error("Selecione um assistido para gerar o documento.");
            return;
        }
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
            printWindow.document.write(
                buildPrintHtml(renderedHtml, template.template_name),
            );
            printWindow.document.close();
        } catch (_error) {
            toast.error("Erro ao preparar impressão.");
        } finally {
            setIsGenerating(false);
        }
    };

    return {
        isGenerating,
        isSaving,
        handleSaveDocument,
        handleGeneratePDF,
        handlePrint,
    };
}
