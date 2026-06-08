import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AssistidoSelector } from "./assistido-selector";
import type { Assisted } from "@/lib/types";

interface VariableFormProps {
    variables: string[];
    dados: Record<string, string>;
    variableStore: Array<{
        variable_name: string;
        source?: string;
        description?: string;
        example?: string;
    }>;
    assisteds: Assisted[];
    selectedAssistidoId: string;
    hasToken: boolean;
    onInputChange: (varName: string, value: string) => void;
    onAssistidoChange: (assistidoId: string) => void;
}

export function VariableForm({
    variables,
    dados,
    variableStore,
    assisteds,
    selectedAssistidoId,
    hasToken,
    onInputChange,
    onAssistidoChange,
}: VariableFormProps) {
    const getVariableInfo = (varName: string) => {
        return variableStore.find((v) => v.variable_name === varName);
    };

    return (
        <div className="space-y-4">
            <AssistidoSelector
                assisteds={assisteds}
                selectedAssistidoId={selectedAssistidoId}
                hasToken={hasToken}
                onValueChange={onAssistidoChange}
            />
            {variables.map((varName) => {
                const info = getVariableInfo(varName);
                const isSystem = info?.source === "system";

                if (isSystem) {
                    return (
                        <div key={varName} className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                    {`{{${varName}}}`}
                                </span>
                                <span>{info?.description || varName}</span>
                                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                    automático
                                </span>
                            </div>
                            <div className="h-9 px-3 py-1.5 text-sm rounded-md border border-border bg-muted/30 text-muted-foreground">
                                {dados[varName] ||
                                    (varName === "endereco"
                                        ? "Selecione um assistido para preencher automaticamente"
                                        : "")}
                            </div>
                        </div>
                    );
                }

                return (
                    <div key={varName} className="space-y-2">
                        <Label
                            htmlFor={varName}
                            className="flex items-center gap-2"
                        >
                            <span className="font-mono text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                {`{{${varName}}}`}
                            </span>
                            <span>{info?.description || varName}</span>
                        </Label>
                        <Input
                            id={varName}
                            placeholder={
                                info?.example || `Informe ${varName}`
                            }
                            value={dados[varName] || ""}
                            onChange={(e) =>
                                onInputChange(varName, e.target.value)
                            }
                        />
                    </div>
                );
            })}
            {variables.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                    Este template não possui variáveis.
                </p>
            )}
        </div>
    );
}
