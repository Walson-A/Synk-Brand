# Génère _directions.html depuis _directions.src.html en remplaçant le marqueur
# /* @FONTFACES */ par les @font-face en data URI.
#
# Pourquoi : les artifacts claude.ai appliquent une CSP stricte qui bloque tout hôte
# externe (donc fonts.gstatic.com) ET les chemins de fichiers locaux. Une police doit
# donc être embarquée dans le HTML, sinon elle tombe silencieusement sur system-ui.
#
# Les woff2 de fonts/ sont des polices VARIABLES : un fichier couvre 100-900.
#
# Usage :  pwsh design/colab/build-type.ps1

$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$src  = Join-Path $here '_directions.src.html'
$dst  = Join-Path $here '_directions.html'
$dir  = Join-Path $here 'fonts'

# nom de fichier → famille CSS déclarée
$families = [ordered]@{
  'Inter'        = 'Inter'
  'Geist'        = 'Geist'
  'Archivo'      = 'Archivo'
  'Manrope'      = 'Manrope'
  'IBMPlexSans'  = 'IBM Plex Sans'
  'SpaceGrotesk' = 'Space Grotesk'
  'Sora'         = 'Sora'
}

$rules = New-Object System.Text.StringBuilder
[void]$rules.AppendLine("  /* Polices libres (OFL) embarquées en data URI — variables, 100-900. */")

$total = 0
foreach ($file in $families.Keys) {
  $path = Join-Path $dir "$file.woff2"
  if (-not (Test-Path $path)) { throw "police manquante : $path" }
  $bytes = [System.IO.File]::ReadAllBytes($path)
  $total += $bytes.Length
  $b64 = [Convert]::ToBase64String($bytes)
  [void]$rules.AppendLine("  @font-face {")
  [void]$rules.AppendLine("    font-family: '$($families[$file])';")
  [void]$rules.AppendLine("    font-style: normal;")
  [void]$rules.AppendLine("    font-weight: 100 900;")
  [void]$rules.AppendLine("    font-display: block;")
  [void]$rules.AppendLine("    src: url(data:font/woff2;base64,$b64) format('woff2-variations');")
  [void]$rules.AppendLine("  }")
}

# Le mark COLAB, blanc sur transparent — le vrai logo owner, pas un placeholder.
$markPath = Join-Path (Split-Path -Parent $here) '..\src\logo\colab\colab-mark-white.png'
$markPath = [System.IO.Path]::GetFullPath($markPath)
if (-not (Test-Path $markPath)) { throw "mark manquant : $markPath" }
$markB64 = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes($markPath))
$logoJs = "  const LOGO_MARK = 'data:image/png;base64,$markB64';"

$html = [System.IO.File]::ReadAllText($src)
foreach ($m in @('/* @FONTFACES', '/* @LOGO')) {
  if ($html -notmatch [regex]::Escape($m)) { throw "marqueur $m absent de $src" }
}

# remplace la ligne complète de chaque marqueur (commentaires sur une ligne)
$html = [regex]::Replace($html, '/\* @FONTFACES[^\r\n]*\*/', $rules.ToString().TrimEnd())
$html = [regex]::Replace($html, '/\* @LOGO[^\r\n]*\*/', $logoJs)
[System.IO.File]::WriteAllText($dst, $html, [System.Text.UTF8Encoding]::new($false))

"{0} polices embarquees" -f $families.Count
"woff2 source : {0} Ko" -f [math]::Round($total / 1kb, 1)
"_directions.html : {0} Ko" -f [math]::Round((Get-Item $dst).Length / 1kb, 1)
