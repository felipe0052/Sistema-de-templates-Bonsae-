"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Edit, Copy, MoreHorizontal, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Template } from "@/lib/types"
import Link from "next/link"

interface TemplateListProps {
  templates: Template[]
  compact?: boolean
}

import { useStore } from "@/components/store-provider"
import { toast } from "sonner"

export function TemplateList({ templates, compact = false }: TemplateListProps) {
  const { deleteTemplate, addTemplate } = useStore()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const handleDuplicate = (template: Template) => {
    addTemplate({
      ...template,
      nome_template: `${template.nome_template} (Cópia)`,
    })
    toast.success("Template duplicado com sucesso!")
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este template?")) {
      deleteTemplate(id)
      toast.success("Template excluído com sucesso!")
    }
  }

  if (compact) {
    return (
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Templates Populares</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/templates">Ver todos</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {templates.slice(0, 5).map((template) => (
              <Link
                key={template.id}
                href={`/templates/${template.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {template.nome_template}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {template.categoria || "Sem categoria"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card key={template.id} className="bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold line-clamp-1">
                    {template.nome_template}
                  </CardTitle>
                  {template.categoria && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {template.categoria}
                    </Badge>
                  )}
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
                    <Link href={`/templates/${template.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDuplicate(template)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(template.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              Template criado em {formatDate(template.created_at)}
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" asChild>
                <Link href={`/templates/${template.id}/gerar`}>
                  Gerar Documento
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/templates/${template.id}`}>
                  Editar
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
