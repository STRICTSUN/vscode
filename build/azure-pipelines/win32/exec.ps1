# Взято у psake https://github.com/psake/psake

<#
.SYNOPSIS
  Это вспомогательная функция, которая запускает блок сценария и проверяет переменную PS $ lastexitcode, чтобы узнать, произошла ли ошибка.
   Если обнаружена ошибка, выдается исключение.
   Эта функция позволяет запускать программы командной строки без необходимости явно проверять переменную $ lastexitcode.

.EXAMPLE
  exec { svn info $repository_trunk } "Ошибка при выполнении SVN. Убедитесь, что установлен клиент командной строки SVN"
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