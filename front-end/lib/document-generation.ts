import {
    findUnknownVariables,
    normalizeTemplateContent,
} from "@/lib/document-utils";
import { extractVariables } from "@/lib/store";
import { getAssistidoValueForVariable } from "@/lib/template-helpers";
import type { Assisted, Template, Variable } from "@/lib/types";
import { formatValue } from "@/lib/variable-formatters";

function getCurrentDateValue() {
    return new Date().toLocaleDateString("pt-BR");
}

export function getInitialDocumentData(): Record<string, string> {
    return { data_atual: getCurrentDateValue() };
}

export function getSupportedVariables(variables: Variable[]): Variable[] {
    return variables.filter((item) => item.source !== "manual");
}

export function getAvailableVariableNames(variables: Variable[]): string[] {
    return variables.map((item) => item.variable_name);
}

export function getTemplateVariables(template: Template | null): string[] {
    if (!template) {
        return [];
    }

    return extractVariables(normalizeTemplateContent(template.content));
}

export function getSupportedTemplateVariables(
    templateVariables: string[],
    availableVariableNames: string[],
): string[] {
    return templateVariables.filter((varName) =>
        availableVariableNames.includes(varName),
    );
}

export function getUnknownTemplateVariables(
    template: Template | null,
    variableCatalogAvailable: boolean,
    availableVariableNames: string[],
): string[] {
    if (!template || !variableCatalogAvailable) {
        return [];
    }

    return findUnknownVariables(template.content, availableVariableNames);
}

export function buildAssistidoDocumentData(
    assistido: Assisted,
    variables: string[],
): Record<string, string> {
    const nextData = getInitialDocumentData();

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
}

export function getAssistidoDisplayName(assistido?: Assisted) {
    return assistido?.name || "Novo Documento";
}
