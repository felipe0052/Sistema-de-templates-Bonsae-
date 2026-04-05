"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Variable, Copy, Check } from "lucide-react"
import { useStore } from "@/components/store-provider"
import { toast } from "sonner"

export default function VariaveisPage() {
  const { variaveis, addVariavel, isLoading } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newVar, setNewVar] = useState({ nome_variavel: "", descricao: "", exemplo: "" })

  if (isLoading) return null

  const filteredVariaveis = variaveis.filter(
    (v) =>
      v.nome_variavel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.descricao.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCopy = (variavel: string, id: string) => {
    navigator.clipboard.writeText(`{{${variavel}}}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success("Copiado para a área de transferência!")
  }

  const handleCreateVar = () => {
    if (!newVar.nome_variavel) {
      toast.error("O nome da variável é obrigatório.")
      return
    }
    addVariavel(newVar)
    toast.success("Variável criada com sucesso!")
    setIsDialogOpen(false)
    setNewVar({ nome_variavel: "", descricao: "", exemplo: "" })
  }

  return (
    <DashboardLayout
      title="Variáveis"
      subtitle="Gerencie as variáveis disponíveis para os templates"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar variáveis..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Variável
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Variável</DialogTitle>
                <DialogDescription>
                  Adicione uma nova variável para usar nos templates de documentos.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome_variavel">Nome da Variável</Label>
                  <Input
                    id="nome_variavel"
                    placeholder="Ex: numero_processo"
                    value={newVar.nome_variavel}
                    onChange={(e) => setNewVar({ ...newVar, nome_variavel: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use apenas letras minúsculas e underscores
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva para que serve esta variável"
                    value={newVar.descricao}
                    onChange={(e) => setNewVar({ ...newVar, descricao: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exemplo">Exemplo (opcional)</Label>
                  <Input
                    id="exemplo"
                    placeholder="Ex: 1234/2024"
                    value={newVar.exemplo}
                    onChange={(e) => setNewVar({ ...newVar, exemplo: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateVar}>
                  Criar Variável
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Variable className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Como usar variáveis
                </h3>
                <p className="text-sm text-muted-foreground">
                  As variáveis são inseridas nos templates usando a sintaxe{" "}
                  <code className="bg-muted px-1 py-0.5 rounded text-primary font-mono">
                    {"{{nome_variavel}}"}
                  </code>
                  . Quando o documento é gerado, as variáveis são substituídas pelos
                  dados reais informados pelo usuário.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variables Table */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-base">
              Variáveis Disponíveis ({filteredVariaveis.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variável</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Exemplo</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVariaveis.map((variavel) => (
                  <TableRow key={variavel.id}>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="font-mono text-xs bg-primary/10 text-primary"
                      >
                        {`{{${variavel.nome_variavel}}}`}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {variavel.descricao}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {variavel.exemplo || "-"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleCopy(variavel.nome_variavel, variavel.id)
                        }
                      >
                        {copiedId === variavel.id ? (
                          <>
                            <Check className="h-4 w-4 mr-1 text-green-600" />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1" />
                            Copiar
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
