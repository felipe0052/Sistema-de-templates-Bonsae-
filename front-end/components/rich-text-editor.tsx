"use client"

import {
  forwardRef,
  useRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
} from "react"
import { cn } from "@/lib/utils"
import {
  normalizeTemplateContent,
  serializeEditorContent,
  VARIABLE_TOKEN_REGEX,
} from "@/lib/document-utils"
import { EditorToolbar } from "@/components/editor/editor-toolbar"

export interface RichTextEditorHandle {
  insertVariable: (variavel: string) => void
}

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  availableVariables?: string[]
  variableCatalogAvailable?: boolean
}

function getTextOffset(root: HTMLElement): number | null {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return null

  const range = selection.getRangeAt(0)
  if (!root.contains(range.startContainer)) return null

  const preSelectionRange = range.cloneRange()
  preSelectionRange.selectNodeContents(root)
  preSelectionRange.setEnd(range.startContainer, range.startOffset)
  return preSelectionRange.toString().length
}

function restoreTextOffset(root: HTMLElement, offset: number | null) {
  if (offset === null) return

  const selection = window.getSelection()
  if (!selection) return

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let currentOffset = 0
  let node = walker.nextNode()

  while (node) {
    const textLength = node.textContent?.length || 0
    if (currentOffset + textLength >= offset) {
      const range = document.createRange()
      range.setStart(node, Math.max(0, offset - currentOffset))
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
      return
    }

    currentOffset += textLength
    node = walker.nextNode()
  }

  const range = document.createRange()
  range.selectNodeContents(root)
  range.collapse(false)
  selection.removeAllRanges()
  selection.addRange(range)
}

function unwrapVariableHighlights(root: HTMLElement) {
  root.querySelectorAll("[data-variable-token]").forEach((node) => {
    node.replaceWith(document.createTextNode(node.textContent || ""))
  })
}

function applyVariableHighlights(
  root: HTMLElement,
  availableSet: Set<string>,
  variableCatalogAvailable: boolean,
) {
  unwrapVariableHighlights(root)

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.textContent || !VARIABLE_TOKEN_REGEX.test(node.textContent)) {
        VARIABLE_TOKEN_REGEX.lastIndex = 0
        return NodeFilter.FILTER_REJECT
      }
      VARIABLE_TOKEN_REGEX.lastIndex = 0
      return NodeFilter.FILTER_ACCEPT
    },
  })
  const nodes: Text[] = []
  let current = walker.nextNode()

  while (current) {
    nodes.push(current as Text)
    current = walker.nextNode()
  }

  nodes.forEach((textNode) => {
    const text = textNode.textContent || ""
    const fragment = document.createDocumentFragment()
    let lastIndex = 0

    for (const match of text.matchAll(VARIABLE_TOKEN_REGEX)) {
      const variableName = match[1]
      const index = match.index || 0

      if (index > lastIndex) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, index)))
      }

      const span = document.createElement("span")
      const isKnown = !variableCatalogAvailable || availableSet.has(variableName)
      span.dataset.variableToken = variableName
      span.contentEditable = "false"
      span.className = cn(
        "px-1 rounded font-mono text-sm mx-0.5",
        isKnown ? "bg-primary/20 text-primary" : "bg-red-100 text-red-700",
      )
      span.textContent = `{{${variableName}}}`
      fragment.appendChild(span)
      lastIndex = index + match[0].length
    }

    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)))
    }

    textNode.replaceWith(fragment)
  })
}

function isVariableTokenElement(node: Node | null): node is HTMLElement {
  return node instanceof HTMLElement && node.hasAttribute("data-variable-token")
}

function isSpacing(value: string) {
  return /^[\s\u00A0]*$/.test(value)
}

function getTokenFromTextBackspace(text: string, offset: number, sibling: Node | null): HTMLElement | null {
  if (offset === 0 || isSpacing(text.slice(0, offset))) {
    return isVariableTokenElement(sibling) ? sibling : null
  }
  return null
}

function getTokenFromTextDelete(text: string, offset: number, sibling: Node | null): HTMLElement | null {
  if (offset === text.length || isSpacing(text.slice(offset))) {
    return isVariableTokenElement(sibling) ? sibling : null
  }
  return null
}

function getTokenFromTextNode(container: Node, offset: number, key: string): HTMLElement | null {
  const text = container.textContent || ""

  if (key === "Backspace") {
    return getTokenFromTextBackspace(text, offset, container.previousSibling)
  }

  if (key === "Delete") {
    return getTokenFromTextDelete(text, offset, container.nextSibling)
  }

  return null
}

function getTokenFromElementNode(container: Element, offset: number, key: string): HTMLElement | null {
  const targetNode = key === "Backspace"
    ? container.childNodes.item(offset - 1)
    : container.childNodes.item(offset)

  return isVariableTokenElement(targetNode) ? targetNode : null
}

function getVariableTokenNearRange(range: Range, root: HTMLElement, key: string): HTMLElement | null {
  if (!range.collapsed || !root.contains(range.startContainer)) return null

  const container = range.startContainer
  const offset = range.startOffset

  if (container.nodeType === Node.TEXT_NODE) {
    return getTokenFromTextNode(container, offset, key)
  }

  if (container.nodeType !== Node.ELEMENT_NODE) return null

  return getTokenFromElementNode(container as Element, offset, key)
}

function unlockVariableToken(token: HTMLElement, placeCursor: "start" | "end") {
  const selection = window.getSelection()
  if (!selection) return

  const textNode = document.createTextNode(token.textContent || "")
  token.replaceWith(textNode)

  const range = document.createRange()
  range.setStart(textNode, placeCursor === "start" ? 0 : textNode.length)
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
}

export const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(function RichTextEditor({
  value,
  onChange,
  placeholder = "Digite o conteúdo do template...",
  className,
  availableVariables = [],
  variableCatalogAvailable = false,
}, ref) {
  const editorRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const isComposingRef = useRef(false)
  const isUnlockingRef = useRef(false)
  const availableSet = useMemo(() => new Set(availableVariables), [availableVariables])

  const emitChange = useCallback(() => {
    if (!editorRef.current) return
    onChange(serializeEditorContent(editorRef.current))
  }, [onChange])

  const scheduleHighlight = useCallback((preserveSelection = true) => {
    if (frameRef.current !== null || isComposingRef.current) return

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null
      if (!editorRef.current) return

      const offset = preserveSelection ? getTextOffset(editorRef.current) : null
      applyVariableHighlights(editorRef.current, availableSet, variableCatalogAvailable)
      restoreTextOffset(editorRef.current, offset)
    })
  }, [availableSet, variableCatalogAvailable])

  useEffect(() => {
    if (editorRef.current && serializeEditorContent(editorRef.current) !== value) {
      editorRef.current.innerHTML = normalizeTemplateContent(value)
      scheduleHighlight(false)
    }
  }, [scheduleHighlight, value])

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [frameRef])

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    emitChange()
    scheduleHighlight()
  }, [emitChange, scheduleHighlight])

  const handleInput = useCallback(() => {
    if (isUnlockingRef.current) {
      isUnlockingRef.current = false
      return
    }
    emitChange()
    scheduleHighlight()
  }, [emitChange, scheduleHighlight])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Backspace" && e.key !== "Delete") return
    if (!editorRef.current) return

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const token = getVariableTokenNearRange(range, editorRef.current, e.key)
    if (!token) return

    e.preventDefault()
    unlockVariableToken(token, e.key === "Backspace" ? "end" : "start")
    isUnlockingRef.current = true
    emitChange()
  }, [emitChange])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    document.execCommand("insertText", false, text)
  }, [])

  const insertVariable = useCallback((variavel: string) => {
    if (!editorRef.current) return

    const selection = window.getSelection()
    if (!selection) return

    let range: Range
    
    // Se o foco não estiver no editor, coloca o cursor no final
    if (!editorRef.current.contains(selection.anchorNode)) {
      range = document.createRange()
      range.selectNodeContents(editorRef.current)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    } else {
      range = selection.getRangeAt(0)
    }

    const span = document.createElement("span")
    span.dataset.variableToken = variavel
    span.className = "bg-primary/20 text-primary px-1 rounded font-mono text-sm mx-0.5"
    span.contentEditable = "false"
    span.textContent = `{{${variavel}}}`
    
    range.deleteContents()
    range.insertNode(span)
    
    // IMPORTANTE: Move o cursor para DEPOIS da variável e adiciona um espaço
    // Isso evita que a próxima variável substitua a atual
    const textNode = document.createTextNode("\u00A0") // Espaço não quebrável
    range.setStartAfter(span)
    range.insertNode(textNode)
    range.setStartAfter(textNode)
    range.collapse(true)
    
    selection.removeAllRanges()
    selection.addRange(range)
    
    editorRef.current.focus()
    emitChange()
    scheduleHighlight()
  }, [emitChange, scheduleHighlight])

  useImperativeHandle(ref, () => ({ insertVariable }), [insertVariable])

  return (
    <div className={cn("border border-border rounded-lg overflow-hidden bg-card", className)}>
      <EditorToolbar onCommand={(cmd) => execCommand(cmd)} />

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="editor-document min-h-[400px] outline-none focus:ring-2 focus:ring-ring focus:ring-inset break-words whitespace-pre-wrap bg-white !text-black shadow-inner mx-auto"
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onPaste={handlePaste}
        onCompositionStart={() => {
          isComposingRef.current = true
        }}
        onCompositionEnd={() => {
          isComposingRef.current = false
          handleInput()
        }}
        data-placeholder={placeholder}
        dir="ltr"
        style={{
          minHeight: "400px",
          width: "100%",
          maxWidth: "210mm", // Simulando A4
          color: "#000000",
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: "12pt",
          lineHeight: "1.7",
          padding: "3cm 2.5cm 2.5cm 2.5cm",
        }}
      />
      <style jsx>{`
        :global(.editor-document p) {
          margin: 0 0 12pt 0;
          text-indent: 1.25cm;
        }

        :global(.editor-document h1),
        :global(.editor-document h2),
        :global(.editor-document h3),
        :global(.editor-document h4),
        :global(.editor-document h5),
        :global(.editor-document h6) {
          margin: 0 0 12pt 0;
          text-indent: 0;
          text-align: center;
        }

        :global(.editor-document ul) {
          margin: 0 0 12pt 1.2cm;
          padding: 0;
          text-indent: 0;
          list-style: disc outside;
        }

        :global(.editor-document ol) {
          margin: 0 0 12pt 1.2cm;
          padding: 0;
          text-indent: 0;
          list-style: decimal outside;
        }

        :global(.editor-document li) {
          margin: 0 0 6pt 0;
        }
      `}</style>
    </div>
  )
})

export { type RichTextEditorProps }
