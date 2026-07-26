# Génère _foundations.html depuis _foundations.src.html.
# Remplace deux marqueurs :
#   /* @FONT */   -> @font-face IBM Plex Sans en data URI
#   /* @ICONS */  -> const ICONS = { jeu: { nom: "<svg…>" } }
#
# Même raison que pour les polices : la CSP des artifacts bloque les hôtes externes
# ET les chemins locaux. Tout doit être embarqué, sinon ça tombe silencieusement.
#
# Usage :  pwsh design/colab/build-foundations.ps1

$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$src  = Join-Path $here '_foundations.src.html'
$dst  = Join-Path $here '_foundations.html'

# ---- police ----
$woff = Join-Path $here 'fonts\IBMPlexSans.woff2'
if (-not (Test-Path $woff)) { throw "police manquante : $woff" }
$b64 = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes($woff))
$fontRule = @"
  @font-face {
    font-family: 'IBM Plex Sans';
    font-style: normal;
    font-weight: 100 900;
    font-display: block;
    src: url(data:font/woff2;base64,$b64) format('woff2-variations');
  }
"@

# ---- icônes ----
$icons = [ordered]@{}
foreach ($dir in (Get-ChildItem (Join-Path $here 'icons') -Directory | Sort-Object Name)) {
  $set = [ordered]@{}
  foreach ($f in (Get-ChildItem $dir.FullName -Filter *.svg | Sort-Object Name)) {
    $svg = [System.IO.File]::ReadAllText($f.FullName)
    $svg = [regex]::Replace($svg, '<!--.*?-->', '', 'Singleline')       # licences en commentaire
    $svg = [regex]::Replace($svg, '\s(width|height|class)="[^"]*"', '') # taille pilotée par le CSS
    $svg = [regex]::Replace($svg, '\s+', ' ').Trim()                    # une seule ligne
    $set[$f.BaseName] = $svg
  }
  $icons[$dir.Name] = $set
}
$iconsJs = "  const ICONS = " + ($icons | ConvertTo-Json -Depth 5 -Compress) + ";"

# ---- injection ----
$html = [System.IO.File]::ReadAllText($src)
foreach ($m in @('/* @FONT', '/* @ICONS')) {
  if ($html -notmatch [regex]::Escape($m)) { throw "marqueur $m absent de $src" }
}
$html = [regex]::Replace($html, '/\* @FONT[^\r\n]*\*/', $fontRule.TrimEnd())
$html = [regex]::Replace($html, '/\* @ICONS[^\r\n]*\*/', $iconsJs)
[System.IO.File]::WriteAllText($dst, $html, [System.Text.UTF8Encoding]::new($false))

"jeux d'icones : {0}" -f $icons.Count
foreach ($k in $icons.Keys) { "  {0,-9} {1} icones" -f $k, $icons[$k].Count }
"_foundations.html : {0} Ko" -f [math]::Round((Get-Item $dst).Length / 1kb, 1)
