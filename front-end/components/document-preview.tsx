"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { replaceVariables } from "@/lib/store"
import { highlightPendingVariables, normalizeTemplateContent, stripVariableTokens } from "@/lib/document-utils"
import { FileText } from "lucide-react"
import { SafeHtmlRenderer } from "@/components/safe-html-renderer"

interface DocumentPreviewProps {
  content: string
  letterhead?: string | null
  data: Record<string, string>
}

export function DocumentPreview({ content, letterhead, data }: DocumentPreviewProps) {
  const normalizedContent = normalizeTemplateContent(content)
  const processedContent = replaceVariables(normalizedContent, {
    ...data,
    data_atual: new Date().toLocaleDateString("pt-BR"),
  })

  const displayContent = highlightPendingVariables(stripVariableTokens(processedContent))

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Pré-visualização do Documento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="relative mx-auto bg-white shadow-lg rounded-sm overflow-hidden"
          style={{
            width: "100%",
            maxWidth: "210mm",
            minHeight: "297mm",
            aspectRatio: "210 / 297",
          }}
        >
          {/* Letterhead Background */}
          {letterhead && (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${letterhead})`,
              }}
            />
          )}

          {/* Content */}
          <SafeHtmlRenderer
            html={displayContent}
            className="preview-document relative !text-black"
            style={{
              fontFamily: "Times New Roman, serif",
              fontSize: "12pt",
              lineHeight: "1.7",
              color: "#000000",
              padding: "3cm 2.5cm 2.5cm 2.5cm",
            }}
          />

          {/* Empty state */}
          {!content && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                O conteúdo do documento aparecerá aqui.
                <br />
                Comece a digitar no editor.
              </p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded bg-blue-100" />
            <span className="text-muted-foreground">Variável preenchida</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded bg-red-100" />
            <span className="text-muted-foreground">Variável pendente</span>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
