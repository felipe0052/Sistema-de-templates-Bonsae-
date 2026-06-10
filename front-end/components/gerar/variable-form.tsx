import { AssistidoSelector } from "./assistido-selector";
import type { Assisted } from "@/lib/types";

interface VariableFormProps {
    assisteds: Assisted[];
    selectedAssistidoId: string;
    selectedAssistido?: Assisted;
    hasToken: boolean;
    onAssistidoChange: (assistidoId: string) => void;
}

export function VariableForm({
    assisteds,
    selectedAssistidoId,
    selectedAssistido: _selectedAssistido,
    hasToken,
    onAssistidoChange,
}: VariableFormProps) {
    return (
        <div className="space-y-4">
            <AssistidoSelector
                assisteds={assisteds}
                selectedAssistidoId={selectedAssistidoId}
                hasToken={hasToken}
                onValueChange={onAssistidoChange}
            />

            <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                Ao selecionar um assistido, os dados do cadastro serão aplicados
                automaticamente no documento.
            </div>
        </div>
    );
}
