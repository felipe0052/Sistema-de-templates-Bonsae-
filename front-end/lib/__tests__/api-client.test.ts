import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { getApiBaseUrl, apiFetch, mapApiVariable } from "../api-client"
import { ApiError } from "../api-errors"

describe("getApiBaseUrl", () => {
  const savedEnv = process.env

  beforeEach(() => {
    process.env = { ...savedEnv }
  })

  afterEach(() => {
    process.env = savedEnv
  })

  it("returns env var when set", () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com"
    expect(getApiBaseUrl()).toBe("https://api.example.com")
  })

  it("returns default when env var not set", () => {
    delete process.env.NEXT_PUBLIC_API_BASE_URL
    expect(getApiBaseUrl()).toBe("http://127.0.0.1:8000/api")
  })

  it("strips trailing slash from env var", () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com/"
    expect(getApiBaseUrl()).toBe("https://api.example.com")
  })
})

describe("apiFetch", () => {
  const savedEnv = process.env
  const originalFetch = global.fetch

  beforeEach(() => {
    process.env = { ...savedEnv }
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.test.com"
    global.fetch = vi.fn()
  })

  afterEach(() => {
    process.env = savedEnv
    global.fetch = originalFetch
  })

  it("returns parsed JSON on successful response", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 1, name: "test" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    )

    const data = await apiFetch("/items")
    expect(data).toEqual({ id: 1, name: "test" })
  })

  it("returns undefined on 204 response", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(new Response(null, { status: 204 }))

    const data = await apiFetch("/items")
    expect(data).toBeUndefined()
  })

  it("throws ApiError on 4xx response", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }),
    )

    await expect(apiFetch("/missing")).rejects.toThrow(ApiError)
  })

  it("throws ApiError on 5xx response", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
    )

    await expect(apiFetch("/broken")).rejects.toThrow(ApiError)
  })

  it("includes Authorization header when token provided", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    )

    await apiFetch("/secure", { token: "abc123" })

    const headers = vi.mocked(global.fetch).mock.calls[0][1]?.headers as Headers
    expect(headers.get("Authorization")).toBe("Bearer abc123")
  })

  it("uses custom Content-Type when provided", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    )

    await apiFetch("/upload", {
      headers: { "Content-Type": "multipart/form-data" },
    })

    const headers = vi.mocked(global.fetch).mock.calls[0][1]?.headers as Headers
    expect(headers.get("Content-Type")).toBe("multipart/form-data")
  })

  it("sets default Accept and Content-Type headers", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    )

    await apiFetch("/items")

    const headers = vi.mocked(global.fetch).mock.calls[0][1]?.headers as Headers
    expect(headers.get("Accept")).toBe("application/json")
    expect(headers.get("Content-Type")).toBe("application/json")
  })
})

describe("mapApiVariable", () => {
  it("maps fields correctly", () => {
    const result = mapApiVariable({
      id: 1,
      name: "nome",
      description: "desc",
      example: "ex",
      source: "manual",
    })
    expect(result).toEqual({
      id: "1",
      variable_name: "nome",
      description: "desc",
      example: "ex",
      source: "manual",
    })
  })

  it("maps example null to empty string", () => {
    const result = mapApiVariable({
      id: 2,
      name: "var",
      description: "d",
      example: null,
      source: "manual",
    })
    expect(result.example).toBe("")
  })

  it("maps source undefined to 'manual'", () => {
    const result = mapApiVariable({
      id: 3,
      name: "var",
      description: "d",
      example: "ex",
    })
    expect(result.source).toBe("manual")
  })
})
