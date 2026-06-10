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

            .tiptap-editor-content .tiptap p[style*="min-height"],
            .tiptap-editor-content .tiptap p:empty,
            .tiptap-editor-content .tiptap p[data-empty] {
                min-height: 1.7em;
                display: flow-root;
                text-indent: 0;
            }

            .tiptap-editor-content .tiptap p[style*="min-height"]::before,
            .tiptap-editor-content .tiptap p:empty::before,
            .tiptap-editor-content .tiptap p[data-empty]::before {
                content: "\\00A0";
                white-space: pre;
            }

            .tiptap-editor-content .tiptap h1 {
                margin: 0 0 12pt 0;
                text-indent: 0;
                text-align: center;
                font-size: 24pt;
                font-weight: bold;
            }

            .tiptap-editor-content .tiptap h2 {
                margin: 0 0 12pt 0;
                text-indent: 0;
                text-align: center;
                font-size: 18pt;
                font-weight: bold;
            }

            .tiptap-editor-content .tiptap h3 {
                margin: 0 0 12pt 0;
                text-indent: 0;
                text-align: center;
                font-size: 14pt;
                font-weight: bold;
            }

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

            .tiptap-editor-content
                .tiptap
                .is-editor-empty:first-child::before {
                content: attr(data-placeholder);
                float: left;
                height: 0;
                pointer-events: none;
                color: hsl(var(--muted-foreground) / 0.6);
                font-family: "Inter", "Geist", var(--font-sans), sans-serif;
                font-style: italic;
                font-size: 14px;
                font-weight: 400;
                line-height: 1.5;
                text-decoration: none;
                text-indent: 0;
                text-align: left;
                display: inline-block;
                max-width: 100%;
            }
        `}</style>
    );
}
