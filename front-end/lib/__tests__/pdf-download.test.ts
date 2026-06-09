import { describe, it, expect, vi, beforeEach } from "vitest"
import { slugify, downloadPdf } from "../pdf-download"
import type { Document, Template } from "@/lib/types"

const mockToastSuccess = vi.fn()
const mockToastError = vi.fn()
const mockTriggerDownload = vi.fn()

vi.mock("sonner", () => ({
  toast: {
    success: (...args: any[]) => mockToastSuccess(...args),
    error: (...args: any[]) => mockToastError(...args),
  },
}))

vi.mock("@/lib/download-utils", () => ({
  triggerDownload: (...args: any[]) => mockTriggerDownload(...args),
}))

describe("slugify", () => {
  it("lowercases", () => {
    expect(slugify("Meu Documento")).toBe("meu-documento")
  })

  it("replaces special chars with dashes", () => {
    expect(slugify("doc__final.v2")).toBe("doc__final-v2")
  })

  it("trims dashes", () => {
    expect(slugify("  -hello-  ")).toBe("hello")
  })

  it("keeps underscores and hyphens", () => {
    expect(slugify("some_var-name")).toBe("some_var-name")
  })

  it("replaces spaces with dashes", () => {
    expect(slugify("a b c")).toBe("a-b-c")
  })

  it("returns empty string for empty input", () => {
    expect(slugify("")).toBe("")
  })
})

describe("downloadPdf", () => {
  const makeTemplate = (id: string): Template => ({
    id,
    client_id: "c1",
    template_name: "My Template",
    content: "<p>content</p>",
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  })

  const makeDoc = (template_id: string, name = "My Doc"): Document => ({
    id: "d1",
    template_id,
    name,
    data_json: { key: "value" },
    created_at: "2025-01-01",
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns without error when template not found (empty templates array)", async () => {
    const renderTemplatePdf = vi.fn()
    await downloadPdf(renderTemplatePdf, makeDoc("t1"), [])
    expect(renderTemplatePdf).not.toHaveBeenCalled()
    expect(mockTriggerDownload).not.toHaveBeenCalled()
    expect(mockToastSuccess).not.toHaveBeenCalled()
    expect(mockToastError).not.toHaveBeenCalled()
  })

  it("calls triggerDownload and toast.success with a valid PDF blob", async () => {
    const blob = new Blob(["pdf-data"], { type: "application/pdf" })
    const renderTemplatePdf = vi.fn().mockResolvedValue(blob)

    await downloadPdf(renderTemplatePdf, makeDoc("t1"), [makeTemplate("t1")])

    expect(renderTemplatePdf).toHaveBeenCalledWith("t1", { key: "value" }, "underline")
    expect(mockTriggerDownload).toHaveBeenCalledWith(blob, "my-doc.pdf")
    expect(mockToastSuccess).toHaveBeenCalledWith("PDF baixado com sucesso.")
    expect(mockToastError).not.toHaveBeenCalled()
  })

  it("calls toast.error when blob is null", async () => {
    const renderTemplatePdf = vi.fn().mockResolvedValue(null)

    await downloadPdf(renderTemplatePdf, makeDoc("t1"), [makeTemplate("t1")])

    expect(mockToastError).toHaveBeenCalledWith("Não foi possível gerar o PDF para download.")
    expect(mockTriggerDownload).not.toHaveBeenCalled()
  })

  it("calls toast.error when blob has wrong type", async () => {
    const blob = new Blob(["html"], { type: "text/html" })
    const renderTemplatePdf = vi.fn().mockResolvedValue(blob)

    await downloadPdf(renderTemplatePdf, makeDoc("t1"), [makeTemplate("t1")])

    expect(mockToastError).toHaveBeenCalledWith("Não foi possível gerar o PDF para download.")
    expect(mockTriggerDownload).not.toHaveBeenCalled()
  })

  it("calls toast.error when renderTemplatePdf throws", async () => {
    const renderTemplatePdf = vi.fn().mockRejectedValue(new Error("render failed"))

    await downloadPdf(renderTemplatePdf, makeDoc("t1"), [makeTemplate("t1")])

    expect(mockToastError).toHaveBeenCalledWith("Erro ao baixar PDF.")
    expect(mockTriggerDownload).not.toHaveBeenCalled()
  })
})
