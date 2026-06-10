import type { Variable } from "./types";
import { escapeHtml, extractVariableTokens } from "./document-utils";

export const availableVariables: Variable[] = [];

export function replaceVariables(
    content: string,
    data: Record<string, string>,
): string {
    let result = content;
    Object.entries(data).forEach(([key, value]) => {
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`{{\\s*${escapedKey}\\s*}}`, "g");
        result = result.replace(
            regex,
            value ? escapeHtml(value) : `{{${key}}}`,
        );
    });
    return result;
}

export function extractVariables(content: string): string[] {
    return extractVariableTokens(content);
}
