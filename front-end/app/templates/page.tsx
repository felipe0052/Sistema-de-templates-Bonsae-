"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TemplateList } from "@/components/template-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Filter } from "lucide-react"
import { useStore } from "@/components/store-provider"
import Link from "next/link"

export default function TemplatesPage() {
  const { templates, isLoading } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  if (isLoading) return null

  const categorias = Array.from(
    new Set(templates.map((t) => t.categoria).filter(Boolean))
  )

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.nome_template
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || template.categoria === categoryFilter
    return matchesSearch && matchesCategory
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
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-3 w-full sm:w-auto">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[190px]">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {categorias.map((cat) => (
                  <SelectItem key={cat} value={cat || ""}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button asChild>
            <Link href="/templates/novo">
              <Plus className="h-4 w-4" />
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
