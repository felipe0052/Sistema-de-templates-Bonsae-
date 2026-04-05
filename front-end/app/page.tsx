"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { RecentDocuments } from "@/components/recent-documents"
import { TemplateList } from "@/components/template-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FolderOpen, Users, TrendingUp, Plus, ArrowRight } from "lucide-react"
import { useStore } from "@/components/store-provider"
import Link from "next/link"

export default function DashboardPage() {
  const { templates, documentos, isLoading } = useStore()

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm font-medium">Carregando dados do servidor...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Bem-vindo ao sistema de templates"
    >
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/templates/novo">
              <Plus className="h-4 w-4" />
              Novo Template
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/templates">
              Ver Templates
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Templates Ativos"
            value={templates.length}
            description="Templates disponíveis"
            icon={FileText}
            trend={{ value: 12, positive: true }}
          />
          <StatsCard
            title="Documentos Gerados"
            value={documentos.length}
            description="Total gerados"
            icon={FolderOpen}
            trend={{ value: 8, positive: true }}
          />
          <StatsCard
            title="Clientes Ativos"
            value={15}
            description="Usando o sistema"
            icon={Users}
            trend={{ value: 5, positive: true }}
          />
          <StatsCard
            title="Taxa de Uso"
            value="94%"
            description="Satisfação do cliente"
            icon={TrendingUp}
            trend={{ value: 2, positive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentDocuments documentos={documentos} />
          </div>
          <div>
            <TemplateList templates={templates} compact />
          </div>
        </div>

        {/* Activity Card */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Template criado", item: templates[templates.length - 1]?.nome_template || "Nenhum", time: "Recentemente" },
                { action: "Documento gerado", item: documentos[documentos.length - 1]?.nome || "Nenhum", time: "Recentemente" },
                { action: "Sessão iniciada", item: "Usuário Demo", time: "Agora" },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.item}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
