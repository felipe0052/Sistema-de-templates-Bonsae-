"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Variable, Search, Plus } from "lucide-react"
import { variaveisDisponiveis } from "@/lib/store"
import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface VariablePanelProps {
  onInsertVariable: (variavel: string) => void
}

export function VariablePanel({ onInsertVariable }: VariablePanelProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredVariables = variaveisDisponiveis.filter(
    (v) =>
      v.nome_variavel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.descricao.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card className="bg-card h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Variable className="h-4 w-4 text-primary" />
          Variáveis
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar variável..."
            className="pl-9 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            <TooltipProvider>
              {filteredVariables.map((variavel) => (
                <Tooltip key={variavel.id}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onInsertVariable(variavel.nome_variavel)}
                      className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/50 transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge
                          variant="secondary"
                          className="font-mono text-xs bg-primary/10 text-primary"
                        >
                          {`{{${variavel.nome_variavel}}}`}
                        </Badge>
                        <Plus className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {variavel.descricao}
                      </p>
                      {variavel.exemplo && (
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          Ex: {variavel.exemplo}
                        </p>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Clique para inserir</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
            {filteredVariables.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma variável encontrada.
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
