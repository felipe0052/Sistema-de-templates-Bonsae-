"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type {
    Template,
    Documento,
    Variavel,
} from "@/lib/types";
import { toast } from "sonner";
import { templatesIniciais, variaveisDisponiveis, documentosIniciais } from "@/lib/store";

export function useApiStore() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [variaveis, setVariaveis] = useState<Variavel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVariables = useCallback(async () => {
        if (!isSupabaseConfigured) {
            setVariaveis(variaveisDisponiveis as Variavel[]);
            return variaveisDisponiveis;
        }
        try {
            const { data, error: sbError } = await supabase
                .from('variaveis')
                .select('*')
                .order('nome', { ascending: true });

            if (sbError) throw sbError;
            setVariaveis(data as Variavel[]);
            return data as Variavel[];
        } catch (err: any) {
            const msg = err?.message || (err && typeof err === 'object' ? JSON.stringify(err) : String(err));
            console.error("Erro ao buscar variáveis:", msg);
            console.error("Detalhes do erro:", err);
            setVariaveis(variaveisDisponiveis as Variavel[]);
            return variaveisDisponiveis;
        }
    }, []);

    const fetchTemplates = useCallback(async () => {
        if (!isSupabaseConfigured) {
            setTemplates(templatesIniciais as Template[]);
            return templatesIniciais;
        }
        try {
            const { data, error: sbError } = await supabase
                .from('templates')
                .select('*')
                .order('created_at', { ascending: false });

            if (sbError) throw sbError;
            setTemplates((data || []) as Template[]);
            return (data || []) as Template[];
        } catch (err: any) {
            const msg = err?.message || (err && typeof err === 'object' ? JSON.stringify(err) : String(err));
            console.error("Erro ao buscar templates:", msg);
            console.error("Detalhes do erro:", err);
            setTemplates(templatesIniciais as Template[]);
            return templatesIniciais;
        }
    }, []);

    const fetchDocumentos = useCallback(async () => {
        if (!isSupabaseConfigured) {
            setDocumentos(documentosIniciais as Documento[]);
            return documentosIniciais;
        }
        try {
            const { data, error: sbError } = await supabase
                .from('documentos')
                .select('*')
                .order('created_at', { ascending: false });

            if (sbError) throw sbError;
            setDocumentos((data || []) as Documento[]);
            return (data || []) as Documento[];
        } catch (err: any) {
            const msg = err?.message || (err && typeof err === 'object' ? JSON.stringify(err) : String(err));
            console.error("Erro ao buscar documentos:", msg);
            console.error("Detalhes do erro:", err);
            setDocumentos(documentosIniciais as Documento[]);
            return documentosIniciais;
        }
    }, []);

    // Carregar dados iniciais
    useEffect(() => {
        console.log("Supabase configurado:", isSupabaseConfigured);
        if (!isSupabaseConfigured) {
            console.log("Usando dados locais (Mock Mode)");
        }

        const fetchInitialData = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                // Executar em paralelo mas capturar erros individuais para não travar o Promise.all
                // Embora os fetches já capturem seus próprios erros, garantimos aqui também.
                await Promise.allSettled([
                    fetchVariables(),
                    fetchTemplates(),
                    fetchDocumentos()
                ]);
            } catch (err: any) {
                const message = err?.message || (err && typeof err === 'object' ? JSON.stringify(err) : String(err));
                console.error("Erro fatal ao carregar dados iniciais:", message);
                setError(message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, [fetchVariables, fetchTemplates, fetchDocumentos]);

    const addVariavel = async (variavel: Omit<Variavel, "id">) => {
        if (!isSupabaseConfigured) {
            const newVar = { ...variavel, id: Math.random().toString(36).substr(2, 9) } as Variavel;
            setVariaveis(prev => [...(prev || []), newVar].sort((a, b) => a.nome.localeCompare(b.nome)));
            return newVar;
        }
        const { data, error: sbError } = await supabase
            .from('variaveis')
            .insert([variavel])
            .select()
            .single();

        if (sbError) throw sbError;
        const newVar = data as Variavel;
        setVariaveis(prev => [...prev, newVar].sort((a, b) => a.nome.localeCompare(b.nome)));
        return newVar;
    };

    const updateVariavel = async (id: string, updates: Omit<Variavel, "id">) => {
        if (!isSupabaseConfigured) {
            const updatedVar = { ...updates, id } as Variavel;
            setVariaveis(prev => (prev || []).map(v => v.id === id ? updatedVar : v));
            return updatedVar;
        }
        const { data, error: sbError } = await supabase
            .from('variaveis')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (sbError) throw sbError;
        const updatedVar = data as Variavel;
        setVariaveis(prev => prev.map(v => v.id === id ? updatedVar : v));
        return updatedVar;
    };

    const deleteVariavel = async (id: string) => {
        if (!isSupabaseConfigured) {
            setVariaveis(prev => (prev || []).filter(v => v.id !== id));
            return;
        }
        const { error: sbError } = await supabase
            .from('variaveis')
            .delete()
            .eq('id', id);

        if (sbError) throw sbError;
        setVariaveis(prev => prev.filter(v => v.id !== id));
    };

    const addTemplate = async (template: Omit<Template, "id">) => {
        if (!isSupabaseConfigured) {
            const newTemplate = { ...template, id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() } as Template;
            setTemplates(prev => [newTemplate, ...(prev || [])]);
            return newTemplate;
        }
        const { data, error: sbError } = await supabase
            .from('templates')
            .insert([template])
            .select()
            .single();

        if (sbError) throw sbError;
        const newTemplate = data as Template;
        setTemplates(prev => [newTemplate, ...prev]);
        return newTemplate;
    };

    const updateTemplate = async (id: string, updates: Partial<Template>) => {
        if (!isSupabaseConfigured) {
            const updatedTemplate = { ...(templates || []).find(t => t.id === id), ...updates } as Template;
            setTemplates(prev => (prev || []).map(t => t.id === id ? updatedTemplate : t));
            return updatedTemplate;
        }
        const { data, error: sbError } = await supabase
            .from('templates')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (sbError) throw sbError;
        const updatedTemplate = data as Template;
        setTemplates(prev => prev.map(t => t.id === id ? updatedTemplate : t));
        return updatedTemplate;
    };

    const deleteTemplate = async (id: string) => {
        if (!isSupabaseConfigured) {
            setTemplates(prev => (prev || []).filter(t => t.id !== id));
            return;
        }
        const { error: sbError } = await supabase
            .from('templates')
            .delete()
            .eq('id', id);

        if (sbError) throw sbError;
        setTemplates(prev => prev.filter(t => t.id !== id));
    };

    const addDocumento = async (doc: Omit<Documento, "id">) => {
        if (!isSupabaseConfigured) {
            const newDoc = { ...doc, id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() } as Documento;
            setDocumentos(prev => [newDoc, ...(prev || [])]);
            return newDoc;
        }
        const { data, error: sbError } = await supabase
            .from('documentos')
            .insert([doc])
            .select()
            .single();

        if (sbError) throw sbError;
        const newDoc = data as Documento;
        setDocumentos(prev => [newDoc, ...prev]);
        return newDoc;
    };

    const updateDocumento = async (id: string, updates: Partial<Documento>) => {
        if (!isSupabaseConfigured) {
            const updatedDoc = { ...(documentos || []).find(d => d.id === id), ...updates } as Documento;
            setDocumentos(prev => (prev || []).map(d => d.id === id ? updatedDoc : d));
            return updatedDoc;
        }
        const { data, error: sbError } = await supabase
            .from('documentos')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (sbError) throw sbError;
        const updatedDoc = data as Documento;
        setDocumentos(prev => prev.map(d => d.id === id ? updatedDoc : d));
        return updatedDoc;
    };

    const deleteDocumento = async (id: string) => {
        if (!isSupabaseConfigured) {
            setDocumentos(prev => (prev || []).filter(d => d.id !== id));
            return;
        }
        const { error: sbError } = await supabase
            .from('documentos')
            .delete()
            .eq('id', id);

        if (sbError) throw sbError;
        setDocumentos(prev => prev.filter(d => d.id !== id));
    };

    const getTemplateById = useCallback((id: string) => (templates || []).find(t => t.id === id), [templates]);
    const getDocumentoById = useCallback((id: string) => (documentos || []).find(d => d.id === id), [documentos]);

    return {
        templates: templates || [],
        documentos: documentos || [],
        variaveis: variaveis || [],
        isLoading,
        error,
        isConfigured: isSupabaseConfigured,
        fetchVariables,
        fetchTemplates,
        fetchDocumentos,
        addVariavel,
        updateVariavel,
        deleteVariavel,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        addDocumento,
        updateDocumento,
        deleteDocumento,
        getTemplateById,
        getDocumentoById,
    };
}
