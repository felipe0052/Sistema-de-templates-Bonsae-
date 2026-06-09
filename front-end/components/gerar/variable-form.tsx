import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AssistidoSelector } from "./assistido-selector"
import type { Assisted } from "@/lib/types"

interface VariableFormProps {
  variables: string[]
  dados: Record<string, string>
  variableStore: Array<{ variable_name: string; source?: string; description?: string; example?: string }>
  assisteds: Assisted[]
  selectedAssistidoId: string
  hasToken: boolean
  onInputChange: (varName: string, value: string) => void
  onAssistidoChange: (assistidoId: string) => void
}

const SYSTEM_PLACEHOLDERS: Record<string, string> = {
  endereco: "Será preenchido ao selecionar um assistido",
}

function VariableTag({ varName }: { varName: string }) {
  return (
    <span className="font-mono text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
      {`{{${varName}}}`}
    </span>
  )
}

function SystemVariableField({ varName, info, value }: { varName: string; info?: { description?: string }; value: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <VariableTag varName={varName} />
        <span>{info?.description || varName}</span>
        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">automático</span>
      </div>
      <div className="h-9 px-3 py-1.5 text-sm rounded-md border border-border bg-muted/30 text-muted-foreground">
        {value || SYSTEM_PLACEHOLDERS[varName] || ""}
      </div>
    </div>
  )
}

function ManualVariableField({ varName, info, value, onChange }: { varName: string; info?: { description?: string; example?: string }; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={varName} className="flex items-center gap-2">
        <VariableTag varName={varName} />
        <span>{info?.description || varName}</span>
      </Label>
      <Input
        id={varName}
        placeholder={info?.example || `Informe ${varName}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export function VariableForm({ variables, dados, variableStore, assisteds, selectedAssistidoId, hasToken, onInputChange, onAssistidoChange }: VariableFormProps) {
  const getVariableInfo = (varName: string) => variableStore.find((v) => v.variable_name === varName)

  return (
    <div className="space-y-4">
      <AssistidoSelector assisteds={assisteds} selectedAssistidoId={selectedAssistidoId} hasToken={hasToken} onValueChange={onAssistidoChange} />
      {variables.map((varName) => {
        const info = getVariableInfo(varName)
        const isSystem = info?.source === "system"
        return isSystem ? (
          <SystemVariableField key={varName} varName={varName} info={info} value={dados[varName] || ""} />
        ) : (
          <ManualVariableField key={varName} varName={varName} info={info} value={dados[varName] || ""} onChange={(v) => onInputChange(varName, v)} />
        )
      })}
      {variables.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">Este template não possui variáveis.</p>
      )}
    </div>
  )
}
