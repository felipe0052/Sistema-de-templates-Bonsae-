import { DashboardLayout } from "@/components/dashboard-layout"

interface LoadingSkeletonProps {
  title: string
}

export function LoadingSkeleton({ title }: LoadingSkeletonProps) {
  return (
    <DashboardLayout title={title} subtitle="">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-10 w-24 bg-muted rounded-md animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-36 bg-muted rounded-md animate-pulse" />
            <div className="h-10 w-28 bg-muted rounded-md animate-pulse" />
          </div>
        </div>
        <div className="rounded-xl border bg-card shadow animate-pulse">
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-10 w-full bg-muted rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-10 w-full bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
