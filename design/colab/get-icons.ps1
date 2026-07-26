# Télécharge les mêmes 20 icônes dans 4 jeux libres, pour comparaison à l'identique.
# Chaque jeu a sa nomenclature : d'où la table de correspondance.
$ErrorActionPreference = 'Continue'
$root = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) 'icons'
$UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'

$sets = @{
  lucide   = 'https://unpkg.com/lucide-static@latest/icons/{0}.svg'
  phosphor = 'https://unpkg.com/@phosphor-icons/core@latest/assets/regular/{0}.svg'
  feather  = 'https://unpkg.com/feather-icons@latest/dist/icons/{0}.svg'
  tabler   = 'https://unpkg.com/@tabler/icons@latest/icons/outline/{0}.svg'
}

# nom canonique = @(lucide, phosphor, feather, tabler)
$map = [ordered]@{
  play      = @('play',            'play',               'play',            'player-play')
  pause     = @('pause',           'pause',              'pause',           'player-pause')
  waveform  = @('audio-waveform',  'waveform',           'activity',        'wave-sine')
  fileAudio = @('file-audio',      'file-audio',         'file-text',       'file-music')
  versions  = @('git-branch',      'git-branch',         'git-branch',      'git-branch')
  upload    = @('upload',          'upload-simple',      'upload',          'upload')
  download  = @('download',        'download-simple',    'download',        'download')
  attach    = @('paperclip',       'paperclip',          'paperclip',       'paperclip')
  send      = @('send',            'paper-plane-right',  'send',            'send')
  members   = @('users',           'users',              'users',           'users')
  settings  = @('settings',        'gear',               'settings',        'settings')
  search    = @('search',          'magnifying-glass',   'search',          'search')
  calendar  = @('calendar',        'calendar',           'calendar',        'calendar')
  plus      = @('plus',            'plus',               'plus',            'plus')
  check     = @('check',           'check',              'check',           'check')
  alert     = @('alert-triangle',  'warning',            'alert-triangle',  'alert-triangle')
  close     = @('x',               'x',                  'x',               'x')
  more      = @('more-horizontal', 'dots-three',         'more-horizontal', 'dots')
  chevron   = @('chevron-right',   'caret-right',        'chevron-right',   'chevron-right')
  trash     = @('trash-2',         'trash',              'trash-2',         'trash')
}

$order = @('lucide', 'phosphor', 'feather', 'tabler')
$report = @{}

for ($i = 0; $i -lt $order.Count; $i++) {
  $set = $order[$i]
  $dir = Join-Path $root $set
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  $ok = 0; $miss = @()
  foreach ($canon in $map.Keys) {
    $name = $map[$canon][$i]
    $url = $sets[$set] -f $name
    try {
      Invoke-WebRequest -Uri $url -OutFile (Join-Path $dir "$canon.svg") -UserAgent $UA -TimeoutSec 25
      $ok++
    } catch { $miss += "$canon($name)" }
  }
  $report[$set] = @{ ok = $ok; miss = $miss }
}

foreach ($set in $order) {
  $r = $report[$set]
  "{0,-9} {1}/{2}{3}" -f $set, $r.ok, $map.Count, ($(if ($r.miss.Count) { "   manquantes: " + ($r.miss -join ', ') } else { '' }))
}
