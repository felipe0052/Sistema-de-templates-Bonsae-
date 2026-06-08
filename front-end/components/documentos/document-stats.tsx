import { Card, CardContent } from "@/components/ui/card"
import { FileText, Download, Calendar } from "lucide-react"

interface DocumentStatsProps {
  totalCount: number
  pdfCount: number
  thisMonthCount: number
}

export function DocumentStats({ totalCount, pdfCount, thisMonthCount }: DocumentStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="bg-card">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCount}</p>
              <p className="text-sm text-muted-foreground">Total de documentos</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pdfCount}</p>
              <p className="text-sm text-muted-foreground">PDFs exportados</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{thisMonthCount}</p>
              <p className="text-sm text-muted-foreground">Este mês</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
