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

function isNonArrayObject(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val)
}

export function parseErrorResponse(payload: unknown): string | null {
  if (!isNonArrayObject(payload)) return null
  if (typeof payload.message === "string") return payload.message

  const errors = payload.errors
  if (!isNonArrayObject(errors)) return null
  const firstKey = Object.keys(errors)[0]
  if (!firstKey || !Array.isArray(errors[firstKey])) return null
  return errors[firstKey][0] ?? null
}
