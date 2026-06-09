import { useRef } from "react"
import { TipTapEditor, type TipTapEditorHandle } from "@/components/tiptap-editor"

interface EditorTabProps {
  content: string
  setContent: (value: string) => void
  variables: Array<{ variable_name: string; description: string }>
  variableCatalogAvailable: boolean
  hasUnknownVariables: boolean
  unknownVariables: string[]
}

export function EditorTab({
  content,
  setContent,
  variables,
  variableCatalogAvailable,
  hasUnknownVariables,
  unknownVariables,
}: EditorTabProps) {
  const editorRef = useRef<TipTapEditorHandle>(null)

  return (
    <>
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
          availableVariables={variables.map((item) => ({
            variable_name: item.variable_name,
            description: item.description,
          }))}
          variableCatalogAvailable={variableCatalogAvailable}
          placeholder="Digite o conteúdo do template. Use {{ para inserir variáveis."
        />
      </div>
    </>
  )
}
