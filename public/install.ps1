$ErrorActionPreference = "Stop"
$base = "https://github.com/B-Divyesh/sf-calendar-ics-snapshots/releases/latest/download"
$manifest = Invoke-RestMethod "$base/latest.json"
$asset = $manifest.platforms.windows
if (-not $asset.url -or -not $asset.sha256) { throw "Release manifest is missing the Windows installer." }
$temp = Join-Path ([System.IO.Path]::GetTempPath()) $asset.name
Invoke-WebRequest $asset.url -OutFile $temp
$actual = (Get-FileHash -Algorithm SHA256 $temp).Hash.ToLowerInvariant()
if ($actual -ne $asset.sha256.ToLowerInvariant()) { Remove-Item $temp; throw "Checksum verification failed; nothing was installed." }
Write-Host "Verified SHA256 for $($asset.name)."
if ($temp.EndsWith(".msi")) { Start-Process msiexec.exe -ArgumentList "/i `"$temp`"" -Wait }
else { Start-Process $temp -Wait }
Write-Host "Calendar Snapshotter installer finished. This preview is unsigned; Windows may show a SmartScreen notice."
