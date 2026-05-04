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
  const [nome, setNome] = useState("")
  const [conteudo, setConteudo] = useState("")
  const [letterhead, setLetterhead] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("editor")
  const [isSaving, setIsSaving] = useState(false)

  const handleInsertVariable = (variavel: string) => {
    if ((window as any).insertVariableToEditor) {
      (window as any).insertVariableToEditor(variavel)
    }
  }

  const handleSave = async () => {
    if (!nome.trim()) {
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
        nome: nome,
        conteudo: conteudo,
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
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Template</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Declaração de Residência"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
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
