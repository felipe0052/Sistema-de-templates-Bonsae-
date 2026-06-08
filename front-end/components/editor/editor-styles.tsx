export function EditorStyles() {
  return (
    <style jsx global>{`
      .tiptap-editor-content .tiptap {
        min-height: 400px;
        outline: none;
        width: 100%;
        max-width: 210mm;
        box-sizing: border-box;
        color: #000000;
        font-family: "Times New Roman", Times, serif;
        font-size: 12pt;
        line-height: 1.7;
        padding: 3cm 2.5cm 2.5cm 2.5cm;
      }

      .tiptap-editor-content .tiptap:focus {
        box-shadow: inset 0 0 0 2px hsl(var(--ring));
      }

      .tiptap-editor-content .tiptap p {
        margin: 0 0 12pt 0;
        text-indent: 1.25cm;
      }

      .tiptap-editor-content .tiptap p[style*="text-align"] {
        text-indent: 0;
      }

      .tiptap-editor-content .tiptap h1,
      .tiptap-editor-content .tiptap h2,
      .tiptap-editor-content .tiptap h3,
      .tiptap-editor-content .tiptap h4,
      .tiptap-editor-content .tiptap h5,
      .tiptap-editor-content .tiptap h6 {
        margin: 0 0 12pt 0;
        text-indent: 0;
        text-align: center;
      }

      .tiptap-editor-content .tiptap ul {
        margin: 0 0 12pt 1.2cm;
        padding: 0;
        text-indent: 0;
        list-style: disc outside;
      }

      .tiptap-editor-content .tiptap ol {
        margin: 0 0 12pt 1.2cm;
        padding: 0;
        text-indent: 0;
        list-style: decimal outside;
      }

      .tiptap-editor-content .tiptap li {
        margin: 0 0 6pt 0;
      }

      .tiptap-editor-content div[data-node-view-wrapper] {
        display: inline;
      }

      .tiptap-editor-content .tiptap .is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        float: left;
        color: hsl(var(--muted-foreground) / 0.6);
        pointer-events: none;
        height: 0;
        font-family: 'Inter', 'Geist', var(--font-sans), sans-serif;
        font-style: italic;
        font-size: 14px;
      }
    `}</style>
  )
}
