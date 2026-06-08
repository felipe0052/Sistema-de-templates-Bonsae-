import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function TemplateLoadingSkeleton() {
  return (
    <DashboardLayout title="Gerar Documento" subtitle="">
      <div className="space-y-6">
        <div className="flex gap-2">
          <div className="h-10 w-28 rounded-md bg-muted animate-pulse" />
          <div className="h-10 w-28 rounded-md bg-muted animate-pulse" />
          <div className="h-10 w-28 rounded-md bg-muted animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card">
            <CardHeader>
              <div className="h-5 w-40 rounded bg-muted animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                  <div className="h-10 w-full rounded bg-muted animate-pulse" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader>
              <div className="h-5 w-32 rounded bg-muted animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full rounded bg-muted animate-pulse" />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
