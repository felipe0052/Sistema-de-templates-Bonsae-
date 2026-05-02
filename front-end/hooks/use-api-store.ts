"use client";

import { useState, useEffect } from "react";
import type {
    Template,
    Documento,
    Variavel,
    Cliente,
    StaticVariableApiResponse,
} from "@/lib/types";

const API_BASE_URL = "http://127.0.0.1:8000/api";
const LOCAL_STORAGE_KEY = "bonsae_templates_local";

function getApiBaseUrl(): string {
    return (
        process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || API_BASE_URL
    );
}

function mapApiVariable(variable: StaticVariableApiResponse): Variavel {
    return {
        id: String(variable.id),
        nome_variavel: variable.name,
        descricao: variable.description,
        exemplo: variable.example || "",
    };
}

export function useApiStore() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [variaveis, setVariaveis] = useState<Variavel[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [variableCatalogAvailable, setVariableCatalogAvailable] =
        useState(false);
    const [token, setToken] = useState<string | null>(null);
    const apiBaseUrl = getApiBaseUrl();

    // 1. Carregar do LocalStorage imediatamente para garantir que o usuário veja algo
    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            setTemplates(JSON.parse(saved));
        }
    }, []);

    // 2. Login automático no background
    useEffect(() => {
        const login = async () => {
            const tryLogin = async (path: string, options?: RequestInit) => {
                const response = await fetch(`${apiBaseUrl}${path}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    ...options,
                });

                if (!response.ok) {
                    throw new Error(`Login failed for ${path}`);
                }

                return response.json();
            };

            try {
                const data = await tryLogin("/login", {
                    body: JSON.stringify({
                        email: "admin@instituicao.com",
                        password: "password",
                    }),
                });

                if (data.access_token) {
                    setToken(data.access_token);
                    return;
                }
            } catch (_error) {
                try {
                    const adminModeData = await tryLogin("/admin-mode/login");

                    if (adminModeData.access_token) {
                        setToken(adminModeData.access_token);
                        return;
                    }
                } catch (_adminModeError) {
                    console.warn("API Login failed, using local mode only.");
                }
            }
        };
        login();
    }, [apiBaseUrl]);

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
        const mappedVariables: Variavel[] = (variablesData.data || []).map(
            mapApiVariable,
        );
        setVariaveis(mappedVariables);
        setVariableCatalogAvailable(true);

        return mappedVariables;
    };

    // 3. Sincronizar variáveis públicas sempre que possível
    useEffect(() => {
        const syncVariables = async () => {
            try {
                await fetchVariables();
            } catch (error) {
                // In offline/local mode, failing to sync public variables should not break app bootstrap.
                const message =
                    error instanceof Error ? error.message : String(error);
                console.warn(`Variables sync skipped: ${message}`);
            } finally {
                setIsLoading(false);
            }
        };

        syncVariables();
    }, [apiBaseUrl]);

    // 4. Sincronizar templates e documentos com o Banco de Dados (API) se disponível
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
                        nome_template: t.title,
                        conteudo: t.content,
                        categoria: t.metadata?.categoria || "Geral",
                        cliente_id: String(t.tenant_id || "1"),
                        created_at: t.created_at,
                        updated_at: t.updated_at,
                        background_image_url: t.background_image_url,
                    }));

                    setTemplates((prev) => {
                        const merged = [...mappedTemplates];
                        prev.forEach((p) => {
                            if (!merged.find((m) => m.id === p.id)) {
                                merged.push(p);
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
                    const mappedDocuments: Documento[] = (
                        documentsData.data || []
                    ).map((d: any) => ({
                        id: String(d.id),
                        template_id: String(d.template_id),
                        nome: d.name,
                        dados_json: d.data_json,
                        created_at: d.created_at,
                    }));
                    setDocumentos(mappedDocuments);
                }
            } catch (_error) {
                console.error("Sync failed");
            }
        };

        fetchData();
    }, [token, apiBaseUrl]);

    const addTemplate = async (
        template: Omit<Template, "id" | "created_at" | "updated_at">,
    ) => {
        // SALVAR NO FRONT-END PRIMEIRO (Imediato)
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

        // TENTAR SALVAR NO BACK-END (Background)
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
                        title: template.nome_template,
                        content: template.conteudo,
                        visibility: "public",
                        metadata: { categoria: template.categoria },
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    // Atualizar o ID temporário pelo ID real do banco
                    setTemplates((prev) => {
                        const updated = prev.map((t) =>
                            t.id === tempId
                                ? {
                                      ...t,
                                      id: String(data.id),
                                      cliente_id: String(data.tenant_id),
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

    const addDocumento = async (doc: Omit<Documento, "id" | "created_at">) => {
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
                    name: doc.nome,
                    data_json: doc.dados_json,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const newDoc: Documento = {
                    id: String(data.id),
                    template_id: String(data.template_id),
                    nome: data.name,
                    dados_json: data.data_json,
                    created_at: data.created_at,
                };
                setDocumentos((prev) => [newDoc, ...prev]);
                return newDoc;
            }
        } catch (_error) {
            console.error("Failed to save document");
        }
    };

    const updateTemplate = async (id: string, updates: Partial<Template>) => {
        // Atualiza local primeiro
        setTemplates((prev) => {
            const updated = prev.map((t) =>
                t.id === id ? { ...t, ...updates } : t,
            );
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });

        // Tenta API
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
                        title: updates.nome_template,
                        content: updates.conteudo,
                        metadata: updates.categoria
                            ? { categoria: updates.categoria }
                            : undefined,
                    }),
                });
            } catch (_e) {}
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
            } catch (_e) {}
        }
    };

    const renderTemplate = async (
        templateId: string,
        variables: Record<string, string>,
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
                            variables,
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
        variables: Record<string, string>,
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
                        variables,
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

    const addVariavel = async (variavel: Omit<Variavel, "id">) => {
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
                name: variavel.nome_variavel.trim().toLowerCase(),
                description: variavel.descricao.trim(),
                example: variavel.exemplo?.trim() || undefined,
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
        setVariaveis((prev) =>
            [...prev, created].sort((a, b) =>
                a.nome_variavel.localeCompare(b.nome_variavel),
            ),
        );

        return created;
    };

    const updateVariavel = async (
        id: string,
        variavel: Omit<Variavel, "id">,
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
                name: variavel.nome_variavel.trim().toLowerCase(),
                description: variavel.descricao.trim(),
                example: variavel.exemplo?.trim() || undefined,
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
        setVariaveis((prev) =>
            prev
                .map((item) => (item.id === id ? updated : item))
                .sort((a, b) => a.nome_variavel.localeCompare(b.nome_variavel)),
        );

        return updated;
    };

    const deleteVariavel = async (id: string) => {
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

        setVariaveis((prev) => prev.filter((item) => item.id !== id));
    };

    return {
        templates,
        documentos,
        variaveis,
        variableCatalogAvailable,
        clientes,
        isLoading,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        renderTemplate,
        renderTemplatePdf,
        addVariavel,
        updateVariavel,
        addDocumento,
        deleteDocumento: async (id: string) => {
            if (!token) return;
            try {
                const response = await fetch(`${apiBaseUrl}/documents/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    setDocumentos((prev) => prev.filter((d) => d.id !== id));
                }
            } catch (_error) {
                console.error("Failed to delete document");
            }
        },
        deleteVariavel,
        addCliente: () => {},
    };
}
