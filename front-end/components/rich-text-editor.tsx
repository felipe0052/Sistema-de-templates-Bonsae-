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
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    document.execCommand("insertText", false, text)
  }, [])

  const insertVariable = useCallback((variavel: string) => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const span = document.createElement("span")
      span.className = "bg-primary/20 text-primary px-1 rounded font-mono text-sm"
      span.contentEditable = "false"
      span.textContent = `{{${variavel}}}`
      range.deleteContents()
      range.insertNode(span)
      
      // Move cursor after the inserted variable
      range.setStartAfter(span)
      range.setEndAfter(span)
      selection.removeAllRanges()
      selection.addRange(range)
      
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
    }
  }, [onChange])

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
        className="min-h-[400px] p-4 outline-none prose prose-sm max-w-none focus:ring-2 focus:ring-ring focus:ring-inset break-words whitespace-pre-wrap"
        onInput={handleInput}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        dir="ltr"
        style={{
          minHeight: "400px",
        }}
      />
    </div>
  )
}

export { type RichTextEditorProps }
