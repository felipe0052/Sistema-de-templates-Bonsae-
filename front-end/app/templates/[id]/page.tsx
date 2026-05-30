"use client"

import { useRef, useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TipTapEditor, type TipTapEditorHandle } from "@/components/tiptap-editor"
import { DocumentPreview } from "@/components/document-preview"
import { LetterheadUpload } from "@/components/letterhead-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Save, Eye, ArrowLeft, Play } from "lucide-react"
import Link from "next/link"
import { useTemplates } from "@/hooks/use-templates"
import { useVariables } from "@/hooks/use-variables"
import { toast } from "sonner"
import { findUnknownVariables } from "@/lib/document-utils"
import type { Template } from "@/lib/types"

const categorias = [
  "Declarações",
  "Comprovantes",
  "Autorizações",
  "Contratos",
  "Relatórios",
  "Outros",
]

export default function EditarTemplatePage() {
  const params = useParams()
  const router = useRouter()
  const { templates, updateTemplate, isLoading } = useTemplates()
  const { variables, variableCatalogAvailable } = useVariables()
  const editorRef = useRef<TipTapEditorHandle>(null)
  const [template, setTemplate] = useState<Template | null>(null)
  const [templateName, setTemplateName] = useState("")
  const [category, setCategory] = useState("")
  const [content, setContent] = useState("")
  const [letterhead, setLetterhead] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("editor")
  const [isSaving, setIsSaving] = useState(false)
  const unknownVariables = variableCatalogAvailable
    ? findUnknownVariables(
        content,
        variables.map((item) => item.variable_name),
      )
    : []
  const hasUnknownVariables = unknownVariables.length > 0

  useEffect(() => {
    if (isLoading) return

    const templateId = params.id as string
    const foundTemplate = templates.find((t) => t.id === templateId)
    if (foundTemplate) {
      setTemplate(foundTemplate)
      setTemplateName(foundTemplate.template_name)
      setCategory(foundTemplate.category || "")
      setContent(foundTemplate.content)
      setLetterhead(foundTemplate.background_image || null)
    }
  }, [params.id, templates, isLoading])

  const handleSave = async () => {
    if (!template) return
    if (!templateName.trim()) {
      toast.error("Por favor, informe o nome do template.")
      return
    }
    if (!content.trim()) {
      toast.error("Por favor, adicione conteúdo ao template.")
      return
    }
    if (hasUnknownVariables) {
      toast.error("Existem variáveis inválidas no template. Corrija antes de salvar.")
      return
    }

    setIsSaving(true)
    try {
      updateTemplate(template.id, {
        template_name: templateName,
        category: category,
        content: content,
        background_image: letterhead || undefined,
      })
      toast.success("Template atualizado com sucesso!")
      router.push("/templates")
    } catch (_error) {
      toast.error("Erro ao atualizar template.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return null

  if (!template) {
    return (
      <DashboardLayout title="Template não encontrado" subtitle="">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Template não encontrado.</p>
          <Button className="mt-4" asChild>
            <Link href="/templates">
              <ArrowLeft className="h-4 w-4" />
              Voltar aos templates
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Editar Template"
      subtitle={template.template_name}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button variant="ghost" asChild>
            <Link href="/templates">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/templates/${template.id}/gerar`}>
                <Play className="h-4 w-4" />
                Gerar Documento
              </Link>
            </Button>
            <Button variant="outline" onClick={() => setActiveTab("preview")}>
              <Eye className="h-4 w-4" />
              Visualizar
            </Button>
            <Button onClick={handleSave} disabled={isSaving || hasUnknownVariables}>
              <Save className="h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>

        {/* Template Info */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-base">Informações do Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Template</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Declaração de Residência"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Editor Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="letterhead">Papel Timbrado</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="mt-4">
            {hasUnknownVariables && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  Variáveis não cadastradas:{" "}
                  <span className="font-mono">
                    {unknownVariables.map((item) => `{{${item}}}`).join(", ")}
                  </span>
                  . Cadastre em Variáveis ou ajuste o template.
                </p>
              </div>
            )}
            <div className="max-w-4xl mx-auto">
              <TipTapEditor
                ref={editorRef}
                value={content}
                onChange={setContent}
                                availableVariables={variables.map((item) => ({ variable_name: item.variable_name, description: item.description }))}
                variableCatalogAvailable={variableCatalogAvailable}
                placeholder="Digite o conteúdo do template. Use {{ para inserir variáveis."
              />
            </div>
          </TabsContent>

          <TabsContent value="letterhead" className="mt-4">
            <LetterheadUpload value={letterhead} onChange={setLetterhead} />
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <DocumentPreview
              content={content}
              letterhead={letterhead}
              data={{}}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
