import { describe, it, expect } from "vitest"
import { ApiError, parseErrorResponse } from "../api-errors"

describe("ApiError", () => {
  it("inherits from Error", () => {
    expect(new ApiError("msg", 400, "/api/x")).toBeInstanceOf(Error)
  })

  it("has correct name", () => {
    expect(new ApiError("msg", 400, "/api/x").name).toBe("ApiError")
  })

  it("has status", () => {
    expect(new ApiError("msg", 400, "/api/x").status).toBe(400)
  })

  it("has endpoint", () => {
    expect(new ApiError("msg", 400, "/api/x").endpoint).toBe("/api/x")
  })

  it("has details", () => {
    expect(new ApiError("msg", 400, "/api/x", { info: 1 }).details).toEqual({ info: 1 })
  })
})

describe("parseErrorResponse", () => {
  it("returns null for null", () => {
    expect(parseErrorResponse(null)).toBeNull()
  })

  it("returns null for string", () => {
    expect(parseErrorResponse("string")).toBeNull()
  })

  it("returns null for array", () => {
    expect(parseErrorResponse([1, 2])).toBeNull()
  })

  it("extracts message field", () => {
    expect(parseErrorResponse({ message: "foo" })).toBe("foo")
  })

  it("extracts first error from errors object", () => {
    expect(parseErrorResponse({ errors: { email: ["já existe"] } })).toBe("já existe")
  })

  it("returns null for empty errors array", () => {
    expect(parseErrorResponse({ errors: { email: [] } })).toBeNull()
  })

  it("returns null for empty object", () => {
    expect(parseErrorResponse({})).toBeNull()
  })

  it("returns null for errors being null", () => {
    expect(parseErrorResponse({ errors: null })).toBeNull()
  })
})
