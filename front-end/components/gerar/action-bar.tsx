import Link from "next/link";
import { ArrowLeft, FileDown, Printer, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionBarProps {
    isSaving: boolean;
    isGenerating: boolean;
    hasUnknownVariables: boolean;
    onSave: () => void;
    onPrint: () => void;
    onExportPdf: () => void;
}

export function ActionBar({
    isSaving,
    isGenerating,
    hasUnknownVariables,
    onSave,
    onPrint,
    onExportPdf,
}: ActionBarProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <Button variant="ghost" asChild>
                <Link href="/templates">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                </Link>
            </Button>
            <div className="flex gap-2">
                <Button
                    variant="secondary"
                    onClick={onSave}
                    disabled={isSaving || isGenerating || hasUnknownVariables}
                >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Salvando..." : "Salvar Documento"}
                </Button>
                <Button
                    variant="outline"
                    onClick={onPrint}
                    disabled={isGenerating || hasUnknownVariables}
                >
                    <Printer className="h-4 w-4" />
                    Imprimir
                </Button>
                <Button
                    onClick={onExportPdf}
                    disabled={isGenerating || hasUnknownVariables}
                >
                    <FileDown className="h-4 w-4" />
                    {isGenerating ? "Gerando..." : "Exportar PDF"}
                </Button>
            </div>
        </div>
    );
}
