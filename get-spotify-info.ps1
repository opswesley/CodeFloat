# Verifica se o Spotify está tocando
$session = Get-WmiObject -Query "SELECT * FROM Win32_Process WHERE Name = 'Spotify.exe'"
if ($session) {
    $title = (Get-Process -Name Spotify).MainWindowTitle
    if ($title -and $title -ne "Spotify Free" -and $title -ne "Spotify Premium") {
        $parts = $title -split " - "
        $artist = $parts[0]
        $track = $parts[1]

        # Retorna um JSON válido
        $output = @{
            name  = $track
            artist = $artist
        } | ConvertTo-Json

        Write-Output $output
    } else {
        # Retorna um JSON indicando que nenhuma música está tocando
        Write-Output (@{ message = "Nenhuma música tocando." } | ConvertTo-Json)
    }
} else {
    # Retorna um JSON indicando que o Spotify não está aberto
    Write-Output (@{ message = "Spotify não está aberto." } | ConvertTo-Json)
}