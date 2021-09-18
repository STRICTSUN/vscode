. build/azure-pipelines/win32/exec.ps1
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$ARTIFACT_PROCESSED_WILDCARD_PATH = "$env:PIPELINE_WORKSPACE/artifacts_processed_*/artifacts_processed_*"
$ARTIFACT_PROCESSED_FILE_PATH = "$env:PIPELINE_WORKSPACE/artifacts_processed_$env:SYSTEM_STAGEATTEMPT/artifacts_processed_$env:SYSTEM_STAGEATTEMPT.txt"

function Get-PipelineArtifact {
	param($Name = '*')
	try {
		$res = Invoke-RestMethod "$($env:BUILDS_API_URL)artifacts?api-version=6.0" -Headers @{
			Authorization = "Bearer $env:SYSTEM_ACCESSTOKEN"
		} -MaximumRetryCount 5 -RetryIntervalSec 1

		if (!$res) {
			return
		}

		$res.value | Where-Object { $_.name -Like $Name }
	} catch {
		Write-Warning $_
	}
}

#���� ����� ����� �����������, ����� ��������� ��� ���� ����������.
$set = [System.Collections.Generic.HashSet[string]]::new()

if (Test-Path $ARTIFACT_PROCESSED_WILDCARD_PATH) {
	# �������� ��������� ��������� ���� artifact_processed � ��������� �� ���� ��� ��� ������������ �������.
	# ��� ��������, ��� ��������� ���� artifact_processed_*.txt �������� �� ���������� ���������� ������.
	# ��������. ���������, �������� kusto, �������� ������ � PS7 + � ������ � ���������, �� �� � REPL.
	Get-ChildItem $ARTIFACT_PROCESSED_WILDCARD_PATH
		| Sort-Object
		| Select-Object -Last 1
		| Get-Content
		| ForEach-Object {
			$set.Add($_) | Out-Null
			Write-Host "��� ������������ ��������: $_"
		}
}

# �������� ����� ���������, ������� ����� �������������� ��� ����� �������.
New-Item -Path $ARTIFACT_PROCESSED_FILE_PATH -Force | Out-Null

# �������, ����� ����� ��� ����� ���������.
$stages = @(
	if ($env:VSCODE_BUILD_STAGE_WINDOWS -eq 'True') { 'Windows' }
	if ($env:VSCODE_BUILD_STAGE_LINUX -eq 'True') { 'Linux' }
	if ($env:VSCODE_BUILD_STAGE_MACOS -eq 'True') { 'macOS' }
)

do {
	Start-Sleep -Seconds 10

	$artifacts = Get-PipelineArtifact -Name 'vscode_*'
	if (!$artifacts) {
		continue
	}

	$artifacts | ForEach-Object {
		$artifactName = $_.name
		if($set.Add($artifactName)) {
			Write-Host "��������� ��������� '$artifactName. ���������� �: $($_.resource.downloadUrl)"

			try {
				Invoke-RestMethod $_.resource.downloadUrl -OutFile "$env:AGENT_TEMPDIRECTORY/$artifactName.zip" -Headers @{
					Authorization = "Bearer $env:SYSTEM_ACCESSTOKEN"
				} -MaximumRetryCount 5 -RetryIntervalSec 1  | Out-Null

				Expand-Archive -Path "$env:AGENT_TEMPDIRECTORY/$artifactName.zip" -DestinationPath $env:AGENT_TEMPDIRECTORY | Out-Null
			} catch {
				Write-Warning $_
				$set.Remove($artifactName) | Out-Null
				continue
			}

			$null,$product,$os,$arch,$type = $artifactName -split '_'
			$asset = Get-ChildItem -rec "$env:AGENT_TEMPDIRECTORY/$artifactName"
			Write-Host "��������� ��������� �� ���������� ����������:"
			# ����������� � ������ ������ ��� ����, ����� ������� ����� � �������.
			@{
				product = $product
				os = $os
				arch = $arch
				type = $type
				asset = $asset.Name
			} | Format-Table

			exec { node build/azure-pipelines/common/createAsset.js $product $os $arch $type $asset.Name $asset.FullName }
			$artifactName >> $ARTIFACT_PROCESSED_FILE_PATH
		}
	}

	#��������� ������� � ����������, ������� �� � ��, ��� ������ ���� ��������.
	try {
		$timeline = Invoke-RestMethod "$($env:BUILDS_API_URL)timeline?api-version=6.0" -Headers @{
			Authorization = "Bearer $env:SYSTEM_ACCESSTOKEN"
		}  -MaximumRetryCount 5 -RetryIntervalSec 1
	} catch {
		Write-Warning $_
		continue
	}

	foreach ($stage in $stages) {
		$otherStageFinished = $timeline.records | Where-Object { $_.name -eq $stage -and $_.type -eq 'stage' -and $_.state -eq 'completed' }
		if (!$otherStageFinished) {
			break
		}
	}

	$artifacts = Get-PipelineArtifact -Name 'vscode_*'
	$artifactsStillToProcess = $artifacts.Count -ne $set.Count
} while (!$otherStageFinished -or $artifactsStillToProcess)

Write-Host "���������� $($set.Count) ����������."
