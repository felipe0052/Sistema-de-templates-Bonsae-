"use client"

import { Fragment, createElement, type CSSProperties, type ReactNode } from "react"

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "div",
  "span",
])

const STRIP_WITH_CONTENT_TAGS = new Set(["script", "style", "iframe", "object", "embed"])

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

const PENDING_VARIABLE_STYLE: CSSProperties = {
  backgroundColor: "#fee2e2",
  color: "#991b1b",
  padding: "0 4px",
  borderRadius: "4px",
  fontFamily: "monospace",
  fontSize: "0.75rem",
}

interface SafeHtmlRendererProps {
  html: string
  className?: string
  style?: CSSProperties
}

function toReactStyle(styleValue: string): CSSProperties {
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

const TAG_COMPONENTS: Record<string, string> = {
  br: "br", p: "p", strong: "strong", b: "b", em: "em", i: "i", u: "u",
  h1: "h1", h2: "h2", h3: "h3", h4: "h4", h5: "h5", h6: "h6",
  ul: "ul", ol: "ol", li: "li", div: "div", span: "span",
}

function renderNode(node: Node, key: string): ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null
  }

  const element = node as HTMLElement
  const tagName = element.tagName.toLowerCase()

  if (STRIP_WITH_CONTENT_TAGS.has(tagName)) {
    return null
  }

  const children = Array.from(element.childNodes).map((child, index) =>
    renderNode(child, `${key}-${index}`),
  )

  const Tag = TAG_COMPONENTS[tagName]
  if (!Tag) {
    return <Fragment key={key}>{children}</Fragment>
  }

  const safeStyle = toReactStyle(element.getAttribute("style") || "")
  const hasPending = element.dataset.variablePreview === "pending"
  const style = hasPending
    ? { ...safeStyle, ...PENDING_VARIABLE_STYLE }
    : Object.keys(safeStyle).length > 0
      ? safeStyle
      : undefined

  return createElement(Tag, { key, ...(style ? { style } : {}) }, ...children)
}

export function SafeHtmlRenderer({ html, className, style }: SafeHtmlRendererProps) {
  if (typeof window === "undefined") {
    return <div className={className} style={style} />
  }

  const documentNode = new DOMParser().parseFromString(html, "text/html")
  const children = Array.from(documentNode.body.childNodes).map((node, index) =>
    renderNode(node, String(index)),
  )

  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}
