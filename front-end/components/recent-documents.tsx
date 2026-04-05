"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Documento } from "@/lib/types"
import Link from "next/link"
import { useStore } from "@/components/store-provider"

interface RecentDocumentsProps {
  documentos: Documento[]
}

export function RecentDocuments({ documentos }: RecentDocumentsProps) {
  const { templates, isLoading } = useStore()

  if (isLoading) return null

  const getTemplateName = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    return template?.nome_template || "Template desconhecido"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Documentos Recentes</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/documentos">Ver todos</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documentos.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{doc.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {getTemplateName(doc.template_id)} • {formatDate(doc.created_at)}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                   <DropdownMenuItem asChild>
                    <Link href={`/documentos/${doc.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/documentos/${doc.id}?print=true`}>
                      <Download className="h-4 w-4 mr-2" />
                      Baixar PDF
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
          {documentos.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum documento gerado ainda.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
