"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TemplateList } from "@/components/template-list"
import { Button } from "@/components/ui/button"
import { Plus, AlertCircle } from "lucide-react"
import { useStore } from "@/components/store-provider"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function TemplatesPage() {
  const { templates, isLoading, error } = useStore()
  const [searchQuery, setSearchQuery] = useState("")

  if (isLoading) return null

  if (error) {
    return (
      <DashboardLayout title="Templates" subtitle="Erro ao carregar dados">
        <div className="max-w-2xl mx-auto mt-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro de Conexão</AlertTitle>
            <AlertDescription className="mt-2">
              {error.includes("placeholder") ? (
                <div className="space-y-4">
                  <p>O Supabase não foi configurado corretamente.</p>
                  <p className="text-sm">
                    Substitua os valores no arquivo <code className="bg-muted px-1 rounded">.env.local</code>:
                  </p>
                  <pre className="bg-black text-white p-3 rounded text-xs overflow-x-auto">
                    NEXT_PUBLIC_SUPABASE_URL=https://seu-id.supabase.co{"\n"}
                    NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
                  </pre>
                </div>
              ) : (
                <p>{error}</p>
              )}
            </AlertDescription>
          </Alert>
          <Button 
            className="mt-4 w-full" 
            onClick={() => window.location.reload()}
          >
            Tentar Novamente
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const filteredTemplates = (templates || []).filter((template) => {
    const nome = template?.nome || ""
    const matchesSearch = nome.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <DashboardLayout
      title="Templates"
      subtitle="Gerencie seus modelos de documentos"
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-end">
          <Button asChild>
            <Link href="/templates/novo">
              <Plus className="h-4 w-4 mr-2" />
              Novo Template
            </Link>
          </Button>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <TemplateList templates={filteredTemplates} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum template encontrado.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/templates/novo">
                <Plus className="h-4 w-4 mr-2" />
                Criar primeiro template
              </Link>
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
