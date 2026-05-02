"use client"

import { useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { normalizeTemplateContent } from "@/lib/document-utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Digite o conteúdo do template...",
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const normalized = normalizeTemplateContent(editorRef.current.innerHTML)
      if (normalized !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = normalized
      }
      onChange(normalized)
    }
  }, [onChange])

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
    onChange(editorRef.current.innerHTML)
  }, [onChange])

  // Expor o método para ser chamado de fora (como no VariablePanel)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).insertVariableToEditor = insertVariable
    }
  }, [insertVariable])

  const tools = [
    { icon: Bold, command: "bold", label: "Negrito" },
    { icon: Italic, command: "italic", label: "Itálico" },
    { icon: Underline, command: "underline", label: "Sublinhado" },
    { type: "separator" },
    { icon: AlignLeft, command: "justifyLeft", label: "Alinhar à esquerda" },
    { icon: AlignCenter, command: "justifyCenter", label: "Centralizar" },
    { icon: AlignRight, command: "justifyRight", label: "Alinhar à direita" },
    { icon: AlignJustify, command: "justifyFull", label: "Justificar" },
    { type: "separator" },
    { icon: List, command: "insertUnorderedList", label: "Lista" },
    { icon: ListOrdered, command: "insertOrderedList", label: "Lista numerada" },
    { type: "separator" },
    { icon: Undo, command: "undo", label: "Desfazer" },
    { icon: Redo, command: "redo", label: "Refazer" },
  ]

  return (
    <div className={cn("border border-border rounded-lg overflow-hidden bg-card", className)}>
      <TooltipProvider>
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
          {tools.map((tool, index) =>
            tool.type === "separator" ? (
              <div key={index} className="w-px h-6 bg-border mx-1" />
            ) : (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => execCommand(tool.command!)}
                  >
                    {tool.icon && <tool.icon className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tool.label}</p>
                </TooltipContent>
              </Tooltip>
            )
          )}
        </div>
      </TooltipProvider>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="editor-document min-h-[400px] outline-none focus:ring-2 focus:ring-ring focus:ring-inset break-words whitespace-pre-wrap bg-white !text-black shadow-inner mx-auto"
        onInput={handleInput}
        onPaste={handlePaste}
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
          padding: "3cm 2.5cm 2.5cm 3cm",
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
}

export { type RichTextEditorProps }
