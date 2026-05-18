"use client"

import { useState, useEffect } from "react"
import type { Template, Document, Variable, Client } from "@/lib/types"
import { initialTemplates, initialDocuments, availableVariables } from "@/lib/store"

const STORAGE_KEYS = {
  TEMPLATES: "bonsae_templates",
  DOCUMENTS: "bonsae_documents",
  VARIABLES: "bonsae_variables",
  CLIENTS: "bonsae_clients",
}

export function useMockStore() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [variables, setVariables] = useState<Variable[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedTemplates = localStorage.getItem(STORAGE_KEYS.TEMPLATES)
    const storedDocuments = localStorage.getItem(STORAGE_KEYS.DOCUMENTS)
    const storedVariables = localStorage.getItem(STORAGE_KEYS.VARIABLES)
    const storedClients = localStorage.getItem(STORAGE_KEYS.CLIENTS)

    if (storedTemplates) {
      setTemplates(JSON.parse(storedTemplates))
    } else {
      setTemplates(initialTemplates)
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(initialTemplates))
    }

    if (storedDocuments) {
      setDocuments(JSON.parse(storedDocuments))
    } else {
      setDocuments(initialDocuments)
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(initialDocuments))
    }

    if (storedVariables) {
      setVariables(JSON.parse(storedVariables))
    } else {
      setVariables(availableVariables)
      localStorage.setItem(STORAGE_KEYS.VARIABLES, JSON.stringify(availableVariables))
    }

    if (storedClients) {
      setClients(JSON.parse(storedClients))
    } else {
      const initialClients: Client[] = [
        { id: "1", name: "João Silva", email: "joao@email.com", organization: "Empresa ABC", created_at: new Date().toISOString() },
        { id: "2", name: "Maria Santos", email: "maria@email.com", organization: "Consultoria XYZ", created_at: new Date().toISOString() },
      ]
      setClients(initialClients)
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(initialClients))
    }

    setIsLoading(false)
  }, [])

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

  const addDocument = (doc: Omit<Document, "id" | "created_at">) => {
    const newDoc: Document = {
      ...doc,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    }
    const updated = [...documents, newDoc]
    setDocuments(updated)
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(updated))
    return newDoc
  }

  const deleteDocument = (id: string) => {
    const updated = documents.filter((d) => d.id !== id)
    setDocuments(updated)
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(updated))
  }

  const addVariable = (variable: Omit<Variable, "id">) => {
    const newVar: Variable = {
      ...variable,
      id: Math.random().toString(36).substr(2, 9),
    }
    const updated = [...variables, newVar]
    setVariables(updated)
    localStorage.setItem(STORAGE_KEYS.VARIABLES, JSON.stringify(updated))
  }

  const deleteVariable = (id: string) => {
    const updated = variables.filter((v) => v.id !== id)
    setVariables(updated)
    localStorage.setItem(STORAGE_KEYS.VARIABLES, JSON.stringify(updated))
  }

  const updateVariable = (id: string, updates: Omit<Variable, "id">) => {
    const updated = variables
      .map((v) => (v.id === id ? { ...v, ...updates } : v))
      .sort((a, b) => a.variable_name.localeCompare(b.variable_name))
    setVariables(updated)
    localStorage.setItem(STORAGE_KEYS.VARIABLES, JSON.stringify(updated))
  }

  const addClient = (client: Omit<Client, "id" | "created_at">) => {
    const newClient: Client = {
      ...client,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    }
    const updated = [...clients, newClient]
    setClients(updated)
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updated))
  }

  return {
    templates,
    documents,
    variables,
    clients,
    isLoading,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    addDocument,
    deleteDocument,
    addVariable,
    updateVariable,
    deleteVariable,
    addClient,
  }
}
