export function LetterheadTips() {
  return (
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
  )
}
