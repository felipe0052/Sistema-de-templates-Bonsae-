"use client"

import { Button } from "@/components/ui/button"
import { X, Image as ImageIcon } from "lucide-react"

interface ImagePreviewProps {
  value: string
  onRemove: () => void
  onSwap: () => void
  inputId: string
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function ImagePreview({
  value,
  onRemove,
  onSwap,
  inputId,
  onFileInput,
}: ImagePreviewProps) {
  return (
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
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => document.getElementById(inputId)?.click()}
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Trocar imagem
        </Button>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileInput}
        />
      </div>
    </div>
  )
}
