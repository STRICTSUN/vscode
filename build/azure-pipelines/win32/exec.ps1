# ����� � psake https://github.com/psake/psake

<#
.SYNOPSIS
  ��� ��������������� �������, ������� ��������� ���� �������� � ��������� ���������� PS $ lastexitcode, ����� ������, ��������� �� ������.
   ���� ���������� ������, �������� ����������.
   ��� ������� ��������� ��������� ��������� ��������� ������ ��� ������������� ���� ��������� ���������� $ lastexitcode.

.EXAMPLE
  exec { svn info $repository_trunk } "������ ��� ���������� SVN. ���������, ��� ���������� ������ ��������� ������ SVN"
#>
function Exec
{
	[CmdletBinding()]
	param(
		[Parameter(Position=0,Mandatory=1)][scriptblock]$cmd,
		[Parameter(Position=1,Mandatory=0)][string]$errorMessage = ($msgs.error_bad_command -f $cmd)
	)
	& $cmd
	if ($lastexitcode -ne 0) {
		throw ("Exec: " + $errorMessage)
	}
}