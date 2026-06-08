"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import type { Template } from "@/lib/types"
import Link from "next/link"

interface CompactListProps {
  templates: Template[]
}

export function CompactList({ templates }: CompactListProps) {
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
                  {template.template_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {template.category || "Sem categoria"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
