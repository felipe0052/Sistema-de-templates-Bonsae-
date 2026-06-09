"use client"

import { type LucideIcon } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ToolbarItem {
  type?: "separator"
  icon?: LucideIcon
  command?: string
  label?: string
}

const TOOLBAR_ITEMS: ToolbarItem[] = [
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

interface EditorToolbarProps {
  onCommand: (command: string) => void
}

export function EditorToolbar({ onCommand }: EditorToolbarProps) {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
        {TOOLBAR_ITEMS.map((tool, index) =>
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
                  onClick={() => tool.command && onCommand(tool.command)}
                >
                  {tool.icon && <tool.icon className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          ),
        )}
      </div>
    </TooltipProvider>
  )
}
