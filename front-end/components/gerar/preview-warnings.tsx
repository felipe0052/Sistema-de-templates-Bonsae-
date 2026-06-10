import type { ReactNode } from "react";

interface PreviewWarningsProps {
    hasSelectedAssistido: boolean;
    hasMissingValues: boolean;
    hasUnknownVariables: boolean;
    unknownVariables: string[];
}

function PreviewAlert({
    tone,
    children,
}: {
    tone: "warning" | "error";
    children: ReactNode;
}) {
    const classes =
        tone === "error"
            ? "border-red-200 bg-red-50 text-red-800"
            : "border-amber-200 bg-amber-50 text-amber-800";

    return (
        <div className={`mt-4 rounded-lg border p-3 ${classes}`}>
            <p className="text-sm">{children}</p>
        </div>
    );
}

export function PreviewWarnings({
    hasSelectedAssistido,
    hasMissingValues,
    hasUnknownVariables,
    unknownVariables,
}: PreviewWarningsProps) {
    return (
        <>
            {!hasSelectedAssistido && (
                <PreviewAlert tone="warning">
                    Selecione um assistido para carregar os dados no preview.
                </PreviewAlert>
            )}

            {hasMissingValues && (
                <PreviewAlert tone="warning">
                    Algumas variáveis ficaram sem valor porque esses dados não
                    estão preenchidos no cadastro do assistido selecionado.
                </PreviewAlert>
            )}

            {hasUnknownVariables && (
                <PreviewAlert tone="error">
                    O template contém variáveis sem preenchimento automático
                    disponível:{" "}
                    <span className="font-mono">
                        {unknownVariables.map((v) => `{{${v}}}`).join(", ")}
                    </span>
                    . Remova essas variáveis do template antes de gerar o
                    documento.
                </PreviewAlert>
            )}
        </>
    );
}
