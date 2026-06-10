import { Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SafeHtmlRenderer } from "@/components/safe-html-renderer";

interface DocumentPreviewProps {
    previewHtml: string;
    backgroundImage?: string | null;
    variables: string[];
    dados: Record<string, string>;
    hasUnknownVariables: boolean;
    unknownVariables: string[];
    hasSelectedAssistido: boolean;
}

export function DocumentPreview({
    previewHtml,
    backgroundImage,
    variables,
    dados,
    hasUnknownVariables,
    unknownVariables,
    hasSelectedAssistido,
}: DocumentPreviewProps) {
    return (
        <Card className="bg-card">
            <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary" />
                    Preview do Documento
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    className="relative mx-auto bg-white shadow-lg rounded-sm overflow-hidden"
                    style={{
                        width: "100%",
                        maxWidth: "210mm",
                        minHeight: "297mm",
                        aspectRatio: "210 / 297",
                    }}
                >
                    {backgroundImage && (
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: `url(${backgroundImage})`,
                            }}
                        />
                    )}
                    <SafeHtmlRenderer
                        html={previewHtml}
                        className="preview-document relative !text-black"
                        style={{
                            fontFamily: "Times New Roman, serif",
                            fontSize: "12pt",
                            lineHeight: "1.7",
                            color: "#000000",
                            padding: "3cm 2.5cm 2.5cm 2.5cm",
                        }}
                    />
                </div>

                {!hasSelectedAssistido && (
                    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                        <p className="text-sm text-amber-800">
                            Selecione um assistido para carregar os dados no
                            preview.
                        </p>
                    </div>
                )}
                {hasSelectedAssistido && variables.some((v) => !dados[v]) && (
                    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                        <p className="text-sm text-amber-800">
                            Algumas variáveis ficaram sem valor porque esses
                            dados não estão preenchidos no cadastro do assistido
                            selecionado.
                        </p>
                    </div>
                )}
                {hasUnknownVariables && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                            O template contém variáveis sem preenchimento
                            automático disponível:{" "}
                            <span className="font-mono">
                                {unknownVariables
                                    .map((v) => `{{${v}}}`)
                                    .join(", ")}
                            </span>
                            . Remova essas variáveis do template antes de gerar
                            o documento.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
