# Verifica se o Spotify está tocando
$session = Get-WmiObject -Query "SELECT * FROM Win32_Process WHERE Name = 'Spotify.exe'"
if ($session) {
    $title = (Get-Process -Name Spotify).MainWindowTitle
    if ($title -and $title -ne "Spotify Free" -and $title -ne "Spotify Premium") {
        $parts = $title -split " - "
        $artist = $parts[0]
        $track = $parts[1]
        
        $output = @{
            name  = $track
            artist = $artist
        } | ConvertTo-Json

        Write-Output $output
    } else {
        Write-Output (@{ message = "Nenhuma música tocando." } | ConvertTo-Json)
    }
} else {
    Write-Output (@{ message = "Spotify não está aberto." } | ConvertTo-Json)
}
