import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export function NotFoundState() {
  const router = useRouter()

  return (
    <DashboardLayout title="Template não encontrado" subtitle="">
      <div className="text-center py-12">
        <p className="text-muted-foreground">Template não encontrado.</p>
        <Button className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Voltar aos templates
        </Button>
      </div>
    </DashboardLayout>
  )
}
