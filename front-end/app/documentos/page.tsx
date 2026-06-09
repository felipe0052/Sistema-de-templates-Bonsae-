"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Filter } from "lucide-react"
import { useDocuments } from "@/hooks/use-documents"
import { useTemplates } from "@/hooks/use-templates"
import { useRenderTemplate } from "@/hooks/use-render-template"
import type { Document } from "@/lib/types"
import { toast } from "sonner"
import { downloadPdf } from "@/lib/pdf-download"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DocumentStats } from "@/components/documentos/document-stats"
import { DocumentTableRow } from "@/components/documentos/document-table-row"

export default function DocumentosPage() {
  const { documents, deleteDocument, isLoading } = useDocuments()
  const { templates } = useTemplates()
  const [searchQuery, setSearchQuery] = useState("")
  const [templateFilter, setTemplateFilter] = useState("all")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { renderTemplatePdf } = useRenderTemplate()

  if (isLoading) return null

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesTemplate =
      templateFilter === "all" || doc.template_id === templateFilter
    return matchesSearch && matchesTemplate
  })

  const getTemplateName = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    return template?.template_name || "Template desconhecido"
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteDocument(id)
      toast.success("Documento excluído com sucesso!")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir o documento.")
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleDownloadPdf = (doc: Document) => {
    return downloadPdf(renderTemplatePdf, doc, templates)
  }

  const now = new Date()
  const thisMonthCount = documents.filter((d) => {
    const docDate = new Date(d.created_at)
    return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear()
  }).length

  return (
    <DashboardLayout
      title="Documentos Gerados"
      subtitle="Histórico de documentos gerados"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar documentos..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={templateFilter} onValueChange={setTemplateFilter}>
            <SelectTrigger className="w-[250px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar por template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os templates</SelectItem>
              {templates.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.template_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DocumentStats
          totalCount={documents.length}
          pdfCount={documents.filter((d) => d.pdf_generated).length}
          thisMonthCount={thisMonthCount}
        />

        <Card className="bg-card">
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Documento</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <DocumentTableRow
                    key={doc.id}
                    doc={doc}
                    templateName={getTemplateName(doc.template_id)}
                    formattedDate={formatDate(doc.created_at)}
                    isDeleting={deletingId === doc.id}
                    onDelete={() => handleDelete(doc.id)}
                    onDownloadPdf={() => handleDownloadPdf(doc)}
                  />
                ))}
                {filteredDocuments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-muted-foreground">
                        Nenhum documento encontrado.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
