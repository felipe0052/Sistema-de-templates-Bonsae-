"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, FileDown, Eye, Printer, Save, UserRound } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/components/store-provider";
import { toast } from "sonner";
import { extractVariables, replaceVariables } from "@/lib/store";
import { escapeHtml, findUnknownVariables, highlightPendingVariables, normalizeTemplateContent } from "@/lib/document-utils";
import { SafeHtmlRenderer } from "@/components/safe-html-renderer";
import type { Assisted, Template, Address } from "@/lib/types";

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
            .replace(/(-\d{1})\d+?$/, "$1");
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

const formatDateFromApi = (value?: string | null) => {
    if (!value) return "";

    const [year, month, day] = value.split("T")[0].split("-");
    if (!year || !month || !day) return value;

    return `${day}/${month}/${year}`;
};

const buildFullAddress = (address?: Address | null): string => {
    if (!address) return "";

    const parts: string[] = [];

    if (address.street_name) {
        let streetPart = address.street_name;
        if (address.number) {
            streetPart += `, ${address.number}`;
        }
        parts.push(streetPart);
    }

    if (address.complement) {
        parts.push(address.complement);
    }

    if (address.neighborhood) {
        parts.push(address.neighborhood);
    }

    const cityStateParts: string[] = [];
    if (address.city) cityStateParts.push(address.city);
    if (address.state) cityStateParts.push(address.state);
    if (cityStateParts.length > 0) {
        parts.push(cityStateParts.join("/"));
    }

    if (address.cep) {
        parts.push(`CEP: ${address.cep}`);
    }

    return parts.join(" - ");
};

const clientFieldMap: Record<string, string> = {
    nome: 'name',
    assistido_nome: 'name',
    nome_assistido: 'name',
    nome_completo: 'name',
    apelido: 'nickname',
    nome_social: 'social_name',
    nome_mae: 'mother_name',
    mae: 'mother_name',
    nome_pai: 'father_name',
    pai: 'father_name',
    tipo_pessoa: 'kind_of_person',
    menor_idade: 'is_under_age',
    cpf: 'cpf',
    cnpj: 'cnpj',
    data_nascimento: 'birth_date',
    nascimento: 'birth_date',
    rg: 'rg',
    orgao_expedidor: 'issuing_body',
    uf_orgao_expedidor: 'uf_issuing_body',
    estado_civil: 'marital_status',
    profissao: 'profession',
    escolaridade: 'education',
    renda_mensal: 'monthly_income',
    numero_dependentes: 'dependents_number',
    nacionalidade: 'nationality',
    naturalidade: 'naturalness',
    telefone: 'telephone',
    celular: 'telephone',
    telefone2: 'telephone2',
    email: 'email',
    email2: 'email2',
    titulo_eleitor: 'voter_registration',
    pis: 'pis',
    descricao: 'description',
    inscricao_estadual: 'state_subscription',
    inscricao_municipal: 'local_subscription',
    porte_empresa: 'size_of_company',
    prioridade: 'priority',
    cidade: 'address.city',
    estado: 'address.state',
    cep: 'address.cep',
    bairro: 'address.neighborhood',
    logradouro: 'address.street_name',
    numero: 'address.number',
    complemento: 'address.complement',
};

const getFieldValue = (obj: Record<string, any>, path: string): any => {
    return path.split('.').reduce((current, key) => {
        if (current == null) return undefined;
        return current[key];
    }, obj);
};

const getAssistidoValueForVariable = (
    varName: string,
    assistido: Assisted,
) => {
    const fieldName = varName.toLowerCase();

    if (fieldName === "endereco") {
        return buildFullAddress(assistido.address);
    }

    const fieldPath = clientFieldMap[fieldName];
    if (!fieldPath) return "";

    const rawValue = getFieldValue(assistido as Record<string, any>, fieldPath);
    if (rawValue == null) return "";

    if (fieldPath === "birth_date") {
        return formatDateFromApi(rawValue);
    }

    if (fieldPath === "monthly_income") {
        return String(rawValue);
    }

    if (fieldPath === "priority") {
        return rawValue ? "Sim" : "Não";
    }

    return String(rawValue);
};

export default function GerarDocumentoPage() {
    const params = useParams();
    const router = useRouter();
    const {
        templates,
        variables: variablesStore,
        addDocument,
        isLoading,
        renderTemplatePdf,
        renderTemplate,
        variableCatalogAvailable,
        assisteds,
    } = useStore();
    const [template, setTemplate] = useState<Template | null>(null);
    const [dados, setDados] = useState<Record<string, string>>({});
    const [variables, setVariables] = useState<string[]>([]);
    const [selectedAssistidoId, setSelectedAssistidoId] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isLoading) return;

        const templateId = params.id as string;
        const foundTemplate = templates.find((t) => t.id === templateId);
        if (foundTemplate) {
            setTemplate(foundTemplate);
            const normalizedContent = normalizeTemplateContent(foundTemplate.content);
            const extractedVars = extractVariables(normalizedContent);
            setVariables(extractedVars);

            // Initialize with current date
            const initialData: Record<string, string> = {
                data_atual: new Date().toLocaleDateString("pt-BR"),
            };
            setDados(initialData);
        }
    }, [params.id, templates, isLoading]);

    const getVariableInfo = (varName: string) => {
        return variablesStore.find((v) => v.variable_name === varName);
    };

    const handleInputChange = (varName: string, value: string) => {
        const formattedValue = formatValue(varName, value);
        setDados((prev) => ({ ...prev, [varName]: formattedValue }));
    };

    const handleAssistidoChange = (assistidoId: string) => {
        setSelectedAssistidoId(assistidoId);

        const assistido = assisteds.find((item) => item.id === assistidoId);
        if (!assistido) return;

        setDados((prev) => {
            const nextData = { ...prev };

            variables.forEach((varName) => {
                const value = getAssistidoValueForVariable(varName, assistido);
                if (value) {
                    nextData[varName] = formatValue(varName, value);
                }
            });

            nextData.data_atual =
                prev.data_atual || new Date().toLocaleDateString("pt-BR");

            return nextData;
        });
    };

    const selectedAssistido = assisteds.find(
        (item) => item.id === selectedAssistidoId,
    );

    const availableVariableNames = variablesStore.map((item) => item.variable_name);
    const unknownVariables = template && variableCatalogAvailable
        ? findUnknownVariables(template.content, availableVariableNames)
        : [];
    const hasUnknownVariables = unknownVariables.length > 0;

    const saveDocument = async () => {
        if (!template) return null;
        return await addDocument({
            template_id: template.id,
            name: `${template.template_name} - ${dados.nome || "Novo Documento"}`,
            data_json: dados,
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

    const handleGeneratePDF = async () => {
        if (!template || hasUnknownVariables) return;

        setIsGenerating(true);

        try {
            const pdfBlob = await renderTemplatePdf(
                template.id,
                dados,
                "underline",
            );

            await saveDocument();

            if (!pdfBlob || pdfBlob.type !== "application/pdf") {
                toast.error("Não foi possível gerar o PDF para download.");
                return;
            }

            const fileNameBase =
                `${template.template_name}-${dados.nome || "documento"}`
                    .toLowerCase()
                    .replace(/[^a-z0-9-_]+/g, "-")
                    .replace(/-+/g, "-")
                    .replace(/^-|-$/g, "");

            const downloadUrl = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `${fileNameBase || "documento"}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            toast.success("PDF baixado com sucesso.");
            router.push("/documentos");
        } catch (_error) {
            toast.error("Erro ao gerar documento via API.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePrint = async () => {
        if (!template || hasUnknownVariables) return;

        setIsGenerating(true);

        try {
            const renderedHtml = await renderTemplate(
                template.id,
                dados,
                "underline",
            );

            if (!renderedHtml) {
                toast.error(
                    "Não foi possível preparar o documento para impressão.",
                );
                return;
            }

            const printWindow = window.open("", "_blank");

            if (!printWindow) {
                toast.error("Não foi possível abrir a janela de impressão.");
                return;
            }

            const printTitle = escapeHtml(template?.template_name || "Documento");
            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${printTitle}</title>
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              font-family: "Times New Roman", serif;
              font-size: 12pt;
              line-height: 1.6;
              color: #000;
              margin: 0;
              padding: 0;
            }
            .document-content {
              max-width: 170mm;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          <div class="document-content">
            ${renderedHtml}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
        </html>
      `);
            printWindow.document.close();
        } catch (_error) {
            toast.error("Erro ao preparar impressão.");
        } finally {
            setIsGenerating(false);
        }
    };

    const processedContent = template
        ? replaceVariables(normalizeTemplateContent(template.content), dados)
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
            subtitle={template.template_name}
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
                            variant="secondary"
                            onClick={handleSaveDocument}
                            disabled={isSaving || isGenerating || hasUnknownVariables}
                        >
                            <Save className="h-4 w-4" />
                            {isSaving ? "Salvando..." : "Salvar Documento"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handlePrint}
                            disabled={isGenerating || hasUnknownVariables}
                        >
                            <Printer className="h-4 w-4" />
                            Imprimir
                        </Button>
                        <Button
                            onClick={handleGeneratePDF}
                            disabled={isGenerating || hasUnknownVariables}
                        >
                            <FileDown className="h-4 w-4" />
                            {isGenerating ? "Gerando..." : "Exportar PDF"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Form */}
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">
                                Preencher Dados
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
                                    <Label
                                        htmlFor="assistido"
                                        className="flex items-center gap-2"
                                    >
                                        <UserRound className="h-4 w-4 text-primary" />
                                        Assistido para autopreenchimento
                                    </Label>
                                    <Select
                                        value={selectedAssistidoId}
                                        onValueChange={handleAssistidoChange}
                                    >
                                        <SelectTrigger
                                            id="assistido"
                                            className="w-full"
                                        >
                                            <SelectValue placeholder="Selecione um assistido" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {assisteds.map((assistido) => (
                                                <SelectItem
                                                    key={assistido.id}
                                                    value={assistido.id}
                                                >
                                                    {assistido.name}
                                                    {assistido.cpf
                                                        ? ` - ${formatValue("cpf", assistido.cpf)}`
                                                        : ""}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {assisteds.length === 0 && (
                                        <p className="text-sm text-muted-foreground">
                                            Nenhum assistido disponível para o seu acesso.
                                        </p>
                                    )}
                                    {selectedAssistido && (
                                        <p className="text-sm text-muted-foreground">
                                            Dados de {selectedAssistido.name} aplicados. Revise e edite os campos abaixo antes de gerar o documento.
                                        </p>
                                    )}
                                        </div>
                                {variables.map((varName) => {
                                    const info = getVariableInfo(varName);
                                    const isSystem = info?.source === 'system';

                                    if (isSystem) {
                                        return (
                                            <div
                                                key={varName}
                                                className="space-y-2"
                                            >
                                                <Label className="flex items-center gap-2">
                                                    <span className="font-mono text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                                        {`{{${varName}}}`}
                                                    </span>
                                                    <span>
                                                        {info?.description || varName}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                        automático
                                                    </span>
                                                </Label>
                                                <div className="h-9 px-3 py-1.5 text-sm rounded-md border border-border bg-muted/30 text-muted-foreground">
                                                    {dados[varName] || (varName === 'endereco' ? 'Selecione um assistido para preencher automaticamente' : '')}
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            key={varName}
                                            className="space-y-2"
                                        >
                                            <Label
                                                htmlFor={varName}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="font-mono text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                                    {`{{${varName}}}`}
                                                </span>
                                                <span>
                                                    {info?.description || varName}
                                                </span>
                                            </Label>
                                            <Input
                                                id={varName}
                                                placeholder={
                                                    info?.example ||
                                                    `Informe ${varName}`
                                                }
                                                value={dados[varName] || ""}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        varName,
                                                        e.target.value,
                                                    )
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
                        </CardContent>
                    </Card>

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
                                {template.background_image && (
                                    <div
                                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                                        style={{
                                            backgroundImage: `url(${template.background_image})`,
                                        }}
                                    />
                                )}
                                <SafeHtmlRenderer
                                    html={highlightPendingVariables(processedContent)}
                                    className="preview-document relative !text-black"
                                    style={{
                                        fontFamily: "Times New Roman, serif",
                                        fontSize: "12pt",
                                        lineHeight: "1.7",
                                        color: "#000000",
                                        padding: "3cm 2.5cm 2.5cm 3cm",
                                    }}
                                />
                            </div>

                            {/* Unfilled variables warning */}
                            {variables.some((v) => !dados[v]) && (
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
