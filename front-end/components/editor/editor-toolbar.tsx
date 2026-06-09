'use client'

import { TooltipProvider } from '@/components/ui/tooltip'
import { HeadingDropdown } from './heading-dropdown'
import { FontSizeDropdown } from './font-size-dropdown'
import { BasicToolbarButtons } from './basic-toolbar-buttons'
import type { Editor } from '@tiptap/react'

interface EditorToolbarProps {
  onCommand: (command: string) => void
  editor?: Editor | null
}

export function EditorToolbar({
  onCommand,
  editor,
}: EditorToolbarProps) {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
        {editor && <HeadingDropdown editor={editor} />}
        {editor && <FontSizeDropdown editor={editor} />}
        <div className="w-px h-6 bg-border mx-1" />
        <BasicToolbarButtons onCommand={onCommand} />
      </div>
    </TooltipProvider>
  )
}
