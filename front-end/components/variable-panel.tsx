"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Variable } from "lucide-react"
import { useState } from "react"
import { useStore } from "@/components/store-provider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface VariablePanelProps {
  onInsertVariable: (variavel: string) => void
}

export function VariablePanel({ onInsertVariable }: VariablePanelProps) {
  const [selectedVariable, setSelectedVariable] = useState<string | undefined>(undefined)
  const { variaveis } = useStore()

  const handleValueChange = (value: string) => {
    onInsertVariable(value)
    setSelectedVariable(undefined)
  }

  return (
    <Card className="bg-card h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Variable className="h-4 w-4 text-primary" />
          Variáveis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <Select value={selectedVariable} onValueChange={handleValueChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Inserir variável" />
          </SelectTrigger>
          <SelectContent>
            {variaveis.map((variavel) => (
              <SelectItem key={variavel.id} value={variavel.nome_variavel}>
                {`{{${variavel.nome_variavel}}}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Selecione uma variável para inserir no cursor atual do editor.
        </p>
        <p className="text-xs text-muted-foreground">
          Sintaxe: <span className="font-mono text-primary">{"{{nome_variavel}}"}</span>
        </p>
      </CardContent>
    </Card>
  )
}
