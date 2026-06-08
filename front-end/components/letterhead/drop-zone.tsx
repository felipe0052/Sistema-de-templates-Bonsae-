"use client"

import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropZoneProps {
  isDragging: boolean
  onDrag: (e: React.DragEvent) => void
  onDragIn: (e: React.DragEvent) => void
  onDragOut: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onDragStart?: (e: React.DragEvent) => void
  onDragEnd?: (e: React.DragEvent) => void
  onDragOver?: (e: React.DragEvent) => void
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputId: string
}

export function DropZone({
  isDragging,
  onDrag,
  onDragIn,
  onDragOut,
  onDrop,
  onDragStart,
  onDragEnd,
  onDragOver,
  onFileInput,
  inputId,
}: DropZoneProps) {
  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      )}
      onDrag={onDrag}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragEnter={onDragIn}
      onDragLeave={onDragOut}
      onDrop={onDrop}
      onClick={() => document.getElementById(inputId)?.click()}
    >
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileInput}
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
  )
}
