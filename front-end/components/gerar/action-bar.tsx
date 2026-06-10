import { ArrowLeft, FileDown, Printer, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ActionBarProps {
    isSaving: boolean;
    isGenerating: boolean;
    hasUnknownVariables: boolean;
    hasSelectedAssistido: boolean;
    onSave: () => void;
    onPrint: () => void;
    onExportPdf: () => void;
}

export function ActionBar({
    isSaving,
    isGenerating,
    hasUnknownVariables,
    hasSelectedAssistido,
    onSave,
    onPrint,
    onExportPdf,
}: ActionBarProps) {
    const router = useRouter();

    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
                Voltar
            </Button>
            <div className="flex gap-2">
                <Button
                    variant="secondary"
                    onClick={onSave}
                    disabled={
                        isSaving ||
                        isGenerating ||
                        hasUnknownVariables ||
                        !hasSelectedAssistido
                    }
                >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Salvando..." : "Salvar Documento"}
                </Button>
                <Button
                    variant="outline"
                    onClick={onPrint}
                    disabled={
                        isGenerating ||
                        hasUnknownVariables ||
                        !hasSelectedAssistido
                    }
                >
                    <Printer className="h-4 w-4" />
                    Imprimir
                </Button>
                <Button
                    onClick={onExportPdf}
                    disabled={
                        isGenerating ||
                        hasUnknownVariables ||
                        !hasSelectedAssistido
                    }
                >
                    <FileDown className="h-4 w-4" />
                    {isGenerating ? "Gerando..." : "Exportar PDF"}
                </Button>
            </div>
        </div>
    );
}
