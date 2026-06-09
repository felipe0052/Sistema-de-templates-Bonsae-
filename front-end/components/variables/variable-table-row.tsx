import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TableRow, TableCell } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"
import { Pencil, Trash2, MoreHorizontal } from "lucide-react"
import type { Variable } from "@/lib/types"

interface VariableTableRowProps {
  variable: Variable
  isNotEditable: boolean
  isDeleting: boolean
  onEdit: (variable: Variable) => void
  onDelete: () => void
}

export function VariableTableRow({
  variable,
  isNotEditable,
  isDeleting,
  onEdit,
  onDelete,
}: VariableTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Badge
          variant="secondary"
          className="font-mono text-xs bg-primary/10 text-primary"
        >
          {`{{${variable.variable_name}}}`}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {variable.description}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {variable.example || "-"}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onEdit(variable)}
              disabled={isNotEditable}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {!isNotEditable ? (
              <ConfirmDeleteDialog
                title="Excluir variável"
                description={`Esta ação removerá a variável {{${variable.variable_name}}} da lista pública de templates.`}
                isDeleting={isDeleting}
                onConfirm={onDelete}
              >
                <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </ConfirmDeleteDialog>
            ) : (
              <DropdownMenuItem className="text-destructive" disabled>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
