"use client"

import { useCallback, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileImage } from "lucide-react"
import { DropZone } from "@/components/letterhead/drop-zone"
import { ImagePreview } from "@/components/letterhead/image-preview"
import { LetterheadTips } from "@/components/letterhead/tips"

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

  const inputId = "letterhead-input"

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
            <DropZone
              isDragging={isDragging}
              onDrag={handleDrag}
              onDragIn={handleDragIn}
              onDragOut={handleDragOut}
              onDrop={handleDrop}
              onDragStart={handleDrag}
              onDragEnd={handleDrag}
              onDragOver={handleDragIn}
              onFileInput={handleFileInput}
              inputId={inputId}
            />
          ) : (
            <ImagePreview
              value={value}
              onRemove={handleRemove}
              onSwap={() => document.getElementById(inputId)?.click()}
              inputId={inputId}
              onFileInput={handleFileInput}
            />
          )}

          <LetterheadTips />
        </div>
      </CardContent>
    </Card>
  )
}
