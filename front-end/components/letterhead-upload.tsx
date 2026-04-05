"use client"

import { useCallback, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, Image as ImageIcon, FileImage } from "lucide-react"
import { cn } from "@/lib/utils"

interface LetterheadUploadProps {
  value: string | null
  onChange: (value: string | null) => void
}

export function LetterheadUpload({ value, onChange }: LetterheadUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files && files.length > 0) {
        handleFile(files[0])
      }
    },
    [onChange]
  )

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione um arquivo de imagem.")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      onChange(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleRemove = () => {
    onChange(null)
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <FileImage className="h-4 w-4 text-primary" />
          Papel Timbrado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Faça upload de uma imagem para usar como papel timbrado (fundo) do documento.
            A imagem será aplicada como marca d&apos;água no documento gerado.
          </p>

          {!value ? (
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
              onDrag={handleDrag}
              onDragStart={handleDrag}
              onDragEnd={handleDrag}
              onDragOver={handleDragIn}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDrop={handleDrop}
              onClick={() => document.getElementById("letterhead-input")?.click()}
            >
              <input
                id="letterhead-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
              />
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Arraste uma imagem ou clique para fazer upload
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PNG, JPG ou JPEG (max. 5MB)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative border border-border rounded-lg overflow-hidden">
                <img
                  src={value}
                  alt="Papel timbrado"
                  className="w-full h-auto max-h-96 object-contain bg-muted/20"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("letterhead-input")?.click()}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Trocar imagem
                </Button>
                <input
                  id="letterhead-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </div>
            </div>
          )}

          {/* Preview tip */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-sm text-foreground mb-2">
              Dicas para o papel timbrado:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Use imagens em alta resolução (300 DPI recomendado)</li>
              <li>O tamanho ideal é A4 (210mm x 297mm)</li>
              <li>A imagem será aplicada com opacidade reduzida como marca d&apos;água</li>
              <li>Evite imagens muito escuras para não prejudicar a leitura do texto</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
