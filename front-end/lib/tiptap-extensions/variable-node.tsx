import { Node, mergeAttributes, InputRule } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import {
  NodeViewWrapper,
  NodeViewWrapperProps,
} from "@tiptap/react"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    variableNode: {
      insertVariable: (name: string) => ReturnType
    }
  }
}

function VariableNodeComponent({
  node,
  selected,
}: NodeViewWrapperProps) {
  const name = node.attrs.name as string

  return (
    <NodeViewWrapper
      as="span"
      data-variable-token={name}
      className={`px-1.5 py-0.5 rounded font-mono text-sm mx-0.5 inline-flex items-center cursor-default select-none transition-colors ${
        selected
          ? "bg-primary/30 text-primary ring-1 ring-primary/40"
          : "bg-primary/15 text-primary hover:bg-primary/25"
      }`}
      contentEditable={false}
      draggable={false}
    >
      {`{{${name}}}`}
    </NodeViewWrapper>
  )
}

export const VariableNode = Node.create({
  name: "variableNode",

  inline: true,
  group: "inline",
  atom: true,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      name: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          element.getAttribute("data-variable-token"),
        renderHTML: (attributes: Record<string, string>) => {
          if (!attributes.name) return {}
          return { "data-variable-token": attributes.name }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-variable-token]',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-variable-token": node.attrs.name,
        class: "variable-chip",
      }),
      `{{${node.attrs.name}}}`,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(VariableNodeComponent)
  },

  addCommands() {
    return {
      insertVariable:
        (name: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { name },
          })
        },
    }
  },

  addInputRules() {
    return [
      new InputRule({
        find: /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}$/,
        handler: ({ state, range, match }) => {
          const variableName = match[1]
          if (!variableName) return

          const node = state.schema.nodes[this.name].create({ name: variableName })
          const { tr } = state
          tr.replaceWith(range.from, range.to, node)

          return
        },
      }),
    ]
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { state } = editor
        const { selection } = state
        if (!selection.empty) return false

        const $pos = selection.$anchor
        if ($pos.parentOffset <= 0) return false

        const nodeBefore = $pos.parent.child($pos.parentOffset - 1)

        if (nodeBefore?.type.name === this.name) {
          const pos = $pos.pos - 1
          editor.chain()
            .focus()
            .command(({ tr }) => {
              tr.delete(pos, pos + 1)
              return true
            })
            .run()
          return true
        }

        return false
      },
      Delete: ({ editor }) => {
        const { state } = editor
        const { selection } = state
        if (!selection.empty) return false

        const $pos = selection.$anchor
        if ($pos.parentOffset >= $pos.parent.childCount) return false

        const nodeAfter = $pos.parent.child($pos.parentOffset)

        if (nodeAfter?.type.name === this.name) {
          const pos = $pos.pos
          editor.chain()
            .focus()
            .command(({ tr }) => {
              tr.delete(pos, pos + 1)
              return true
            })
            .run()
          return true
        }

        return false
      },
    }
  },
})
