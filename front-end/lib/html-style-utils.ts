import type { CSSProperties } from "react"

const ALLOWED_STYLE_PROPS = new Set([
  "text-align",
  "font-weight",
  "font-style",
  "text-decoration",
  "font-size",
  "line-height",
  "margin",
  "margin-left",
  "margin-right",
  "margin-top",
  "margin-bottom",
  "padding",
  "padding-left",
  "padding-right",
  "padding-top",
  "padding-bottom",
])

export function toReactStyle(styleValue: string): CSSProperties {
  const style: CSSProperties = {}

  styleValue.split(";").forEach((declaration) => {
    const [rawProperty, ...rawValueParts] = declaration.split(":")
    if (!rawProperty || rawValueParts.length === 0) return

    const property = rawProperty.trim().toLowerCase()
    const value = rawValueParts.join(":").trim()
    if (!ALLOWED_STYLE_PROPS.has(property) || !value) return
    if (/url\s*\(|expression\s*\(|javascript:/i.test(value)) return

    const camelProperty = property.replace(/-([a-z])/g, (_match, letter: string) =>
      letter.toUpperCase(),
    )
    ;(style as Record<string, string>)[camelProperty] = value
  })

  return style
}
