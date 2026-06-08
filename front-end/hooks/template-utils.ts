"use client"

import type { Template } from "@/lib/types"

export const queryKey = ["templates"] as const

export function mapTemplate(template: any): Template {
  return {
    id: String(template.id),
    template_name: template.title ?? template.template_name ?? "",
    content: template.content ?? "",
    category: template.metadata?.category ?? template.category ?? "General",
    client_id: String(template.tenant_id ?? template.client_id ?? "1"),
    created_at: template.created_at ?? new Date().toISOString(),
    updated_at: template.updated_at ?? new Date().toISOString(),
    background_image: template.background_image_url ?? template.background_image,
  }
}

export function serializeBackgroundImage(value: string | null | undefined) {
  if (value === null) return null
  return value?.startsWith("data:image/") ? value : undefined
}
