"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileDown, Eye, Printer, Save } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/components/store-provider";
import { toast } from "sonner";
import { extrairVariaveis, substituirVariaveis } from "@/lib/store";
import { findUnknownVariables, normalizeTemplateContent } from "@/lib/document-utils";
import type { Template } from "@/lib/types";

// Função auxiliar para formatação
const formatValue = (varName: string, value: string) => {
    if (!value) return "";

    const nomeLower = varName.toLowerCase();

    if (nomeLower.includes("cpf")) {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})/, "$1-$2")
            .replace(/(-\d{2})\d+?$/, "$1");
    }

    if (nomeLower.includes("rg")) {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1})/, "$1-$2")
            .replace(/(-\d{1})\d+?$/, "$1"); // RG formato: 12.345.678-9 (pode variar, mas tenta um padrão)
    }

    if (nomeLower.includes("cep")) {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .replace(/(-\d{3})\d+?$/, "$1");
    }

    if (nomeLower.includes("telefone") || nomeLower.includes("celular")) {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4,5})(\d{4})$/, "$1-$2");
    }

    if (nomeLower.includes("data")) {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "$1/$2")
            .replace(/(\d{2})(\d)/, "$1/$2")
            .replace(/(\d{4})\d+?$/, "$1");
    }

    return value;
};

export default function GerarDocumentoPage() {
    const params = useParams();
    const router = useRouter();
    const {
        templates,
        variaveis: variaveisStore,
        addDocumento,
        isLoading,
    } = useStore();
    const previewRef = useRef<HTMLDivElement>(null);
    const [template, setTemplate] = useState<Template | null>(null);
    const [dados, setDados] = useState<Record<string, string>>({});
    const [variaveis, setVariaveis] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isLoading) return;

        const templateId = params.id as string;
        const foundTemplate = templates.find((t) => t.id === templateId);
        if (foundTemplate) {
            setTemplate(foundTemplate);
            const normalizedContent = normalizeTemplateContent(foundTemplate.conteudo);
            const extractedVars = extrairVariaveis(normalizedContent);
            setVariaveis(extractedVars);

            // Initialize with current date
            const initialData: Record<string, string> = {
                data_atual: new Date().toLocaleDateString("pt-BR"),
            };
            setDados(initialData);
        }
    }, [params.id, templates, isLoading]);

    const getVariableInfo = (varName: string) => {
        return variaveisStore.find((v) => v.nome === varName);
    };

    const handleInputChange = (varName: string, value: string) => {
        const formattedValue = formatValue(varName, value);
        setDados((prev) => ({ ...prev, [varName]: formattedValue }));
    };

    const availableVariableNames = (variaveisStore || []).map((item) => item.nome);
    const unknownVariables = template
        ? findUnknownVariables(template.conteudo, availableVariableNames)
        : [];
    const hasUnknownVariables = unknownVariables.length > 0;

    const saveDocument = async () => {
        if (!template) return null;
        return await addDocumento({
            template_id: template.id,
            dados_variaveis: dados,
            status: 'concluído'
        });
    };

    const handleSaveDocument = async () => {
        if (!template || hasUnknownVariables) return;
        setIsSaving(true);
        try {
            const saved = await saveDocument();
            if (!saved) {
                toast.error("Não foi possível salvar o documento.");
                return;
            }
            toast.success("Documento salvo com sucesso.");
            router.push("/documentos");
        } catch (_error) {
            toast.error("Erro ao salvar documento.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePrint = () => {
        if (!template) return;
        window.print();
    };

    const processedContent = template
        ? substituirVariaveis(normalizeTemplateContent(template.conteudo), dados)
        : "";

    if (!template) {
        return (
            <DashboardLayout title="Template não encontrado" subtitle="">
                <div className="text-center py-12">
                    <p className="text-muted-foreground">
                        Template não encontrado.
                    </p>
                    <Button className="mt-4" asChild>
                        <Link href="/templates">
                            <ArrowLeft className="h-4 w-4" />
                            Voltar aos templates
                        </Link>
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            title="Gerar Documento"
            subtitle={template.nome}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Button variant="ghost" asChild>
                        <Link href="/templates">
                            <ArrowLeft className="h-4 w-4" />
                            Voltar
                        </Link>
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handlePrint}
                            disabled={isGenerating || hasUnknownVariables}
                        >
                            <Printer className="h-4 w-4 mr-2" />
                            Imprimir
                        </Button>
                        <Button
                            onClick={handleSaveDocument}
                            disabled={isSaving || isGenerating || hasUnknownVariables}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {isSaving ? "Salvando..." : "Salvar no Sistema"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Side */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Preencha os Dados
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {variaveis.length === 0 ? (
                                    <p className="text-sm text-muted-foreground py-4">
                                        Nenhuma variável encontrada neste template.
                                    </p>
                                ) : (
                                    variaveis.map((v) => {
                                        const info = getVariableInfo(v);
                                        return (
                                            <div key={v} className="space-y-2">
                                                <Label htmlFor={v}>
                                                    {info?.label || v}
                                                </Label>
                                                <Input
                                                    id={v}
                                                    placeholder={info?.label || v}
                                                    value={dados[v] || ""}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            v,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                {info?.tipo && (
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                                        Tipo: {info.tipo}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Preview */}
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Eye className="h-4 w-4 text-primary" />
                                Preview do Documento
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="relative mx-auto bg-white shadow-lg rounded-sm overflow-hidden border border-border"
                                style={{
                                    width: "100%",
                                    maxHeight: "600px",
                                    overflowY: "auto",
                                }}
                            >
                                {template.imagem_fundo && (
                                    <div
                                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                                        style={{
                                            backgroundImage: `url(${template.imagem_fundo})`,
                                        }}
                                    />
                                )}
                                <div
                                    ref={previewRef}
                                    className="preview-document relative !text-black"
                                    style={{
                                        fontFamily: "Times New Roman, serif",
                                        fontSize: "12pt",
                                        lineHeight: "1.7",
                                        color: "#000000",
                                        padding: "3cm 2.5cm 2.5cm 3cm",
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: processedContent.replace(
                                            /{{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*}}/g,
                                            '<span style="background-color: #fee2e2; color: #991b1b; padding: 0 4px; border-radius: 4px; font-family: monospace; font-size: 0.75rem;">{{$1}}</span>',
                                        ),
                                    }}
                                />
                            </div>

                            {/* Unfilled variables warning */}
                            {variaveis.some((v) => !dados[v]) && (
                                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-sm text-amber-800">
                                        Existem variáveis não preenchidas.
                                        Preencha todos os campos para gerar o
                                        documento completo.
                                    </p>
                                </div>
                            )}
                            {hasUnknownVariables && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-800">
                                        O template contém variáveis que não existem no sistema:{" "}
                                        <span className="font-mono">
                                            {unknownVariables.map((v) => `{{${v}}}`).join(", ")}
                                        </span>
                                        . Corrija antes de salvar/exportar.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <style jsx>{`
                    :global(.preview-document p) {
                        margin: 0 0 12pt 0;
                        text-indent: 1.25cm;
                    }

                    :global(.preview-document h1),
                    :global(.preview-document h2),
                    :global(.preview-document h3),
                    :global(.preview-document h4),
                    :global(.preview-document h5),
                    :global(.preview-document h6) {
                        margin: 0 0 12pt 0;
                        text-indent: 0;
                        text-align: center;
                    }

                    :global(.preview-document ul),
                    :global(.preview-document ol) {
                        margin: 0 0 12pt 1.2cm;
                        padding: 0;
                        text-indent: 0;
                    }

                    :global(.preview-document ul) {
                        list-style: disc outside;
                    }

                    :global(.preview-document ol) {
                        list-style: decimal outside;
                    }

                    :global(.preview-document li) {
                        margin: 0 0 6pt 0;
                    }
                `}</style>
            </div>
        </DashboardLayout>
    );
}
