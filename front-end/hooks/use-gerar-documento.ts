"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useTemplates } from "@/hooks/use-templates";
import { useVariables } from "@/hooks/use-variables";
import { useAssisteds } from "@/hooks/use-assisteds";
import { useAuth } from "@/hooks/use-auth";
import { useGerarDocumentActions } from "@/hooks/use-gerar-document-actions";
import { replaceVariables } from "@/lib/store";
import {
    highlightPendingVariables,
    normalizeTemplateContent,
    stripVariableTokens,
} from "@/lib/document-utils";
import {
    buildAssistidoDocumentData,
    getAssistidoDisplayName,
    getAvailableVariableNames,
    getInitialDocumentData,
    getSupportedTemplateVariables,
    getSupportedVariables,
    getTemplateVariables,
    getUnknownTemplateVariables,
} from "@/lib/document-generation";
import type { Template } from "@/lib/types";

export function useGerarDocumento() {
    const params = useParams();
    const { templates, isLoading: templatesLoading } = useTemplates();
    const { variables: variablesStore, variableCatalogAvailable } =
        useVariables();
    const { assisteds } = useAssisteds();
    const { token } = useAuth();

    const isLoading = templatesLoading;
    const [dados, setDados] = useState<Record<string, string>>(
        getInitialDocumentData,
    );
    const [selectedAssistidoId, setSelectedAssistidoId] = useState("");

    const template = useMemo<Template | null>(() => {
        const templateId = params.id as string;
        return templates.find((item) => item.id === templateId) || null;
    }, [params.id, templates]);

    const supportedVariablesStore = useMemo(
        () => getSupportedVariables(variablesStore),
        [variablesStore],
    );
    const availableVariableNames = useMemo(
        () => getAvailableVariableNames(supportedVariablesStore),
        [supportedVariablesStore],
    );
    const templateVariables = useMemo(
        () => getTemplateVariables(template),
        [template],
    );
    const variables = useMemo(
        () =>
            getSupportedTemplateVariables(
                templateVariables,
                availableVariableNames,
            ),
        [templateVariables, availableVariableNames],
    );

    useEffect(() => {
        setSelectedAssistidoId("");
        setDados(getInitialDocumentData());
    }, [template?.id]);

    const handleAssistidoChange = (assistidoId: string) => {
        setSelectedAssistidoId(assistidoId);

        if (!assistidoId) {
            setDados(getInitialDocumentData());
            return;
        }

        const assistido = assisteds.find((item) => item.id === assistidoId);
        if (!assistido) {
            return;
        }

        setDados(buildAssistidoDocumentData(assistido, variables));
    };

    const selectedAssistido = useMemo(
        () => assisteds.find((item) => item.id === selectedAssistidoId),
        [assisteds, selectedAssistidoId],
    );
    const assistidoName = getAssistidoDisplayName(selectedAssistido);

    const unknownVariables = useMemo(
        () =>
            getUnknownTemplateVariables(
                template,
                variableCatalogAvailable,
                availableVariableNames,
            ),
        [template, variableCatalogAvailable, availableVariableNames],
    );
    const hasUnknownVariables = unknownVariables.length > 0;

    const actions = useGerarDocumentActions({
        template,
        dados,
        assistidoName,
        hasUnknownVariables,
        selectedAssistidoId,
    });

    const processedContent = useMemo(
        () =>
            template
                ? replaceVariables(
                      normalizeTemplateContent(template.content),
                      dados,
                  )
                : "",
        [template, dados],
    );
    const previewHtml = useMemo(
        () => highlightPendingVariables(stripVariableTokens(processedContent)),
        [processedContent],
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
