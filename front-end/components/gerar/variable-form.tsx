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
    selectedAssistido,
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
                automaticamente no documento. A edição manual dos dados do
                assistido não está mais disponível nesta tela.
            </div>

            {selectedAssistido && (
                <div className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-background p-4 sm:grid-cols-2">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Nome
                        </p>
                        <p className="text-sm text-foreground">
                            {selectedAssistido.name}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            CPF
                        </p>
                        <p className="text-sm text-foreground">
                            {selectedAssistido.cpf || "Não informado"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
