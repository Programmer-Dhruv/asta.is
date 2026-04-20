# Download Anime Images for Watch Page
$baseUrl = "C:\Users\devel\Desktop\asta.is\src\assets\images"

# Anime poster images (high quality)
$images = @(
    @{Name="demonslayer-poster.webp"; Url="https://cdn.myanimelist.net/images/anime/1286/99889.jpg"},
    @{Name="demonslayer-cover.webp"; Url="https://cdn.myanimelist.net/images/anime/1286/99889l.jpg"},
    @{Name="attackontitan.webp"; Url="https://cdn.myanimelist.net/images/anime/10/47347.jpg"},
    @{Name="jujutsu.webp"; Url="https://cdn.myanimelist.net/images/anime/1171/109222.jpg"},
    @{Name="chainsaw.webp"; Url="https://cdn.myanimelist.net/images/anime/1806/126216.jpg"},
    @{Name="spyfamily.webp"; Url="https://cdn.myanimelist.net/images/anime/1641/122795.jpg"},
    @{Name="myheroacademia.webp"; Url="https://cdn.myanimelist.net/images/anime/10/78745.jpg"}
)

# Create directories
$dirs = @("$baseUrl\poster", "$baseUrl\episodes", "$baseUrl\related", "$baseUrl\avatars")
foreach ($dir in $dirs) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
}

Write-Host "Downloading anime images..."

# Download main poster to poster folder
$posterUrl = "https://cdn.myanimelist.net/images/anime/1286/99889.jpg"
$posterPath = "$baseUrl\poster\demonslayer-poster.jpg"
try {
    Invoke-WebRequest -Uri $posterUrl -OutFile $posterPath -UserAgent "Mozilla/5.0" -TimeoutSec 30
    Write-Host "Downloaded: demonslayer-poster.jpg"
} catch {
    Write-Host "Failed to download poster: $_"
}

# Download related anime posters
$relatedImages = @(
    @{Name="attackontitan.webp"; Url="https://cdn.myanimelist.net/images/anime/10/47347.jpg"},
    @{Name="jujutsu.webp"; Url="https://cdn.myanimelist.net/images/anime/1171/109222.jpg"},
    @{Name="chainsaw.webp"; Url="https://cdn.myanimelist.net/images/anime/1806/126216.jpg"},
    @{Name="spyfamily.webp"; Url="https://cdn.myanimelist.net/images/anime/1641/122795.jpg"},
    @{Name="myheroacademia.webp"; Url="https://cdn.myanimelist.net/images/anime/10/78745.jpg"}
)

$relatedDir = "$baseUrl\related"
foreach ($img in $relatedImages) {
    $path = "$relatedDir\$($img.Name)"
    try {
        Invoke-WebRequest -Uri $img.Url -OutFile $path -UserAgent "Mozilla/5.0" -TimeoutSec 30
        Write-Host "Downloaded: $($img.Name)"
    } catch {
        Write-Host "Failed: $($img.Name)"
    }
    Start-Sleep -Milliseconds 500
}

# Download episode thumbnails (use poster as placeholder with different aspect)
$epDir = "$baseUrl\episodes"
$episodeThumbnails = @(
    "episode-1.webp", "episode-2.webp", "episode-3.webp", "episode-4.webp", "episode-5.webp",
    "episode-6.webp", "episode-7.webp", "episode-8.webp", "episode-9.webp", "episode-10.webp",
    "episode-11.webp", "episode-12.webp"
)

foreach ($ep in $episodeThumbnails) {
    $path = "$epDir\$ep"
    try {
        Invoke-WebRequest -Uri $posterUrl -OutFile $path -UserAgent "Mozilla/5.0" -TimeoutSec 30
        Write-Host "Downloaded: $ep"
    } catch {
        Write-Host "Failed: $ep"
    }
}

Write-Host "All downloads complete!"
