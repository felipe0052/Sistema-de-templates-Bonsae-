import { Extension } from "@tiptap/core"

export const EMPTY_PARAGRAPH_MIN_HEIGHT = "1.7em"

function hasEmptyParagraphStyle(style: string | null | undefined): boolean {
  return typeof style === "string" && style.includes("min-height")
}

function mergeEmptyParagraphStyle(existingStyle: string | null | undefined): string {
  const minHeightRule = `min-height: ${EMPTY_PARAGRAPH_MIN_HEIGHT}`
  if (!existingStyle?.trim()) {
    return minHeightRule
  }
  if (hasEmptyParagraphStyle(existingStyle)) {
    return existingStyle
  }
  return `${existingStyle}; ${minHeightRule}`
}

function stripEmptyParagraphStyle(style: string | null | undefined): string | null {
  if (!style?.trim()) {
    return null
  }

  const cleaned = style
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part && !part.startsWith("min-height:"))
    .join("; ")

  return cleaned || null
}

export const EmptyParagraphHeight = Extension.create({
  name: "emptyParagraphHeight",

  addGlobalAttributes() {
    return [
      {
        types: ["paragraph"],
        attributes: {
          style: {
            default: null,
            parseHTML: (element) => element.getAttribute("style"),
            renderHTML: (attributes) => {
              if (!attributes.style) {
                return {}
              }
              return { style: attributes.style }
            },
          },
        },
      },
    ]
  },

  addAppendTransaction() {
    return ({ tr, state }) => {
      let modified = false

      state.doc.descendants((node, pos) => {
        if (node.type.name !== "paragraph") {
          return
        }

        const currentStyle = node.attrs.style as string | null | undefined

        if (node.content.size === 0) {
          const nextStyle = mergeEmptyParagraphStyle(currentStyle)
          if (nextStyle !== currentStyle) {
            tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              style: nextStyle,
            })
            modified = true
          }
          return
        }

        if (hasEmptyParagraphStyle(currentStyle)) {
          const nextStyle = stripEmptyParagraphStyle(currentStyle)
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            style: nextStyle,
          })
          modified = true
        }
      })

      return modified ? tr : null
    }
  },
})
