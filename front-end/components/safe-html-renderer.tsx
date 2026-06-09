"use client"

import { Fragment, createElement, type CSSProperties, type ReactNode } from "react"
import { toReactStyle } from "@/lib/html-style-utils"

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

const TAG_COMPONENTS: Record<string, string> = {
  br: "br", p: "p", strong: "strong", b: "b", em: "em", i: "i", u: "u",
  h1: "h1", h2: "h2", h3: "h3", h4: "h4", h5: "h5", h6: "h6",
  ul: "ul", ol: "ol", li: "li", div: "div", span: "span",
}

function renderTextNode(node: Node): ReactNode {
  return node.textContent
}

function renderElementNode(node: Node, key: string, children: ReactNode[]): ReactNode {
  const element = node as HTMLElement
  const tagName = element.tagName.toLowerCase()

  if (STRIP_WITH_CONTENT_TAGS.has(tagName)) {
    return null
  }

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

function renderNode(node: Node, key: string): ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    return renderTextNode(node)
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null
  }

  const children = Array.from(node.childNodes).map((child, index) =>
    renderNode(child, `${key}-${index}`),
  )

  return renderElementNode(node, key, children)
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
