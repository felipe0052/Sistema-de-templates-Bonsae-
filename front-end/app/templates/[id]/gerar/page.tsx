"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileDown, Eye, Save, Printer } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/components/store-provider"
import { toast } from "sonner"
import { extrairVariaveis, substituirVariaveis } from "@/lib/store"
import type { Template } from "@/lib/types"

// Função auxiliar para formatação
const formatValue = (varName: string, value: string) => {
  if (!value) return ""
  
  const nomeLower = varName.toLowerCase()
  
  if (nomeLower.includes('cpf')) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }
  
  if (nomeLower.includes('rg')) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1})/, '$1-$2')
      .replace(/(-\d{1})\d+?$/, '$1') // RG formato: 12.345.678-9 (pode variar, mas tenta um padrão)
  }
  
  if (nomeLower.includes('cep')) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1')
  }
  
  if (nomeLower.includes('telefone') || nomeLower.includes('celular')) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})$/, '$1-$2')
  }

  if (nomeLower.includes('data')) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{4})\d+?$/, '$1')
  }
  
  return value
}

export default function GerarDocumentoPage() {
  const params = useParams()
  const router = useRouter()
  const { templates, variaveis: variaveisStore, addDocumento, isLoading, renderTemplate } = useStore()
  const previewRef = useRef<HTMLDivElement>(null)
  const [template, setTemplate] = useState<Template | null>(null)
  const [dados, setDados] = useState<Record<string, string>>({})
  const [variaveis, setVariaveis] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (isLoading) return

    const templateId = params.id as string
    const foundTemplate = templates.find((t) => t.id === templateId)
    if (foundTemplate) {
      setTemplate(foundTemplate)
      const extractedVars = extrairVariaveis(foundTemplate.conteudo)
      setVariaveis(extractedVars)
      
      // Initialize with current date
      const initialData: Record<string, string> = {
        data_atual: new Date().toLocaleDateString("pt-BR"),
      }
      setDados(initialData)
    }
  }, [params.id, templates, isLoading])

  const getVariableInfo = (varName: string) => {
    return variaveisStore.find((v) => v.nome_variavel === varName)
  }

  const handleInputChange = (varName: string, value: string) => {
    const formattedValue = formatValue(varName, value)
    setDados((prev) => ({ ...prev, [varName]: formattedValue }))
  }

  const handleGeneratePDF = async () => {
    if (!template) return
    
    setIsGenerating(true)
    
    try {
      // Use backend rendering
      const renderedHtml = await renderTemplate(template.id, dados, 'underline')
      
      // Create document in store
      addDocumento({
        template_id: template.id,
        nome: `${template.nome_template} - ${dados.nome || "Novo Documento"}`,
        dados_json: dados,
      })

      // Use browser print functionality with backend-rendered content
      if (renderedHtml) {
        const printWindow = window.open("", "_blank")
        
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>${template?.nome_template || "Documento"}</title>
              <style>
                @page {
                  size: A4;
                  margin: 20mm;
                }
                body {
                  font-family: "Times New Roman", serif;
                  font-size: 12pt;
                  line-height: 1.6;
                  color: #000;
                  margin: 0;
                  padding: 0;
                }
                .document-content {
                  max-width: 170mm;
                  margin: 0 auto;
                }
              </style>
            </head>
            <body>
              <div class="document-content">
                ${renderedHtml}
              </div>
              <script>
                window.onload = function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  }
                }
              </script>
            </body>
            </html>
          `)
          printWindow.document.close()
        }
      }
      
      toast.success("Documento gerado com sucesso via API!")
      router.push("/documentos")
    } catch (error) {
      toast.error("Erro ao gerar documento via API.")
    } finally {
      setIsGenerating(false)
    }
  }

  const processedContent = template
    ? substituirVariaveis(template.conteudo, dados)
    : ""

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
      title="Gerar Documento"
      subtitle={template.nome_template}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button variant="ghost" asChild>
            <Link href="/templates">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGeneratePDF} disabled={isGenerating}>
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Button onClick={handleGeneratePDF} disabled={isGenerating}>
              <FileDown className="h-4 w-4" />
              {isGenerating ? "Gerando..." : "Exportar PDF"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Preencher Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {variaveis.map((varName) => {
                  const info = getVariableInfo(varName)
                  return (
                    <div key={varName} className="space-y-2">
                      <Label htmlFor={varName} className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          {`{{${varName}}}`}
                        </span>
                        <span>{info?.descricao || varName}</span>
                      </Label>
                      <Input
                        id={varName}
                        placeholder={info?.exemplo || `Informe ${varName}`}
                        value={dados[varName] || ""}
                        onChange={(e) => handleInputChange(varName, e.target.value)}
                      />
                    </div>
                  )
                })}
                {variaveis.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Este template não possui variáveis.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                Preview do Documento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="relative mx-auto bg-white shadow-lg rounded-sm overflow-hidden border border-border"
                style={{
                  width: "100%",
                  maxHeight: "600px",
                  overflowY: "auto",
                }}
              >
                {template.imagem_fundo && (
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                    style={{
                      backgroundImage: `url(${template.imagem_fundo})`,
                    }}
                  />
                )}
                <div
                  ref={previewRef}
                  className="relative p-6 prose prose-sm max-w-none !text-black"
                  style={{
                    fontFamily: "Times New Roman, serif",
                    fontSize: "11pt",
                    lineHeight: "1.6",
                    color: "#000000",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: processedContent
                      .replace(
                        /{{(\w+)}}/g,
                        '<span style="background-color: #fee2e2; color: #991b1b; padding: 0 4px; border-radius: 4px; font-family: monospace; font-size: 0.75rem;">{{$1}}</span>'
                      ),
                  }}
                />
              </div>
              
              {/* Unfilled variables warning */}
              {variaveis.some((v) => !dados[v]) && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    Existem variáveis não preenchidas. Preencha todos os campos
                    para gerar o documento completo.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
