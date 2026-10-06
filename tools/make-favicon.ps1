param(
  [Parameter(Mandatory = $true)][string]$Source,
  [Parameter(Mandatory = $true)][string]$OutputDirectory
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$sourceImage = [Drawing.Image]::FromFile($Source)
try {
  $iconImages = @()
  foreach ($size in @(16, 32, 48, 180, 192)) {
    $bitmap = [Drawing.Bitmap]::new($size, $size)
    $graphics = [Drawing.Graphics]::FromImage($bitmap)
    $stream = [IO.MemoryStream]::new()
    try {
      $graphics.Clear([Drawing.Color]::Transparent)
      $graphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $ratio = [Math]::Min($size / $sourceImage.Width, $size / $sourceImage.Height)
      $width = [int]($sourceImage.Width * $ratio)
      $height = [int]($sourceImage.Height * $ratio)
      $graphics.DrawImage($sourceImage, [int](($size - $width) / 2), [int](($size - $height) / 2), $width, $height)
      $bitmap.Save($stream, [Drawing.Imaging.ImageFormat]::Png)
      $bytes = $stream.ToArray()
      if ($size -le 48) { $iconImages += @{ Size = $size; Bytes = $bytes } }
      if ($size -eq 32 -or $size -eq 192) {
        [IO.File]::WriteAllBytes((Join-Path $OutputDirectory "favicon-ff-$size.png"), $bytes)
      }
      if ($size -eq 180) {
        [IO.File]::WriteAllBytes((Join-Path $OutputDirectory 'apple-touch-icon.png'), $bytes)
      }
    } finally {
      $stream.Dispose()
      $graphics.Dispose()
      $bitmap.Dispose()
    }
  }
  $ico = [IO.File]::Create((Join-Path $OutputDirectory 'favicon.ico'))
  $writer = [IO.BinaryWriter]::new($ico)
  try {
    $writer.Write([uint16]0)
    $writer.Write([uint16]1)
    $writer.Write([uint16]$iconImages.Count)
    $offset = 6 + 16 * $iconImages.Count
    foreach ($entry in $iconImages) {
      $writer.Write([byte]$entry.Size)
      $writer.Write([byte]$entry.Size)
      $writer.Write([uint16]0)
      $writer.Write([uint16]1)
      $writer.Write([uint16]32)
      $writer.Write([uint32]$entry.Bytes.Length)
      $writer.Write([uint32]$offset)
      $offset += $entry.Bytes.Length
    }
    foreach ($entry in $iconImages) { $writer.Write([byte[]]$entry.Bytes) }
  } finally { $writer.Dispose() }
} finally { $sourceImage.Dispose() }
