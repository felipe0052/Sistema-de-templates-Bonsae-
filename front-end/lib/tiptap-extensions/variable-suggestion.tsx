import { Extension } from "@tiptap/core"
import { ReactRenderer } from "@tiptap/react"
import Suggestion from "@tiptap/suggestion"
import tippy, { Instance as TippyInstance } from "tippy.js"
import {
  SuggestionKeyDownProps,
  SuggestionProps,
} from "@tiptap/suggestion"
import { useCallback, useEffect, useState, forwardRef } from "react"

interface VariableItem {
  name: string
  description: string
}

interface VariableListProps {
  items: VariableItem[]
  command: (item: VariableItem) => void
}

const VariableList = forwardRef<HTMLDivElement, VariableListProps>(
  function VariableList({ items, command }, ref) {
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
      setSelectedIndex(0)
    }, [items])

    const selectItem = useCallback(
      (index: number) => {
        const item = items[index]
        if (item) command(item)
      },
      [items, command],
    )

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelectedIndex((prev) => (prev + items.length - 1) % items.length)
          return true
        }
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % items.length)
          return true
        }
        if (e.key === "Enter") {
          e.preventDefault()
          selectItem(selectedIndex)
          return true
        }
        return false
      }

      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }, [items, selectedIndex, selectItem])

    if (items.length === 0) {
      return (
        <div
          ref={ref}
          className="bg-popover border border-border rounded-lg shadow-lg p-3 text-sm text-muted-foreground"
        >
          Nenhuma variável encontrada.
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className="bg-popover border border-border rounded-lg shadow-lg overflow-hidden min-w-[240px] max-h-[300px] overflow-y-auto"
      >
        {items.map((item, index) => (
          <button
            key={item.name}
            className={`w-full text-left px-3 py-2 text-sm flex flex-col gap-0.5 transition-colors ${
              index === selectedIndex
                ? "bg-accent text-accent-foreground"
                : "text-foreground hover:bg-accent/50"
            }`}
            onClick={() => selectItem(index)}
          >
            <span className="font-mono text-xs text-primary">
              {`{{${item.name}}}`}
            </span>
            <span className="text-muted-foreground text-xs truncate">
              {item.description}
            </span>
          </button>
        ))}
      </div>
    )
  },
)

function createSuggestionConfig(
  availableVariables: Array<{ variable_name: string; description: string }>,
) {
  return {
    char: "{{",
    allowSpaces: true,

    items: ({ query }: { query: string }) => {
      const lower = query.toLowerCase()
      return availableVariables
        .filter(
          (v) =>
            v.variable_name.toLowerCase().includes(lower) ||
            v.description.toLowerCase().includes(lower),
        )
        .slice(0, 20)
        .map((v) => ({
          name: v.variable_name,
          description: v.description,
        }))
    },

    render: () => {
      let component: ReactRenderer
      let popup: TippyInstance[]

      return {
        onStart: (props: SuggestionProps) => {
          component = new ReactRenderer(VariableList, {
            props: props as any,
            editor: props.editor,
          })

          if (!props.clientRect) return

          popup = tippy("body", {
            getReferenceClientRect: props.clientRect as () => DOMRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
          })
        },

        onUpdate: (props: SuggestionProps) => {
          component?.updateProps(props as any)
          if (!props.clientRect) return
          popup?.[0]?.setProps({
            getReferenceClientRect: props.clientRect as () => DOMRect,
          })
        },

        onKeyDown: (props: SuggestionKeyDownProps) => {
          if (props.event.key === "Escape") {
            popup?.[0]?.hide()
            return true
          }
          return (component?.ref as any)?.onKeyDown?.(props) ?? false
        },

        onExit: () => {
          popup?.[0]?.destroy()
          component?.destroy()
        },
      }
    },

    command: ({ editor, range, props }: any) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: "variableNode",
          attrs: { name: props.name },
        })
        .run()
    },
  }
}

export function createVariableSuggestionExtension(
  availableVariables: Array<{ variable_name: string; description: string }>,
) {
  const config = createSuggestionConfig(availableVariables)

  return Extension.create({
    name: "variableSuggestion",

    addOptions() {
      return {
        suggestion: config,
      }
    },

    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          ...this.options.suggestion,
        }),
      ]
    },
  })
}
