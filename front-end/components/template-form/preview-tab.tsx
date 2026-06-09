import { DocumentPreview } from "@/components/document-preview"

interface PreviewTabProps {
  content: string
  letterhead: string | null
}

export function PreviewTab({ content, letterhead }: PreviewTabProps) {
  return <DocumentPreview content={content} letterhead={letterhead} data={{}} />
}
