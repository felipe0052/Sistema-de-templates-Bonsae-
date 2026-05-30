"use client"

import { useCallback } from "react"
import { getApiBaseUrl } from "@/lib/api-client"
import { useAuth } from "./use-auth"

export function useRenderTemplate() {
  const { token } = useAuth()

  const renderTemplate = useCallback(
    async (templateId: string, vars: Record<string, string>, behavior: "blank" | "underline" = "blank") => {
      if (!token) return null

      try {
        const response = await fetch(`${getApiBaseUrl()}/templates/${templateId}/render`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            variables: vars,
            missing_variable_behavior: behavior,
            format: "html",
          }),
        })

        if (!response.ok) return null

        const data = await response.json()
        return data.html || null
      } catch {
        return null
      }
    },
    [token],
  )

  const renderTemplatePdf = useCallback(
    async (templateId: string, vars: Record<string, string>, behavior: "blank" | "underline" = "blank") => {
      if (!token) return null

      try {
        const response = await fetch(`${getApiBaseUrl()}/templates/${templateId}/render`, {
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
        })

        if (!response.ok) return null

        const contentType = response.headers.get("content-type") || ""
        if (contentType.includes("application/pdf")) {
          return await response.blob()
        }

        const data = await response.json().catch(() => null)
        if (data?.html) {
          return new Blob([data.html], { type: "text/html;charset=utf-8" })
        }

        return null
      } catch {
        return null
      }
    },
    [token],
  )

  return { renderTemplate, renderTemplatePdf }
}
