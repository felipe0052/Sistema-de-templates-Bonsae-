"use client";

import { useState, useEffect, useCallback } from "react";
import type {
    Template,
    Document,
    Variable,
    Client,
    Assisted,
    StaticVariableApiResponse,
} from "@/lib/types";
import { availableVariables as fallbackVariables } from "@/lib/store";

const API_BASE_URL = "http://127.0.0.1:8000/api";
const LOCAL_STORAGE_KEY = "bonsae_templates_local";
const AUTH_TOKEN_KEY = "bonsae_auth_token";

type LegacyTemplate = Partial<Template> & {
    nome_template?: string;
    conteudo?: string;
    categoria?: string;
    cliente_id?: string;
    imagem_fundo?: string;
};

function getApiBaseUrl(): string {
    return (
        process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || API_BASE_URL
    );
}

function mapApiVariable(variable: StaticVariableApiResponse): Variable {
    return {
        id: String(variable.id),
        variable_name: variable.name,
        description: variable.description,
        example: variable.example || "",
        source: variable.source || "manual",
    };
}

export function useApiStore() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [variables, setVariables] = useState<Variable[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [assisteds, setAssisteds] = useState<Assisted[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [variableCatalogAvailable, setVariableCatalogAvailable] =
        useState(false);
    const [token, setTokenState] = useState<string | null>(() => {
        if (typeof window === "undefined") {
            return null;
        }

        return localStorage.getItem(AUTH_TOKEN_KEY);
    });
    const apiBaseUrl = getApiBaseUrl();

    const setToken = useCallback((value: string | null) => {
        setTokenState(value);

        if (typeof window === "undefined") {
            return;
        }

        if (value) {
            localStorage.setItem(AUTH_TOKEN_KEY, value);
            return;
        }

        localStorage.removeItem(AUTH_TOKEN_KEY);
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            const normalized = parsed.map((t: any) => ({
                id: t.id,
                template_name: t.template_name || t.nome_template || "",
                content: t.content || t.conteudo || "",
                category: t.category || t.categoria || "General",
                client_id: t.client_id || t.cliente_id || "1",
                created_at: t.created_at || "",
                updated_at: t.updated_at || "",
                background_image: t.background_image || t.imagem_fundo,
            }));
            setTemplates(normalized);
        }
    }, []);

    const fetchVariables = async (search?: string) => {
        const query = search ? `?search=${encodeURIComponent(search)}` : "";
        const response = await fetch(`${apiBaseUrl}/variables${query}`, {
            headers: { Accept: "application/json" },
        });

        if (!response.ok) {
            throw new Error(
                `Variables sync failed with status ${response.status}`,
            );
        }

        const variablesData = await response.json();
        const mappedVariables: Variable[] = (variablesData.data || []).map(
            mapApiVariable,
        );
        setVariables(mappedVariables);
        setVariableCatalogAvailable(true);

        return mappedVariables;
    };

    useEffect(() => {
        const syncVariables = async () => {
            try {
                await fetchVariables();
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : String(error);
                console.warn(`Variables sync skipped: ${message}`);

                if (variables.length === 0) {
                    setVariables(fallbackVariables);
                }
            } finally {
                setIsLoading(false);
            }
        };

        syncVariables();
    }, [apiBaseUrl]);

    const fetchAssisteds = useCallback(async (search?: string) => {
        if (!token) return;

        const query = search ? `?search=${encodeURIComponent(search)}` : "";
        try {
            const response = await fetch(`${apiBaseUrl}/assisteds${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                const assistedsData = await response.json();
                const mappedAssisteds: Assisted[] = (
                    assistedsData.data || []
                ).map((assisted: any) => ({
                    ...assisted,
                    id: String(assisted.id),
                    address: assisted.address
                        ? {
                              ...assisted.address,
                              id: String(assisted.address.id),
                          }
                        : null,
                }));

                setAssisteds(mappedAssisteds);
                setClients(
                    mappedAssisteds.map((assisted) => ({
                        id: assisted.id,
                        name: assisted.name,
                        email: assisted.email || "",
                        organization: "Assisted",
                        created_at:
                            assisted.created_at || new Date().toISOString(),
                        address: assisted.address || null,
                    })),
                );
            }
        } catch (_error) {
            console.error("Sync failed");
        }
    }, [token, apiBaseUrl]);

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                return;
            }

            try {
                const [templatesRes, documentsRes] = await Promise.all([
                    fetch(`${apiBaseUrl}/templates`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    }),
                    fetch(`${apiBaseUrl}/documents`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    }),
                ]);

                if (templatesRes.ok) {
                    const templatesData = await templatesRes.json();
                    const mappedTemplates: Template[] = (
                        templatesData.data || []
                    ).map((t: any) => ({
                        id: String(t.id),
                        template_name: t.title,
                        content: t.content,
                        category: t.metadata?.category || "General",
                        client_id: String(t.tenant_id || "1"),
                        created_at: t.created_at,
                        updated_at: t.updated_at,
                        background_image: t.background_image_url,
                    }));

                    setTemplates((prev) => {
                        const merged = [...mappedTemplates];
                        prev.forEach((p) => {
                            const legacyTemplate = p as LegacyTemplate;
                            if (!merged.find((m) => m.id === p.id)) {
                                merged.push({
                                    id: legacyTemplate.id || "",
                                    template_name: legacyTemplate.template_name || legacyTemplate.nome_template || "",
                                    content: legacyTemplate.content || legacyTemplate.conteudo || "",
                                    category: legacyTemplate.category || legacyTemplate.categoria || "General",
                                    client_id: legacyTemplate.client_id || legacyTemplate.cliente_id || "1",
                                    created_at: legacyTemplate.created_at || "",
                                    updated_at: legacyTemplate.updated_at || "",
                                    background_image: legacyTemplate.background_image || legacyTemplate.imagem_fundo,
                                });
                            }
                        });
                        localStorage.setItem(
                            LOCAL_STORAGE_KEY,
                            JSON.stringify(merged),
                        );
                        return merged;
                    });
                }

                if (documentsRes.ok) {
                    const documentsData = await documentsRes.json();
                    const mappedDocuments: Document[] = (
                        documentsData.data || []
                    ).map((d: any) => ({
                        id: String(d.id),
                        template_id: String(d.template_id),
                        name: d.name,
                        data_json: d.data_json,
                        created_at: d.created_at,
                    }));
                    setDocuments(mappedDocuments);
                }

                await fetchAssisteds();
            } catch (_error) {
                console.error("Sync failed");
            }
        };

        fetchData();
    }, [token, apiBaseUrl, fetchAssisteds]);

    const addTemplate = async (
        template: Omit<Template, "id" | "created_at" | "updated_at">,
    ) => {
        const tempId = "temp_" + Math.random().toString(36).substr(2, 9);
        const newTemplate: Template = {
            ...template,
            id: tempId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        setTemplates((prev) => {
            const updated = [newTemplate, ...prev];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });

        if (token) {
            try {
                const response = await fetch(`${apiBaseUrl}/templates`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        title: template.template_name,
                        content: template.content,
                        visibility: "public",
                        metadata: { category: template.category },
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setTemplates((prev) => {
                        const updated = prev.map((t) =>
                            t.id === tempId
                                ? {
                                      ...t,
                                      id: String(data.id),
                                      client_id: String(data.tenant_id),
                                  }
                                : t,
                        );
                        localStorage.setItem(
                            LOCAL_STORAGE_KEY,
                            JSON.stringify(updated),
                        );
                        return updated;
                    });
                }
            } catch (_error) {
                console.error(
                    "Background sync failed, template remains local.",
                );
            }
        }

        return newTemplate;
    };

    const addDocument = async (doc: Omit<Document, "id" | "created_at">) => {
        if (!token) return;

        try {
            const response = await fetch(`${apiBaseUrl}/documents`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    template_id: doc.template_id,
                    name: doc.name,
                    data_json: doc.data_json,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const newDoc: Document = {
                    id: String(data.id),
                    template_id: String(data.template_id),
                    name: data.name,
                    data_json: data.data_json,
                    created_at: data.created_at,
                };
                setDocuments((prev) => [newDoc, ...prev]);
                return newDoc;
            }
        } catch (_error) {
            console.error("Failed to save document");
        }
    };

    const updateTemplate = async (id: string, updates: Partial<Template>) => {
        setTemplates((prev) => {
            const updated = prev.map((t) =>
                t.id === id ? { ...t, ...updates } : t,
            );
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });

        if (token && !id.startsWith("temp_")) {
            try {
                await fetch(`${apiBaseUrl}/templates/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        title: updates.template_name,
                        content: updates.content,
                        metadata: updates.category
                            ? { category: updates.category }
                            : undefined,
                    }),
                });
            } catch (_e) {
                console.error("Failed to update template");
            }
        }
    };

    const deleteTemplate = async (id: string) => {
        setTemplates((prev) => {
            const updated = prev.filter((t) => t.id !== id);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });

        if (token && !id.startsWith("temp_")) {
            try {
                await fetch(`${apiBaseUrl}/templates/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch (_e) {
                console.error("Failed to delete template");
            }
        }
    };

    const renderTemplate = async (
        templateId: string,
        vars: Record<string, string>,
        behavior: "blank" | "underline" = "blank",
    ) => {
        if (token && !templateId.startsWith("temp_")) {
            try {
                const response = await fetch(
                    `${apiBaseUrl}/templates/${templateId}/render`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            variables: vars,
                            missing_variable_behavior: behavior,
                            format: "html",
                        }),
                    },
                );
                const data = await response.json();
                return data.html;
            } catch (_error) {
                return null;
            }
        }
        return null;
    };

    const renderTemplatePdf = async (
        templateId: string,
        vars: Record<string, string>,
        behavior: "blank" | "underline" = "blank",
    ) => {
        if (!token || templateId.startsWith("temp_")) {
            return null;
        }

        try {
            const response = await fetch(
                `${apiBaseUrl}/templates/${templateId}/render`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        Accept: "application/pdf, application/json",
                    },
                    body: JSON.stringify({
                        variables: vars,
                        missing_variable_behavior: behavior,
                        format: "pdf",
                    }),
                },
            );

            if (!response.ok) {
                return null;
            }

            const contentType = response.headers.get("content-type") || "";

            if (contentType.includes("application/pdf")) {
                return await response.blob();
            }

            const data = await response.json().catch(() => null);
            if (data?.html) {
                const htmlBlob = new Blob([data.html], {
                    type: "text/html;charset=utf-8",
                });
                return htmlBlob;
            }

            return null;
        } catch (_error) {
            return null;
        }
    };

    const addVariable = async (variable: Omit<Variable, "id">) => {
        if (!token) {
            throw new Error("Autenticação necessária para criar variáveis.");
        }

        const response = await fetch(`${apiBaseUrl}/variables`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: JSON.stringify({
                name: variable.variable_name.trim().toLowerCase(),
                description: variable.description.trim(),
                example: variable.example?.trim() || undefined,
            }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const message =
                data?.errors?.name?.[0] ||
                data?.message ||
                "Não foi possível criar a variável.";
            throw new Error(message);
        }

        const created = mapApiVariable(data as StaticVariableApiResponse);
        setVariables((prev) =>
            [...prev, created].sort((a, b) =>
                a.variable_name.localeCompare(b.variable_name),
            ),
        );

        return created;
    };

    const updateVariable = async (
        id: string,
        variable: Omit<Variable, "id">,
    ) => {
        if (!token) {
            throw new Error("Autenticação necessária para editar variáveis.");
        }

        const response = await fetch(`${apiBaseUrl}/variables/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: JSON.stringify({
                name: variable.variable_name.trim().toLowerCase(),
                description: variable.description.trim(),
                example: variable.example?.trim() || undefined,
            }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const message =
                data?.errors?.name?.[0] ||
                data?.message ||
                "Não foi possível atualizar a variável.";
            throw new Error(message);
        }

        const updated = mapApiVariable(data as StaticVariableApiResponse);
        setVariables((prev) =>
            prev
                .map((item) => (item.id === id ? updated : item))
                .sort((a, b) => a.variable_name.localeCompare(b.variable_name)),
        );

        return updated;
    };

    const deleteVariable = async (id: string) => {
        if (!token) {
            throw new Error("Autenticação necessária para excluir variáveis.");
        }

        const response = await fetch(`${apiBaseUrl}/variables/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Não foi possível excluir a variável.");
        }

        setVariables((prev) => prev.filter((item) => item.id !== id));
    };

    return {
        templates,
        documents,
        variables,
        variableCatalogAvailable,
        clients,
        assisteds,
        isLoading,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        renderTemplate,
        renderTemplatePdf,
        addVariable,
        updateVariable,
        addDocument,
        token,
        setAuthToken: setToken,
        clearAuthToken: () => setToken(null),
        deleteDocument: async (id: string) => {
            if (!token) return;
            try {
                const response = await fetch(`${apiBaseUrl}/documents/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    setDocuments((prev) => prev.filter((d) => d.id !== id));
                }
            } catch (_error) {
                console.error("Failed to delete document");
            }
        },
        deleteVariable,
        addClient: (_client: Omit<Client, "id" | "created_at">) => {},
        fetchAssisteds,
    };
}
