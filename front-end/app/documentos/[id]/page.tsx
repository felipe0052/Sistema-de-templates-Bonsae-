"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DocumentPreview } from "@/components/document-preview"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Download, Printer, FileText } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/components/store-provider"
import { toast } from "sonner"
import type { Documento, Template } from "@/lib/types"

export default function VisualizarDocumentoPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { documentos, templates, isLoading } = useStore()
  const [documento, setDocumento] = useState<Documento | null>(null)
  const [template, setTemplate] = useState<Template | null>(null)

  useEffect(() => {
    if (isLoading) return

    const docId = params.id as string
    const foundDoc = documentos.find((d) => d.id === docId)
    
    if (foundDoc) {
      setDocumento(foundDoc)
      const foundTemplate = templates.find((t) => t.id === foundDoc.template_id)
      if (foundTemplate) {
        setTemplate(foundTemplate)
        
        // Auto-print if param is present
        if (searchParams.get('print') === 'true') {
          setTimeout(() => {
            window.print()
          }, 500)
        }
      }
    }
  }, [params.id, documentos, templates, isLoading, searchParams])

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) return null

  if (!documento || !template) {
    return (
      <DashboardLayout title="Documento não encontrado" subtitle="">
        <div className="text-center py-12">
          <p className="text-muted-foreground">O documento solicitado não foi encontrado.</p>
          <Button className="mt-4" asChild>
            <Link href="/documentos">
              <ArrowLeft className="h-4 w-4" />
              Voltar aos documentos
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Visualizar Documento"
      subtitle={documento.nome}
    >
      <div className="space-y-6">
        {/* Actions bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 no-print">
          <Button variant="ghost" asChild>
            <Link href="/documentos">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button onClick={handlePrint}>
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </div>

        {/* Document Info Card - Hidden when printing */}
        <Card className="bg-card no-print">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Detalhes do Documento
                </h3>
                <div className="text-sm text-muted-foreground grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                  <p><span className="font-medium text-foreground">Template:</span> {template.nome_template}</p>
                  <p><span className="font-medium text-foreground">Data:</span> {new Date(documento.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Preview */}
        <div className="print-container">
          <DocumentPreview
            content={template.conteudo}
            letterhead={template.imagem_fundo}
            data={documento.dados_json}
          />
        </div>
      </div>

      <style jsx global>{`
        @media print {
          /* Hide everything by default */
          html, body {
            height: auto !important;
            overflow: visible !important;
            background: white !important;
          }

          body * {
            visibility: hidden;
          }
          
          /* Show only the print container and its children */
          .print-container, .print-container * {
            visibility: visible;
          }
          
          /* Position the print container at the top left */
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Hide UI wrappers of the preview component */
          .print-container .bg-card {
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
            padding: 0 !important;
          }
          
          /* Hide legends and preview headers */
          .print-container > div > div:first-child, /* CardHeader */
          .print-container .mt-4.flex.flex-wrap /* Legend */ {
            display: none !important;
            visibility: hidden !important;
          }

          /* Focus on the A4 div */
          .print-container div[style*="min-height: 297mm"] {
            box-shadow: none !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: none !important;
            border: none !important;
          }

          /* Generic helper to hide elements */
          .no-print, aside, header, nav, button, .dashboard-sidebar, .dashboard-header {
            display: none !important;
          }

          /* Reset margins */
          @page {
            margin: 0;
            size: auto;
          }
        }
      `}</style>
    </DashboardLayout>
  )
}
