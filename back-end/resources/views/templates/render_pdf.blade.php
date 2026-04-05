<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Documento Gerado</title>
    <style>
        @page {
            margin: 0;
        }
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            position: relative;
            width: 21cm;
            height: 29.7cm;
        }
        .background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background-image: url('{{ $backgroundImage }}');
            background-size: cover;
            background-position: center;
            opacity: 1;
        }
        .content {
            padding: 2.5cm 2.5cm; /* Margens padrão ABNT ou conforme necessário */
            position: relative;
            z-index: 1;
            line-height: 1.5;
            font-size: 12pt;
        }
    </style>
</head>
<body>
    @if($backgroundImage)
        <div class="background"></div>
    @endif
    <div class="content">
        {!! $content !!}
    </div>
</body>
</html>
