import { escapeHtml } from "@/lib/document-utils"

const PRINT_CSS = `
  @page { size: A4; margin: 0; }
  html, body {
    margin: 0; padding: 0;
    font-family: "Times New Roman", Times, serif;
    font-size: 12pt; line-height: 1.7;
    color: #000; background: #fff;
  }
  * { box-sizing: border-box; }
  .print-page {
    width: 100%; max-width: 210mm; min-height: 297mm;
    margin: 0 auto; padding: 3cm 2.5cm 2.5cm 2.5cm;
    box-sizing: border-box;
  }
  p { margin: 0 0 12pt 0; text-indent: 1.25cm; }
  p[style*="text-align"] { text-indent: 0; }
  h1, h2, h3, h4, h5, h6 {
    margin: 0 0 12pt 0; text-indent: 0; text-align: center;
  }
  ul, ol { margin: 0 0 12pt 1.2cm; padding: 0; text-indent: 0; }
  ul { list-style: disc outside; }
  ol { list-style: decimal outside; }
  li { margin: 0 0 6pt 0; }
`

const PRINT_SCRIPT = `
  window.onload = function() {
    setTimeout(function() { window.print(); }, 500);
    window.onafterprint = function() { window.close(); }
  }
`

export function buildPrintHtml(renderedHtml: string, title: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <title>${escapeHtml(title)}</title>
  <style>${PRINT_CSS}</style>
</head>
<body>
  <div class="print-page">${renderedHtml}</div>
  <script>${PRINT_SCRIPT}</script>
</body>
</html>`
}
