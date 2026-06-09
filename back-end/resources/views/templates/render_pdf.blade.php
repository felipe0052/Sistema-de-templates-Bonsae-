<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Documento Gerado</title>
    <style>
        html,
        body {
            margin: 0;
            padding: 0;
            font-family: "Times New Roman", Times, serif;
            font-size: 12pt;
            line-height: 1.7;
            color: #000000;
            background: #ffffff;
        }

        * {
            box-sizing: border-box;
        }

        .content {
            position: relative;
            z-index: 1;
            width: 100%;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }

        p {
            margin: 0 0 12pt 0;
            text-indent: 1.25cm;
        }

        p[style*="text-align"] {
            text-indent: 0;
        }

        p[style*="min-height"],
        p:empty {
            min-height: 1.7em;
            display: flow-root;
            text-indent: 0;
        }

        p[style*="min-height"]::before,
        p:empty::before {
            content: "\00a0";
            white-space: pre;
        }

        h1, h2, h3, h4, h5, h6 {
            margin: 0 0 12pt 0;
            text-indent: 0;
            text-align: center;
            page-break-after: avoid;
            page-break-inside: avoid;
        }

        ul, ol {
            margin: 0 0 12pt 1.2cm;
            padding: 0;
            text-indent: 0;
        }

        li {
            margin: 0 0 6pt 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            page-break-inside: auto;
        }

        tr {
            page-break-inside: avoid;
            page-break-after: auto;
        }

        img {
            max-width: 100%;
            height: auto;
            page-break-inside: avoid;
        }

        .no-break {
            page-break-inside: avoid;
        }

        .page-break {
            page-break-before: always;
        }
    </style>
</head>
<body>
    <div class="content">
        {!! $content !!}
    </div>
</body>
</html>
