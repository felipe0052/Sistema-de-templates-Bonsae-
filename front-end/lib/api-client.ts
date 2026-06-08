import { type StaticVariableApiResponse, type Variable } from "@/lib/types"

const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000/api"

export class ApiError extends Error {
  status: number
  endpoint: string
  details?: unknown

  constructor(message: string, status: number, endpoint: string, details?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.endpoint = endpoint
    this.details = details
  }
}

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || DEFAULT_API_BASE_URL
}

function isNonArrayObject(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val)
}

function parseErrorResponse(payload: unknown): string | null {
  if (!isNonArrayObject(payload)) return null
  if (typeof payload.message === "string") return payload.message

  const errors = payload.errors
  if (!isNonArrayObject(errors)) return null
  const firstKey = Object.keys(errors)[0]
  if (!firstKey || !Array.isArray(errors[firstKey])) return null
  return errors[firstKey][0] ?? null
}

function buildRequestHeaders(options: { token?: string | null; headers?: HeadersInit }) {
  const { token, headers } = options
  const requestHeaders = new Headers(headers)
  requestHeaders.set("Accept", "application/json")
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`)
  if (!requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json")
  }
  return requestHeaders
}

async function parseResponse<T>(response: Response, endpoint: string): Promise<T> {
  const isJson = (response.headers.get("content-type") || "").includes("application/json")
  const payload = isJson ? await response.json().catch(() => null) : null

  if (!response.ok) {
    const message =
      parseErrorResponse(payload) ||
      `Request to ${endpoint} failed with status ${response.status}`
    throw new ApiError(message, response.status, endpoint, payload)
  }

  if (response.status === 204 || !isJson) {
    return undefined as T
  }

  return payload as T
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const { token, headers, ...rest } = options
  const requestHeaders = buildRequestHeaders({ token, headers })

  const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
    ...rest,
    headers: requestHeaders,
  })

  return parseResponse<T>(response, endpoint)
}

export function mapApiVariable(variable: StaticVariableApiResponse): Variable {
  return {
    id: String(variable.id),
    variable_name: variable.name,
    description: variable.description,
    example: variable.example || "",
    source: variable.source || "manual",
  }
}
