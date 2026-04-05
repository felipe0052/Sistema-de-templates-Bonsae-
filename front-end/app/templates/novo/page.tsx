"use client"

import { useState, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { RichTextEditor } from "@/components/rich-text-editor"
import { VariablePanel } from "@/components/variable-panel"
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
import { Save, Eye, FileDown, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const categorias = [
  "Declarações",
  "Comprovantes",
  "Autorizações",
  "Contratos",
  "Relatórios",
  "Outros",
]

import { useStore } from "@/components/store-provider"
import { toast } from "sonner"

export default function NovoTemplatePage() {
  const router = useRouter()
  const { addTemplate } = useStore()
  const editorRef = useRef<{ insertVariable: (v: string) => void }>(null)
  const [nomeTemplate, setNomeTemplate] = useState("")
  const [categoria, setCategoria] = useState("")
  const [conteudo, setConteudo] = useState("")
  const [letterhead, setLetterhead] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("editor")
  const [isSaving, setIsSaving] = useState(false)

  const handleInsertVariable = (variavel: string) => {
    // Insert variable at cursor position
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const span = document.createElement("span")
      span.className = "bg-primary/20 text-primary px-1 rounded font-mono text-sm"
      span.contentEditable = "false"
      span.textContent = `{{${variavel}}}`
      range.deleteContents()
      range.insertNode(span)
      
      // Update content
      const editor = document.querySelector('[contenteditable="true"]')
      if (editor) {
        setConteudo(editor.innerHTML)
      }
    }
  }

  const handleSave = async () => {
    if (!nomeTemplate.trim()) {
      toast.error("Por favor, informe o nome do template.")
      return
    }
    if (!conteudo.trim()) {
      toast.error("Por favor, adicione conteúdo ao template.")
      return
    }

    setIsSaving(true)
    try {
      await addTemplate({
        nome_template: nomeTemplate,
        categoria: categoria || "Outros",
        conteudo: conteudo,
        cliente_id: "1", // Mock client
        imagem_fundo: letterhead || undefined,
      })
      
      toast.success("Template salvo com sucesso!")
      router.push("/templates")
    } catch (error) {
      console.error("Save error:", error)
      toast.error("Erro ao salvar template.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardLayout title="Novo Template" subtitle="Crie um novo modelo de documento">
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
            <Button variant="outline" onClick={() => setActiveTab("preview")}>
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Salvando..." : "Salvar Template"}
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
                  value={nomeTemplate}
                  onChange={(e) => setNomeTemplate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={categoria} onValueChange={setCategoria}>
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
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="letterhead">Papel Timbrado</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3">
                <RichTextEditor
                  value={conteudo}
                  onChange={setConteudo}
                  placeholder="Digite o conteúdo do seu template aqui. Use as variáveis do painel lateral para inserir dados dinâmicos."
                />
              </div>
              <div className="lg:col-span-1">
                <VariablePanel onInsertVariable={handleInsertVariable} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="letterhead" className="mt-4">
            <LetterheadUpload
              value={letterhead}
              onChange={setLetterhead}
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <DocumentPreview
              content={conteudo}
              letterhead={letterhead}
              data={{}}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
