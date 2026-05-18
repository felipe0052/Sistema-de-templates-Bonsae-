"use client"

import { Fragment, type CSSProperties, type ReactNode } from "react"

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

  if (!ALLOWED_TAGS.has(tagName)) {
    return <Fragment key={key}>{children}</Fragment>
  }

  const props: {
    style?: CSSProperties
  } = {}

  const safeStyle = toReactStyle(element.getAttribute("style") || "")
  if (element.dataset.variablePreview === "pending") {
    props.style = { ...safeStyle, ...PENDING_VARIABLE_STYLE }
  } else if (Object.keys(safeStyle).length > 0) {
    props.style = safeStyle
  }

  switch (tagName) {
    case "br":
      return <br key={key} />
    case "p":
      return <p key={key} {...props}>{children}</p>
    case "strong":
      return <strong key={key} {...props}>{children}</strong>
    case "b":
      return <b key={key} {...props}>{children}</b>
    case "em":
      return <em key={key} {...props}>{children}</em>
    case "i":
      return <i key={key} {...props}>{children}</i>
    case "u":
      return <u key={key} {...props}>{children}</u>
    case "h1":
      return <h1 key={key} {...props}>{children}</h1>
    case "h2":
      return <h2 key={key} {...props}>{children}</h2>
    case "h3":
      return <h3 key={key} {...props}>{children}</h3>
    case "h4":
      return <h4 key={key} {...props}>{children}</h4>
    case "h5":
      return <h5 key={key} {...props}>{children}</h5>
    case "h6":
      return <h6 key={key} {...props}>{children}</h6>
    case "ul":
      return <ul key={key} {...props}>{children}</ul>
    case "ol":
      return <ol key={key} {...props}>{children}</ol>
    case "li":
      return <li key={key} {...props}>{children}</li>
    case "div":
      return <div key={key} {...props}>{children}</div>
    case "span":
      return <span key={key} {...props}>{children}</span>
    default:
      return <Fragment key={key}>{children}</Fragment>
  }
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
