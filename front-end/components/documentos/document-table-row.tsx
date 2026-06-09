import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TableCell, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileText, Download, Eye, MoreHorizontal, Trash2, Printer } from "lucide-react"
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"
import type { Document } from "@/lib/types"

interface DocumentTableRowProps {
  doc: Document
  templateName: string
  formattedDate: string
  isDeleting: boolean
  onDelete: () => void
  onDownloadPdf: () => void
}

export function DocumentTableRow({
  doc,
  templateName,
  formattedDate,
  isDeleting,
  onDelete,
  onDownloadPdf,
}: DocumentTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{doc.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{templateName}</Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">{formattedDate}</TableCell>
      <TableCell>
        <Badge
          variant={doc.pdf_generated ? "default" : "outline"}
          className={doc.pdf_generated ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
        >
          {doc.pdf_generated ? "Exportado" : "Pendente"}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/documentos/${doc.id}`}>
                <Eye className="h-4 w-4" />
                Visualizar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDownloadPdf}>
              <Download className="h-4 w-4" />
              Baixar PDF
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/documentos/${doc.id}?print=true`}>
                <Printer className="h-4 w-4" />
                Imprimir
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <ConfirmDeleteDialog
              title="Excluir documento"
              description="Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita."
              isDeleting={isDeleting}
              onConfirm={onDelete}
            >
              <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </ConfirmDeleteDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
