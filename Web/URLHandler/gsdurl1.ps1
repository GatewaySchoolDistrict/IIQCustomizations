$param1=$args[0]


$param1

if ($param1 -match "printstudentassetlabel"){

    [void][System.Reflection.Assembly]::LoadFile("C:\Apps\GSDURLHandler\libraries\Interop.bpac.dll")

    $Printers = New-Object bpac.PrinterClass
    $Label = New-Object bpac.DocumentClass


    $urlparams=@{}
    ([System.Uri]$param1).Query -replace '^\?','' -split "&" | ForEach-Object {$_ -match "(.*)=(.*)";$urlparams[$Matches[1]]=$Matches[2] }

    if ($urlparams.username -eq $null -or $urlparams.studentid -eq $null -or $urlparams.username -eq '' -or $urlparams.studentid -eq ''){
        Write-Warning "Error - No username or studentid found to print"
    } else {

    Write-Host "Printing label for $($urlparams.username.ToUpper())/$($urlparams.studentid)"


    $Label.open("C:\Apps\GSDURLHandler\content\studentassetlabel.lbx")
    $Label.SetText(0,$urlparams.username.ToUpper())
    $Label.SetBarcodeData(0,$urlparams.studentid)

    $Label.StartPrint('',0x1)
    $Label.PrintOut(1, 0)
    $Label.EndPrint()
    $Label.Close()

    Start-Sleep 3
}




}



