'use client'

import { Type, Heading1, Heading2, Heading3, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Editor } from '@tiptap/react'

const HEADING_OPTIONS = [
  { label: 'Parágrafo', value: 'paragraph', icon: Type },
  { label: 'Título 1', value: '1', icon: Heading1 },
  { label: 'Título 2', value: '2', icon: Heading2 },
  { label: 'Subtítulo', value: '3', icon: Heading3 },
]

interface HeadingDropdownProps {
  editor: Editor | null
}

export function HeadingDropdown({ editor }: HeadingDropdownProps) {
  const currentLabel = (() => {
    if (!editor) return 'Parágrafo'
    for (const opt of HEADING_OPTIONS) {
      if (opt.value !== 'paragraph' && editor.isActive('heading', { level: parseInt(opt.value) })) {
        return opt.label
      }
    }
    return 'Parágrafo'
  })()

  const handleSelect = (value: string) => {
    if (!editor) return
    if (value === 'paragraph') {
      editor.chain().focus().setParagraph().run()
    } else {
      editor.chain().focus().toggleHeading({ level: parseInt(value) as 1 | 2 | 3 }).run()
    }
  }

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 px-2 gap-1 text-xs font-medium">
              {currentLabel}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent><p>Título</p></TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start">
        {HEADING_OPTIONS.map((opt) => (
          <DropdownMenuItem key={opt.value} onClick={() => handleSelect(opt.value)}>
            <opt.icon className="h-4 w-4 mr-2" />
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
