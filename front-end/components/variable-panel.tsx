"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Variable } from "lucide-react"
import { useState } from "react"
import { useVariables } from "@/hooks/use-variables"
import { cn } from "@/lib/utils"

interface VariablePanelProps {
  onInsertVariable: (variavel: string) => void
}

export function VariablePanel({ onInsertVariable }: VariablePanelProps) {
  const [open, setOpen] = useState(false)
  const { variables } = useVariables()

  const handleSelect = (value: string) => {
    onInsertVariable(value)
    setOpen(false)
  }

  return (
    <Card className="bg-card h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Variable className="h-4 w-4 text-primary" />
          Variáveis
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Selecione uma variável para inserir no cursor atual do editor.
        </p>
        <p className="text-xs text-muted-foreground">
          Sintaxe: <span className="font-mono text-primary">{"{{nome_variavel}}"}</span>
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between font-normal"
            >
              Buscar e inserir variável
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-(--radix-popover-trigger-width) p-0"
            side="bottom"
            align="start"
            sideOffset={4}
            avoidCollisions={true}
          >
            <Command>
              <CommandInput placeholder="Buscar variável..." />
              <CommandList>
                <CommandEmpty>Nenhuma variável encontrada.</CommandEmpty>
                <CommandGroup>
                  {variables.map((variable) => (
                    <CommandItem
                      key={variable.id}
                      value={`${variable.variable_name} ${variable.description}`}
                      onSelect={() => handleSelect(variable.variable_name)}
                    >
                      <Check className={cn("h-4 w-4 opacity-0")} />
                      <div className="flex min-w-0 flex-col">
                        <span className="font-mono text-xs text-primary">
                          {`{{${variable.variable_name}}}`}
                        </span>
                        <span className="truncate text-muted-foreground">
                          {variable.description}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  )
}
