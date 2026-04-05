"use client"

import { useState, useEffect } from "react"
import type { Template, Documento, Variavel, Cliente } from "@/lib/types"
import { templatesIniciais, documentosIniciais, variaveisDisponiveis } from "@/lib/store"

const STORAGE_KEYS = {
  TEMPLATES: "bonsae_templates",
  DOCUMENTOS: "bonsae_documentos",
  VARIAVEIS: "bonsae_variaveis",
  CLIENTES: "bonsae_clientes",
}

export function useMockStore() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [variaveis, setVariaveis] = useState<Variavel[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load data from localStorage or use defaults
    const storedTemplates = localStorage.getItem(STORAGE_KEYS.TEMPLATES)
    const storedDocumentos = localStorage.getItem(STORAGE_KEYS.DOCUMENTOS)
    const storedVariaveis = localStorage.getItem(STORAGE_KEYS.VARIAVEIS)
    const storedClientes = localStorage.getItem(STORAGE_KEYS.CLIENTES)

    if (storedTemplates) {
      setTemplates(JSON.parse(storedTemplates))
    } else {
      setTemplates(templatesIniciais)
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templatesIniciais))
    }

    if (storedDocumentos) {
      setDocumentos(JSON.parse(storedDocumentos))
    } else {
      setDocumentos(documentosIniciais)
      localStorage.setItem(STORAGE_KEYS.DOCUMENTOS, JSON.stringify(documentosIniciais))
    }

    if (storedVariaveis) {
      setVariaveis(JSON.parse(storedVariaveis))
    } else {
      setVariaveis(variaveisDisponiveis)
      localStorage.setItem(STORAGE_KEYS.VARIAVEIS, JSON.stringify(variaveisDisponiveis))
    }

    if (storedClientes) {
      setClientes(JSON.parse(storedClientes))
    } else {
      const initialClientes: Cliente[] = [
        { id: "1", nome: "João Silva", email: "joao@email.com", empresa: "Empresa ABC", created_at: new Date().toISOString() },
        { id: "2", nome: "Maria Santos", email: "maria@email.com", empresa: "Consultoria XYZ", created_at: new Date().toISOString() },
      ]
      setClientes(initialClientes)
      localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(initialClientes))
    }

    setIsLoading(false)
  }, [])

  // Template Actions
  const addTemplate = (template: Omit<Template, "id" | "created_at" | "updated_at">) => {
    const newTemplate: Template = {
      ...template,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const updated = [...templates, newTemplate]
    setTemplates(updated)
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(updated))
    return newTemplate
  }

  const updateTemplate = (id: string, updates: Partial<Template>) => {
    const updated = templates.map((t) =>
      t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
    )
    setTemplates(updated)
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(updated))
  }

  const deleteTemplate = (id: string) => {
    const updated = templates.filter((t) => t.id !== id)
    setTemplates(updated)
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(updated))
  }

  // Document Actions
  const addDocumento = (documento: Omit<Documento, "id" | "created_at">) => {
    const newDoc: Documento = {
      ...documento,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    }
    const updated = [...documentos, newDoc]
    setDocumentos(updated)
    localStorage.setItem(STORAGE_KEYS.DOCUMENTOS, JSON.stringify(updated))
    return newDoc
  }

  const deleteDocumento = (id: string) => {
    const updated = documentos.filter((d) => d.id !== id)
    setDocumentos(updated)
    localStorage.setItem(STORAGE_KEYS.DOCUMENTOS, JSON.stringify(updated))
  }

  // Variable Actions
  const addVariavel = (variavel: Omit<Variavel, "id">) => {
    const newVar: Variavel = {
      ...variavel,
      id: Math.random().toString(36).substr(2, 9),
    }
    const updated = [...variaveis, newVar]
    setVariaveis(updated)
    localStorage.setItem(STORAGE_KEYS.VARIAVEIS, JSON.stringify(updated))
  }

  const deleteVariavel = (id: string) => {
    const updated = variaveis.filter((v) => v.id !== id)
    setVariaveis(updated)
    localStorage.setItem(STORAGE_KEYS.VARIAVEIS, JSON.stringify(updated))
  }

  // Cliente Actions
  const addCliente = (cliente: Omit<Cliente, "id" | "created_at">) => {
    const newCliente: Cliente = {
      ...cliente,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    }
    const updated = [...clientes, newCliente]
    setClientes(updated)
    localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(updated))
  }

  return {
    templates,
    documentos,
    variaveis,
    clientes,
    isLoading,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    addDocumento,
    deleteDocumento,
    addVariavel,
    deleteVariavel,
    addCliente,
  }
}
