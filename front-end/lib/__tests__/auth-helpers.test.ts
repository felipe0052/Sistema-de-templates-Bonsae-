import { describe, it, expect } from "vitest"
import { validateActivationForm } from "../auth-helpers"

describe("validateActivationForm", () => {
  it("returns error when password is too short", () => {
    expect(validateActivationForm("abc", "abc")).toBe(
      "A senha deve ter no mínimo 8 caracteres."
    )
  })

  it("returns error when passwords don't match", () => {
    expect(validateActivationForm("password1", "password2")).toBe(
      "As senhas não coincidem."
    )
  })

  it("returns null for valid inputs", () => {
    expect(validateActivationForm("password1", "password1")).toBeNull()
  })

  it("returns null when password is exactly 8 characters", () => {
    expect(validateActivationForm("12345678", "12345678")).toBeNull()
  })
})
