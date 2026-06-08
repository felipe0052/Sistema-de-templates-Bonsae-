import { UserRound } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { formatValue } from "@/lib/template-helpers";
import type { Assisted } from "@/lib/types";

interface AssistidoSelectorProps {
    assisteds: Assisted[];
    selectedAssistidoId: string;
    hasToken: boolean;
    onValueChange: (assistidoId: string) => void;
}

export function AssistidoSelector({
    assisteds,
    selectedAssistidoId,
    hasToken,
    onValueChange,
}: AssistidoSelectorProps) {
    const selectedAssistido = assisteds.find(
        (item) => item.id === selectedAssistidoId,
    );

    return (
        <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
            <Label htmlFor="assistido" className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-primary" />
                Assistido para autopreenchimento
            </Label>
            <Select value={selectedAssistidoId} onValueChange={onValueChange}>
                <SelectTrigger id="assistido" className="w-full">
                    <SelectValue placeholder="Selecione um assistido" />
                </SelectTrigger>
                <SelectContent>
                    {assisteds.map((assistido) => (
                        <SelectItem key={assistido.id} value={assistido.id}>
                            {assistido.name}
                            {assistido.cpf
                                ? ` - ${formatValue("cpf", assistido.cpf)}`
                                : ""}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {!hasToken && (
                <p className="text-sm text-muted-foreground">
                    Faça login para carregar assistidos.
                </p>
            )}
            {hasToken && assisteds.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    Nenhum assistido disponível para o seu acesso.
                </p>
            )}
            {selectedAssistido && (
                <p className="text-sm text-muted-foreground">
                    Dados de {selectedAssistido.name} aplicados. Revise e edite
                    os campos abaixo antes de gerar o documento.
                </p>
            )}
        </div>
    );
}
