"use client"

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import UnderlineExt from "@tiptap/extension-underline"
import Placeholder from "@tiptap/extension-placeholder"
import { cn } from "@/lib/utils"
import { VariableNode } from "@/lib/tiptap-extensions/variable-node"
import { createVariableSuggestionExtension } from "@/lib/tiptap-extensions/variable-suggestion"
import { IndentExtension } from "@/lib/tiptap-extensions/indent-extension"
import { EditorToolbar } from "@/components/editor/editor-toolbar"
import { EditorStyles } from "@/components/editor/editor-styles"

export interface TipTapEditorHandle {
  insertVariable: (variavel: string) => void
}

interface TipTapEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  availableVariables?: Array<{ variable_name: string; description?: string }>
  variableCatalogAvailable?: boolean
}

function runCommand(chain: ReturnType<NonNullable<ReturnType<typeof useEditor>["chain"]>>, command: string) {
  const commandMap: Record<string, () => typeof chain> = {
    bold: () => chain.toggleBold(),
    italic: () => chain.toggleItalic(),
    underline: () => chain.toggleUnderline(),
    justifyLeft: () => chain.setTextAlign("left"),
    justifyCenter: () => chain.setTextAlign("center"),
    justifyRight: () => chain.setTextAlign("right"),
    justifyFull: () => chain.setTextAlign("justify"),
    insertUnorderedList: () => chain.toggleBulletList(),
    insertOrderedList: () => chain.toggleOrderedList(),
    undo: () => chain.undo(),
    redo: () => chain.redo(),
  }
  const fn = commandMap[command]
  if (fn) fn().run()
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
    const variableItemsRef = useRef<Array<{ variable_name: string; description: string }>>([])

    useEffect(() => {
      variableItemsRef.current = availableVariables.map((v) => ({
        variable_name: v.variable_name,
        description: v.description || v.variable_name,
      }))
    }, [availableVariables])

    const VariableSuggestionExt = useMemo(
      () => createVariableSuggestionExtension(variableItemsRef),
      [],
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

    const handleCommand = (command: string) => {
      if (!editor) return
      runCommand(editor.chain().focus(), command)
    }

    return (
      <div
        className={cn(
          "border border-border rounded-lg overflow-hidden bg-card",
          className,
        )}
      >
        <EditorToolbar onCommand={handleCommand} />

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

        <EditorStyles />
      </div>
    )
  },
)

export type { TipTapEditorProps }
