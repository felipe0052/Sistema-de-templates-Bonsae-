import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function NotFoundState() {
  return (
    <DashboardLayout title="Template não encontrado" subtitle="">
      <div className="text-center py-12">
        <p className="text-muted-foreground">Template não encontrado.</p>
        <Button className="mt-4" asChild>
          <Link href="/templates">
            <ArrowLeft className="h-4 w-4" />
            Voltar aos templates
          </Link>
        </Button>
      </div>
    </DashboardLayout>
  )
}
