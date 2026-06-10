"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTemplates } from "@/hooks/use-templates";
import { useVariables } from "@/hooks/use-variables";
import { useAssisteds } from "@/hooks/use-assisteds";
import { useAuth } from "@/hooks/use-auth";
import { useGerarDocumentActions } from "@/hooks/use-gerar-document-actions";
import { extractVariables, replaceVariables } from "@/lib/store";
import {
    findUnknownVariables,
    highlightPendingVariables,
    normalizeTemplateContent,
    stripVariableTokens,
} from "@/lib/document-utils";
import { formatValue } from "@/lib/variable-formatters";
import { getAssistidoValueForVariable } from "@/lib/template-helpers";
import type { Template } from "@/lib/types";

export function useGerarDocumento() {
    const params = useParams();
    const { templates, isLoading: templatesLoading } = useTemplates();
    const { variables: variablesStore, variableCatalogAvailable } =
        useVariables();
    const { assisteds } = useAssisteds();
    const { token } = useAuth();

    const isLoading = templatesLoading;
    const [template, setTemplate] = useState<Template | null>(null);
    const [dados, setDados] = useState<Record<string, string>>({});
    const [templateVariables, setTemplateVariables] = useState<string[]>([]);
    const [selectedAssistidoId, setSelectedAssistidoId] = useState("");

    const supportedVariablesStore = variablesStore.filter(
        (item) => item.source !== "manual",
    );
    const availableVariableNames = supportedVariablesStore.map(
        (item) => item.variable_name,
    );
    const variables = templateVariables.filter((varName) =>
        availableVariableNames.includes(varName),
    );

    useEffect(() => {
        if (isLoading) return;
        const templateId = params.id as string;
        const foundTemplate = templates.find((t) => t.id === templateId);
        if (foundTemplate) {
            setTemplate(foundTemplate);
            const normalizedContent = normalizeTemplateContent(
                foundTemplate.content,
            );
            setTemplateVariables(extractVariables(normalizedContent));
            setSelectedAssistidoId("");
            setDados({ data_atual: new Date().toLocaleDateString("pt-BR") });
        }
    }, [params.id, templates, isLoading]);

    const handleAssistidoChange = (assistidoId: string) => {
        setSelectedAssistidoId(assistidoId);

        if (!assistidoId) {
            setDados({ data_atual: new Date().toLocaleDateString("pt-BR") });
            return;
        }

        const assistido = assisteds.find((item) => item.id === assistidoId);
        if (!assistido) return;

        setDados(() => {
            const nextData: Record<string, string> = {
                data_atual: new Date().toLocaleDateString("pt-BR"),
            };

            variables.forEach((varName) => {
                if (varName === "data_atual") {
                    return;
                }

                const value = getAssistidoValueForVariable(varName, assistido);
                if (value) {
                    nextData[varName] = formatValue(varName, value);
                }
            });

            return nextData;
        });
    };

    const selectedAssistido = assisteds.find(
        (item) => item.id === selectedAssistidoId,
    );
    const assistidoName = selectedAssistido?.name || "Novo Documento";

    const unknownVariables =
        template && variableCatalogAvailable
            ? findUnknownVariables(template.content, availableVariableNames)
            : [];
    const hasUnknownVariables = unknownVariables.length > 0;

    const actions = useGerarDocumentActions({
        template,
        dados,
        assistidoName,
        hasUnknownVariables,
        selectedAssistidoId,
    });

    const processedContent = template
        ? replaceVariables(normalizeTemplateContent(template.content), dados)
        : "";
    const previewHtml = highlightPendingVariables(
        stripVariableTokens(processedContent),
    );

    return {
        template,
        dados,
        variables,
        selectedAssistidoId,
        isLoading,
        token,
        assisteds,
        variablesStore,
        selectedAssistido,
        assistidoName,
        availableVariableNames,
        unknownVariables,
        hasUnknownVariables,
        processedContent,
        previewHtml,
        handleAssistidoChange,
        ...actions,
    };
}
