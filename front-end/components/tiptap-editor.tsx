"use client"

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
} from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import UnderlineExt from "@tiptap/extension-underline"
import Placeholder from "@tiptap/extension-placeholder"
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
import { VariableNode } from "@/lib/tiptap-extensions/variable-node"
import { createVariableSuggestionExtension } from "@/lib/tiptap-extensions/variable-suggestion"
import { IndentExtension } from "@/lib/tiptap-extensions/indent-extension"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface TipTapEditorHandle {
  insertVariable: (variavel: string) => void
}

interface TipTapEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  availableVariables?: string[]
  variableCatalogAvailable?: boolean
}

export const TipTapEditor = forwardRef<TipTapEditorHandle, TipTapEditorProps>(
  function TipTapEditor(
    {
      value,
      onChange,
      placeholder = "Digite o conteúdo do template...",
      className,
      availableVariables = [],
      variableCatalogAvailable: _variableCatalogAvailable = false,
    },
    ref,
  ) {
    const VariableSuggestionExt = useMemo(
      () =>
        createVariableSuggestionExtension(
          availableVariables.map((name) => ({
            variable_name: name,
            description: name,
          })),
        ),
      [availableVariables],
    )

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
          underline: false,
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        UnderlineExt,
        Placeholder.configure({
          placeholder,
        }),
        VariableNode,
        VariableSuggestionExt,
        IndentExtension,
      ],
      content: value || "",
      onUpdate: ({ editor: e }) => {
        onChange(e.getHTML())
      },
      editorProps: {
        attributes: {
          class: "editor-document focus:outline-none",
        },
      },
    })

    useEffect(() => {
      if (editor && editor.getHTML() !== value) {
        editor.commands.setContent(value || "", { emitUpdate: false })
      }
    }, [value])

    useImperativeHandle(
      ref,
      () => ({
        insertVariable: (variavel: string) => {
          if (!editor) return
          editor
            .chain()
            .focus()
            .insertContent({
              type: "variableNode",
              attrs: { name: variavel },
            })
            .run()
        },
      }),
      [editor],
    )

    const execCommand = useCallback(
      (command: string, _value?: string) => {
        if (!editor) return
        const chain = editor.chain().focus()

        switch (command) {
          case "bold":
            chain.toggleBold().run()
            break
          case "italic":
            chain.toggleItalic().run()
            break
          case "underline":
            chain.toggleUnderline().run()
            break
          case "justifyLeft":
            chain.setTextAlign("left").run()
            break
          case "justifyCenter":
            chain.setTextAlign("center").run()
            break
          case "justifyRight":
            chain.setTextAlign("right").run()
            break
          case "justifyFull":
            chain.setTextAlign("justify").run()
            break
          case "insertUnorderedList":
            chain.toggleBulletList().run()
            break
          case "insertOrderedList":
            chain.toggleOrderedList().run()
            break
          case "undo":
            chain.undo().run()
            break
          case "redo":
            chain.redo().run()
            break
        }
      },
      [editor],
    )

    const tools = [
      { icon: Bold, command: "bold", label: "Negrito" },
      { icon: Italic, command: "italic", label: "Itálico" },
      { icon: Underline, command: "underline", label: "Sublinhado" },
      { type: "separator" },
      {
        icon: AlignLeft,
        command: "justifyLeft",
        label: "Alinhar à esquerda",
      },
      { icon: AlignCenter, command: "justifyCenter", label: "Centralizar" },
      {
        icon: AlignRight,
        command: "justifyRight",
        label: "Alinhar à direita",
      },
      { icon: AlignJustify, command: "justifyFull", label: "Justificar" },
      { type: "separator" },
      { icon: List, command: "insertUnorderedList", label: "Lista" },
      {
        icon: ListOrdered,
        command: "insertOrderedList",
        label: "Lista numerada",
      },
      { type: "separator" },
      { icon: Undo, command: "undo", label: "Desfazer" },
      { icon: Redo, command: "redo", label: "Refazer" },
    ]

    return (
      <div
        className={cn(
          "border border-border rounded-lg overflow-hidden bg-card",
          className,
        )}
      >
        <TooltipProvider>
          <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
            {tools.map((tool, index) =>
              tool.type === "separator" ? (
                <div
                  key={index}
                  className="w-px h-6 bg-border mx-1"
                />
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
              ),
            )}
          </div>
        </TooltipProvider>

        <div
          className={cn(
            "min-h-[400px] bg-white shadow-inner mx-auto",
            "tiptap-editor-content",
          )}
        >
          <EditorContent
            editor={editor}
            className="min-h-[400px]"
          />
        </div>

        <style jsx global>{`
          .tiptap-editor-content .tiptap {
            min-height: 400px;
            outline: none;
            width: 100%;
            max-width: 210mm;
            box-sizing: border-box;
            color: #000000;
            font-family: "Times New Roman", Times, serif;
            font-size: 12pt;
            line-height: 1.7;
            padding: 3cm 2.5cm 2.5cm 2.5cm;
          }

          .tiptap-editor-content .tiptap:focus {
            box-shadow: inset 0 0 0 2px hsl(var(--ring));
          }

          .tiptap-editor-content .tiptap p {
            margin: 0 0 12pt 0;
            text-indent: 1.25cm;
          }

          .tiptap-editor-content .tiptap p[style*="text-align"] {
            text-indent: 0;
          }

          .tiptap-editor-content .tiptap h1,
          .tiptap-editor-content .tiptap h2,
          .tiptap-editor-content .tiptap h3,
          .tiptap-editor-content .tiptap h4,
          .tiptap-editor-content .tiptap h5,
          .tiptap-editor-content .tiptap h6 {
            margin: 0 0 12pt 0;
            text-indent: 0;
            text-align: center;
          }

          .tiptap-editor-content .tiptap ul {
            margin: 0 0 12pt 1.2cm;
            padding: 0;
            text-indent: 0;
            list-style: disc outside;
          }

          .tiptap-editor-content .tiptap ol {
            margin: 0 0 12pt 1.2cm;
            padding: 0;
            text-indent: 0;
            list-style: decimal outside;
          }

          .tiptap-editor-content .tiptap li {
            margin: 0 0 6pt 0;
          }

          .tiptap-editor-content div[data-node-view-wrapper] {
            display: inline;
          }

          .tiptap-editor-content .tiptap .is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: hsl(var(--muted-foreground) / 0.6);
            pointer-events: none;
            height: 0;
            font-family: 'Inter', 'Geist', var(--font-sans), sans-serif;
            font-style: italic;
            font-size: 14px;
          }
        `}</style>
      </div>
    )
  },
)

export type { TipTapEditorProps }
