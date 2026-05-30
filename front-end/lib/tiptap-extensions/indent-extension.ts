import { Extension } from "@tiptap/core"

export interface IndentOptions {
  types: string[]
  minLevel: number
  maxLevel: number
  indentUnit: number
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType
      outdent: () => ReturnType
    }
  }
}

export const IndentExtension = Extension.create<IndentOptions>({
  name: "indent",

  addOptions() {
    return {
      types: ["paragraph", "heading"],
      minLevel: 0,
      maxLevel: 7,
      indentUnit: 40,
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) => {
              const ml = element.style.marginLeft
              if (!ml) return 0
              const px = parseInt(ml, 10)
              if (isNaN(px)) return 0
              return Math.round(px / this.options.indentUnit)
            },
            renderHTML: (attributes) => {
              const level = attributes.indent as number
              if (!level) return {}
              return {
                style: `margin-left: ${level * this.options.indentUnit}px`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state
          const { from, to } = selection
          let modified = false

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              const currentLevel = (node.attrs.indent as number) || 0
              if (currentLevel < this.options.maxLevel) {
                modified = true
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  indent: currentLevel + 1,
                })
              }
            }
          })

          if (modified) {
            dispatch?.(tr)
            return true
          }
          return false
        },

      outdent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state
          const { from, to } = selection
          let modified = false

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              const currentLevel = (node.attrs.indent as number) || 0
              if (currentLevel > this.options.minLevel) {
                modified = true
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  indent: currentLevel - 1,
                })
              }
            }
          })

          if (modified) {
            dispatch?.(tr)
            return true
          }
          return false
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        if (editor.isActive("listItem")) return false
        return editor.commands.indent()
      },
      "Shift-Tab": ({ editor }) => {
        return editor.commands.outdent()
      },
    }
  },
})
