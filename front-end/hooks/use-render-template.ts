"use client"

import { useCallback } from "react"
import { getApiBaseUrl } from "@/lib/api-client"
import { useAuth } from "./use-auth"

async function callRenderApi(
  token: string | null,
  templateId: string,
  vars: Record<string, string>,
  behavior: "blank" | "underline",
  format: "html" | "pdf",
  acceptHeader: string,
): Promise<Response | null> {
  if (!token) return null
  try {
    return await fetch(`${getApiBaseUrl()}/templates/${templateId}/render`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: acceptHeader,
      },
      body: JSON.stringify({
        variables: vars,
        missing_variable_behavior: behavior,
        format,
      }),
    })
  } catch {
    return null
  }
}

export function useRenderTemplate() {
  const { token } = useAuth()

  const renderTemplate = useCallback(
    async (templateId: string, vars: Record<string, string>, behavior: "blank" | "underline" = "blank") => {
      const response = await callRenderApi(token, templateId, vars, behavior, "html", "application/json")
      if (!response?.ok) return null
      const data = await response.json().catch(() => null)
      return data?.html || null
    },
    [token],
  )

  const renderTemplatePdf = useCallback(
    async (templateId: string, vars: Record<string, string>, behavior: "blank" | "underline" = "blank") => {
      const response = await callRenderApi(token, templateId, vars, behavior, "pdf", "application/pdf, application/json")
      if (!response?.ok) return null

      const contentType = response.headers.get("content-type") || ""
      if (contentType.includes("application/pdf")) {
        return await response.blob()
      }

      const data = await response.json().catch(() => null)
      if (data?.html) {
        return new Blob([data.html], { type: "text/html;charset=utf-8" })
      }
      return null
    },
    [token],
  )

  return { renderTemplate, renderTemplatePdf }
}
