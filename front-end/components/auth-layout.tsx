import Image from "next/image"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthLayoutProps {
  title: string
  description: string
  children: React.ReactNode
}

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-8">
        <div className="w-full space-y-4">
          <div className="flex justify-center">
            <Image src="/academy-2.png" alt="Bonsae" width={140} height={48} className="h-12 w-auto" priority />
          </div>

          <Card className="w-full border-border/70 bg-white shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {children}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
