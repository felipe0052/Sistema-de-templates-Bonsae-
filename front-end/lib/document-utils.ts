const VARIABLE_TOKEN_REGEX = /{{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*}}/g

export function extractVariableTokens(content: string): string[] {
  const variables = new Set<string>()
  for (const match of content.matchAll(VARIABLE_TOKEN_REGEX)) {
    variables.add(match[1])
  }
  return Array.from(variables)
}

export function findUnknownVariables(content: string, availableVariables: string[]): string[] {
  const availableSet = new Set(availableVariables)
  return extractVariableTokens(content).filter((variable) => !availableSet.has(variable))
}

export function normalizeTemplateContent(content: string): string {
  return content.replace(VARIABLE_TOKEN_REGEX, (_full, variableName: string) => `{{${variableName}}}`)
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export function highlightPendingVariables(content: string): string {
  return normalizeTemplateContent(content).replace(
    VARIABLE_TOKEN_REGEX,
    (_full, variableName: string) =>
      `<span data-variable-preview="pending">{{${variableName}}}</span>`,
  )
}

export function stripVariableTokens(html: string): string {
  return html.replace(/\s*data-variable-token="[^"]*"/g, "")
}
