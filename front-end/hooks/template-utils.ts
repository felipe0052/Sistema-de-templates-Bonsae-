"use client"

import type { Template } from "@/lib/types"

export const queryKey = ["templates"] as const

export interface RawTemplate {
  id?: string | number
  title?: string
  template_name?: string
  content?: string
  metadata?: { category?: string }
  category?: string
  tenant_id?: string | number
  client_id?: string | number
  created_at?: string
  updated_at?: string
  background_image_url?: string
  background_image?: string
}

function mapTemplateName(t: RawTemplate): string {
  return t.title ?? t.template_name ?? ""
}

function mapTemplateCategory(t: RawTemplate): string {
  return t.metadata?.category ?? t.category ?? "General"
}

function mapTemplateClientId(t: RawTemplate): string {
  return String(t.tenant_id ?? t.client_id ?? "1")
}

function mapTemplateBackgroundImage(
  t: RawTemplate,
): string | null | undefined {
  return t.background_image_url ?? t.background_image
}

export function mapTemplate(template: RawTemplate): Template {
  return {
    id: String(template.id),
    template_name: mapTemplateName(template),
    content: template.content ?? "",
    category: mapTemplateCategory(template),
    client_id: mapTemplateClientId(template),
    created_at: template.created_at ?? new Date().toISOString(),
    updated_at: template.updated_at ?? new Date().toISOString(),
    background_image: mapTemplateBackgroundImage(template),
  }
}

export function serializeBackgroundImage(value: string | null | undefined) {
  if (value === null) return null
  return value?.startsWith("data:image/") ? value : undefined
}
