"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { LetterheadUpload } from "@/components/letterhead-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVariables } from "@/hooks/use-variables";
import { toast } from "sonner";
import { findUnknownVariables } from "@/lib/document-utils";
import type { Template } from "@/lib/types";
import { EditorTab } from "./template-form/editor-tab";
import { PreviewTab } from "./template-form/preview-tab";
import { LoadingSkeleton } from "./template-form/loading-skeleton";
import { FormToolbar } from "./template-form/form-toolbar";
import { InfoCard } from "./template-form/info-card";

interface TemplateFormProps {
    mode: "create" | "edit";
    template?: Template | null;
    isLoading?: boolean;
    onSave: (values: {
        template_name: string;
        category: string;
        content: string;
        background_image?: string | null;
    }) => Promise<void>;
    title: string;
    subtitle?: string;
}

export function TemplateForm({
    mode,
    template,
    isLoading = false,
    onSave,
    title,
    subtitle,
}: TemplateFormProps) {
    const { variables, variableCatalogAvailable } = useVariables();
    const supportedVariables = variables.filter(
        (item) => item.source !== "manual",
    );
    const [templateName, setTemplateName] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    const [letterhead, setLetterhead] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("editor");
    const [isSaving, setIsSaving] = useState(false);

    const unknownVariables = variableCatalogAvailable
        ? findUnknownVariables(
              content,
              supportedVariables.map((item) => item.variable_name),
          )
        : [];
    const hasUnknownVariables = unknownVariables.length > 0;

    useEffect(() => {
        if (mode === "edit" && template) {
            setTemplateName(template.template_name);
            setCategory(template.category || "");
            setContent(template.content);
            setLetterhead(template.background_image || null);
        }
    }, [mode, template]);

    const handleSave = async () => {
        if (!templateName.trim()) {
            toast.error("Por favor, informe o nome do template.");
            return;
        }
        if (!content.trim()) {
            toast.error("Por favor, adicione conteúdo ao template.");
            return;
        }
        if (hasUnknownVariables) {
            toast.error(
                "Existem variáveis inválidas no template. Corrija antes de salvar.",
            );
            return;
        }

        setIsSaving(true);
        try {
            await onSave({
                template_name: templateName,
                category: category || "Outros",
                content,
                background_image: letterhead,
            });
            toast.success(
                mode === "create"
                    ? "Template salvo com sucesso!"
                    : "Template atualizado com sucesso!",
            );
        } catch (_error) {
            toast.error(
                mode === "create"
                    ? "Erro ao salvar template."
                    : "Erro ao atualizar template.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <LoadingSkeleton title={title} />;
    }

    return (
        <DashboardLayout title={title} subtitle={subtitle}>
            <div className="space-y-6">
                <FormToolbar
                    mode={mode}
                    template={template}
                    isSaving={isSaving}
                    hasUnknownVariables={hasUnknownVariables}
                    onPreview={() => setActiveTab("preview")}
                    onSave={handleSave}
                />
                <InfoCard
                    templateName={templateName}
                    setTemplateName={setTemplateName}
                    category={category}
                    setCategory={setCategory}
                />
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                        <TabsTrigger value="editor">Editor</TabsTrigger>
                        <TabsTrigger value="letterhead">
                            Papel Timbrado
                        </TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="editor" className="mt-4">
                        <EditorTab
                            content={content}
                            setContent={setContent}
                            variables={supportedVariables}
                            variableCatalogAvailable={variableCatalogAvailable}
                            hasUnknownVariables={hasUnknownVariables}
                            unknownVariables={unknownVariables}
                        />
                    </TabsContent>
                    <TabsContent value="letterhead" className="mt-4">
                        <LetterheadUpload
                            value={letterhead}
                            onChange={setLetterhead}
                        />
                    </TabsContent>
                    <TabsContent value="preview" className="mt-4">
                        <PreviewTab content={content} letterhead={letterhead} />
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
